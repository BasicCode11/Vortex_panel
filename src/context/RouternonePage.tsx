import React from "react";
import OfferAdd from "../pages/Bonusoffer/OfferAdd";

export type Data = {
    path?: string;
    element?: React.ReactNode;
}

export const RouternonePage: Data[] = [
    {
        path: "/bonuns-offer/offeradd",
        element: <OfferAdd />,
    }
]