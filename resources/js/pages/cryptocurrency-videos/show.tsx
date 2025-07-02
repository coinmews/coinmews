import Footer from '@/components/sections/footer';
import Header from '@/components/sections/header';
import ShareDialog from '@/components/share-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import YouTubePlayer from '@/components/youtube-player';
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Video {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    youtube_url: string;
    youtube_id: string;
    youtube_embed_url: string;
    thumbnail_url: string | null;
    duration: string | null;
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
    canonical: string;
    structuredData: any;
}

interface VideoPageProps {
    video: Video;
    relatedVideos: Video[];
    meta: Meta;
}

export default function VideoShow({ auth, video, relatedVideos, meta, structuredData }: PageProps & VideoPageProps & { structuredData: any }) {
    const [upvotes, setUpvotes] = useState(video.upvotes_count);
    const [hasUpvoted, setHasUpvoted] = useState(false);
    const [videoError, setVideoError] = useState(false);

    const handleUpvote = async () => {
        if (!auth.user) {
            toast.error('You need to sign in to upvote videos');
            return;
        }

        if (hasUpvoted) {
            toast.info('You have already upvoted this video');
            return;
        }

        try {
            const response = await axios.post(route('cryptocurrency-videos.upvote', video.id));
            setUpvotes(response.data.upvotes_count);
            setHasUpvoted(true);
            toast.success('Video upvoted successfully!');
        } catch {
            toast.error('Failed to upvote video');
        }
    };

    const handleVideoError = () => {
        console.error('Failed to load YouTube video');
        setVideoError(true);
    };

    useEffect(() => {
        // Log when component mounts
        console.log('Component mounted with video data:', {
            url: video.youtube_url,
            id: video.youtube_id,
            error: videoError,
        });

        // Add message event listener for iframe errors
        const handleMessage = (event: MessageEvent) => {
            if (event.origin === 'https://www.youtube.com') {
                console.log('YouTube iframe message:', event.data);
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [video, videoError]);

    return (
        <div>
            <Head>
                <title>{meta.title}</title>
                <meta name="description" content={meta.description} />
                <meta name="keywords" content={meta.keywords} />
                <link rel="canonical" href={meta.canonical} />
                <meta property="og:title" content={meta.og.title} />
                <meta property="og:description" content={meta.og.description} />
                {meta.og.image && <meta property="og:image" content={meta.og.image} />}
                <meta property="og:type" content={meta.og.type} />
                <meta property="og:url" content={meta.og.url} />
                <meta name="twitter:card" content={meta.twitter.card} />
                <meta name="twitter:title" content={meta.twitter.title} />
                <meta name="twitter:description" content={meta.twitter.description} />
                {meta.twitter.image && <meta name="twitter:image" content={meta.twitter.image} />}
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            </Head>

            <Header />

            <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
                {/* Breadcrumb and Share */}
                <div className="mb-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center space-x-2">
                            <Link href={route('cryptocurrency-videos.index')} className="text-muted-foreground hover:text-foreground">
                                Cryptocurrency Videos
                            </Link>
                            <span className="text-muted-foreground">/</span>
                            <span className="font-medium">{video.title}</span>
                        </div>
                        <ShareDialog
                            url={window.location.href}
                            title={video.title}
                            description={video.description || 'Check out this cryptocurrency video!'}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        {/* Video Player */}
                        <div className="mb-6 aspect-video overflow-hidden rounded-lg">
                            <YouTubePlayer videoId={video.youtube_id} title={video.title} onError={handleVideoError} />
                        </div>

                        {/* Video Info */}
                        <div className="mb-8">
                            <h1 className="text-4xl font-bold">{meta.title}</h1>

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
                                        <span className="text-muted-foreground">{video.view_count} views</span>
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
                                        <span className="text-muted-foreground">{new Date(video.published_at).toLocaleDateString()}</span>
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
                                    <AvatarImage src={video.user.avatar || undefined} alt={video.user.name} />
                                    <AvatarFallback>{video.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <Link href={`/users/${video.user.username}`} className="font-semibold hover:underline">
                                        {video.user.name}
                                    </Link>
                                    {video.user.bio && <p className="text-muted-foreground line-clamp-2 text-sm">{video.user.bio}</p>}
                                </div>
                            </div>

                            {/* Description */}
                            {video.description && (
                                <div className="bg-card mb-6 rounded-lg p-4">
                                    <h2 className="mb-2 text-lg font-semibold">Description</h2>
                                    <div className="prose dark:prose-invert max-w-none">
                                        <p className="whitespace-pre-line">{video.description}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        {/* Related Videos */}
                        <div className="sticky top-4 space-y-6">
                            <h2 className="mb-4 text-xl font-semibold">Related Videos</h2>
                            <div className="space-y-4">
                                {relatedVideos.length > 0 ? (
                                    relatedVideos.map((relatedVideo) => (
                                        <Card key={relatedVideo.id} className="overflow-hidden">
                                            <Link href={route('cryptocurrency-videos.show', relatedVideo.slug)}>
                                                <div className="flex flex-col sm:flex-row lg:flex-col">
                                                    <div className="relative aspect-video sm:w-1/3 lg:w-full">
                                                        <img
                                                            src={
                                                                relatedVideo.thumbnail_url ||
                                                                `https://img.youtube.com/vi/${relatedVideo.youtube_id}/mqdefault.jpg`
                                                            }
                                                            alt={relatedVideo.title}
                                                            className="h-full w-full object-cover"
                                                        />
                                                        {relatedVideo.duration && (
                                                            <div className="absolute right-2 bottom-2 rounded bg-black/70 px-1 py-0.5 text-xs text-white">
                                                                {relatedVideo.duration}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <CardContent className="p-3 sm:w-2/3 lg:w-full">
                                                        <h3 className="line-clamp-2 text-sm font-medium">{relatedVideo.title}</h3>
                                                        <div className="text-muted-foreground mt-2 flex items-center text-xs">
                                                            <span>{relatedVideo.view_count} views</span>
                                                            <span className="mx-2">•</span>
                                                            <span>{new Date(relatedVideo.published_at).toLocaleDateString()}</span>
                                                        </div>
                                                    </CardContent>
                                                </div>
                                            </Link>
                                        </Card>
                                    ))
                                ) : (
                                    <p className="text-muted-foreground p-4 text-center">No related videos found</p>
                                )}
                            </div>

                            {/* Back Button */}
                            <div className="mt-8">
                                <Link href={route('cryptocurrency-videos.index')}>
                                    <Button variant="outline" className="w-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="mr-2 h-4 w-4">
                                            <path
                                                fillRule="evenodd"
                                                d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        Back to All Videos
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
