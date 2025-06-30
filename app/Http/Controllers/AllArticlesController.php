<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class AllArticlesController extends Controller
{
    public function index(Request $request)
    {
        // Start with only published articles
        $query = Article::published()
            ->with(['author', 'category', 'tags', 'comments' => function ($query) {
                $query->where('is_spam', false);
            }]); // Eager load relationships

        // Filter by category if not 'all' or null
        if ($request->filled('category') && $request->category !== 'all') {
            $query->byCategory($request->category);
        }

        // Filter by content type if not 'all' or null
        if ($request->filled('content_type') && $request->content_type !== 'all') {
            $query->where('content_type', $request->content_type);
        }

        // Filter by featured
        if ($request->filled('featured') && $request->featured) {
            $query->featured();
        }

        // Filter by breaking news
        if ($request->filled('breaking_news') && $request->breaking_news) {
            $query->breakingNews();
        }

        // Filter by time sensitive
        if ($request->filled('time_sensitive') && $request->time_sensitive) {
            $query->timeSensitive();
        }

        // Filter by trending
        if ($request->filled('trending') && $request->trending) {
            $query->trending();
        }

        // Filter by popular
        if ($request->filled('popular') && $request->popular) {
            $query->where(function ($q) {
                $q->where('is_trending', true)
                    ->orWhere('view_count', '>', 500);
            });
        }

        // Sorting
        switch ($request->sort_by) {
            case 'view_count':
                $query->orderBy('view_count', 'desc');
                break;
            case 'latest':
                $query->latest();  // By published_at desc
                break;
            case 'latest_reacted':
                $query->withCount('comments')->orderByDesc('comments_count');
                break;
            default:
                $query->latest(); // Default to latest if no sort specified
                break;
        }

        // Cache categories for 1 hour
        $categories = Cache::remember('all_categories', 3600, function () {
            return Category::select('id', 'name')->get();
        });

        // Get filter counts
        $filterCounts = $this->getFilterCounts();

        // Now paginate
        $articles = $query
            ->paginate(10)
            ->appends($request->query()); // preserve query string

        // Return Inertia response
        return Inertia::render('articles/index', [
            'articles' => $articles,
            'filters' => $request->only([
                'category',
                'content_type',
                'featured',
                'breaking_news',
                'time_sensitive',
                'trending',
                'popular',
                'sort_by'
            ]),
            'categories' => $categories,
            'filterCounts' => $filterCounts,
        ]);
    }

    private function getFilterCounts()
    {
        // Base query for all published articles
        $baseQuery = Article::published();

        // Get content type counts
        $contentTypeCounts = [
            'news' => $baseQuery->clone()->where('content_type', 'news')->count(),
            'short_news' => $baseQuery->clone()->where('content_type', 'short_news')->count(),
            'blog' => $baseQuery->clone()->where('content_type', 'blog')->count(),
            'guest_post' => $baseQuery->clone()->where('content_type', 'guest_post')->count(),
            'press_release' => $baseQuery->clone()->where('content_type', 'press_release')->count(),
            'sponsored' => $baseQuery->clone()->where('content_type', 'sponsored')->count(),
            'price_prediction' => $baseQuery->clone()->where('content_type', 'price_prediction')->count(),
            'research_report' => $baseQuery->clone()->where('content_type', 'research_report')->count(),
            'web3_bulletin' => $baseQuery->clone()->where('content_type', 'web3_bulletin')->count(),
            'web_story' => $baseQuery->clone()->where('content_type', 'web_story')->count(),
        ];

        // Get the current content type from the request
        $contentType = request('content_type', 'all');

        // Build the base query based on content type
        $filteredQuery = $baseQuery->clone();
        if ($contentType !== 'all') {
            $filteredQuery->where('content_type', $contentType);
        }

        // Calculate combined counts
        $contentTypeCounts['news_and_short_news'] = $contentTypeCounts['news'] + $contentTypeCounts['short_news'];
        $contentTypeCounts['blog_and_guest_posts'] = $contentTypeCounts['blog'] + $contentTypeCounts['guest_post'];
        $contentTypeCounts['all'] = $baseQuery->count();

        return [
            'contentTypes' => $contentTypeCounts,
            'featured' => $filteredQuery->clone()->featured()->count(),
            'breaking_news' => $filteredQuery->clone()->breakingNews()->count(),
            'time_sensitive' => $filteredQuery->clone()->timeSensitive()->count(),
            'trending' => $filteredQuery->clone()->trending()->count(),
            'popular' => $filteredQuery->clone()->where(function ($q) {
                $q->where('is_trending', true)
                    ->orWhere('view_count', '>', 500);
            })->count(),
            'sortOptions' => [
                'latest' => $filteredQuery->clone()->count(),
                'view_count' => $filteredQuery->clone()->where('view_count', '>', 0)->count(),
                'latest_reacted' => $filteredQuery->clone()->has('comments')->count(),
            ],
        ];
    }
}
