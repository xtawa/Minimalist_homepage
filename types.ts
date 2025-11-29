import { LucideIcon } from 'lucide-react';

export interface BadgeItem {
  text: string;
  icon?: LucideIcon | string; // Can be a component or an emoji/string for simplicity
  href?: string;
  colorClass?: string; // Tailwind class for specific text color (e.g., text-green-400)
}

export interface SectionGroup {
  label: string;
  items: BadgeItem[];
}

export interface NavLink {
  label: string;
  href: string;
  icon?: LucideIcon;
}
