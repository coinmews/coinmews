import { cn } from '@/lib/utils';
import { Article } from '@/types/articleTypes';
import { Calendar, Eye, ImageIcon, MessageSquare, Play, TrendingUp } from 'lucide-react';
import React, { useState } from 'react';
import WebStoryPlayer from '../stories/web-story-player';

type WebStoryCardProps = {
    article: Article;
};

const WebStoryCard: React.FC<WebStoryCardProps> = ({ article }) => {
    const [showStoryPlayer, setShowStoryPlayer] = useState(false);

    // Only handle web stories
    if (article.content_type !== 'web_story') return null;

    // Format the published date
    const formatDate = (date: string | null) => {
        if (!date) return '';
        const d = new Date(date);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    // Get user initials for avatar fallback
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase();
    };

    // Parse story slides safely
    const getSlideCount = () => {
        if (!article.story_slides) return 0;
        try {
            const slides = typeof article.story_slides === 'string' ? JSON.parse(article.story_slides) : article.story_slides;
            return Array.isArray(slides) ? slides.length : 0;
        } catch {
            return 0;
        }
    };

    const slideCount = article.slides_count || getSlideCount();

    return (
        <>
            <button
                onClick={() => setShowStoryPlayer(true)}
                className="focus-visible:ring-primary block w-full text-left focus:outline-none focus-visible:ring-1"
            >
                <div
                    className={cn(
                        'group bg-muted relative w-full overflow-hidden rounded-lg',
                        'hover:ring-border transition-all duration-200 hover:shadow-md hover:ring-1',
                        'aspect-[3/4] sm:aspect-[3/5] md:aspect-[9/16]',
                        article.deleted_at && 'opacity-60',
                        !article.is_vertical && 'aspect-video',
                    )}
                >
                    {/* Background Image */}
                    <img
                        src={article.banner_url || '/default-banner.png'}
                        alt={article.title}
                        className="absolute inset-0 h-full w-full object-contain"
                        onError={(e) => {
                            e.currentTarget.src = '/default-banner.png';
                        }}
                        loading="lazy"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80" />

                    {/* Breaking News Indicator */}
                    {article.is_breaking_news && (
                        <div className="bg-destructive text-destructive-foreground absolute top-0 left-0 px-2 py-0.5 text-[10px] font-bold">
                            BREAKING
                        </div>
                    )}

                    {/* Compact Header with Author */}
                    <div className="absolute top-1.5 right-1.5 left-1.5 flex items-center justify-between">
                        {/* <div className="flex items-center gap-1.5">
                            <div className="bg-background/20 ring-background/50 relative h-6 w-6 overflow-hidden rounded-full ring-1">
                                {article.author?.avatar_url ? (
                                    <img
                                        src={article.author.avatar_url}
                                        alt={article.author?.name || 'Author'}
                                        className="h-full w-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.src = '/default-avatar.jpg';
                                        }}
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-gray-200 text-[10px] font-medium text-gray-600">
                                        {article.author?.name ? getInitials(article.author.name) : 'U'}
                                    </div>
                                )}
                            </div>
                            <div className="text-primary-foreground max-w-[80px] truncate text-xs font-medium">
                                {article.author?.name || 'Unknown'}
                            </div>
                        </div> */}

                        {/* Compact Status Badges */}
                        <div className="flex flex-wrap gap-1">
                            {/* {article.is_featured && (
                                <span className="bg-primary/90 text-primary-foreground flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium">
                                    <Star className="mr-0.5 h-2 w-2" />
                                    <span className="hidden sm:inline">Featured</span>
                                </span>
                            )} */}
                            {article.is_trending && (
                                <span className="bg-accent/90 text-accent-foreground flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium">
                                    <TrendingUp className="mr-0.5 h-2 w-2" />
                                    <span className="hidden sm:inline">Trending</span>
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Title and Description - Bottom */}
                    <div className="absolute right-0 bottom-0 left-0 p-2">
                        <div className="space-y-0.5">
                            {/* <h3 className="text-primary-foreground line-clamp-2 text-sm leading-tight font-bold">{article.title}</h3>
                            <p className="text-primary-foreground/80 line-clamp-1 text-xs">{article.excerpt}</p> */}

                            {/* Compact Stats */}
                            <div className="flex flex-wrap items-center gap-2 pt-1">
                                {slideCount > 0 && (
                                    <div className="flex items-center gap-0.5 text-[10px] text-white/90">
                                        <ImageIcon className="h-2.5 w-2.5" />
                                        <span>{slideCount}</span>
                                    </div>
                                )}
                                {article.view_count > 0 && (
                                    <div className="flex items-center gap-0.5 text-[10px] text-white/90">
                                        <Eye className="h-2.5 w-2.5" />
                                        <span>{article.view_count > 1000 ? `${(article.view_count / 1000).toFixed(1)}K` : article.view_count}</span>
                                    </div>
                                )}
                                {article.comments?.length > 0 && (
                                    <div className="flex items-center gap-0.5 text-[10px] text-white/90">
                                        <MessageSquare className="h-2.5 w-2.5" />
                                        <span>{article.comments.length}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-0.5 text-[10px] text-white/90">
                                    <Calendar className="h-2.5 w-2.5" />
                                    <span>{formatDate(article.published_at)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Play Indicator */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                        <div className="bg-primary rounded-full p-2 backdrop-blur-sm">
                            <Play className="h-5 w-5 text-white" />
                        </div>
                    </div>
                </div>
            </button>

            {/* Story Player Modal */}
            {showStoryPlayer && <WebStoryPlayer article={article} onClose={() => setShowStoryPlayer(false)} />}
        </>
    );
};

export default WebStoryCard;
