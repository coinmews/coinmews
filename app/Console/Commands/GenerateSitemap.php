<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Spatie\Sitemap\SitemapGenerator;
use Spatie\Sitemap\Tags\Url;
use App\Models\Article;
use App\Models\Category;
use Carbon\Carbon;

class GenerateSitemap extends Command
{
    protected $signature = 'sitemap:generate';
    protected $description = 'Generate the sitemap.';

    public function handle()
    {
        $this->info('Generating sitemap...');

        // Create main sitemap
        $sitemap = SitemapGenerator::create(config('app.url'))
            ->getSitemap();

        // Add static pages
        $sitemap->add(Url::create('/')
            ->setLastModificationDate(Carbon::now())
            ->setChangeFrequency(Url::CHANGE_FREQUENCY_DAILY)
            ->setPriority(1.0));

        $sitemap->add(Url::create('/articles')
            ->setLastModificationDate(Carbon::now())
            ->setChangeFrequency(Url::CHANGE_FREQUENCY_DAILY)
            ->setPriority(0.9));

        $sitemap->add(Url::create('/news')
            ->setLastModificationDate(Carbon::now())
            ->setChangeFrequency(Url::CHANGE_FREQUENCY_DAILY)
            ->setPriority(0.9));

        $sitemap->add(Url::create('/blog')
            ->setLastModificationDate(Carbon::now())
            ->setChangeFrequency(Url::CHANGE_FREQUENCY_DAILY)
            ->setPriority(0.8));

        // Add legal pages
        $legalPages = [
            '/legal/terms',
            '/legal/privacy',
            '/legal/cookies',
            '/legal/accessibility',
        ];

        foreach ($legalPages as $page) {
            $sitemap->add(Url::create($page)
                ->setLastModificationDate(Carbon::now())
                ->setChangeFrequency(Url::CHANGE_FREQUENCY_MONTHLY)
                ->setPriority(0.5));
        }

        // Add dynamic content
        // Articles
        Article::latest()->get()->each(function ($article) use ($sitemap) {
            $sitemap->add(Url::create("/articles/{$article->slug}")
                ->setLastModificationDate($article->updated_at)
                ->setChangeFrequency(
                    $article->is_breaking_news
                        ? Url::CHANGE_FREQUENCY_HOURLY
                        : Url::CHANGE_FREQUENCY_DAILY
                )
                ->setPriority(0.8));
        });

        // Categories
        Category::all()->each(function ($category) use ($sitemap) {
            $sitemap->add(Url::create("/categories/{$category->slug}")
                ->setLastModificationDate($category->updated_at)
                ->setChangeFrequency(Url::CHANGE_FREQUENCY_WEEKLY)
                ->setPriority(0.8));
        });

        // Save sitemap
        $sitemap->writeToFile(public_path('sitemap.xml'));

        // Generate news sitemap
        $newsSitemap = SitemapGenerator::create(config('app.url'))
            ->getSitemap();

        // Add recent news articles (last 48 hours)
        Article::where('created_at', '>=', now()->subHours(48))
            ->where(function ($query) {
                $query->where('is_breaking_news', true)
                    ->orWhere('is_time_sensitive', true);
            })
            ->latest()
            ->get()
            ->each(function ($article) use ($newsSitemap) {
                $newsSitemap->add(Url::create("/articles/{$article->slug}")
                    ->setLastModificationDate($article->updated_at)
                    ->setChangeFrequency(Url::CHANGE_FREQUENCY_HOURLY)
                    ->setPriority(0.9));
            });

        // Save news sitemap
        $newsSitemap->writeToFile(public_path('sitemap-news.xml'));

        $this->info('Sitemap generated successfully!');
    }
}
