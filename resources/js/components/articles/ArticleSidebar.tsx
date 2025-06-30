import { Card, CardContent } from '@/components/ui/card';
import { Article } from '@/types/articleTypes';
import { Link } from '@inertiajs/react';
import { formatDistanceToNow } from 'date-fns';

interface ArticleSidebarProps {
    relatedArticles: Article[];
}

export function ArticleSidebar({ relatedArticles }: ArticleSidebarProps) {
    return (
        <aside className="space-y-6" role="complementary" aria-label="Article sidebar">
            <div>
                <section role="region" aria-label="Related articles">
                    <h2 className="mb-6 text-2xl font-bold">Related Articles</h2>
                    {relatedArticles.length > 0 ? (
                        <div className="space-y-3">
                            {relatedArticles.map((relatedArticle) => (
                                <Card key={relatedArticle.id} className="overflow-hidden p-0">
                                    <div className="flex">
                                        {relatedArticle.banner_url && (
                                            <div className="w-1/3 flex-shrink-0">
                                                <img
                                                    src={relatedArticle.banner_url}
                                                    alt={relatedArticle.title}
                                                    className="h-full w-full object-cover"
                                                    loading="lazy"
                                                    style={{ minHeight: '80px', maxHeight: '100px' }}
                                                />
                                            </div>
                                        )}
                                        <CardContent className="w-2/3 p-3">
                                            <Link href={`/articles/${relatedArticle.slug}`} className="no-underline">
                                                <h3 className="mb-1 line-clamp-2 text-sm font-semibold hover:underline">{relatedArticle.title}</h3>
                                            </Link>
                                            <div className="text-muted-foreground flex flex-wrap items-center gap-1 text-xs">
                                                <span>{relatedArticle.category.name}</span>
                                                <span>•</span>
                                                <span>
                                                    {formatDistanceToNow(new Date(relatedArticle.published_at || ''), {
                                                        addSuffix: true,
                                                    })}
                                                </span>
                                            </div>
                                        </CardContent>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-muted-foreground rounded-lg border p-4 text-center">No related articles found.</div>
                    )}
                </section>
            </div>
        </aside>
    );
}
