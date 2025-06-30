import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SettingsSidebarNavItem {
    title: string;
    route: string;
    icon?: LucideIcon | null;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    phone: string;
    bio: string;
    website: string;
    twitter: string;
    telegram: string;
    discord: string;
    facebook: string;
    instagram: string;
    birthday: string;
    location: string;
    avatar: string | null;
    [key: string]: unknown; // This allows for additional properties...
}

export interface ProfileFormData {
    name: string;
    email: string;
    phone: string;
    bio: string;
    website: string;
    twitter: string;
    telegram: string;
    discord: string;
    facebook: string;
    instagram: string;
    birthday: string;
    location: string;
    avatar: File | null;
}
