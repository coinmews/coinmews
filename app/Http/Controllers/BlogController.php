<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class BlogController extends Controller
{
    public function index(Request $request)
    {
        // Start with only published articles
        $query = Article::published()
            ->with(['author', 'category', 'tags']); // Eager load relationships

        // Filter by category if not 'all' or null
        if ($request->filled('category') && $request->category !== 'all') {
            $query->byCategory($request->category);
        }

        // Filter by content type if not 'all' or null
        if ($request->filled('content_type') && $request->content_type !== 'all') {
            switch ($request->content_type) {
                case 'blog':
                    $query->where('content_type', 'blog');
                    break;
                case 'guest_post':
                    $query->where('content_type', 'guest_post');
                    break;
                case 'blog_and_guest_posts':
                    $query->whereIn('content_type', ['blog', 'guest_post']);
                    break;
            }
        } else {
            // By default, show both blog and guest posts
            $query->whereIn('content_type', ['blog', 'guest_post']);
        }

        // Filter by featured
        if ($request->filled('featured') && $request->featured) {
            $query->featured();
        }

        // Filter by trending
        if ($request->filled('trending') && $request->trending) {
            $query->trending();
        }

        // Filter by popular (modified criteria)
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
        $categories = Cache::remember('blog_categories', 3600, function () {
            return Category::select('id', 'name')->get();
        });

        // Get filter counts
        $filterCounts = $this->getFilterCounts();

        // Now paginate
        $articles = $query
            ->paginate(10)
            ->appends($request->query()); // preserve query string

        // Return Inertia response
        return Inertia::render('blog/index', [
            'articles' => $articles,
            'filters' => $request->only([
                'category',
                'content_type',
                'featured',
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
        $guestPostsCount = $baseQuery->clone()->where('content_type', 'guest_post')->count();
        $blogPostsCount = $baseQuery->clone()->where('content_type', 'blog')->count();
        $allPostsCount = $guestPostsCount + $blogPostsCount;

        // Get the current content type from the request
        $contentType = request('content_type', 'all');

        // Build the base query based on content type
        $filteredQuery = $baseQuery->clone();
        if ($contentType === 'guest_post') {
            $filteredQuery->where('content_type', 'guest_post');
        } elseif ($contentType === 'blog') {
            $filteredQuery->where('content_type', 'blog');
        } else {
            $filteredQuery->whereIn('content_type', ['blog', 'guest_post']);
        }

        return [
            'contentTypes' => [
                'blog' => $blogPostsCount,
                'guest_post' => $guestPostsCount,
                'blog_and_guest_posts' => $allPostsCount,
            ],
            'featured' => $filteredQuery->clone()->featured()->count(),
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
