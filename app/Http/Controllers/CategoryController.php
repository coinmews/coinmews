<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::withCount('articles')
            ->orderBy('articles_count', 'desc')
            ->get();

        return Inertia::render('categories/index', [
            'categories' => $categories,
        ]);
    }

    public function show(Request $request, string $slug)
    {
        $category = Category::where('slug', $slug)
            ->withCount('articles')
            ->firstOrFail();

        $query = Article::with(['category', 'tags', 'author'])
            ->where('status', 'published')
            ->where('category_id', $category->id);

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%")
                    ->orWhere('excerpt', 'like', "%{$search}%");
            });
        }

        // Sort
        $sort = $request->get('sort', 'latest');
        switch ($sort) {
            case 'popular':
                $query->orderBy('view_count', 'desc');
                break;
            case 'trending':
                $query->orderBy('view_count', 'desc')
                    ->where('created_at', '>=', now()->subDays(7));
                break;
            default:
                $query->latest();
        }

        // Get featured articles
        $featuredArticles = Article::with(['category', 'tags', 'author'])
            ->where('status', 'published')
            ->where('category_id', $category->id)
            ->where('is_featured', true)
            ->latest()
            ->take(3)
            ->get();

        // Get latest articles
        $latestArticles = $query->paginate(12)->withQueryString();

        // Get related categories
        $relatedCategories = Category::where('id', '!=', $category->id)
            ->withCount('articles')
            ->orderBy('articles_count', 'desc')
            ->take(5)
            ->get();

        return Inertia::render('categories/show', [
            'category' => $category,
            'featuredArticles' => $featuredArticles,
            'latestArticles' => $latestArticles,
            'relatedCategories' => $relatedCategories,
            'filters' => $request->only(['search', 'sort']),
        ]);
    }
}
