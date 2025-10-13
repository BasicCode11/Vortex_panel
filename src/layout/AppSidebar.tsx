import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { useTranslation } from "react-i18next";

// Assume these icons are imported from an icon library
import {
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  AdminIcon,
  DollarIcon,
  UserIcon,
  UserCircleIcon,
  SettingsIcon,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";
import { usePermissions } from "../hooks/usePermission";

type Actor = 'super-admin' | 'team-actor' | 'agent-actor';
type NavItem = {
  name: string;
  translationKey: string;
  icon: React.ReactNode;
  path?: string;
  requiredPermission?: string;
  requiredActor?: Actor | Actor[];
  subItems?: { name: string; translationKey: string; path: string; requiredPermission?: string; requiredActor?: Actor | Actor[]; }[];
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    translationKey: "sidebar.dashboard",
    path: "/",
  },
  {
    icon: <UserIcon />,
    name: "Customers",
    translationKey: "sidebar.customers",
    path: "/customers",
    requiredPermission: "customer:read",
  },
  {
    name: "Bonus Offer",
    translationKey: "sidebar.bonusOffer",
    icon: <DollarIcon />,
    path: "/bonuns-offer",
    requiredPermission: "bonusoffer:read",
    requiredActor: ["super-admin","team-actor"]
  },
  {
    name: "Operational",
    translationKey: "sidebar.operational",
    icon: <SettingsIcon />,
    subItems: [
      { name: "Teams", translationKey: "sidebar.teams", path: "/teams", requiredPermission: "teams:read",requiredActor: ["super-admin","team-actor"], },
      { name: "Agents", translationKey: "sidebar.agents", path: "/agents", requiredPermission: "agents:read", requiredActor: ["super-admin","team-actor"],},
      { name: "Banks", translationKey: "sidebar.banks", path: "/banks", requiredPermission: "banks:read", requiredActor: ["super-admin","team-actor"],},
      { name: "Products", translationKey: "sidebar.products", path: "/products", requiredPermission: "products:read",requiredActor: ["super-admin","team-actor"], },
      { name: "Promotion", translationKey: "sidebar.promotion", path: "/promotions", requiredPermission: "products:read", requiredActor: ["super-admin","team-actor"],},
      { name: "Bonus", translationKey: "sidebar.bonus", path: "/bonus", requiredPermission: "bonuses:read", requiredActor: ["super-admin","team-actor"],},
    ],
  },
];

const othersItems: NavItem[] = [
  {
    icon: <AdminIcon />,
    name: "Administration",
    translationKey: "sidebar.administration",
    subItems: [
      { name: "Role Permissions", translationKey: "sidebar.rolePermissions", path: "/role-permission", requiredPermission: "roles:read", requiredActor: ["super-admin","team-actor"],},
      { name: "Users", translationKey: "sidebar.users", path: "/users", requiredPermission: "users:read",requiredActor: ["super-admin","team-actor"], },
    ],
  },
  {
    icon: <UserCircleIcon />,
    name: "User Profile",
    translationKey: "sidebar.userProfile",
    path: "/profile",
  },
];

