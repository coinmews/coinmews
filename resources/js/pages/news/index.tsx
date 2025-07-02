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
import React, { useEffect, useState } from 'react';

interface NewsPageProps {
    articles: {
        data: Article[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links?: { url: string | null; label: string }[];
    };
    categories: Category[];
    filters: {
        category?: string;
        featured?: boolean;
        breaking_news?: boolean;
        time_sensitive?: boolean;
        sort_by?: string;
        content_type?: string;
        trending?: boolean;
        popular?: boolean;
    };
    filterCounts: {
        contentTypes: {
            news: number;
            short_news: number;
            news_and_short_news: number;
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

const NewsPage: React.FC<NewsPageProps> = ({ articles, categories, filters, filterCounts }) => {
    const [selectedCategory, setSelectedCategory] = useState<string>(filters.category || 'all');
    const [selectedContentType, setSelectedContentType] = useState<string>(filters.content_type || 'all');
    const [selectedSort, setSelectedSort] = useState<string>(filters.sort_by || 'latest');
    const [showFeatured, setShowFeatured] = useState<boolean>(filters.featured || false);
    const [showBreakingNews, setShowBreakingNews] = useState<boolean>(filters.breaking_news || false);
    const [showTimeSensitive, setShowTimeSensitive] = useState<boolean>(filters.time_sensitive || false);
    const [showTrending, setShowTrending] = useState<boolean>(filters.trending || false);
    const [showPopular, setShowPopular] = useState<boolean>(filters.popular || false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [showMoreCategories, setShowMoreCategories] = useState(false);

    const updateFilters = (newFilters: Partial<typeof filters>) => {
        setIsLoading(true);

        // Create a new filters object that removes any undefined or 'all' values
        const updatedFilters = {
            ...filters,
            ...newFilters,
        };

        // Remove any filters that are set to their default values
        (Object.keys(updatedFilters) as Array<keyof typeof updatedFilters>).forEach((key) => {
            if (updatedFilters[key] === 'all' || updatedFilters[key] === false || updatedFilters[key] === undefined) {
                delete updatedFilters[key];
            }
        });

        router.get(
            route('news.index'),
            {
                ...updatedFilters,
                page: 1, // Reset to first page when filters change
            },
            {
                preserveScroll: true,
                preserveState: true,
                onFinish: () => setIsLoading(false),
                onError: () => {
                    setIsLoading(false);
                    // You might want to show an error toast here
                },
            },
        );
    };

    const handleCategoryChange = (value: string) => {
        setSelectedCategory(value);
        updateFilters({ category: value === 'all' ? undefined : value });
    };

    const handleContentTypeChange = (value: string) => {
        setSelectedContentType(value);
        updateFilters({ content_type: value === 'all' ? undefined : value });
    };

    const handleSortChange = (value: string) => {
        setSelectedSort(value);
        updateFilters({ sort_by: value === 'latest' ? undefined : value });
    };

    const handleFilterChange = (filter: string, value: boolean) => {
        switch (filter) {
            case 'featured':
                setShowFeatured(value);
                updateFilters({ featured: value ? true : undefined });
                break;
            case 'breaking_news':
                setShowBreakingNews(value);
                updateFilters({ breaking_news: value ? true : undefined });
                break;
            case 'time_sensitive':
                setShowTimeSensitive(value);
                updateFilters({ time_sensitive: value ? true : undefined });
                break;
            case 'trending':
                setShowTrending(value);
                updateFilters({ trending: value ? true : undefined });
                break;
            case 'popular':
                setShowPopular(value);
                updateFilters({ popular: value ? true : undefined });
                break;
        }
    };

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
                <title>CoinMews - Latest Crypto News</title>
                <meta name="description" content="Stay updated with the latest cryptocurrency news, breaking stories, and blockchain updates on CoinMews." />
                <meta name="keywords" content="crypto news, blockchain news, cryptocurrency updates, breaking news, CoinMews" />
                <link rel="canonical" href={window.location.origin + '/news'} />
                <meta property="og:title" content="CoinMews - Latest Crypto News" />
                <meta property="og:description" content="Stay updated with the latest cryptocurrency news, breaking stories, and blockchain updates on CoinMews." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={window.location.origin + '/news'} />
                <meta property="og:image" content="/favicon.png" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="CoinMews - Latest Crypto News" />
                <meta name="twitter:description" content="Stay updated with the latest cryptocurrency news, breaking stories, and blockchain updates on CoinMews." />
                <meta name="twitter:image" content="/favicon.png" />
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'CollectionPage',
                    'name': 'CoinMews News',
                    'description': 'Latest cryptocurrency news and blockchain updates.',
                    'url': window.location.origin + '/news',
                    'breadcrumb': {
                        '@type': 'BreadcrumbList',
                        'itemListElement': [
                            { '@type': 'ListItem', position: 1, name: 'Home', item: window.location.origin },
                            { '@type': 'ListItem', position: 2, name: 'News', item: window.location.origin + '/news' }
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
                                <img src={slide.image} alt="Crypto News Advertisement" loading="lazy" className="h-auto w-full rounded-lg object-cover" />
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
                        <h1 className="text-4xl font-bold">Latest Crypto News</h1>
                        <p className="mt-2 max-w-3xl text-gray-600">
                            Stay updated with the latest news, market trends, and developments in the world of cryptocurrency, blockchain, and Web3
                            technology. Breaking news, short updates, and in-depth analysis delivered to you in real-time.
                        </p>
                    </div>

                    <div className="flex flex-col gap-8 lg:flex-row">
                        {/* Filters Section - Left Sidebar */}
                        <div className="w-full lg:w-1/4">
                            <div className="sticky top-40">
                                <Card className="space-y-6 p-6">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Categories</h3>
                                        <RadioGroup value={selectedCategory} onValueChange={handleCategoryChange} className="space-y-2">
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="all" id="all-categories" />
                                                <Label htmlFor="all-categories">All Categories</Label>
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
                                                            value={selectedCategory}
                                                            onValueChange={handleCategoryChange}
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
                                        <RadioGroup value={selectedContentType} onValueChange={handleContentTypeChange} className="space-y-2">
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="all" id="all-content" />
                                                <Label htmlFor="all-content">All Content Types ({articles.total})</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="news" id="news" />
                                                <Label htmlFor="news">News ({filterCounts.contentTypes.news})</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="short_news" id="short_news" />
                                                <Label htmlFor="short_news">Short News ({filterCounts.contentTypes.short_news})</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="news_and_short_news" id="news_and_short_news" />
                                                <Label htmlFor="news_and_short_news">
                                                    News & Short News ({filterCounts.contentTypes.news_and_short_news})
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="web3_bulletin" id="web3_bulletin" />
                                                <Label htmlFor="web3_bulletin">Web3 Bulletin ({filterCounts.contentTypes.web3_bulletin})</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="web_story" id="web_story" />
                                                <Label htmlFor="web_story">Web Story ({filterCounts.contentTypes.web_story})</Label>
                                            </div>
                                        </RadioGroup>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Sort By</h3>
                                        <RadioGroup value={selectedSort} onValueChange={handleSortChange} className="space-y-2">
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="latest" id="latest" />
                                                <Label htmlFor="latest">Latest ({filterCounts.sortOptions.latest})</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="view_count" id="view_count" />
                                                <Label htmlFor="view_count">Most Viewed ({filterCounts.sortOptions.view_count})</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="latest_reacted" id="latest_reacted" />
                                                <Label htmlFor="latest_reacted">Latest Reacted ({filterCounts.sortOptions.latest_reacted})</Label>
                                            </div>
                                        </RadioGroup>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Filters</h3>
                                        <div className="space-y-2">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="featured"
                                                    checked={showFeatured}
                                                    onCheckedChange={(checked) => handleFilterChange('featured', checked as boolean)}
                                                    disabled={isLoading}
                                                />
                                                <Label htmlFor="featured">Featured Only ({filterCounts.featured})</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="breaking_news"
                                                    checked={showBreakingNews}
                                                    onCheckedChange={(checked) => handleFilterChange('breaking_news', checked as boolean)}
                                                    disabled={isLoading}
                                                />
                                                <Label htmlFor="breaking_news">Breaking News ({filterCounts.breaking_news})</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="time_sensitive"
                                                    checked={showTimeSensitive}
                                                    onCheckedChange={(checked) => handleFilterChange('time_sensitive', checked as boolean)}
                                                    disabled={isLoading}
                                                />
                                                <Label htmlFor="time_sensitive">Time Sensitive ({filterCounts.time_sensitive})</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="trending"
                                                    checked={showTrending}
                                                    onCheckedChange={(checked) => handleFilterChange('trending', checked as boolean)}
                                                    disabled={isLoading}
                                                />
                                                <Label htmlFor="trending">Trending ({filterCounts.trending})</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="popular"
                                                    checked={showPopular}
                                                    onCheckedChange={(checked) => handleFilterChange('popular', checked as boolean)}
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
                                <div className="rounded-lg bg-white py-12 text-center shadow">
                                    <h3 className="text-lg font-medium text-gray-900">No articles found</h3>
                                    <p className="mt-2 text-sm text-gray-500">Try adjusting your filters or check back later for new content.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                        {articles.data.map((article) => (
                                            <div key={article.id}>
                                                <ArticleCard article={article} />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Bottom Ad Banner */}
                                    {/* <div className="border-border bg-muted my-8 rounded-lg border p-4">
                                        <div className="flex flex-col items-center justify-between md:flex-row">
                                            <div className="mb-4 md:mb-0">
                                                <h3 className="text-foreground text-lg font-bold">Subscribe to Our Newsletter</h3>
                                                <p className="text-muted-foreground">Get daily crypto news updates delivered to your inbox</p>
                                            </div>
                                            <Button variant="default">Subscribe Now</Button>
                                        </div>
                                    </div> */}
                                </>
                            )}

                            {/* Improved Pagination */}
                            {!isLoading && articles.last_page > 1 && (
                                <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                                    {/* Previous button */}
                                    <Button
                                        variant="outline"
                                        disabled={articles.current_page === 1 || isLoading}
                                        onClick={() => {
                                            if (articles.current_page > 1) {
                                                router.get(
                                                    route('news.index', {
                                                        ...filters,
                                                        page: articles.current_page - 1,
                                                    }),
                                                    {},
                                                    {
                                                        preserveScroll: true,
                                                        preserveState: true,
                                                        only: ['articles'],
                                                    },
                                                );
                                            }
                                        }}
                                        className="flex items-center gap-1"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        <span>Previous</span>
                                    </Button>

                                    {/* Page numbers */}
                                    {Array.from({ length: articles.last_page }, (_, i) => i + 1).map((page) => (
                                        <Button
                                            key={page}
                                            variant={page === articles.current_page ? 'default' : 'outline'}
                                            disabled={isLoading}
                                            onClick={() => {
                                                if (page !== articles.current_page) {
                                                    router.get(
                                                        route('news.index', {
                                                            ...filters,
                                                            page,
                                                        }),
                                                        {},
                                                        {
                                                            preserveScroll: true,
                                                            preserveState: true,
                                                            only: ['articles'],
                                                        },
                                                    );
                                                }
                                            }}
                                            className="min-w-[2.5rem] px-3"
                                        >
                                            {page}
                                        </Button>
                                    ))}

                                    {/* Next button */}
                                    <Button
                                        variant="outline"
                                        disabled={articles.current_page === articles.last_page || isLoading}
                                        onClick={() => {
                                            if (articles.current_page < articles.last_page) {
                                                router.get(
                                                    route('news.index', {
                                                        ...filters,
                                                        page: articles.current_page + 1,
                                                    }),
                                                    {},
                                                    {
                                                        preserveScroll: true,
                                                        preserveState: true,
                                                        only: ['articles'],
                                                    },
                                                );
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
};

export default NewsPage;
