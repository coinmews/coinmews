export type AirdropStatus = 'ongoing' | 'upcoming' | 'potential' | 'ended';

export interface Airdrop {
    id: number;
    name: string;
    slug: string;
    description: string;
    status: AirdropStatus;

    // Token details
    token_symbol: string;
    type: 'token' | 'nft' | 'other';
    blockchain: string;

    // Airdrop details
    start_date: string;
    end_date: string | null;
    total_supply: string | null;
    airdrop_qty: string | null;
    winners_count: number | null;
    usd_value: string | null;

    // Metrics
    upvotes_count: number;
    tasks_count: number;
    is_featured: boolean;
    view_count: number;

    // Calculated properties
    logo_url: string | null;
    time_remaining: string;
    percent_of_supply: number | null;

    // Timestamps
    created_at: string;
    updated_at: string;

    // Relations
    creator: {
        id: number;
        name: string;
        username: string;
        avatar: string;
        bio?: string;
    };
}

export interface AirdropFilters {
    status?: string;
    blockchain?: string;
    featured?: string;
    search?: string;
    sort?: string;
}

export interface AirdropStats {
    total: number;
    ongoing: number;
    upcoming: number;
    ended: number;
    featured: number;
}

export interface AirdropShowPageProps {
    airdrop: Airdrop;
    similarAirdrops: Airdrop[];
    structuredData: any;
    meta: {
        title: string;
        description: string;
        keywords: string;
        canonical: string;
        og: {
            title: string;
            description: string;
            image: string | null;
            type: string;
            url: string;
        };
        twitter: {
            card: string;
            title: string;
            description: string;
            image: string | null;
        };
    };
}

export interface AirdropIndexPageProps {
    airdrops: {
        data: Airdrop[];
        current_page: number;
        per_page: number;
        total: number;
    };
    blockchains: string[];
    stats: AirdropStats;
    filters: AirdropFilters;
}
