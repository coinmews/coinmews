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

interface Meme {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    media_type: 'image' | 'video';
    media_url: string;
    view_count: number;
    upvotes_count: number;
    is_featured: boolean;
    status: string;
    published_at: string;
    created_at: string;
    updated_at: string;
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
    images: number;
    videos: number;
    featured: number;
}

interface FiltersType {
    category_id?: string;
    media_type?: string;
    search?: string;
    sort?: string;
}

interface MemesProps extends PageProps {
    memes: PaginationInfo & {
        data: Meme[];
    };
    categories: Category[];
    stats: Stats;
    filters: FiltersType | unknown;
}

export default function MemesIndex({ auth, memes, categories, stats, filters }: MemesProps) {
    console.log('Props received:', { auth, memes, categories, stats, filters });

    // Make sure filters is an object (handle case where it might be an array or null)
    const filtersObj: FiltersType = typeof filters === 'object' && filters !== null && !Array.isArray(filters) ? (filters as FiltersType) : {};

    // Initialize state with simple values first, making sure we have valid defaults
    const [search, setSearch] = useState<string>(filtersObj.search || '');
    const debouncedSearch = useDebounce(search, 500);
    const [categoryId, setCategoryId] = useState<string>(filtersObj.category_id || 'none');
    const [mediaType, setMediaType] = useState<string>(filtersObj.media_type || 'none');
    const [sort, setSort] = useState<string>(filtersObj.sort || 'newest');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('none');
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Define safe objects to ensure they're never undefined
    const safeCategories = Array.isArray(categories) ? categories : [];
    const safeStats = stats && typeof stats === 'object' ? stats : { total: 0, images: 0, videos: 0, featured: 0 };
    const safeMemes = memes && typeof memes === 'object' ? memes : { data: [], current_page: 1, per_page: 10, total: 0, last_page: 1, links: [] };
    const safeAuth = auth && typeof auth === 'object' ? auth : { user: null };

    useEffect(() => {
        const filterSearch = filtersObj.search || '';
        const filterCategoryId = filtersObj.category_id || 'none';
        const filterMediaType = filtersObj.media_type || 'none';
        const filterSort = filtersObj.sort || 'newest';

        if (debouncedSearch !== filterSearch || categoryId !== filterCategoryId || mediaType !== filterMediaType || sort !== filterSort) {
            router.get(
                route('cryptocurrency-memes.index'),
                {
                    search: debouncedSearch || null,
                    category_id: categoryId === 'none' ? null : categoryId,
                    media_type: mediaType === 'none' ? null : mediaType,
                    sort: sort || null,
                },
                { preserveState: true, replace: true },
            );
        }
    }, [debouncedSearch, categoryId, mediaType, sort, filtersObj]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            // Validate file size (20MB max)
            if (selectedFile.size > 20 * 1024 * 1024) {
                setUploadError('File size must be less than 20MB');
                setFile(null);
                setPreviewUrl(null);
                return;
            }

            // Validate file type
            const fileType = selectedFile.type;
            if (!fileType.startsWith('image/') && !fileType.startsWith('video/')) {
                setUploadError('Only image or video files are allowed');
                setFile(null);
                setPreviewUrl(null);
                return;
            }

            setFile(selectedFile);
            setUploadError('');

            // Create a preview URL
            const url = URL.createObjectURL(selectedFile);
            setPreviewUrl(url);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            setUploadError('Please select a file to upload');
            return;
        }

        if (!title) {
            setUploadError('Please enter a title');
            return;
        }

        setIsUploading(true);
        setUploadError('');

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('category_id', selectedCategory === 'none' ? '' : selectedCategory);
        formData.append('media', file);

        // Submit the form
        router.post(route('cryptocurrency-memes.upload'), formData, {
            onSuccess: () => {
                setIsDialogOpen(false);
                setIsUploading(false);
                setTitle('');
                setDescription('');
                setSelectedCategory('none');
                setFile(null);
                setPreviewUrl(null);
            },
            onError: (errors) => {
                setIsUploading(false);
                setUploadError(Object.values(errors).join(', '));
            },
        });
    };

    // Clean up preview URL when component unmounts or when file changes
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    return (
        <>
            <Head title="Cryptocurrency Memes" />
            <Header />

            <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
                <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Cryptocurrency Memes</h1>
                        <p className="text-muted-foreground mt-1">Explore and share funny crypto memes and videos</p>
                    </div>
                    {/* 
                    {safeAuth.user && (
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <UploadIcon className="mr-2 h-4 w-4" />
                                    Upload Meme
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                                <DialogHeader>
                                    <DialogTitle>Upload your crypto meme</DialogTitle>
                                    <DialogDescription>
                                        Share your favorite meme with the community. You can upload images or short videos.
                                    </DialogDescription>
                                </DialogHeader>

                                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Title</Label>
                                        <Input
                                            id="title"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="Enter a catchy title"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description (Optional)</Label>
                                        <Textarea
                                            id="description"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Add a short description"
                                            rows={3}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="category">Category (Optional)</Label>
                                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">No category</SelectItem>
                                                {safeCategories.map((category) => (
                                                    <SelectItem key={category.id} value={String(category.id)}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="media">Upload File (Image or Video)</Label>
                                        <div className="hover:bg-muted/50 cursor-pointer rounded-lg border-2 border-dashed p-4 text-center">
                                            <input type="file" id="media" className="hidden" accept="image/*,video/*" onChange={handleFileChange} />
                                            <label htmlFor="media" className="cursor-pointer">
                                                {previewUrl ? (
                                                    file?.type.startsWith('image/') ? (
                                                        <img src={previewUrl} alt="Preview" className="mx-auto max-h-52" />
                                                    ) : (
                                                        <video src={previewUrl} controls className="mx-auto max-h-52" />
                                                    )
                                                ) : (
                                                    <div className="flex flex-col items-center py-4">
                                                        <div className="mb-2 flex">
                                                            <ImageIcon className="mr-2 h-6 w-6" />
                                                            <VideoIcon className="h-6 w-6" />
                                                        </div>
                                                        <p>Click to select an image or video</p>
                                                        <p className="text-muted-foreground mt-1 text-xs">
                                                            Supported formats: JPG, PNG, GIF, MP4, WEBM (Max 20MB)
                                                        </p>
                                                    </div>
                                                )}
                                            </label>
                                        </div>
                                        {uploadError && <p className="text-destructive mt-1 text-sm">{uploadError}</p>}
                                    </div>

                                    <div className="flex justify-end space-x-2">
                                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isUploading}>
                                            Cancel
                                        </Button>
                                        <Button type="submit" disabled={isUploading || !file}>
                                            {isUploading ? 'Uploading...' : 'Upload'}
                                        </Button>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>
                    )} */}
                </div>

                {/* Stats */}
                {/* <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                    <Card>
                        <CardContent>
                            <div className="text-2xl font-bold">{safeStats.total}</div>
                            <div className="text-muted-foreground text-sm">Total Memes</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent>
                            <div className="text-2xl font-bold">{safeStats.images}</div>
                            <div className="text-muted-foreground text-sm">Images</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent>
                            <div className="text-2xl font-bold">{safeStats.videos}</div>
                            <div className="text-muted-foreground text-sm">Videos</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent>
                            <div className="text-2xl font-bold">{safeStats.featured}</div>
                            <div className="text-muted-foreground text-sm">Featured Memes</div>
                        </CardContent>
                    </Card>
                </div> */}

                {/* Filters */}
                <div className="mb-8 flex flex-col gap-4 md:flex-row">
                    <div className="flex-1">
                        <Input placeholder="Search memes..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full" />
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

                    <Select value={mediaType} onValueChange={setMediaType}>
                        <SelectTrigger className="w-full md:w-[200px]">
                            <SelectValue placeholder="Media Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">All Types</SelectItem>
                            <SelectItem value="image">Images</SelectItem>
                            <SelectItem value="video">Videos</SelectItem>
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

                {/* Memes Grid */}
                {safeMemes.data.length > 0 ? (
                    <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {safeMemes.data.map((meme) => (
                            <Card key={meme.id} className="flex h-full flex-col overflow-hidden p-0 pb-6">
                                <Link href={route('cryptocurrency-memes.show', meme.slug)}>
                                    <div className="group relative aspect-square overflow-hidden">
                                        {meme.media_type === 'image' ? (
                                            <img
                                                src={meme.media_url}
                                                alt={meme.title}
                                                className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="relative h-full w-full">
                                                <video
                                                    src={meme.media_url}
                                                    className="h-full w-full object-cover"
                                                    muted
                                                    loop
                                                    onMouseOver={(e) => e.currentTarget.play()}
                                                    onMouseOut={(e) => {
                                                        e.currentTarget.pause();
                                                        e.currentTarget.currentTime = 0;
                                                    }}
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 24 24"
                                                        fill="currentColor"
                                                        className="h-12 w-12 text-white opacity-70"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </div>
                                            </div>
                                        )}
                                        {meme.is_featured && <Badge className="bg-primary absolute top-2 right-2">Featured</Badge>}
                                        <Badge className={`absolute top-2 left-2 ${meme.media_type === 'image' ? 'bg-primary' : 'bg-red-500'}`}>
                                            {meme.media_type === 'image' ? 'Image' : 'Video'}
                                        </Badge>
                                    </div>
                                </Link>
                                <CardHeader className="pt-6">
                                    <Link
                                        href={route('cryptocurrency-memes.show', meme.slug)}
                                        className="line-clamp-2 text-lg font-semibold hover:underline"
                                    >
                                        {meme.title}
                                    </Link>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center">
                        <h3 className="text-xl font-semibold">No memes found</h3>
                        <p className="text-muted-foreground mt-2">Try adjusting your search or filters</p>
                    </div>
                )}

                {/* Pagination */}
                {safeMemes.last_page > 1 && (
                    <div className="mt-8 flex justify-center">
                        <div className="flex gap-2">
                            {safeMemes.links.map((link, i) => (
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
