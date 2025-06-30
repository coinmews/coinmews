import { Badge } from '@/components/ui/badge';
import { Article, ContentTypeLayout } from '@/types/articleTypes';
import { Link } from '@inertiajs/react';
import {
    AlertTriangle,
    BookOpen,
    Building2,
    Clock,
    FileText,
    Image as ImageIcon,
    Link as LinkIcon,
    Loader2,
    Map,
    MessageSquare,
    Music,
    Target,
    Users,
} from 'lucide-react';
import { useState } from 'react';

interface ArticleContentProps {
    article: Article;
}

const contentTypeLayouts: Record<string, ContentTypeLayout> = {
    news: {
        showExcerpt: true,
        showPriceTargets: false,
        showMethodology: false,
        showRiskFactors: false,
        showCompanyInfo: false,
        showSource: true,
        showLocation: true,
        showAuthorBio: false,
    },
    blog: {
        showExcerpt: true,
        showPriceTargets: false,
        showMethodology: false,
        showRiskFactors: false,
        showCompanyInfo: false,
        showSource: false,
        showLocation: false,
        showAuthorBio: true,
    },
    guest_post: {
        showExcerpt: true,
        showPriceTargets: false,
        showMethodology: false,
        showRiskFactors: false,
        showCompanyInfo: false,
        showSource: false,
        showLocation: false,
        showAuthorBio: true,
    },
    price_prediction: {
        showExcerpt: true,
        showPriceTargets: true,
        showMethodology: true,
        showRiskFactors: true,
        showCompanyInfo: true,
        showSource: true,
        showLocation: false,
        showAuthorBio: false,
    },
    research_report: {
        showExcerpt: true,
        showPriceTargets: true,
        showMethodology: true,
        showRiskFactors: true,
        showCompanyInfo: true,
        showSource: true,
        showLocation: false,
        showAuthorBio: false,
    },
    press_release: {
        showExcerpt: true,
        showPriceTargets: false,
        showMethodology: false,
        showRiskFactors: false,
        showCompanyInfo: true,
        showSource: true,
        showLocation: false,
        showAuthorBio: false,
    },
    web3_bulletin: {
        showExcerpt: true,
        showPriceTargets: false,
        showMethodology: false,
        showRiskFactors: false,
        showCompanyInfo: true,
        showSource: true,
        showLocation: false,
        showAuthorBio: false,
    },
    web_story: {
        showExcerpt: true,
        showPriceTargets: false,
        showMethodology: false,
        showRiskFactors: false,
        showCompanyInfo: false,
        showSource: false,
        showLocation: false,
        showAuthorBio: false,
    },
    short_news: {
        showExcerpt: true,
        showPriceTargets: false,
        showMethodology: false,
        showRiskFactors: false,
        showCompanyInfo: false,
        showSource: true,
        showLocation: true,
        showAuthorBio: false,
    },
    sponsored: {
        showExcerpt: true,
        showPriceTargets: false,
        showMethodology: false,
        showRiskFactors: false,
        showCompanyInfo: true,
        showSource: true,
        showLocation: false,
        showAuthorBio: false,
    },
    airdrop: {
        showExcerpt: true,
        showPriceTargets: false,
        showMethodology: false,
        showRiskFactors: true,
        showCompanyInfo: true,
        showSource: true,
        showLocation: false,
        showAuthorBio: false,
    },
    event: {
        showExcerpt: true,
        showPriceTargets: false,
        showMethodology: false,
        showRiskFactors: false,
        showCompanyInfo: true,
        showSource: true,
        showLocation: true,
        showAuthorBio: false,
    },
    token_launch: {
        showExcerpt: true,
        showPriceTargets: true,
        showMethodology: true,
        showRiskFactors: true,
        showCompanyInfo: true,
        showSource: true,
        showLocation: false,
        showAuthorBio: false,
    },
};

