// src/pages/welcome.tsx
import ArticleCard from '@/components/cards/article-card';
import CategoryByArticlesSection from '@/components/sections/category-by-articles-section';
import FilterByScopeSection from '@/components/sections/filter-by-scope-section';
import FilterByScopeTicker from '@/components/sections/filter-by-scope-ticker';
import Footer from '@/components/sections/footer';
import Header from '@/components/sections/header';
import CryptoPriceTicker from '@/components/tickers/crypto-price-ticker';
import LiveNewsTicker from '@/components/tickers/live-news-ticker';
import { Button } from '@/components/ui/button';
import { ImageSlider } from '@/components/ui/image-slider';
import { Article, Category, Tag } from '@/types/articleTypes';
import { Head, Link } from '@inertiajs/react';
import { CalendarIcon, TrendingUp, Zap, DollarSign, FileText, BarChart3, Tag as TagIcon, Youtube, ArrowRight, Star, Clock, Eye } from 'lucide-react';
import React from 'react';

// Inertia Article Props (for passing all data to React)
interface WelcomePageProps {
    newsArticles: Article[];
    shortNews: Article[];
    blogArticles: Article[];
    pressReleases: Article[];
    sponsoredArticles: Article[];
    pricePredictions: Article[];
    guestPosts: Article[];
    researchReports: Article[];
    web3Bulletins: Article[];
    webStories: Article[];
    featuredArticles: Article[];
    breakingNews: Article[];
    trendingArticles: Article[];
    topArticles: Article[];
    latestReactedArticles: Article[];
    timeSensitiveArticles: Article[];
    categories: Category[];
    tags: Tag[];
    articles: Article[];
    liveFeedNews: Article[];
}

