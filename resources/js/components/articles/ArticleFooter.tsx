import ShareDialog from '@/components/share-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Article } from '@/types/articleTypes';
import { Link } from '@inertiajs/react';
import { formatDistanceToNow } from 'date-fns';
import { AlertCircle, CheckCircle2, Flag, Loader2, MessageSquare, MoreVertical } from 'lucide-react';
import { useState } from 'react';

interface ArticleFooterProps {
    article: Article;
    relatedArticles: Article[];
    isAdmin?: boolean;
    isAuthor?: boolean;
}

export function ArticleFooter({ article, relatedArticles, isAdmin = false, isAuthor = false }: ArticleFooterProps) {
    const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>('newest');
    const [replyTo, setReplyTo] = useState<number | null>(null);
    const [editingComment, setEditingComment] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const commentsPerPage = 10;

    const sortedComments = [...article.comments].sort((a, b) => {
        switch (sortBy) {
            case 'newest':
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            case 'oldest':
                return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
            case 'popular':
                return b.report_count - a.report_count;
            default:
                return 0;
        }
    });

    const totalPages = Math.ceil(sortedComments.length / commentsPerPage);
    const paginatedComments = sortedComments.slice((currentPage - 1) * commentsPerPage, currentPage * commentsPerPage);

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            // TODO: Implement comment submission
        } catch (err) {
            setError('Failed to submit comment. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCommentEdit = (commentId: number) => {
        setEditingComment(commentId);
    };

    const handleCommentDelete = (commentId: number) => {
        // TODO: Implement comment deletion
    };

    const handleCommentReport = (commentId: number) => {
        // TODO: Implement comment reporting
    };

    const handleCommentVote = (commentId: number, vote: 'up' | 'down') => {
        // TODO: Implement comment voting
    };

    const handleCommentApprove = (commentId: number) => {
        // TODO: Implement comment approval
    };

    const handleCommentMarkAsSpam = (commentId: number) => {
        // TODO: Implement marking comment as spam
    };

    return (
        <footer className="mt-12 space-y-8" role="contentinfo" aria-label="Article footer">
            {error && (
                <div className="border-destructive bg-destructive/10 text-destructive rounded-lg border p-4">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        <p>{error}</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Comments Section - Takes 2/3 of the space */}
                <div className="lg:col-span-2">
                    <section role="region" aria-label="Comments">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-2xl font-bold">Comments</h2>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSortBy('newest')}
                                    className={sortBy === 'newest' ? 'bg-muted' : ''}
                                >
                                    Newest
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSortBy('oldest')}
                                    className={sortBy === 'oldest' ? 'bg-muted' : ''}
                                >
                                    Oldest
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSortBy('popular')}
                                    className={sortBy === 'popular' ? 'bg-muted' : ''}
                                >
                                    Popular
                                </Button>
                            </div>
                        </div>

                        <Card>
                            <CardContent className="p-6">
                                <form onSubmit={handleCommentSubmit} className="mb-6 space-y-4">
                                    <Textarea
                                        placeholder="Write your comment..."
                                        className="min-h-[100px]"
                                        aria-label="Comment text"
                                        disabled={isLoading}
                                    />
                                    <div className="flex justify-end">
                                        <Button type="submit" disabled={isLoading}>
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Posting...
                                                </>
                                            ) : (
                                                'Post Comment'
                                            )}
                                        </Button>
                                    </div>
                                </form>

                                {article.comments.length > 0 ? (
                                    <>
                                        <div className="space-y-6">
                                            {paginatedComments.map((comment) => (
                                                <div
                                                    key={comment.id}
                                                    className={`rounded-lg border p-4 ${
                                                        comment.is_spam ? 'bg-destructive/10' : comment.is_approved ? 'bg-muted' : ''
                                                    }`}
                                                    role="article"
                                                    aria-label={`Comment by ${comment.user.name}`}
                                                >
                                                    <div className="mb-4 flex items-start justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <Avatar>
                                                                <AvatarImage src={comment.user.avatar_url} alt={comment.user.name} />
                                                                <AvatarFallback>{comment.user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <div className="font-medium">{comment.user.name}</div>
                                                                <div className="text-muted-foreground text-sm">
                                                                    {formatDistanceToNow(new Date(comment.created_at), {
                                                                        addSuffix: true,
                                                                    })}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {comment.is_spam && (
                                                                <span className="text-destructive flex items-center gap-1 text-sm">
                                                                    <AlertCircle className="h-4 w-4" />
                                                                    Spam
                                                                </span>
                                                            )}
                                                            {comment.is_approved && (
                                                                <span className="text-success flex items-center gap-1 text-sm">
                                                                    <CheckCircle2 className="h-4 w-4" />
                                                                    Approved
                                                                </span>
                                                            )}
                                                            {comment.approved_at && (
                                                                <span className="text-muted-foreground text-sm">
                                                                    Approved{' '}
                                                                    {formatDistanceToNow(new Date(comment.approved_at), {
                                                                        addSuffix: true,
                                                                    })}
                                                                </span>
                                                            )}
                                                            {comment.report_count > 0 && (
                                                                <span className="text-warning flex items-center gap-1 text-sm">
                                                                    <Flag className="h-4 w-4" />
                                                                    {comment.report_count} reports
                                                                </span>
                                                            )}
                                                            {(isAdmin || isAuthor) && (
                                                                <div className="relative">
                                                                    <Button variant="ghost" size="icon">
                                                                        <MoreVertical className="h-4 w-4" />
                                                                    </Button>
                                                                    <div className="bg-background absolute top-full right-0 mt-1 w-48 rounded-md border p-1 shadow-lg">
                                                                        {isAdmin && (
                                                                            <>
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    className="w-full justify-start"
                                                                                    onClick={() => handleCommentApprove(comment.id)}
                                                                                >
                                                                                    Approve
                                                                                </Button>
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    className="w-full justify-start"
                                                                                    onClick={() => handleCommentMarkAsSpam(comment.id)}
                                                                                >
                                                                                    Mark as Spam
                                                                                </Button>
                                                                            </>
                                                                        )}
                                                                        {(isAdmin || isAuthor) && (
                                                                            <>
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    className="w-full justify-start"
                                                                                    onClick={() => handleCommentEdit(comment.id)}
                                                                                >
                                                                                    Edit
                                                                                </Button>
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    className="text-destructive w-full justify-start"
                                                                                    onClick={() => handleCommentDelete(comment.id)}
                                                                                >
                                                                                    Delete
                                                                                </Button>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {editingComment === comment.id ? (
                                                        <div className="space-y-4">
                                                            <Textarea defaultValue={comment.content} className="min-h-[100px]" />
                                                            <div className="flex justify-end gap-2">
                                                                <Button variant="outline" onClick={() => setEditingComment(null)}>
                                                                    Cancel
                                                                </Button>
                                                                <Button>Save</Button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="prose prose-sm dark:prose-invert max-w-none">{comment.content}</div>
                                                    )}

                                                    <div className="mt-4 flex items-center gap-4">
                                                        <Button variant="ghost" size="sm" onClick={() => setReplyTo(comment.id)}>
                                                            <MessageSquare className="mr-2 h-4 w-4" />
                                                            Reply
                                                        </Button>
                                                        <Button variant="ghost" size="sm" onClick={() => handleCommentReport(comment.id)}>
                                                            <Flag className="mr-2 h-4 w-4" />
                                                            Report
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {totalPages > 1 && (
                                            <div className="mt-6 flex justify-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                                    disabled={currentPage === 1}
                                                >
                                                    Previous
                                                </Button>
                                                <span className="flex items-center px-4">
                                                    Page {currentPage} of {totalPages}
                                                </span>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                                    disabled={currentPage === totalPages}
                                                >
                                                    Next
                                                </Button>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="text-muted-foreground rounded-lg border p-4 text-center">
                                        No comments yet. Be the first to comment!
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </section>
                </div>

                {/* Related Articles Section - Takes 1/3 of the space */}
                <div>
                    <section role="region" aria-label="Related articles">
                        <h2 className="mb-6 text-2xl font-bold">Related Articles</h2>
                        {relatedArticles.length > 0 ? (
                            <div className="space-y-4">
                                {relatedArticles.map((relatedArticle) => (
                                    <Card key={relatedArticle.id} className="overflow-hidden">
                                        {relatedArticle.banner_url && (
                                            <img
                                                src={relatedArticle.banner_url}
                                                alt={relatedArticle.title}
                                                className="h-48 w-full object-cover"
                                                loading="lazy"
                                            />
                                        )}
                                        <CardContent className="p-4">
                                            <Link href={`/articles/${relatedArticle.slug}`} className="no-underline">
                                                <h3 className="mb-2 line-clamp-2 font-semibold hover:underline">{relatedArticle.title}</h3>
                                            </Link>
                                            <div className="text-muted-foreground flex items-center gap-2 text-sm">
                                                <span>{relatedArticle.category.name}</span>
                                                <span>•</span>
                                                <span>
                                                    {formatDistanceToNow(new Date(relatedArticle.published_at || ''), {
                                                        addSuffix: true,
                                                    })}
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="text-muted-foreground rounded-lg border p-4 text-center">No related articles found.</div>
                        )}
                    </section>

                    <section role="region" aria-label="Share options" className="mt-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Share this Article</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ShareDialog url={window.location.href} title={article.title} description={article.excerpt || ''} />
                            </CardContent>
                        </Card>
                    </section>
                </div>
            </div>
        </footer>
    );
}