export function ArticleContent({ article }: ArticleContentProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const layout = contentTypeLayouts[article.content_type] || contentTypeLayouts.news;

    if (!article.content) {
        return (
            <div className="flex h-64 items-center justify-center rounded-lg border">
                <p className="text-muted-foreground">Content not available</p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center rounded-lg border">
                <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
            </div>
        );
    }

    // Web Story Navigation
    const nextSlide = () => {
        if (article.story_slides && currentSlide < article.story_slides.length - 1) {
            setCurrentSlide(currentSlide + 1);
        }
    };

    const prevSlide = () => {
        if (currentSlide > 0) {
            setCurrentSlide(currentSlide - 1);
        }
    };

    return (
        <article className="prose prose-sm prose-neutral dark:prose-invert mt-6 max-w-none">
            {/* Web Story Specific UI */}
            {article.content_type === 'web_story' && article.story_slides ? (
                <div className="relative" role="region" aria-label="Web story content">
                    {/* Progress Bar */}
                    <div className="bg-muted mb-4 h-1 w-full">
                        <div
                            className="bg-primary h-full transition-all duration-300"
                            style={{
                                width: `${((currentSlide + 1) / article.story_slides.length) * 100}%`,
                            }}
                        />
                    </div>

                    {/* Current Slide */}
                    <div className="relative aspect-[9/16] w-full overflow-hidden rounded-lg border">
                        {article.story_slides[currentSlide].image && (
                            <img
                                src={article.story_slides[currentSlide].image}
                                alt={`Slide ${currentSlide + 1}`}
                                className="h-full w-full object-cover"
                                loading="lazy"
                                decoding="async"
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        <div className="absolute right-0 bottom-0 left-0 p-6 text-white">
                            <div
                                className="prose prose-invert max-w-none"
                                dangerouslySetInnerHTML={{ __html: article.story_slides[currentSlide].content }}
                            />
                        </div>

                        {/* Navigation Buttons */}
                        <button
                            onClick={prevSlide}
                            disabled={currentSlide === 0}
                            className="absolute top-1/2 left-4 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white disabled:opacity-50"
                            aria-label="Previous slide"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="m15 18-6-6 6-6" />
                            </svg>
                        </button>
                        <button
                            onClick={nextSlide}
                            disabled={currentSlide === article.story_slides.length - 1}
                            className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white disabled:opacity-50"
                            aria-label="Next slide"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="m9 18 6-6-6-6" />
                            </svg>
                        </button>
                    </div>

                    {/* Slide Counter */}
                    <div className="text-muted-foreground mt-2 text-center text-sm">
                        Slide {currentSlide + 1} of {article.story_slides.length}
                    </div>

                    {/* Media Elements */}
                    {article.media_elements && article.media_elements.length > 0 && (
                        <div className="mt-8">
                            <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                                <ImageIcon className="h-5 w-5" />
                                Media Gallery
                            </h3>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {article.media_elements.map((media, index) => (
                                    <div key={index} className="group relative overflow-hidden rounded-lg border">
                                        {media.type === 'image' && (
                                            <img
                                                src={media.url}
                                                alt={media.caption || `Media ${index + 1}`}
                                                className="aspect-video w-full object-cover transition-transform group-hover:scale-105"
                                                loading="lazy"
                                                decoding="async"
                                            />
                                        )}
                                        {media.type === 'video' && (
                                            <video src={media.url} controls className="aspect-video w-full object-cover" poster={media.thumbnail} />
                                        )}
                                        {media.type === 'audio' && (
                                            <div className="flex items-center gap-2 p-4">
                                                <Music className="h-5 w-5" />
                                                <audio src={media.url} controls className="flex-1" />
                                            </div>
                                        )}
                                        {media.caption && (
                                            <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                                                <p className="text-sm">{media.caption}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Interactive Elements */}
                    {article.interactive_elements && article.interactive_elements.length > 0 && (
                        <div className="mt-8">
                            <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                                <MessageSquare className="h-5 w-5" />
                                Interactive Elements
                            </h3>
                            <div className="grid gap-4 sm:grid-cols-2">
                                {article.interactive_elements.map((element, index) => (
                                    <div key={index} className="rounded-lg border p-4">
                                        {element.type === 'button' && (
                                            <button className="bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-md px-4 py-2">
                                                {element.text}
                                            </button>
                                        )}
                                        {element.type === 'poll' && (
                                            <div>
                                                <p className="mb-4 font-medium">{element.text}</p>
                                                <div className="space-y-2">
                                                    {element.poll_options &&
                                                        element.poll_options.map((option, optionIndex) => (
                                                            <button
                                                                key={optionIndex}
                                                                className="hover:bg-muted w-full rounded-md border p-3 text-left transition-colors"
                                                            >
                                                                {option.option}
                                                            </button>
                                                        ))}
                                                </div>
                                            </div>
                                        )}
                                        {element.type === 'link' && (
                                            <a
                                                href={element.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary flex items-center gap-2 hover:underline"
                                            >
                                                <LinkIcon className="h-4 w-4" />
                                                {element.text}
                                            </a>
                                        )}
                                        {element.type === 'mention' && (
                                            <div className="flex items-center gap-2">
                                                <Users className="h-4 w-4" />
                                                <span className="text-primary">@{element.text}</span>
                                            </div>
                                        )}
                                        {element.type === 'location' && (
                                            <div className="flex items-center gap-2">
                                                <Map className="h-4 w-4" />
                                                <span>{element.text}</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Story Info */}
                    <div className="mt-8 grid gap-4 sm:grid-cols-2">
                        {article.story_duration && (
                            <div className="rounded-lg border p-4">
                                <h4 className="mb-2 flex items-center gap-2 text-sm font-medium">
                                    <Clock className="h-4 w-4" />
                                    Story Duration
                                </h4>
                                <p>{article.story_duration} seconds</p>
                            </div>
                        )}
                        {article.is_vertical && (
                            <div className="rounded-lg border p-4">
                                <h4 className="mb-2 flex items-center gap-2 text-sm font-medium">
                                    <FileText className="h-4 w-4" />
                                    Format
                                </h4>
                                <p>Vertical Story</p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                // Regular Article Content
                <>
                    {/* Excerpt */}
                    {layout.showExcerpt && article.excerpt && (
                        <div className="bg-muted mb-6 rounded-lg p-4" role="complementary" aria-label="Article excerpt">
                            <p className="m-0 text-lg font-medium">{article.excerpt}</p>
                        </div>
                    )}

                    {/* Author Bio */}
                    {layout.showAuthorBio && article.author_bio && (
                        <section className="mb-6 rounded-lg border p-4" role="region" aria-label="Author bio">
                            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                                <Users className="h-5 w-5" />
                                About the Author
                            </h2>
                            <div className="prose prose-sm dark:prose-invert max-w-none">{article.author_bio}</div>
                        </section>
                    )}

                    {/* Price Targets */}
                    {layout.showPriceTargets && (article.price_target_low || article.price_target_high) && (
                        <section className="mb-6 rounded-lg border p-4" role="region" aria-label="Price targets">
                            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                                <Target className="h-5 w-5" />
                                Price Targets
                            </h2>
                            <div className="grid gap-4 sm:grid-cols-2">
                                {article.price_target_low && (
                                    <div className="rounded-lg border p-4">
                                        <h3 className="text-muted-foreground mb-2 text-sm font-medium">Low Target</h3>
                                        <p className="text-2xl font-bold">${article.price_target_low}</p>
                                    </div>
                                )}
                                {article.price_target_high && (
                                    <div className="rounded-lg border p-4">
                                        <h3 className="text-muted-foreground mb-2 text-sm font-medium">High Target</h3>
                                        <p className="text-2xl font-bold">${article.price_target_high}</p>
                                    </div>
                                )}
                            </div>
                            {article.time_horizon && <p className="text-muted-foreground mt-4 text-sm">Time Horizon: {article.time_horizon}</p>}
                        </section>
                    )}

                    {/* Methodology */}
                    {layout.showMethodology && article.methodology && (
                        <section className="mb-6 rounded-lg border p-4" role="region" aria-label="Methodology">
                            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                                <BookOpen className="h-5 w-5" />
                                Methodology
                            </h2>
                            <div className="prose prose-sm dark:prose-invert max-w-none">{article.methodology}</div>
                            {article.data_sources && (
                                <div className="mt-4">
                                    <h3 className="text-muted-foreground mb-2 text-sm font-medium">Data Sources</h3>
                                    <ul className="text-muted-foreground list-inside list-disc text-sm">
                                        {Object.entries(article.data_sources).map(([key, value]) => (
                                            <li key={key}>
                                                <a href={value} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                                    {key}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </section>
                    )}

                    {/* Risk Factors */}
                    {layout.showRiskFactors && article.risk_factors && (
                        <section className="mb-6 rounded-lg border p-4" role="region" aria-label="Risk factors">
                            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                                <AlertTriangle className="h-5 w-5" />
                                Risk Factors
                            </h2>
                            <div className="prose prose-sm dark:prose-invert max-w-none">{article.risk_factors}</div>
                        </section>
                    )}

                    {/* Company Info */}
                    {layout.showCompanyInfo && article.company_name && (
                        <section className="mb-6 rounded-lg border p-4" role="region" aria-label="Company information">
                            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                                <Building2 className="h-5 w-5" />
                                Company Information
                            </h2>
                            <div className="max-w-none">
                                <p>
                                    <strong>Company Name:</strong> {article.company_name}
                                </p>
                                {article.contact_email && (
                                    <p>
                                        <strong>Contact Email:</strong>{' '}
                                        <a href={`mailto:${article.contact_email}`} className="hover:underline">
                                            {article.contact_email}
                                        </a>
                                    </p>
                                )}
                                {article.contact_phone && (
                                    <p>
                                        <strong>Contact Phone:</strong>{' '}
                                        <a href={`tel:${article.contact_phone}`} className="hover:underline">
                                            {article.contact_phone}
                                        </a>
                                    </p>
                                )}
                                {article.official_links && (
                                    <div className="mt-2">
                                        <h3 className="text-muted-foreground mb-2 text-sm font-medium">Official Links</h3>
                                        <ul className="text-muted-foreground list-inside list-disc text-sm">
                                            {Object.entries(article.official_links).map(([key, value]) => (
                                                <li key={key}>
                                                    <a href={value} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                                        {key}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                    {/* Main Content */}
                    <div className="" dangerouslySetInnerHTML={{ __html: article.content }} />

                    {/* Tags */}
                    {article.tags.length > 0 && (
                        <div className="mt-8 flex flex-wrap gap-2" role="list" aria-label="Article tags">
                            {article.tags.map((tag) => (
                                <Link key={tag.id} href={`/tags/${tag.slug}`} className="no-underline">
                                    <Badge variant="secondary" className="hover:bg-secondary/80" role="listitem">
                                        {tag.name}
                                    </Badge>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Source */}
                    {layout.showSource && article.source && (
                        <div className="text-muted-foreground mt-8 text-sm" role="contentinfo" aria-label="Article source">
                            Source: {article.source}
                        </div>
                    )}
                </>
            )}
        </article>
    );
}
