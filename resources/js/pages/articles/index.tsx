import ArticleCard from '@/components/cards/article-card';
import Footer from '@/components/sections/footer';
import Header from '@/components/sections/header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Skeleton } from '@/components/ui/skeleton';
import { Article, Category } from '@/types/articleTypes';
import { Head, router } from '@inertiajs/react';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Filters {
    category?: string;
    content_type?: string;
    featured?: boolean;
    breaking_news?: boolean;
    time_sensitive?: boolean;
    trending?: boolean;
    popular?: boolean;
    sort_by?: string;
}

interface AllArticlesPageProps {
    articles: {
        data: Article[];
        links: { url: string | null; label: string }[];
        current_page: number;
        last_page: number;
        total: number;
    };
    categories: Category[];
    filters: Filters;
    filterCounts: {
        contentTypes: {
            all: number;
            news: number;
            short_news: number;
            news_and_short_news: number;
            blog: number;
            guest_post: number;
            blog_and_guest_posts: number;
            press_release: number;
            sponsored: number;
            price_prediction: number;
            research_report: number;
            web3_bulletin: number;
            web_story: number;
        };
        featured: number;
        breaking_news: number;
        time_sensitive: number;
        trending: number;
        popular: number;
        sortOptions: {
            latest: number;
            view_count: number;
            latest_reacted: number;
        };
    };
}

// Ad slider data
const adSlides = [
    {
        id: 1,
        image: 'https://dummyimage.com/1200x300/dbdbdb/000000.png',
        link: 'https://example.com/ad1',
    },
    {
        id: 2,
        image: 'https://dummyimage.com/1200x300/dbdbdb/000000.png',
        link: 'https://example.com/ad2',
    },
    {
        id: 3,
        image: 'https://dummyimage.com/1200x300/dbdbdb/000000.png',
        link: 'https://example.com/ad3',
    },
];

