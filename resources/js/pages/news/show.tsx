import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { formatDistanceToNow } from 'date-fns';
import { Bookmark, Eye, MessageCircle, Share2, ThumbsUp } from 'lucide-react';

interface Article {
    id: number;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    banner_image: string;
    category: {
        name: string;
        slug: string;
    };
    author: {
        name: string;
        avatar?: string;
    };
    created_at: string;
    content_type: string;
    view_count: number;
    reading_time: number;
    tags: {
        id: number;
        name: string;
        slug: string;
    }[];
    source?: string;
    location?: string;
    is_time_sensitive?: boolean;
}

interface Props {
    article: Article;
    relatedArticles: Article[];
    trendingArticles: Article[];
}

export default function NewsShow({ article, relatedArticles, trendingArticles }: Props) {
    return (
        <AppLayout>
            <Head title={`${article.title} - CoinMews`} />

            <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
                <article className="mx-auto max-w-4xl">
                    {/* Article Header */}
                    <header className="mb-8">
                        <div className="flex items-center gap-2">
                            <Link href={`/categories/${article.category.slug}`}>
                                <Badge variant="secondary">{article.category.name}</Badge>
                            </Link>
                            {article.is_time_sensitive && <Badge variant="destructive">Time Sensitive</Badge>}
                        </div>
                        <h1 className="mt-4 text-4xl font-bold">{article.title}</h1>
                        <div className="text-muted-foreground mt-4 flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                {article.author.avatar ? (
                                    <img src={article.author.avatar} alt={article.author.name} className="h-6 w-6 rounded-full" />
                                ) : (
                                    <div className="bg-muted h-6 w-6 rounded-full" />
                                )}
                                <span>By {article.author.name}</span>
                            </div>
                            <span>•</span>
                            <span>{formatDistanceToNow(new Date(article.created_at), { addSuffix: true })}</span>
                            <span>•</span>
                            <span>{article.reading_time} min read</span>
                        </div>
                        {article.source && (
                            <div className="text-muted-foreground mt-2 text-sm">
                                Source: {article.source}
                                {article.location && ` • ${article.location}`}
                            </div>
                        )}
                    </header>

                    {/* Article Banner */}
                    <div className="relative mb-8 aspect-video overflow-hidden rounded-lg">
                        <img src={article.banner_image} alt={article.title} className="h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>

                    {/* Article Content */}
                    <div className="" dangerouslySetInnerHTML={{ __html: article.content }} />

                    {/* Article Tags */}
                    {article.tags.length > 0 && (
                        <div className="mt-8">
                            <h2 className="mb-4 text-lg font-semibold">Tags</h2>
                            <div className="flex flex-wrap gap-2">
                                {article.tags.map((tag) => (
                                    <Link key={tag.id} href={`/tags/${tag.slug}`}>
                                        <Badge variant="outline">{tag.name}</Badge>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Article Actions */}
                    <div className="mt-8 flex items-center justify-between border-t pt-8">
                        <div className="flex items-center gap-4">
                            <Button variant="outline" size="sm">
                                <ThumbsUp className="mr-2 h-4 w-4" />
                                Like
                            </Button>
                            <Button variant="outline" size="sm">
                                <MessageCircle className="mr-2 h-4 w-4" />
                                Comment
                            </Button>
                            <Button variant="outline" size="sm">
                                <Share2 className="mr-2 h-4 w-4" />
                                Share
                            </Button>
                        </div>
                        <Button variant="outline" size="sm">
                            <Bookmark className="mr-2 h-4 w-4" />
                            Save
                        </Button>
                    </div>
                </article>

                {/* Related Articles */}
                {relatedArticles.length > 0 && (
                    <div className="mt-12">
                        <h2 className="mb-6 text-2xl font-bold">Related Articles</h2>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {relatedArticles.map((relatedArticle) => (
                                <Link key={relatedArticle.id} href={`/news/${relatedArticle.slug}`}>
                                    <Card className="h-full overflow-hidden transition-shadow hover:shadow-lg">
                                        <div className="relative aspect-video">
                                            <img
                                                src={relatedArticle.banner_image}
                                                alt={relatedArticle.title}
                                                className="h-full w-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                            <Badge variant="secondary" className="absolute bottom-2 left-2">
                                                {relatedArticle.category.name}
                                            </Badge>
                                        </div>
                                        <CardHeader>
                                            <CardTitle className="line-clamp-2">{relatedArticle.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-muted-foreground line-clamp-3 text-sm">{relatedArticle.excerpt}</p>
                                            <div className="mt-4 flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">By {relatedArticle.author.name}</span>
                                                <span className="text-muted-foreground">{relatedArticle.reading_time} min read</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Trending Articles */}
                {trendingArticles.length > 0 && (
                    <div className="mt-12">
                        <h2 className="mb-6 text-2xl font-bold">Trending Now</h2>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {trendingArticles.map((trendingArticle) => (
                                <Link key={trendingArticle.id} href={`/news/${trendingArticle.slug}`}>
                                    <Card className="h-full overflow-hidden transition-shadow hover:shadow-lg">
                                        <div className="relative aspect-video">
                                            <img
                                                src={trendingArticle.banner_image}
                                                alt={trendingArticle.title}
                                                className="h-full w-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                            <Badge variant="secondary" className="absolute bottom-2 left-2">
                                                {trendingArticle.category.name}
                                            </Badge>
                                        </div>
                                        <CardHeader>
                                            <CardTitle className="line-clamp-2">{trendingArticle.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-muted-foreground line-clamp-3 text-sm">{trendingArticle.excerpt}</p>
                                            <div className="mt-4 flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">By {trendingArticle.author.name}</span>
                                                <div className="text-muted-foreground flex items-center gap-2">
                                                    <Eye className="h-4 w-4" />
                                                    <span>{trendingArticle.view_count}</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
