<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Category;
use Illuminate\Http\Response;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Url;
use App\Models\Airdrop;
use App\Models\Presale;
use App\Models\Event;
use App\Models\Tag;
use App\Models\CryptocurrencyMeme;
use App\Models\CryptocurrencyVideo;
use App\Models\CryptoExchangeListing;

class SitemapController extends Controller
{
    public function index(): Response
    {
        $sitemap = Sitemap::create();

        // 1) Static pages
        $static = [
            ['/',             'daily',   1.0],
            ['/articles',     'daily',   0.9],
            ['/news',         'daily',   0.9],
            ['/blog',         'daily',   0.8],
            ['/airdrops',     'daily',   0.8],
            ['/presales',     'daily',   0.8],
            ['/events',       'daily',   0.8],
            ['/categories',   'weekly',  0.8],
            ['/legal/terms',         'monthly', 0.5],
            ['/legal/privacy',       'monthly', 0.5],
            ['/legal/cookies',       'monthly', 0.5],
            ['/legal/accessibility', 'monthly', 0.5],
            ['/about',        'monthly', 0.7],
            ['/careers',      'weekly',  0.7],
            ['/press',        'weekly',  0.7],
            ['/contact',      'monthly', 0.7],
        ];

        foreach ($static as [$path, $freq, $prio]) {
            $sitemap->add(
                Url::create(url($path))
                    ->setLastModificationDate(now())
                    ->setChangeFrequency($freq)
                    ->setPriority($prio)
            );
        }

        // 2) Dynamic articles (detail pages)
        $articleCount = Article::whereNotNull('slug')->whereNotNull('published_at')->count();
        $perPage = 15;
        $maxPages = min(20, ceil($articleCount / $perPage));
        for ($i = 1; $i <= $maxPages; $i++) {
            $sitemap->add(Url::create(url('/articles?page=' . $i))
                ->setLastModificationDate(now())
                ->setChangeFrequency('daily')
                ->setPriority(0.8));
        }
        Article::whereNotNull('slug')
            ->whereNotNull('published_at')
            ->latest()
            ->get()
            ->each(function (Article $article) use ($sitemap) {
                $sitemap->add(
                    Url::create(url("/articles/{$article->slug}"))
                        ->setLastModificationDate($article->updated_at)
                        ->setChangeFrequency(
                            $article->is_breaking_news
                                ? Url::CHANGE_FREQUENCY_HOURLY
                                : Url::CHANGE_FREQUENCY_DAILY
                        )
                        ->setPriority(0.8)
                );
            });

        // 3) News and Blog paginated
        $newsCount = Article::whereIn('content_type', ['news', 'short_news'])->whereNotNull('published_at')->count();
        $newsPages = min(20, ceil($newsCount / $perPage));
        for ($i = 1; $i <= $newsPages; $i++) {
            $sitemap->add(Url::create(url('/news?page=' . $i))
                ->setLastModificationDate(now())
                ->setChangeFrequency('daily')
                ->setPriority(0.8));
        }
        $blogCount = Article::whereIn('content_type', ['blog', 'guest_post'])->whereNotNull('published_at')->count();
        $blogPages = min(20, ceil($blogCount / $perPage));
        for ($i = 1; $i <= $blogPages; $i++) {
            $sitemap->add(Url::create(url('/blog?page=' . $i))
                ->setLastModificationDate(now())
                ->setChangeFrequency('daily')
                ->setPriority(0.8));
        }

        // 4) Airdrops
        $airdropCount = Airdrop::whereNotNull('slug')->count();
        $airdropPages = min(20, ceil($airdropCount / $perPage));
        for ($i = 1; $i <= $airdropPages; $i++) {
            $sitemap->add(Url::create(url('/airdrops?page=' . $i))
                ->setLastModificationDate(now())
                ->setChangeFrequency('daily')
                ->setPriority(0.8));
        }
        Airdrop::whereNotNull('slug')->get()->each(function (Airdrop $airdrop) use ($sitemap) {
            $sitemap->add(
                Url::create(url("/airdrops/{$airdrop->slug}"))
                    ->setLastModificationDate($airdrop->updated_at)
                    ->setChangeFrequency('daily')
                    ->setPriority(0.7)
            );
        });

        // 5) Presales
        $presaleCount = Presale::whereNotNull('slug')->count();
        $presalePages = min(20, ceil($presaleCount / $perPage));
        for ($i = 1; $i <= $presalePages; $i++) {
            $sitemap->add(Url::create(url('/presales?page=' . $i))
                ->setLastModificationDate(now())
                ->setChangeFrequency('daily')
                ->setPriority(0.8));
        }
        Presale::whereNotNull('slug')->get()->each(function (Presale $presale) use ($sitemap) {
            $sitemap->add(
                Url::create(url("/presales/{$presale->slug}"))
                    ->setLastModificationDate($presale->updated_at)
                    ->setChangeFrequency('daily')
                    ->setPriority(0.7)
            );
        });

        // 6) Events
        $eventCount = Event::whereNotNull('slug')->count();
        $eventPages = min(20, ceil($eventCount / $perPage));
        for ($i = 1; $i <= $eventPages; $i++) {
            $sitemap->add(Url::create(url('/events?page=' . $i))
                ->setLastModificationDate(now())
                ->setChangeFrequency('daily')
                ->setPriority(0.8));
        }
        Event::whereNotNull('slug')->get()->each(function (Event $event) use ($sitemap) {
            $sitemap->add(
                Url::create(url("/events/{$event->slug}"))
                    ->setLastModificationDate($event->updated_at)
                    ->setChangeFrequency('daily')
                    ->setPriority(0.7)
            );
        });

        // 7) Categories (paginated)
        Category::whereHas('articles', fn($q) => $q->whereNotNull('published_at'))
            ->get()
            ->each(function (Category $category) use ($sitemap, $perPage) {
                $articleCount = $category->articles()->whereNotNull('published_at')->count();
                $pages = min(20, ceil($articleCount / $perPage));
                for ($i = 1; $i <= $pages; $i++) {
                    $sitemap->add(Url::create(url("/categories/{$category->slug}?page={$i}"))
                        ->setLastModificationDate(now())
                        ->setChangeFrequency('weekly')
                        ->setPriority(0.7));
                }
            });

        // 8) Tags (paginated)
        Tag::get()->each(function (Tag $tag) use ($sitemap, $perPage) {
            $articleCount = $tag->articles()->count();
            $pages = min(20, ceil($articleCount / $perPage));
            for ($i = 1; $i <= $pages; $i++) {
                $sitemap->add(Url::create(url("/tags/{$tag->slug}?page={$i}"))
                    ->setLastModificationDate(now())
                    ->setChangeFrequency('weekly')
                    ->setPriority(0.6));
            }
        });

        // 9) Memes, Videos, Exchange Listings (detail pages)
        if (class_exists(CryptocurrencyMeme::class)) {
            CryptocurrencyMeme::whereNotNull('slug')->get()->each(function ($meme) use ($sitemap) {
                $sitemap->add(
                    Url::create(url("/cryptocurrency-memes/{$meme->slug}"))
                        ->setLastModificationDate($meme->updated_at)
                        ->setChangeFrequency('weekly')
                        ->setPriority(0.6)
                );
            });
        }
        if (class_exists(CryptocurrencyVideo::class)) {
            CryptocurrencyVideo::whereNotNull('slug')->get()->each(function ($video) use ($sitemap) {
                $sitemap->add(
                    Url::create(url("/cryptocurrency-videos/{$video->slug}"))
                        ->setLastModificationDate($video->updated_at)
                        ->setChangeFrequency('weekly')
                        ->setPriority(0.6)
                );
            });
        }
        if (class_exists(CryptoExchangeListing::class)) {
            CryptoExchangeListing::whereNotNull('slug')->get()->each(function ($listing) use ($sitemap) {
                $sitemap->add(
                    Url::create(url("/crypto-exchange-listings/{$listing->slug}"))
                        ->setLastModificationDate($listing->updated_at)
                        ->setChangeFrequency('weekly')
                        ->setPriority(0.6)
                );
            });
        }

        return response(
            $sitemap->render(),
            200,
            ['Content-Type' => 'application/xml']
        );
    }

    public function newsSitemap(): Response
    {
        $sitemap = Sitemap::create();

        // Breaking or time-sensitive in last 48h
        Article::where('created_at', '>=', now()->subHours(48))
            ->where(fn($q) => $q
                ->where('is_breaking_news', true)
                ->orWhere('is_time_sensitive', true)
            )
            ->latest()
            ->get()
            ->each(function (Article $article) use ($sitemap) {
                $sitemap->add(
                    Url::create(url("/articles/{$article->slug}"))
                        ->setLastModificationDate($article->updated_at)
                        ->setChangeFrequency(Url::CHANGE_FREQUENCY_HOURLY)
                        ->setPriority(0.9)
                );
            });

        return response(
            $sitemap->render(),
            200,
            ['Content-Type' => 'application/xml']
        );
    }
}