export default function AllArticlesPage({ articles, categories, filters, filterCounts }: AllArticlesPageProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [currentFilters, setCurrentFilters] = useState<Filters>(filters);
    const [hasFiltersChanged, setHasFiltersChanged] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [showMoreCategories, setShowMoreCategories] = useState(false);

    useEffect(() => {
        if (!hasFiltersChanged) return;

        const updatedFilters = { ...currentFilters };
        // Remove any filters that are set to their default values
        (Object.keys(updatedFilters) as Array<keyof Filters>).forEach((key) => {
            if (updatedFilters[key] === 'all' || updatedFilters[key] === false || updatedFilters[key] === undefined) {
                delete updatedFilters[key];
            }
        });

        setIsLoading(true);
        router.get(route('articles.index'), updatedFilters, {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => {
                setIsLoading(false);
                setHasFiltersChanged(false);
            },
        });
    }, [currentFilters, hasFiltersChanged]);

    const handleFilterChange = (key: keyof Filters, value: string | boolean) => {
        setCurrentFilters((prev) => ({
            ...prev,
            [key]: value === 'all' ? undefined : value,
        }));
        setHasFiltersChanged(true);
    };

    const contentTypeOptions = [
        { value: 'all', label: 'All Content Types', count: filterCounts.contentTypes.all },
        { value: 'news', label: 'News', count: filterCounts.contentTypes.news },
        { value: 'short_news', label: 'Short News', count: filterCounts.contentTypes.short_news },
        { value: 'blog', label: 'Blog', count: filterCounts.contentTypes.blog },
        { value: 'guest_post', label: 'Guest Post', count: filterCounts.contentTypes.guest_post },
        { value: 'press_release', label: 'Press Release', count: filterCounts.contentTypes.press_release },
        { value: 'sponsored', label: 'Sponsored', count: filterCounts.contentTypes.sponsored },
        { value: 'price_prediction', label: 'Price Prediction', count: filterCounts.contentTypes.price_prediction },
        { value: 'research_report', label: 'Research Report', count: filterCounts.contentTypes.research_report },
        { value: 'web3_bulletin', label: 'Web3 Bulletin', count: filterCounts.contentTypes.web3_bulletin },
        { value: 'web_story', label: 'Web Story', count: filterCounts.contentTypes.web_story },
    ];

    const sortOptions = [
        { value: 'latest', label: 'Latest', count: filterCounts.sortOptions.latest },
        { value: 'view_count', label: 'Most Viewed', count: filterCounts.sortOptions.view_count },
        { value: 'latest_reacted', label: 'Most Reacted', count: filterCounts.sortOptions.latest_reacted },
    ];

    // Ad slider controls
    const nextSlide = () => {
        setCurrentSlide((prev) => (prev === adSlides.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? adSlides.length - 1 : prev - 1));
    };

    // Auto-rotate slides
    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <Head>
                <title>All Articles | CoinMews</title>
                <meta name="description" content="Browse all cryptocurrency articles, research, and insights on CoinMews. Stay informed with the latest in blockchain and crypto." />
                <meta name="keywords" content="crypto articles, blockchain research, cryptocurrency insights, CoinMews" />
                <link rel="canonical" href={window.location.origin + '/articles'} />
                <meta property="og:title" content="All Articles | CoinMews" />
                <meta property="og:description" content="Browse all cryptocurrency articles, research, and insights on CoinMews. Stay informed with the latest in blockchain and crypto." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={window.location.origin + '/articles'} />
                <meta property="og:image" content="/favicon.png" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="All Articles | CoinMews" />
                <meta name="twitter:description" content="Browse all cryptocurrency articles, research, and insights on CoinMews. Stay informed with the latest in blockchain and crypto." />
                <meta name="twitter:image" content="/favicon.png" />
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'CollectionPage',
                    'name': 'All Articles',
                    'description': 'Browse all cryptocurrency articles, research, and insights.',
                    'url': window.location.origin + '/articles',
                    'breadcrumb': {
                        '@type': 'BreadcrumbList',
                        'itemListElement': [
                            { '@type': 'ListItem', position: 1, name: 'Home', item: window.location.origin },
                            { '@type': 'ListItem', position: 2, name: 'Articles', item: window.location.origin + '/articles' }
                        ]
                    }
                }) }} />
            </Head>
            <Header />

            {/* Top Ad Space Slider */}
            <div className="relative mx-auto my-4 max-w-7xl overflow-hidden rounded-lg">
                <div className="relative flex">
                    {adSlides.map((slide, index) => (
                        <div
                            key={slide.id}
                            className={`w-full flex-shrink-0 transition-all duration-500 ease-in-out${index === currentSlide ? 'block' : 'hidden'}`}
                        >
                            <a href={slide.link} target="_blank" rel="noopener noreferrer">
                                <img src={slide.image} alt="Articles Advertisement" loading="lazy" className="h-auto w-full rounded-lg object-cover" />
                            </a>
                        </div>
                    ))}
                    <Button
                        onClick={prevSlide}
                        size="icon"
                        variant="outline"
                        className="absolute top-1/2 left-2 z-10 h-10 w-10 -translate-y-1/2 rounded-full bg-white/70 p-2 shadow-md hover:bg-white"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                        onClick={nextSlide}
                        size="icon"
                        variant="outline"
                        className="absolute top-1/2 right-2 z-10 h-10 w-10 -translate-y-1/2 rounded-full bg-white/70 p-2 shadow-md hover:bg-white"
                        aria-label="Next slide"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 lg:px-6">
                <div className="my-8 space-y-4">
                    <div>
                        <h1 className="text-4xl font-bold">All Articles</h1>
                        <p className="mt-2 max-w-3xl text-gray-600">
                            Explore our comprehensive collection of articles, covering everything from news and blogs to press releases and research
                            reports. Filter by category, content type, or browse our trending and featured content.
                        </p>
                    </div>

                    <div className="flex flex-col gap-8 lg:flex-row">
                        {/* Filters Section - Left Sidebar */}
                        <div className="w-full lg:w-1/4">
                            <div className="sticky top-40">
                                <Card className="space-y-6 p-6">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Categories</h3>
                                        <RadioGroup
                                            value={currentFilters.category || 'all'}
                                            onValueChange={(value) => handleFilterChange('category', value)}
                                            className="space-y-2"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="all" id="all-categories" />
                                                <Label htmlFor="all-categories">All Categories ({articles.total})</Label>
                                            </div>

                                            {/* Show first 5 categories always */}
                                            {categories.slice(0, 5).map((category) => (
                                                <div key={category.id} className="flex items-center space-x-2">
                                                    <RadioGroupItem value={String(category.id)} id={`category-${category.id}`} />
                                                    <Label htmlFor={`category-${category.id}`}>{category.name}</Label>
                                                </div>
                                            ))}
                                        </RadioGroup>

                                        {/* Show "More Categories" dropdown if more than 5 categories */}
                                        {categories.length > 5 && (
                                            <div className="mt-2">
                                                <Collapsible open={showMoreCategories} onOpenChange={setShowMoreCategories}>
                                                    <CollapsibleTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="flex h-auto w-full items-center justify-between p-1"
                                                        >
                                                            <span className="text-muted-foreground text-sm">
                                                                {showMoreCategories ? 'Show less' : `Show ${categories.length - 5} more`}
                                                            </span>
                                                            {showMoreCategories ? (
                                                                <ChevronUp className="h-4 w-4" />
                                                            ) : (
                                                                <ChevronDown className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                    </CollapsibleTrigger>
                                                    <CollapsibleContent className="space-y-2 pt-2">
                                                        <RadioGroup
                                                            value={currentFilters.category || 'all'}
                                                            onValueChange={(value) => handleFilterChange('category', value)}
                                                            className="space-y-2"
                                                        >
                                                            {categories.slice(5).map((category) => (
                                                                <div key={category.id} className="flex items-center space-x-2">
                                                                    <RadioGroupItem value={String(category.id)} id={`category-${category.id}`} />
                                                                    <Label htmlFor={`category-${category.id}`}>{category.name}</Label>
                                                                </div>
                                                            ))}
                                                        </RadioGroup>
                                                    </CollapsibleContent>
                                                </Collapsible>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Content Type</h3>
                                        <RadioGroup
                                            value={currentFilters.content_type || 'all'}
                                            onValueChange={(value) => handleFilterChange('content_type', value)}
                                            className="space-y-2"
                                        >
                                            {contentTypeOptions.map((option) => (
                                                <div key={option.value} className="flex items-center space-x-2">
                                                    <RadioGroupItem value={option.value} id={`content-type-${option.value}`} />
                                                    <Label htmlFor={`content-type-${option.value}`}>
                                                        {option.label} ({option.count})
                                                    </Label>
                                                </div>
                                            ))}
                                        </RadioGroup>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Sort By</h3>
                                        <RadioGroup
                                            value={currentFilters.sort_by || 'latest'}
                                            onValueChange={(value) => handleFilterChange('sort_by', value)}
                                            className="space-y-2"
                                        >
                                            {sortOptions.map((option) => (
                                                <div key={option.value} className="flex items-center space-x-2">
                                                    <RadioGroupItem value={option.value} id={`sort-${option.value}`} />
                                                    <Label htmlFor={`sort-${option.value}`}>
                                                        {option.label} ({option.count})
                                                    </Label>
                                                </div>
                                            ))}
                                        </RadioGroup>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Filters</h3>
                                        <div className="space-y-2">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="featured"
                                                    checked={currentFilters.featured || false}
                                                    onCheckedChange={(checked) => handleFilterChange('featured', !!checked)}
                                                    disabled={isLoading}
                                                />
                                                <Label htmlFor="featured">Featured ({filterCounts.featured})</Label>
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="breaking_news"
                                                    checked={currentFilters.breaking_news || false}
                                                    onCheckedChange={(checked) => handleFilterChange('breaking_news', !!checked)}
                                                    disabled={isLoading}
                                                />
                                                <Label htmlFor="breaking_news">Breaking News ({filterCounts.breaking_news})</Label>
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="time_sensitive"
                                                    checked={currentFilters.time_sensitive || false}
                                                    onCheckedChange={(checked) => handleFilterChange('time_sensitive', !!checked)}
                                                    disabled={isLoading}
                                                />
                                                <Label htmlFor="time_sensitive">Time Sensitive ({filterCounts.time_sensitive})</Label>
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="trending"
                                                    checked={currentFilters.trending || false}
                                                    onCheckedChange={(checked) => handleFilterChange('trending', !!checked)}
                                                    disabled={isLoading}
                                                />
                                                <Label htmlFor="trending">Trending ({filterCounts.trending})</Label>
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="popular"
                                                    checked={currentFilters.popular || false}
                                                    onCheckedChange={(checked) => handleFilterChange('popular', !!checked)}
                                                    disabled={isLoading}
                                                />
                                                <Label htmlFor="popular">Popular ({filterCounts.popular})</Label>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>

                        {/* Articles Grid - Right Content */}
                        <div className="w-full lg:w-3/4">
                            {isLoading ? (
                                // Loading State
                                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className="space-y-3">
                                            <Skeleton className="h-[200px] w-full" />
                                            <Skeleton className="h-4 w-3/4" />
                                            <Skeleton className="h-4 w-1/2" />
                                        </div>
                                    ))}
                                </div>
                            ) : articles.data.length === 0 ? (
                                // Empty State
                                <div className="rounded-lg bg-white py-12 text-center shadow">
                                    <h3 className="text-lg font-medium text-gray-900">No articles found</h3>
                                    <p className="mt-2 text-sm text-gray-500">Try adjusting your filters or check back later for new content.</p>
                                </div>
                            ) : (
                                // Articles Grid
                                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                    {articles.data.map((article) => (
                                        <ArticleCard key={article.id} article={article} />
                                    ))}
                                </div>
                            )}

                            {/* Improved Pagination */}
                            {!isLoading && articles.links && articles.links.length > 3 && (
                                <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                                    {/* Previous Button */}
                                    <Button
                                        variant="outline"
                                        disabled={!articles.links[0].url || isLoading}
                                        onClick={() => {
                                            const url = articles.links[0].url;
                                            if (url) {
                                                router.visit(url, {
                                                    preserveScroll: true,
                                                    preserveState: true,
                                                    only: ['articles'],
                                                });
                                            }
                                        }}
                                        className="flex items-center gap-1"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        <span>Previous</span>
                                    </Button>

                                    {/* Page Numbers */}
                                    {articles.links.slice(1, -1).map((link, index) => {
                                        if (!link.url && link.label === '...') {
                                            return (
                                                <Button key={index} variant="outline" disabled className="px-3">
                                                    ...
                                                </Button>
                                            );
                                        }

                                        // Regular page numbers
                                        const isActive = link.label === articles.current_page.toString();
                                        return (
                                            <Button
                                                key={index}
                                                variant={isActive ? 'default' : 'outline'}
                                                disabled={!link.url || isLoading}
                                                onClick={() => {
                                                    if (link.url) {
                                                        router.visit(link.url, {
                                                            preserveScroll: true,
                                                            preserveState: true,
                                                            only: ['articles'],
                                                        });
                                                    }
                                                }}
                                                className="min-w-[2.5rem] px-3"
                                            >
                                                {link.label}
                                            </Button>
                                        );
                                    })}

                                    {/* Next Button */}
                                    <Button
                                        variant="outline"
                                        disabled={!articles.links[articles.links.length - 1].url || isLoading}
                                        onClick={() => {
                                            const url = articles.links[articles.links.length - 1].url;
                                            if (url) {
                                                router.visit(url, {
                                                    preserveScroll: true,
                                                    preserveState: true,
                                                    only: ['articles'],
                                                });
                                            }
                                        }}
                                        className="flex items-center gap-1"
                                    >
                                        <span>Next</span>
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}