const WelcomePage: React.FC<WelcomePageProps> = ({
    newsArticles,
    shortNews,
    blogArticles,
    pressReleases,
    sponsoredArticles,
    pricePredictions,
    guestPosts,
    researchReports,
    web3Bulletins,
    webStories,
    featuredArticles,
    breakingNews,
    trendingArticles,
    topArticles,
    latestReactedArticles,
    timeSensitiveArticles,
    categories,
    articles,
    liveFeedNews,
}) => {
    const formatTimeAgo = (date: string) => {
        const now = new Date();
        const articleDate = new Date(date);
        const diffInMinutes = Math.floor((now.getTime() - articleDate.getTime()) / (1000 * 60));

        if (diffInMinutes < 60) {
            return `${diffInMinutes} minutes ago`;
        } else if (diffInMinutes < 1440) {
            const hours = Math.floor(diffInMinutes / 60);
            return `${hours} hours ago`;
        } else {
            const days = Math.floor(diffInMinutes / 1440);
            return `${days} days ago`;
        }
    };

    const ArticleCardCompact = ({ article }: { article: Article }) => {
        return (
            <a
                href={`/articles/${article.slug}`}
                className="group flex cursor-pointer items-start space-x-3 rounded-lg p-2 transition-all duration-300 hover:bg-muted/50 hover:shadow-sm"
            >
                <div className="relative aspect-square max-w-16 flex-shrink-0 overflow-hidden rounded-md">
                    <img
                        src={article.banner_url || '/default-banner.png'}
                        alt={article.title}
                        className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/default-banner.png';
                        }}
                    />
                    {/* Scope Indicators */}
                    <div className="absolute top-1 right-1 flex -space-x-1">
                        {article.is_breaking_news && (
                            <span className="relative z-20 flex h-1.5 w-1.5">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500"></span>
                            </span>
                        )}
                        {article.is_trending && (
                            <span className="relative z-10 flex h-1.5 w-1.5">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-400 opacity-75"></span>
                                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-yellow-500"></span>
                            </span>
                        )}
                        {article.is_time_sensitive && (
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/75 opacity-75"></span>
                                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary"></span>
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex flex-1 flex-col space-y-1">
                    <h3 className="line-clamp-2 text-sm leading-snug font-medium text-foreground transition-all duration-300 group-hover:text-primary">
                        {article.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <CalendarIcon className="h-3 w-3" />
                            <span>{formatTimeAgo(article.created_at)}</span>
                        </span>
                        <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            <span>{article.view_count || 0}</span>
                        </span>
                    </div>
                </div>
            </a>
        );
    };

    const ArticleCardMini = ({ article }: { article: Article }) => {
        return (
            <a
                href={`/articles/${article.slug}`}
                className="group flex cursor-pointer items-center space-x-2 rounded-md p-2 transition-all duration-300 hover:bg-muted/50"
            >
                <div className="relative aspect-square max-w-12 flex-shrink-0 overflow-hidden rounded-md">
                    <img
                        src={article.banner_url || '/default-banner.png'}
                        alt={article.title}
                        className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/default-banner.png';
                        }}
                    />
                </div>
                <div className="flex flex-1 flex-col space-y-1">
                    <h3 className="line-clamp-1 text-xs font-medium text-foreground transition-all duration-300 group-hover:text-primary">
                        {article.title}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <CalendarIcon className="h-3 w-3" />
                        <span>{formatTimeAgo(article.created_at)}</span>
                    </div>
                </div>
            </a>
        );
    };

    // Sample data for the image slider
    const sliderImages = [
        {
            src: 'https://dummyimage.com/970x90/dbdbdb/000000.png',
            alt: 'Crypto Exchange Listings',
            link: 'https://example.com/offer1',
        },
        {
            src: 'https://dummyimage.com/970x90/dbdbdb/000000.png',
            alt: 'Crypto Trading Opportunities',
            link: 'https://example.com/offer2',
        },
        {
            src: 'https://dummyimage.com/970x90/dbdbdb/000000.png',
            alt: 'Latest Crypto News',
            link: 'https://example.com/offer3',
        },
    ];

    return (
        <>
            <Head>
                <title>CoinMews - Latest Crypto News, Prices & Insights</title>
                <meta name="description" content="CoinMews is your #1 source for the latest crypto news, prices, insights, and analysis. Stay ahead in the blockchain world with expert articles, live tickers, and trending stories." />
                <meta name="keywords" content="crypto news, cryptocurrency prices, blockchain insights, bitcoin, ethereum, altcoins, CoinMews" />
                <link rel="canonical" href={typeof window !== 'undefined' ? window.location.origin : 'https://coinmews.io'} />
                <meta property="og:title" content="CoinMews - Latest Crypto News, Prices & Insights" />
                <meta property="og:description" content="CoinMews is your #1 source for the latest crypto news, prices, insights, and analysis. Stay ahead in the blockchain world with expert articles, live tickers, and trending stories." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={typeof window !== 'undefined' ? window.location.origin : 'https://coinmews.io'} />
                <meta property="og:image" content="/favicon.png" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="CoinMews - Latest Crypto News, Prices & Insights" />
                <meta name="twitter:description" content="CoinMews is your #1 source for the latest crypto news, prices, insights, and analysis. Stay ahead in the blockchain world with expert articles, live tickers, and trending stories." />
                <meta name="twitter:image" content="/favicon.png" />
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'Organization',
                    'name': 'CoinMews',
                    'url': typeof window !== 'undefined' ? window.location.origin : 'https://coinmews.io',
                    'logo': '/favicon.png',
                    'sameAs': [
                        'https://twitter.com/coinmews',
                        'https://facebook.com/coinmews',
                        'https://linkedin.com/company/coinmews'
                    ],
                    'description': 'CoinMews is your #1 source for the latest crypto news, prices, insights, and analysis.'
                }) }} />
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'WebSite',
                    'name': 'CoinMews',
                    'url': typeof window !== 'undefined' ? window.location.origin : 'https://coinmews.io',
                    'potentialAction': {
                        '@type': 'SearchAction',
                        'target': typeof window !== 'undefined' ? window.location.origin + '/search?q={search_term_string}' : 'https://coinmews.io/search?q={search_term_string}',
                        'query-input': 'required name=search_term_string'
                    }
                }) }} />
                <html lang="en" />
            </Head>

            <a href="#main-content" className="sr-only focus:not-sr-only absolute top-0 left-0 z-50 bg-primary text-white p-2">Skip to main content</a>

            <CryptoPriceTicker />
            <Header />
            <LiveNewsTicker news={liveFeedNews} />

            {/* Hero Section with Featured Content */}
            <div className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
                <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Main Featured Article */}
                        <div className="lg:col-span-2">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                                    <Star className="h-5 w-5 text-primary" />
                                    Featured Stories
                                </h2>
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href="/articles?featured=true" className="flex items-center gap-1">
                                        View All
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                            {featuredArticles.length > 0 && (
                                <div className="space-y-4">
                                    {/* Main Featured Article */}
                                    <div className="group">
                                        <ArticleCard article={featuredArticles[0]} />
                                    </div>
                                    {/* Smaller Featured Articles */}
                                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                        {featuredArticles.slice(1, 3).map((article) => (
                                            <ArticleCardMini key={article.id} article={article} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar - Quick Stats & Categories */}
                        <div className="space-y-4">
                            {/* Breaking News */}
                            <div className="rounded-lg bg-gradient-to-br from-red-500/10 to-red-600/10 p-4 border border-red-200/20">
                                <div className="mb-3 flex items-center justify-between">
                                    <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                                        <Zap className="h-4 w-4 text-red-500" />
                                        Breaking News
                                    </h3>
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link href="/articles?breaking=true">View All</Link>
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    {breakingNews.slice(0, 3).map((article) => (
                                        <ArticleCardCompact key={article.id} article={article} />
                                    ))}
                                </div>
                            </div>

                            {/* Trending Now */}
                            <div className="rounded-lg bg-gradient-to-br from-yellow-500/10 to-orange-500/10 p-4 border border-yellow-200/20">
                                <div className="mb-3 flex items-center justify-between">
                                    <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4 text-yellow-600" />
                                        Trending Now
                                    </h3>
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link href="/articles?trending=true">View All</Link>
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    {trendingArticles.slice(0, 3).map((article) => (
                                        <ArticleCardCompact key={article.id} article={article} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Scope Ticker */}
            <div className="border-b border-border/50">
                <div className="mx-auto max-w-7xl px-4 py-3 lg:px-6">
                    <FilterByScopeTicker
                        featuredArticles={featuredArticles}
                        breakingNews={breakingNews}
                        trendingArticles={trendingArticles}
                        timeSensitiveArticles={timeSensitiveArticles}
                        topArticles={topArticles}
                        latestReactedArticles={latestReactedArticles}
                    />
                </div>
            </div>

            {/* Categories Section */}
            <div className="bg-muted/30">
                <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
                    <CategoryByArticlesSection categories={categories} articles={articles} />
                </div>
            </div>

            {/* Filter Scope Section */}
            <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
                <FilterByScopeSection
                    featuredArticles={featuredArticles}
                    breakingNews={breakingNews}
                    trendingArticles={trendingArticles}
                    timeSensitiveArticles={timeSensitiveArticles}
                    topArticles={topArticles}
                    latestReactedArticles={latestReactedArticles}
                />
            </div>

            {/* Image Slider */}
            <div className="mx-auto my-6 hidden w-full max-w-7xl items-center justify-center sm:flex">
                <ImageSlider images={sliderImages} />
            </div>

            {/* Content Grid - New Layout */}
            <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Left Column - News & Short News */}
                    <div className="space-y-6">
                        {/* News Articles */}
                        <div className="rounded-lg bg-gradient-to-br from-primary/5 to-secondary/5 p-4 border border-primary/20">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-primary" />
                                    Latest News
                                </h2>
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href="/articles?content_type=news" className="flex items-center gap-1">
                                        See All
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                            <div className="space-y-3">
                                {newsArticles.slice(0, 4).map((article) => (
                                    <ArticleCardCompact key={article.id} article={article} />
                                ))}
                            </div>
                        </div>

                        {/* Short News */}
                        <div className="rounded-lg bg-gradient-to-br from-green-500/5 to-emerald-500/5 p-4 border border-green-200/20">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-green-600" />
                                    Quick Updates
                                </h2>
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href="/articles?content_type=short_news" className="flex items-center gap-1">
                                        See All
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                            <div className="space-y-3">
                                {shortNews.slice(0, 4).map((article) => (
                                    <ArticleCardCompact key={article.id} article={article} />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Blog & Analysis */}
                    <div className="space-y-6">
                        {/* Blog Articles */}
                        <div className="rounded-lg bg-gradient-to-br from-purple-500/5 to-violet-500/5 p-4 border border-purple-200/20">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                    <BarChart3 className="h-4 w-4 text-purple-600" />
                                    Market Analysis
                                </h2>
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href="/articles?content_type=blog" className="flex items-center gap-1">
                                        See All
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                            <div className="space-y-3">
                                {blogArticles.slice(0, 4).map((article) => (
                                    <ArticleCardCompact key={article.id} article={article} />
                                ))}
                            </div>
                        </div>

                        {/* Price Predictions */}
                        <div className="rounded-lg bg-gradient-to-br from-orange-500/5 to-red-500/5 p-4 border border-orange-200/20">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                    <DollarSign className="h-4 w-4 text-orange-600" />
                                    Price Predictions
                                </h2>
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href="/articles?content_type=price_prediction" className="flex items-center gap-1">
                                        See All
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                            <div className="space-y-3">
                                {pricePredictions.slice(0, 4).map((article) => (
                                    <ArticleCardCompact key={article.id} article={article} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sponsored Content Section */}
            <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border-y border-border/50">
                <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
                    <div className="mb-6 text-center">
                        <h2 className="text-2xl font-bold text-foreground mb-2">Sponsored Content</h2>
                        <p className="text-muted-foreground">Discover projects and opportunities</p>
                    </div>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {sponsoredArticles.slice(0, 6).map((article) => (
                            <div key={article.id}>
                                <ArticleCard article={article} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Additional Content Sections */}
            <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Press Releases */}
                    <div className="rounded-lg bg-gradient-to-br from-primary/5 to-secondary/5 p-4 border border-primary/20">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                <FileText className="h-4 w-4 text-primary" />
                                Press Releases
                            </h2>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/articles?content_type=press_release" className="flex items-center gap-1">
                                    See All
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                        <div className="space-y-3">
                            {pressReleases.slice(0, 3).map((article) => (
                                <ArticleCardCompact key={article.id} article={article} />
                            ))}
                        </div>
                    </div>

                    {/* Research Reports */}
                    <div className="rounded-lg bg-gradient-to-br from-teal-500/5 to-cyan-500/5 p-4 border border-teal-200/20">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                <BarChart3 className="h-4 w-4 text-teal-600" />
                                Research Reports
                            </h2>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/articles?content_type=research_report" className="flex items-center gap-1">
                                    See All
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                        <div className="space-y-3">
                            {researchReports.slice(0, 3).map((article) => (
                                <ArticleCardCompact key={article.id} article={article} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </>
    );
};

export default WelcomePage;
