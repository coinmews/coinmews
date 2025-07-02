import Footer from '@/components/sections/footer';
import Header from '@/components/sections/header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Head, Link } from '@inertiajs/react';
import { Brain, Building2, ChevronLeft, ChevronRight, Coins, Database, FileText, Gamepad2, Globe, Image, Layers, Rocket, Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Category {
    id: number;
    name: string;
    slug: string;
    description: string;
    articles_count: number;
}

interface Props {
    categories: Category[];
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
];

const getCategoryIcon = (name: string) => {
    switch (name.toLowerCase()) {
        case 'bitcoin':
            return <Coins className="h-6 w-6" />;
        case 'ethereum':
            return <Layers className="h-6 w-6" />;
        case 'altcoins':
            return <Coins className="h-6 w-6" />;
        case 'meme coins':
            return <Coins className="h-6 w-6" />;
        case 'blockchain tech':
            return <Database className="h-6 w-6" />;
        case 'layer 2':
            return <Layers className="h-6 w-6" />;
        case 'gamefi':
            return <Gamepad2 className="h-6 w-6" />;
        case 'exchanges':
            return <Building2 className="h-6 w-6" />;
        case 'wallets':
            return <Wallet className="h-6 w-6" />;
        case 'nfts':
            return <Image className="h-6 w-6" />;
        case 'projects':
            return <Rocket className="h-6 w-6" />;
        case 'web3':
            return <Globe className="h-6 w-6" />;
        case 'ai':
            return <Brain className="h-6 w-6" />;
        default:
            return <FileText className="h-6 w-6" />;
    }
};

export default function CategoriesIndex({ categories = [] }: Props) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [populatedCategories, setPopulatedCategories] = useState<Category[]>([]);
    const [featuredCategories, setFeaturedCategories] = useState<Category[]>([]);

    useEffect(() => {
        // Sort categories by article count to find the most popular ones
        const sortedCategories = [...categories].sort((a, b) => b.articles_count - a.articles_count);

        // Set featured categories as the top 3 with most articles
        setFeaturedCategories(sortedCategories.slice(0, 3));

        // Set populated categories as all categories
        setPopulatedCategories(sortedCategories);
    }, [categories]);

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
                <title>Categories - CoinMews</title>
                <meta name="description" content="Explore all crypto and blockchain categories on CoinMews. Find news, analysis, and insights by topic." />
                <meta name="keywords" content="crypto categories, blockchain topics, CoinMews" />
                <link rel="canonical" href={window.location.origin + '/categories'} />
                <meta property="og:title" content="Categories - CoinMews" />
                <meta property="og:description" content="Explore all crypto and blockchain categories on CoinMews. Find news, analysis, and insights by topic." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={window.location.origin + '/categories'} />
                <meta property="og:image" content="/favicon.png" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Categories - CoinMews" />
                <meta name="twitter:description" content="Explore all crypto and blockchain categories on CoinMews. Find news, analysis, and insights by topic." />
                <meta name="twitter:image" content="/favicon.png" />
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'CollectionPage',
                    'name': 'Categories',
                    'description': 'Explore all crypto and blockchain categories.',
                    'url': window.location.origin + '/categories',
                    'breadcrumb': {
                        '@type': 'BreadcrumbList',
                        'itemListElement': [
                            { '@type': 'ListItem', position: 1, name: 'Home', item: window.location.origin },
                            { '@type': 'ListItem', position: 2, name: 'Categories', item: window.location.origin + '/categories' }
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
                            className={`w-full flex-shrink-0 transition-all duration-500 ease-in-out ${index === currentSlide ? 'block' : 'hidden'}`}
                        >
                            <Link href={slide.link} className="relative block">
                                <img src={slide.image} alt="Categories Advertisement" loading="lazy" className="h-auto w-full rounded-lg object-cover" />
                            </Link>
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

            <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold">Categories</h1>
                    <p className="text-muted-foreground mt-2 max-w-3xl">
                        Explore our comprehensive coverage of the crypto and blockchain ecosystem, from Bitcoin and Ethereum to DeFi and NFTs. Find
                        the latest news, analysis, and insights organized by topic.
                    </p>
                </div>

                {/* Featured Categories Section */}
                {featuredCategories.length > 0 && (
                    <div className="mb-12">
                        <h2 className="mb-6 text-2xl font-bold">Featured Categories</h2>
                        <div className="grid gap-6 md:grid-cols-3">
                            {featuredCategories.map((category) => (
                                <Link key={category.id} href={`/articles?category=${category.id}`}>
                                    <Card className="from-primary/10 to-secondary/5 h-full overflow-hidden bg-gradient-to-br transition-all hover:scale-[1.02] hover:shadow-lg">
                                        <CardHeader className="pb-2">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-primary/10 text-primary rounded-full p-2">{getCategoryIcon(category.name)}</div>
                                                <CardTitle>{category.name}</CardTitle>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-muted-foreground line-clamp-2 text-sm">{category.description}</p>
                                            <div className="mt-4">
                                                <Badge variant="secondary" className="text-sm font-medium">
                                                    {category.articles_count} {category.articles_count === 1 ? 'article' : 'articles'}
                                                </Badge>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* All Categories Section */}
                <div>
                    <h2 className="mb-6 text-2xl font-bold">All Categories</h2>
                    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {populatedCategories.map((category) => (
                            <Link key={category.id} href={`/articles?category=${category.id}`}>
                                <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
                                    <CardHeader className="pb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="text-muted-foreground">{getCategoryIcon(category.name)}</div>
                                            <CardTitle className="text-lg">{category.name}</CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground line-clamp-2 text-sm">{category.description}</p>
                                        <div className="mt-3">
                                            <Badge variant="outline" className="text-xs">
                                                {category.articles_count} {category.articles_count === 1 ? 'article' : 'articles'}
                                            </Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
