import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Brain, Building2, Coins, Database, FileText, Filter, Gamepad2, Globe, Image, Layers, Rocket, Search, Wallet } from 'lucide-react';
import { useState } from 'react';

interface Article {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    banner_image: string;
    category: {
        name: string;
        slug: string;
    };
    author: {
        name: string;
    };
    created_at: string;
    content_type: string;
    view_count: number;
    reading_time: number;
}

interface Category {
    id: number;
    name: string;
    slug: string;
    description: string;
    articles_count: number;
}

interface Props {
    category: Category;
    featuredArticles: Article[];
    latestArticles: {
        data: Article[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    relatedCategories: Category[];
    filters?: {
        search?: string;
        sort?: string;
    };
}

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

export default function CategoryShow(props: Props) {
    const {
        category,
        featuredArticles = [],
        latestArticles = { data: [], current_page: 1, last_page: 1, per_page: 12, total: 0 },
        relatedCategories = [],
        filters = { search: '', sort: 'latest' },
    } = props;

    const [search, setSearch] = useState(filters?.search ?? '');
    const [sort, setSort] = useState(filters?.sort ?? 'latest');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        window.location.href = `/categories/${category.slug}?${new URLSearchParams({
            ...(search && { search }),
            ...(sort && { sort }),
        }).toString()}`;
    };

    return (
        <AppLayout>
            <Head title={`${category.name} - CoinMews`} />

            <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
                <div className="mb-8">
                    <div className="flex items-center gap-3">
                        {getCategoryIcon(category.name)}
                        <h1 className="text-4xl font-bold">{category.name}</h1>
                    </div>
                    <p className="text-muted-foreground mt-2">{category.description}</p>
                    <div className="mt-4">
                        <Badge variant="secondary">{category.articles_count} articles</Badge>
                    </div>
                </div>

                {featuredArticles.length > 0 && (
                    <div className="mb-12">
                        <h2 className="mb-6 text-2xl font-bold">Featured Articles</h2>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {featuredArticles.map((article) => (
                                <Button key={article.id} variant="ghost" className="h-auto p-0 text-left" asChild>
                                    <a href={`/news/${article.slug}`}>
                                        <Card className="h-full overflow-hidden transition-shadow hover:shadow-lg">
                                            <div className="relative aspect-video">
                                                <img src={article.banner_image} alt={article.title} className="h-full w-full object-cover" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                                <Badge variant="secondary" className="absolute bottom-2 left-2">
                                                    {article.category.name}
                                                </Badge>
                                            </div>
                                            <CardHeader>
                                                <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-muted-foreground line-clamp-3 text-sm">{article.excerpt}</p>
                                                <div className="mt-4 flex items-center justify-between text-sm">
                                                    <span className="text-muted-foreground">By {article.author.name}</span>
                                                    <span className="text-muted-foreground">{article.reading_time} min read</span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </a>
                                </Button>
                            ))}
                        </div>
                    </div>
                )}

                <form onSubmit={handleSearch} className="mb-8">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center">
                        <div className="relative flex-1">
                            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                            <Input
                                type="search"
                                placeholder="Search articles..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Select value={sort} onValueChange={setSort}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Sort By" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="latest">Latest</SelectItem>
                                <SelectItem value="popular">Most Popular</SelectItem>
                                <SelectItem value="trending">Trending</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button type="submit">
                            <Filter className="mr-2 h-4 w-4" />
                            Apply Filters
                        </Button>
                    </div>
                </form>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {latestArticles.data.map((article) => (
                        <Button key={article.id} variant="ghost" className="h-auto p-0 text-left" asChild>
                            <a href={`/news/${article.slug}`}>
                                <Card className="h-full overflow-hidden transition-shadow hover:shadow-lg">
                                    <div className="relative aspect-video">
                                        <img src={article.banner_image} alt={article.title} className="h-full w-full object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                        <Badge variant="secondary" className="absolute bottom-2 left-2">
                                            {article.category.name}
                                        </Badge>
                                    </div>
                                    <CardHeader>
                                        <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground line-clamp-3 text-sm">{article.excerpt}</p>
                                        <div className="mt-4 flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">By {article.author.name}</span>
                                            <span className="text-muted-foreground">{article.reading_time} min read</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </a>
                        </Button>
                    ))}
                </div>

                {latestArticles.last_page > 1 && (
                    <div className="mt-8 flex justify-center">
                        <div className="flex gap-2">
                            {Array.from({ length: latestArticles.last_page }, (_, i) => i + 1).map((page) => (
                                <Button key={page} variant={page === latestArticles.current_page ? 'default' : 'outline'} asChild>
                                    <a href={`/categories/${category.slug}?page=${page}`}>{page}</a>
                                </Button>
                            ))}
                        </div>
                    </div>
                )}

                {relatedCategories.length > 0 && (
                    <div className="mt-12">
                        <h2 className="mb-6 text-2xl font-bold">Related Categories</h2>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {relatedCategories.map((relatedCategory) => (
                                <Button key={relatedCategory.id} variant="ghost" className="h-auto p-0 text-left" asChild>
                                    <a href={`/categories/${relatedCategory.slug}`}>
                                        <Card className="h-full overflow-hidden transition-shadow hover:shadow-lg">
                                            <CardHeader>
                                                <div className="flex items-center gap-3">
                                                    {getCategoryIcon(relatedCategory.name)}
                                                    <CardTitle>{relatedCategory.name}</CardTitle>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-muted-foreground line-clamp-2 text-sm">{relatedCategory.description}</p>
                                                <div className="mt-4">
                                                    <Badge variant="secondary">{relatedCategory.articles_count} articles</Badge>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </a>
                                </Button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
