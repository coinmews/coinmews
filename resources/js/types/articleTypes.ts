// Category Type
export interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    parent_id: number | null;
    order: number;
    meta_title: string | null;
    meta_description: string | null;
    meta_image: string | null;
    article_count: number;
    view_count: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    parent?: Category;
    children?: Category[];
    articles_count: number;
    articles?: Article[];
}

// Tag Type
export interface Tag {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    usage_count: number;
    trending_score: number;
    last_used_at: string | null;
    meta_title: string | null;
    meta_description: string | null;
    article_count: number;
    created_at: string;
    updated_at: string;
}

// User Type (Author, Commenter, etc.)
export interface User {
    id: number;
    name: string;
    email: string;
    bio?: string;
    avatar?: string;
    is_admin: boolean;
    username: string;
    phone?: string;
    website?: string;
    twitter?: string;
    telegram?: string;
    discord?: string;
    facebook?: string;
    instagram?: string;
    birthday?: string; // Date
    location?: string;
    avatar_url?: string; // Computed, from avatar field
    created_at: string;
    updated_at: string;
    articles: Article[];
    submissions: Submission[];
}

// Comment Type
export interface Comment {
    id: number;
    user_id: number;
    commentable_type: string;
    commentable_id: number;
    content: string;
    ip_address: string | null;
    user_agent: string | null;
    is_spam: boolean;
    is_approved: boolean;
    approved_at: string | null;
    approved_by: number | null;
    moderation_notes: string | null;
    report_count: number;
    last_reported_at: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    user: {
        id: number;
        name: string;
        username: string;
        avatar_url: string;
    };
    approved_by_user?: {
        id: number;
        name: string;
        username: string;
        avatar_url: string;
    };
}

// Submission Type
export interface Submission {
    id: number;
    title: string;
    content: string;
    type: string; // For example: 'guest_post', 'sponsored', etc.
    status: 'pending' | 'reviewing' | 'approved' | 'rejected';
    feedback?: string;
    reviewed_at?: string; // DateTime
    reviewed_by?: number;
    submitted_by: number;
    meta_title?: string;
    meta_description?: string;
    author_bio?: string;
    reading_time?: number; // In minutes
    company_name?: string;
    contact_phone?: string;
    official_links?: Record<string, string>;
    token_name?: string;
    token_symbol?: string;
    token_network?: string;
    total_supply?: string;
    airdrop_amount?: string;
    start_date?: string; // DateTime
    end_date?: string; // DateTime
    requirements?: Record<string, string>;
    price?: string;
    soft_cap?: string;
    hard_cap?: string;
    is_virtual?: boolean;
    virtual_link?: string;
    max_participants?: number;
    submitter: User; // Relation to User who submitted
    reviewer?: User; // Relation to User who reviewed the submission
}

// Content Type Layout Type
export interface ContentTypeLayout {
    showExcerpt: boolean;
    showPriceTargets: boolean;
    showMethodology: boolean;
    showRiskFactors: boolean;
    showCompanyInfo: boolean;
    showSource: boolean;
    showLocation: boolean;
    showAuthorBio: boolean;
}

// Content Type Enums
export type ArticleContentType =
    | 'news'
    | 'blog'
    | 'press_release'
    | 'sponsored'
    | 'price_prediction'
    | 'guest_post'
    | 'research_report'
    | 'web3_bulletin'
    | 'web_story'
    | 'short_news';
export type ArticleStatus = 'draft' | 'published' | 'featured';

// Meta Types
export interface ArticleMeta {
    title: string;
    description: string;
    keywords: string;
    canonical: string;
    og: {
        title: string;
        description: string;
        image: string;
        type: string;
        url: string;
    };
    twitter: {
        card: string;
        title: string;
        description: string;
        image: string;
    };
}

// Structured Data Types
export interface ArticleStructuredData {
    '@context': string;
    '@type': string;
    headline: string;
    description: string;
    image: string;
    author: {
        '@type': string;
        name: string;
    };
    publisher: {
        '@type': string;
        name: string;
        logo: {
            '@type': string;
            url: string;
        };
    };
    datePublished: string;
    dateModified: string;
    mainEntityOfPage: {
        '@type': string;
        '@id': string;
    };
    commentCount: number;
    comment: Array<{
        '@type': string;
        author: {
            '@type': string;
            name: string;
        };
        dateCreated: string;
        text: string;
    }>;
    priceTargetLow?: number;
    priceTargetHigh?: number;
    timeframe?: string;
}

// Article Type
export interface Article {
    // Common fields
    id: number;
    title: string;
    slug: string;
    content: string;
    excerpt: string | null;
    banner_image: string | null;
    banner_url: string; // Computed from banner_image
    content_type: ArticleContentType;
    status: ArticleStatus;
    is_breaking_news: boolean;
    is_featured: boolean;
    is_trending: boolean;
    is_time_sensitive: boolean;
    view_count: number;
    category_id: number;
    author_id: number;
    published_at: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;

    // News & Short News specific fields
    source: string | null;
    location: string | null;

    // Blog & Guest Post specific fields
    author_bio: string | null;
    reading_time: number | null;

    // Price Prediction & Research Report specific fields
    price_target_low: number | null;
    price_target_high: number | null;
    time_horizon: string | null;
    methodology: string | null;
    data_sources: Record<string, string> | null;
    risk_factors: string | null;

    // Press Release & Web3 Bulletin specific fields
    company_name: string | null;
    contact_email: string | null;
    contact_phone: string | null;
    official_links: Record<string, string> | null;

    // Web Story specific fields
    story_duration?: number;
    story_slides?: StorySlide[];
    media_elements?: MediaElement[];
    interactive_elements?: InteractiveElement[];
    is_vertical?: boolean;
    slides_count?: number;

    // SEO fields
    meta_title: string | null;
    meta_description: string | null;

    // Relationships
    author: User;
    category: Category;
    tags: Tag[];
    comments: Comment[];
}

// StorySlide Type (for Web Story content type)
export interface StorySlide {
    image?: string;
    content: string;
    duration?: number;
}

// MediaElement Type (for Web Story content type)
export interface MediaElement {
    type: 'image' | 'video' | 'audio';
    url: string;
    caption?: string;
    thumbnail?: string;
}

// InteractiveElement Type (for Web Story content type)
export interface InteractiveElement {
    type: 'button' | 'poll' | 'link' | 'mention' | 'location';
    text: string;
    url?: string;
    poll_options?: Array<{ option: string }>;
}

// Article Show Page Props
export interface ArticleShowPageProps {
    article: Article;
    relatedArticles: Article[];
    trendingTags: Tag[];
    popularCategories: Category[];
    structuredData: ArticleStructuredData;
    meta: ArticleMeta;
}

// Add to your existing types file
export interface CryptoData {
    topCryptos: Record<string, CryptoPrice>;
    marketOverview: MarketOverviewType;
}

export interface CryptoPrice {
    usd: number;
    usd_24h_change: number;
}

export interface MarketOverviewType {
    total_market_cap: { usd: number };
    market_cap_change_percentage_24h_usd: number;
    active_cryptocurrencies: number;
    markets: number;
}