const AppSidebar: React.FC = () => {
  const { t } = useTranslation();
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const { checkPermission, isSuperAdmin, isTeamActor, isAgentActor } = usePermissions();

  const hasActor = (required?: Actor | Actor[]) => {
    if (!required) return true;
    const req = Array.isArray(required) ? required : [required];
    const current: Actor[] = [
      isSuperAdmin && 'super-admin',
      isTeamActor && 'team-actor',
      isAgentActor && 'agent-actor',
    ].filter(Boolean) as Actor[];
    return req.some(r => current.includes(r));
  };

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => location.pathname === path;
  const isActive = useCallback(
    (path: string) =>
      location.pathname === path || location.pathname.startsWith(`${path}/`),
    [location.pathname]
  );


  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => {
    const filteredItems = items.filter((nav) => {
      if (nav.subItems) {
        const visibleSubItems = nav.subItems.filter(
          (s) => (!s.requiredPermission || checkPermission(s.requiredPermission)) &&
            hasActor(s.requiredActor)
        );
        return visibleSubItems.length > 0 && hasActor(nav.requiredActor);
      }
      return (!nav.requiredPermission || checkPermission(nav.requiredPermission)) &&
        hasActor(nav.requiredActor);
    });


    return (
      <ul className="flex flex-col gap-4">
        {filteredItems.map((nav, index) => {
          const visibleSubItems = nav.subItems?.filter(
               (s) =>
                 (!s.requiredPermission || checkPermission(s.requiredPermission)) &&
                 hasActor(s.requiredActor)
             );

          return (
            <li key={nav.name}>
              {nav.subItems ? (
                <button
                  onClick={() => handleSubmenuToggle(index, menuType)}
                  className={`menu-item group ${openSubmenu?.type === menuType && openSubmenu?.index === index
                      ? "menu-item-active"
                      : "menu-item-inactive"
                    } cursor-pointer ${!isExpanded && !isHovered
                      ? "lg:justify-center"
                      : "lg:justify-start"
                    }`}
                >
                  <span
                    className={`menu-item-icon-size  ${openSubmenu?.type === menuType && openSubmenu?.index === index
                        ? "menu-item-icon-active"
                        : "menu-item-icon-inactive"
                      }`}
                  >
                    {nav.icon}
                  </span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className="menu-item-text">{t(nav.translationKey)}</span>
                  )}
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <ChevronDownIcon
                      className={`ml-auto w-5 h-5 transition-transform duration-200 ${openSubmenu?.type === menuType &&
                          openSubmenu?.index === index
                          ? "rotate-180 text-brand-500"
                          : ""
                        }`}
                    />
                  )}
                </button>
              ) : (
                nav.path && (
                  <Link
                    to={nav.path}
                    className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                      }`}
                  >
                    <span
                      className={`menu-item-icon-size ${isActive(nav.path)
                          ? "menu-item-icon-active"
                          : "menu-item-icon-inactive"
                        }`}
                    >
                      {nav.icon}
                    </span>
                    {(isExpanded || isHovered || isMobileOpen) && (
                      <span className="menu-item-text">{t(nav.translationKey)}</span>
                    )}
                  </Link>
                )
              )}
              {visibleSubItems && visibleSubItems.length > 0 && (isExpanded || isHovered || isMobileOpen) && (
                <div
                  ref={(el) => {
                    subMenuRefs.current[`${menuType}-${index}`] = el;
                  }}
                  className="overflow-hidden transition-all duration-300"
                  style={{
                    height:
                      openSubmenu?.type === menuType && openSubmenu?.index === index
                        ? `${subMenuHeight[`${menuType}-${index}`]}px`
                        : "0px",
                  }}
                >
                  <ul className="mt-2 space-y-1 ml-9">
                    {visibleSubItems.map((subItem) => (
                      <li key={subItem.name}>
                        <Link
                          to={subItem.path}
                          className={`menu-dropdown-item ${isActive(subItem.path)
                              ? "menu-dropdown-item-active"
                              : "menu-dropdown-item-inactive"
                            }`}
                        >
                          {t(subItem.translationKey)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen
          ? "w-[290px]"
          : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
          }`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <img
                className="dark:hidden"
                src="/images/logo/logo.svg"
                alt="Logo"
                width={150}
                height={40}
              />
              <img
                className="hidden dark:block"
                src="/images/logo/logo-dark.svg"
                alt="Logo"
                width={150}
                height={40}
              />
            </>
          ) : (
            <img
              src="/images/logo/logo-icon.svg"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  t("sidebar.menu")
                ) : (
                  <HorizontaLDots className="size-6" />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>
            <div className="">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  t("sidebar.admin")
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(othersItems, "others")}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
