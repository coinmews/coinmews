<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Category;
use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ArticleController extends Controller
{
    public function show($slug)
    {
        try {
            // First check if article exists by slug only
            $articleCheck = Article::where('slug', $slug)->first();
            if (!$articleCheck) {
                Log::error('Article with slug does not exist: ' . $slug);
                return redirect()->route('articles.index')->with('error', 'Article not found');
            }

            // If article exists, log its status for debugging
            Log::info('Article found with status: ' . $articleCheck->status);
            Log::info('Article published_at: ' . ($articleCheck->published_at ?? 'null'));

            // Now try the full query with all conditions
            $article = Article::with([
                'author:id,name,username,bio,created_at,location,website,twitter,facebook,instagram,telegram,discord',
                'category:id,name,slug,description,image',
                'tags:id,name,slug,description,usage_count',
                'comments' => function ($query) {
                    $query->with([
                        'user:id,name,username'
                    ])
                        ->where('is_spam', false)
                        ->orderBy('created_at', 'desc');
                }
            ])
                ->where('slug', $slug)
                ->where(function ($query) {
                    $query->where('status', 'published')
                        ->orWhere('status', 'featured'); // Also allow featured articles
                })
                ->whereNotNull('published_at')
                ->where('published_at', '<=', now())
                ->first();

            if (!$article) {
                Log::error('Article exists but does not meet publishing criteria. Status: ' . $articleCheck->status
                    . ', Published at: ' . ($articleCheck->published_at ?? 'null'));
                return redirect()->route('articles.index')
                    ->with('error', 'This article is not available');
            }

            // Log successful article load
            Log::info('Successfully loading article: ' . $article->title . ' [' . $article->content_type . ']');

            // Increment view count with cache to prevent rapid increments
            $cacheKey = "article_view_{$article->id}";
            if (!Cache::has($cacheKey)) {
                $article->increment('view_count');
                Cache::put($cacheKey, true, 60); // Cache for 1 minute
            }

            // Get related articles with content type matching
            $relatedArticles = Article::with(['category:id,name,slug', 'author:id,name,username'])
                ->where('category_id', $article->category_id)
                ->where('id', '!=', $article->id)
                ->where('content_type', $article->content_type)
                ->where(function ($query) {
                    $query->where('status', 'published')
                        ->orWhere('status', 'featured');
                })
                ->whereNotNull('published_at')
                ->where('published_at', '<=', now())
                ->latest()
                ->take(3)
                ->get();

            // Get trending tags with category-specific caching
            $trendingTags = Cache::remember("trending_tags_{$article->category_id}", 3600, function () {
                return Tag::withCount('articles')
                    ->orderBy('articles_count', 'desc')
                    ->take(10)
                    ->get();
            });

            // Get popular categories with proper caching
            $popularCategories = Cache::remember("popular_categories_{$article->category_id}", 3600, function () {
                return Category::withCount('articles')
                    ->orderBy('articles_count', 'desc')
                    ->take(5)
                    ->get();
            });

            // Prepare structured data for SEO
            $structuredData = $this->prepareStructuredData($article);

            return Inertia::render('articles/show', [
                'article' => $article,
                'relatedArticles' => $relatedArticles,
                'trendingTags' => $trendingTags,
                'popularCategories' => $popularCategories,
                'structuredData' => $structuredData,
                'meta' => $this->prepareMetaData($article),
            ]);
        } catch (\Exception $e) {
            Log::error('Error loading article: ' . $e->getMessage() . ' for slug: ' . $slug);
            return redirect()->route('articles.index')->with('error', 'An error occurred while loading the article');
        }
    }

    private function prepareStructuredData($article)
    {
        $cacheKey = "article_structured_data_{$article->id}";
        return Cache::remember($cacheKey, 3600, function () use ($article) {
            $structuredData = [
                '@context' => 'https://schema.org',
                '@type' => 'Article',
                'headline' => $article->title,
                'description' => $article->excerpt,
                'image' => $article->banner_url,
                'author' => [
                    '@type' => 'Person',
                    'name' => $article->author->name
                ],
                'publisher' => [
                    '@type' => 'Organization',
                    'name' => config('app.name'),
                    'logo' => [
                        '@type' => 'ImageObject',
                        'url' => asset('images/logo.png')
                    ]
                ],
                'datePublished' => $article->published_at,
                'dateModified' => $article->updated_at,
                'mainEntityOfPage' => [
                    '@type' => 'WebPage',
                    '@id' => url()->current()
                ]
            ];

            // Add content type specific structured data
            if ($article->content_type === 'price_prediction') {
                $structuredData['@type'] = 'PricePrediction';
                $structuredData['priceTargetLow'] = $article->price_target_low;
                $structuredData['priceTargetHigh'] = $article->price_target_high;
                $structuredData['timeframe'] = $article->timeframe;
            }

            return $structuredData;
        });
    }

    private function prepareMetaData($article)
    {
        return [
            'title' => $article->meta_title ?? $article->title,
            'description' => $article->meta_description ?? $article->excerpt,
            'keywords' => $article->tags->pluck('name')->join(', '),
            'canonical' => url()->current(),
            'og' => [
                'title' => $article->meta_title ?? $article->title,
                'description' => $article->meta_description ?? $article->excerpt,
                'image' => $article->banner_url,
                'type' => 'article',
                'url' => url()->current()
            ],
            'twitter' => [
                'card' => 'summary_large_image',
                'title' => $article->meta_title ?? $article->title,
                'description' => $article->meta_description ?? $article->excerpt,
                'image' => $article->banner_url
            ]
        ];
    }
}
