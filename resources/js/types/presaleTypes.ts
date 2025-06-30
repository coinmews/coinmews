import { User } from './userTypes';

export type PresaleStatus = 'upcoming' | 'ongoing' | 'ended';

export interface Presale {
    id: number;
    name: string;
    slug: string;
    description: string;
    status: PresaleStatus;

    // Token details
    token_symbol: string;
    total_supply?: string;
    tokens_for_sale?: string;
    percentage_of_supply?: string;

    // Presale details
    stage: 'ICO' | 'IDO' | 'IEO' | 'Presale' | 'Privatesale';
    launchpad?: string;
    start_date: string;
    end_date: string;
    token_price: string;
    token_price_currency: string;
    exchange_rate?: string;
    soft_cap?: string;
    hard_cap?: string;
    personal_cap?: string;
    fundraising_goal?: string;

    // Website & Resources
    website_url?: string;
    whitepaper_url?: string;
    social_media_links?: Record<string, string>;
    project_category?: string;
    contract_address?: string;

    // Media
    logo_image?: string;
    logo_url?: string;

    // Stats
    view_count: number;
    upvotes_count: number;

    // Relations
    created_by: number;
    creator: User;

    // Timestamps
    created_at: string;
    updated_at: string;
    deleted_at?: string;

    // Computed properties from the model
    duration: string;
    remaining_time: string;
    status_text: string;
}

export interface PresaleFilters {
    search?: string;
    status?: PresaleStatus;
    stage?: string;
}

export interface PresaleStats {
    total: number;
    ongoing: number;
    upcoming: number;
    ended: number;
}

export interface PresaleShowPageProps {
    presale: Presale;
    similarPresales: Presale[];
    structuredData: Record<string, any>;
    meta: {
        title: string;
        description: string;
        keywords: string;
        canonical: string;
        og: {
            title: string;
            description: string;
            image?: string;
            type: string;
            url: string;
        };
        twitter: {
            card: string;
            title: string;
            description: string;
            image?: string;
        };
    };
}

export interface PresaleIndexPageProps {
    presales: {
        data: Presale[];
        current_page: number;
        per_page: number;
        total: number;
    };
    filters: PresaleFilters;
    stats: PresaleStats;
    stages: string[];
    sort: {
        field: string;
        direction: string;
    };
}
