<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Category;
use Illuminate\Http\Response;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Url;

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
            ['/categories',   'weekly',  0.8],
            ['/events',       'daily',   0.8],
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

        // 2) Dynamic articles
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

        // 3) Only “live” categories
        Category::whereHas('articles', fn($q) => $q->whereNotNull('published_at'))
            ->get()
            ->each(function (Category $category) use ($sitemap) {
                $sitemap->add(
                    Url::create(url("/categories/{$category->slug}"))
                        ->setLastModificationDate($category->updated_at)
                        ->setChangeFrequency(Url::CHANGE_FREQUENCY_WEEKLY)
                        ->setPriority(0.8)
                );
            });

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
