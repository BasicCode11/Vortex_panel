
import { useTranslation } from "react-i18next"
import PageMeta from "../../components/common/PageMeta"
import { useNavigate } from "react-router"

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table"
import { useAgent } from "../../hooks/useAgent"
import {  AngleRightIcon } from "../../icons"

export default function Bonusoffer() {
    const { t } = useTranslation()
    const {agents , loading , error} = useAgent();
    const navigate = useNavigate();
    const handleViewBonusOffer = (agentid: number) => {
        navigate(`/bonus-offer/${agentid}`)
    }
    return (
        <div >
            <PageMeta 
                title="Bonus Offer"
                description="This is Bonus offer management page"
            />
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {t("sidebar.bonusOffer")}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Manage Bonus offer
                    </p>
                </div>
            </div>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                {!loading && !error && (
                    <div className="max-w-full overflow-x-auto">
                        <div className="min-w-[720px]">
                            <Table>
                                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]" >
                                    <TableRow>
                                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                            {t("common.nO")}
                                        </TableCell>
                                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                            {t("sidebar.products")}
                                        </TableCell>
                                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                            {t("sidebar.agents")}
                                        </TableCell>
                                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                            {t("balance.credit_en")}
                                        </TableCell>
                                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                            {t("balance.credit_kh")}
                                        </TableCell>
                                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                            {t("common.actions")}
                                        </TableCell>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                    {agents.map((a, index) => (
                                        <TableRow key={a.id}>
                                            <TableCell className="px-5 py-4 sm:px-6 text-start">
                                                <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">{index + 1}</span>
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {a.products.product_name}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {a.agent_name}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {a.credit_us} $
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {a.credit_kh} ៛
                                            </TableCell>
                                            <TableCell className="px-4 py-3">
                                                <div className="flex items-center justify-center gap-2">
                                                    
                                                    <button
                                                        className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-blue-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-blue-400"
                                                        title="Work Bonus offer" 
                                                        onClick={() => handleViewBonusOffer(a.id)}
                                                    >
                                                        
                                                            <AngleRightIcon className="h-4 w-4" />
                                                   
                                                    </button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                    )
                }
            </div>
        </div>
    )
}