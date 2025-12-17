import { ReactNode } from "react";

export interface Procedure {
    id: string,
    title: string,
    description: string,
    icon: ReactNode,
    priority: "critical" | "high" | "medium" | "low";
    estimatedTime: string;
    responsibleRole: string;
    href: string;
    actions?: string[];
}