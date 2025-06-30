import Footer from '@/components/sections/footer';
import Header from '@/components/sections/header';
import ShareDialog from '@/components/share-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'sonner';

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
        bio: string | null;
    };
    category: {
        id: number;
        name: string;
        slug: string;
    } | null;
}

interface Meta {
    title: string;
    description: string;
    keywords: string;
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
}

interface MemePageProps {
    meme: Meme;
    relatedMemes: Meme[];
    meta: Meta;
}

export default function MemeShow({ auth, meme, relatedMemes, meta }: PageProps & MemePageProps) {
    const [upvotes, setUpvotes] = useState(meme.upvotes_count);
    const [hasUpvoted, setHasUpvoted] = useState(false);

    const handleUpvote = async () => {
        if (!auth.user) {
            toast.error('You need to sign in to upvote memes');
            return;
        }

        if (hasUpvoted) {
            toast.info('You have already upvoted this meme');
            return;
        }

        try {
            const response = await axios.post(route('cryptocurrency-memes.upvote', meme.id));
            setUpvotes(response.data.upvotes_count);
            setHasUpvoted(true);
            toast.success('Meme upvoted successfully!');
        } catch {
            toast.error('Failed to upvote meme');
        }
    };

    return (
        <div>
            <Head title={meta.title}>
                <meta name="description" content={meta.description} />
                <meta name="keywords" content={meta.keywords} />
                <meta property="og:title" content={meta.og.title} />
                <meta property="og:description" content={meta.og.description} />
                {meta.og.image && <meta property="og:image" content={meta.og.image} />}
                <meta property="og:type" content={meta.og.type} />
                <meta property="og:url" content={meta.og.url} />
                <meta name="twitter:card" content={meta.twitter.card} />
                <meta name="twitter:title" content={meta.twitter.title} />
                <meta name="twitter:description" content={meta.twitter.description} />
                {meta.twitter.image && <meta name="twitter:image" content={meta.twitter.image} />}
            </Head>

            <Header />

            <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
                {/* Breadcrumb and Share */}
                <div className="mb-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center space-x-2">
                            <Link href={route('cryptocurrency-memes.index')} className="text-muted-foreground hover:text-foreground">
                                Cryptocurrency Memes
                            </Link>
                            <span className="text-muted-foreground">/</span>
                            <span className="font-medium">{meme.title}</span>
                        </div>
                        <ShareDialog
                            url={window.location.href}
                            title={meme.title}
                            description={meme.description || 'Check out this cryptocurrency meme!'}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        {/* Meme Media */}
                        <div className="bg-muted mb-6 overflow-hidden rounded-lg">
                            {meme.media_type === 'image' ? (
                                <img src={meme.media_url} alt={meme.title} className="mx-auto max-w-full" />
                            ) : (
                                <video src={meme.media_url} controls autoPlay loop muted className="mx-auto max-w-full"></video>
                            )}
                        </div>

                        {/* Meme Info */}
                        <div className="mb-8">
                            <div className="mb-2 flex items-center gap-2">
                                <Badge variant="outline" className={`${meme.media_type === 'image' ? 'text-primary border-primary/20' : 'text-red-500 border-red-200'}`}>
                                    {meme.media_type === 'image' ? 'Image' : 'Video'}
                                </Badge>
                                {meme.is_featured && <Badge className="bg-primary">Featured</Badge>}
                                {meme.category && (
                                    <Link href={route('categories.show', meme.category.slug)}>
                                        <Badge variant="secondary">{meme.category.name}</Badge>
                                    </Link>
                                )}
                            </div>

                            <h1 className="mb-4 text-2xl font-bold md:text-3xl">{meme.title}</h1>

                            <div className="mb-6 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            className="text-muted-foreground h-5 w-5"
                                        >
                                            <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                                            <path
                                                fillRule="evenodd"
                                                d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <span className="text-muted-foreground">{meme.view_count} views</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            className="text-muted-foreground h-5 w-5"
                                        >
                                            <path d="M12.75 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM7.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM8.25 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM9.75 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM10.5 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM12.75 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM14.25 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 13.5a.75.75 0 100-1.5.75.75 0 000 1.5z" />
                                            <path
                                                fillRule="evenodd"
                                                d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <span className="text-muted-foreground">{new Date(meme.published_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                {/* <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm" onClick={handleUpvote} disabled={hasUpvoted}>
                                        <ThumbsUpIcon className={`mr-2 h-4 w-4 ${hasUpvoted ? 'fill-current' : ''}`} />
                                        <span>{upvotes}</span>
                                    </Button>
                                </div> */}
                            </div>

                            {/* Creator Info */}
                            <div className="bg-muted mb-6 flex items-center gap-4 rounded-lg p-4">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={meme.user.avatar || undefined} alt={meme.user.name} />
                                    <AvatarFallback>{meme.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <Link href={`/users/${meme.user.username}`} className="font-semibold hover:underline">
                                        {meme.user.name}
                                    </Link>
                                    {meme.user.bio && <p className="text-muted-foreground line-clamp-2 text-sm">{meme.user.bio}</p>}
                                </div>
                            </div>

                            {/* Description */}
                            {meme.description && (
                                <div className="bg-card mb-6 rounded-lg p-4">
                                    <h2 className="mb-2 text-lg font-semibold">Description</h2>
                                    <div className="prose dark:prose-invert max-w-none">
                                        <p className="whitespace-pre-line">{meme.description}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        {/* Related Memes */}
                        <div className="sticky top-4 space-y-6">
                            <h2 className="mb-4 text-xl font-semibold">Related {meme.media_type === 'image' ? 'Images' : 'Videos'}</h2>
                            <div className="space-y-4">
                                {relatedMemes.length > 0 ? (
                                    relatedMemes.map((relatedMeme) => (
                                        <Card key={relatedMeme.id} className="overflow-hidden">
                                            <Link href={route('cryptocurrency-memes.show', relatedMeme.slug)}>
                                                <div className="flex flex-row">
                                                    <div className="relative aspect-square w-1/3">
                                                        {relatedMeme.media_type === 'image' ? (
                                                            <img
                                                                src={relatedMeme.media_url}
                                                                alt={relatedMeme.title}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center bg-black">
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    viewBox="0 0 24 24"
                                                                    fill="currentColor"
                                                                    className="h-8 w-8 text-white opacity-70"
                                                                >
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
                                                                        clipRule="evenodd"
                                                                    />
                                                                </svg>
                                                            </div>
                                                        )}
                                                        <Badge className={`absolute top-2 left-2 ${relatedMeme.media_type === 'image' ? 'bg-primary' : 'bg-red-500'}`}>
                                                            {relatedMeme.media_type === 'image' ? 'Image' : 'Video'}
                                                        </Badge>
                                                    </div>
                                                    <CardContent className="w-2/3 p-3">
                                                        <h3 className="line-clamp-2 text-sm font-medium">{relatedMeme.title}</h3>
                                                        <div className="text-muted-foreground mt-2 flex items-center text-xs">
                                                            <span>{relatedMeme.view_count} views</span>
                                                            <span className="mx-2">•</span>
                                                            <span>{relatedMeme.upvotes_count} upvotes</span>
                                                        </div>
                                                    </CardContent>
                                                </div>
                                            </Link>
                                        </Card>
                                    ))
                                ) : (
                                    <p className="text-muted-foreground p-4 text-center">No related memes found</p>
                                )}
                            </div>

                            {/* Back Button */}
                            <div className="mt-8">
                                <Link href={route('cryptocurrency-memes.index')}>
                                    <Button variant="outline" className="w-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="mr-2 h-4 w-4">
                                            <path
                                                fillRule="evenodd"
                                                d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        Back to All Memes
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
