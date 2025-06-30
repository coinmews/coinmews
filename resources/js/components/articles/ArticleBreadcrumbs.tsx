import { Article } from '@/types/articleTypes';
import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';

interface ArticleBreadcrumbsProps {
    article: Article;
}

export function ArticleBreadcrumbs({ article }: ArticleBreadcrumbsProps) {
    return (
        <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center space-x-2 text-sm">
                <li>
                    <Link href="/" className="text-muted-foreground hover:text-foreground">
                        Home
                    </Link>
                </li>
                <li className="flex items-center">
                    <ChevronRight className="text-muted-foreground h-4 w-4" />
                    <Link href="/articles" className="text-muted-foreground hover:text-foreground ml-2">
                        Articles
                    </Link>
                </li>
                {article.category && (
                    <li className="flex items-center">
                        <ChevronRight className="text-muted-foreground h-4 w-4" />
                        <Link href={`/categories/${article.category.slug}`} className="text-muted-foreground hover:text-foreground ml-2">
                            {article.category.name}
                        </Link>
                    </li>
                )}
                <li className="flex items-center">
                    <ChevronRight className="text-muted-foreground h-4 w-4" />
                    <span className="text-foreground ml-2 font-medium" aria-current="page">
                        {article.title}
                    </span>
                </li>
            </ol>
        </nav>
    );
}
