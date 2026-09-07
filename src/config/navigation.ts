import {
  Home,
  FolderKanban,
  Brain,
  Activity,
  Settings,
  CreditCard,
} from "lucide-react";

export const mainNavigation = [
  {
    title: "Home",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Workspaces",
    href: "/dashboard/projects",
    icon: FolderKanban,
  },
  {
    title: "Memory",
    href: "/dashboard/memory",
    icon: Brain,
  },
  {
    title: "Activity",
    href: "/dashboard/activity",
    icon: Activity,
  },
];

export const secondaryNavigation = [
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
  {
    title: "Billing",
    href: "/dashboard/billing",
    icon: CreditCard,
  },
];