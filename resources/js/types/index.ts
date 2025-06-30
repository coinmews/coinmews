/**
 * Common page props provided by Inertia
 */
export interface PageProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            username?: string;
            avatar?: string | null;
        } | null;
    };
    flash?: {
        message?: string;
        success?: string;
        error?: string;
    };
    errors: Record<string, string>;
    ziggy?: {
        location: string;
        url: string;
        port: null | number;
        defaults: Record<string, unknown>;
        routes: Record<string, unknown>;
    };
    results?: SearchResult[];
    query?: string;
}

/**
 * Breadcrumb navigation item
 */
export interface BreadcrumbItem {
    title: string;
    href: string;
    active?: boolean;
}

/**
 * Standard pagination info for all paginated responses
 */
export interface PaginationInfo {
    current_page: number;
    per_page: number;
    from: number;
    to: number;
    total: number;
    last_page: number;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    path: string;
    first_page_url: string;
    last_page_url: string;
    next_page_url: string | null;
    prev_page_url: string | null;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    // Add other user properties
}

export interface SharedAuth {
    user: User | null;
    // Add other auth related shared props
}

export interface CategoryNavItem {
    // Example for categories if passed via shared props
    name: string;
    href: string;
}

export interface SharedData {
    auth: SharedAuth;
    flash?: {
        message?: string;
        type?: string;
    };
    // categoriesForNav?: CategoryNavItem[]; // If you were to pass categories this way
    // Add other global/shared properties
    [key: string]: any; // Or be more specific
}

export interface SearchResult {
    id: number;
    title: string;
    type: string;
    url: string;
    excerpt?: string;
    created_at: string;
}
