import Footer from '@/components/sections/footer';
import Header from '@/components/sections/header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDebounce } from '@/hooks/useDebounce';
import { PageProps, PaginationInfo } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface Video {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    youtube_url: string;
    thumbnail_url: string | null;
    duration: string | null;
    view_count: number;
    upvotes_count: number;
    is_featured: boolean;
    status: string;
    published_at: string;
    created_at: string;
    updated_at: string;
    youtube_id: string;
    youtube_embed_url: string;
    user: {
        id: number;
        name: string;
        username: string;
        avatar: string | null;
    };
}

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface Stats {
    total: number;
    featured: number;
}

interface FiltersType {
    category_id?: string;
    search?: string;
    sort?: string;
}

interface VideosProps extends PageProps {
    videos: PaginationInfo & {
        data: Video[];
    };
    categories: Category[];
    stats: Stats;
    filters: FiltersType | unknown;
}

export default function VideosIndex({ videos, categories, stats, filters }: VideosProps) {
    console.log('Props received:', { videos, categories, stats, filters });

    // Make sure filters is an object (handle case where it might be an array or null)
    const filtersObj: FiltersType = typeof filters === 'object' && filters !== null && !Array.isArray(filters) ? (filters as FiltersType) : {};

    const [search, setSearch] = useState(filtersObj.search || '');
    const debouncedSearch = useDebounce(search, 500);
    const [categoryId, setCategoryId] = useState(filtersObj.category_id || 'none');
    const [sort, setSort] = useState(filtersObj.sort || 'newest');

    // Define safe objects to ensure they're never undefined
    const safeVideos = videos && typeof videos === 'object' ? videos : { data: [], current_page: 1, per_page: 10, total: 0, last_page: 1, links: [] };
    const safeCategories = Array.isArray(categories) ? categories : [];
    const safeStats = stats && typeof stats === 'object' ? stats : { total: 0, featured: 0 };

    useEffect(() => {
        const filterSearch = filtersObj.search || '';
        const filterCategoryId = filtersObj.category_id || 'none';
        const filterSort = filtersObj.sort || 'newest';

        if (debouncedSearch !== filterSearch || categoryId !== filterCategoryId || sort !== filterSort) {
            router.get(
                route('cryptocurrency-videos.index'),
                {
                    search: debouncedSearch || null,
                    category_id: categoryId === 'none' ? null : categoryId,
                    sort: sort || null,
                },
                { preserveState: true, replace: true },
            );
        }
    }, [debouncedSearch, categoryId, sort, filtersObj]);

    return (
        <>
            <Head title="Cryptocurrency Videos" />
            <Header />

            <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
                <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Cryptocurrency Videos</h1>
                        <p className="text-muted-foreground mt-1">
                            Watch and learn about cryptocurrencies, blockchain technology, and the latest trends
                        </p>
                    </div>
                </div>

                {/* Stats */}
                {/* <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold">{safeStats.total}</div>
                            <div className="text-muted-foreground text-sm">Total Videos</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold">{safeStats.featured}</div>
                            <div className="text-muted-foreground text-sm">Featured Videos</div>
                        </CardContent>
                    </Card>
                </div> */}

                {/* Filters */}
                <div className="mb-8 flex flex-col gap-4 md:flex-row">
                    <div className="flex-1">
                        <Input placeholder="Search videos..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full" />
                    </div>

                    <Select value={categoryId} onValueChange={setCategoryId}>
                        <SelectTrigger className="w-full md:w-[200px]">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">All Categories</SelectItem>
                            {safeCategories.map((category) => (
                                <SelectItem key={category.id} value={String(category.id)}>
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={sort} onValueChange={setSort}>
                        <SelectTrigger className="w-full md:w-[200px]">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Newest First</SelectItem>
                            <SelectItem value="oldest">Oldest First</SelectItem>
                            <SelectItem value="most_viewed">Most Viewed</SelectItem>
                            <SelectItem value="most_upvotes">Most Upvoted</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Videos Grid */}
                {safeVideos.data.length > 0 ? (
                    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {safeVideos.data.map((video) => (
                            <Card key={video.id} className="flex h-full flex-col overflow-hidden p-0 pb-6">
                                <Link href={route('cryptocurrency-videos.show', video.slug)}>
                                    <div className="group relative aspect-video">
                                        <img
                                            src={video.thumbnail_url || `https://img.youtube.com/vi/${video.youtube_id}/maxresdefault.jpg`}
                                            alt={video.title}
                                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                        />
                                        {video.is_featured && <Badge className="bg-primary absolute top-2 right-2">Featured</Badge>}

                                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                                            <div className="bg-primary/90 flex h-16 w-16 items-center justify-center rounded-full">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    fill="currentColor"
                                                    className="h-8 w-8 text-white"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                                <CardHeader className="pt-6">
                                    <Link
                                        href={route('cryptocurrency-videos.show', video.slug)}
                                        className="line-clamp-2 text-lg font-semibold hover:underline"
                                    >
                                        {video.title}
                                    </Link>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center">
                        <h3 className="text-xl font-semibold">No videos found</h3>
                        <p className="text-muted-foreground mt-2">Try adjusting your search or filters</p>
                    </div>
                )}

                {/* Pagination */}
                {safeVideos.last_page > 1 && (
                    <div className="mt-8 flex justify-center">
                        <div className="flex gap-2">
                            {safeVideos.links.map((link, i) => (
                                <Button
                                    key={i}
                                    variant={link.active ? 'default' : 'outline'}
                                    disabled={!link.url}
                                    onClick={() => router.get(link.url || '')}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </>
    );
}
