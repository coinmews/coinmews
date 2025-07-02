import { ArticleBreadcrumbs } from '@/components/articles/ArticleBreadcrumbs';
import { ArticleContent } from '@/components/articles/ArticleContent';
import { ArticleHeader } from '@/components/articles/ArticleHeader';
import { ArticleSidebar } from '@/components/articles/ArticleSidebar';
import { StickyShareIcons } from '@/components/articles/StickyShareIcons';
import Footer from '@/components/sections/footer';
import Header from '@/components/sections/header';
import { ImageSlider } from '@/components/ui/image-slider';
import { ArticleShowPageProps } from '@/types/articleTypes';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

// Sample data for the image slider
const sliderImages = [
    {
        src: 'https://dummyimage.com/970x90/dbdbdb/000000.png',
        alt: 'Crypto Exchange Listings',
        link: 'https://example.com/offer1',
    },
    {
        src: 'https://dummyimage.com/970x90/dbdbdb/000000.png',
        alt: 'Crypto Trading Opportunities',
        link: 'https://example.com/offer2',
    },
    {
        src: 'https://dummyimage.com/970x90/dbdbdb/000000.png',
        alt: 'Latest Crypto News',
        link: 'https://example.com/offer3',
    },
];

export default function ArticleShowPage({ article, relatedArticles, structuredData, meta }: ArticleShowPageProps) {
    const [shareUrl, setShareUrl] = useState('');

    useEffect(() => {
        // Set the current URL for sharing
        setShareUrl(window.location.href);
    }, []);
    return (
        <>
            <Head>
                <title>{meta.title}</title>
                <meta name="description" content={meta.description} />
                <meta name="keywords" content={meta.keywords} />
                <link rel="canonical" href={meta.canonical} />
                <meta property="og:title" content={meta.og.title} />
                <meta property="og:description" content={meta.og.description} />
                <meta property="og:image" content={article.banner_url || ''} />
                <meta property="og:type" content={meta.og.type || 'article'} />
                <meta property="og:url" content={meta.og.url || window.location.href} />
                <meta name="twitter:card" content={meta.twitter.card || 'summary_large_image'} />
                <meta name="twitter:title" content={meta.twitter.title} />
                <meta name="twitter:description" content={meta.twitter.description} />
                <meta name="twitter:image" content={meta.twitter.image || article.banner_url || ''} />
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            </Head>
            <Header />
            <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
                <ArticleBreadcrumbs article={article} />

                <div className="grid gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        {/* Image Slider */}
                        <div className="mx-auto mb-6 flex w-full items-start justify-start">
                            <ImageSlider images={sliderImages} />
                        </div>
                        <ArticleHeader article={article} />
                        <div className="relative flex">
                            {/* Position the share icons on the left side */}
                            <div className="sticky top-40 mr-4 -ml-16 hidden h-fit self-start xl:block">
                                <StickyShareIcons url={shareUrl} title={article.title} description={article.excerpt || ''} />
                            </div>
                            <div className="flex-1">
                                <ArticleContent article={article} />
                            </div>
                        </div>
                        {/* Image Slider */}
                        <div className="mx-auto mt-6 flex w-full items-start justify-start">
                            <ImageSlider images={sliderImages} />
                        </div>
                    </div>
                    <div className="lg:col-span-1">
                        <ArticleSidebar relatedArticles={relatedArticles} />
                    </div>
                </div>

                {/* <ArticleFooter article={article} relatedArticles={relatedArticles} /> */}
            </div>
            <Footer />
        </>
    );
}
