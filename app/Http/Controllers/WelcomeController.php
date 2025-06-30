<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Category;
use App\Models\Tag;
use App\Models\Comment;
use Inertia\Inertia;


class WelcomeController extends Controller
{
    // Home Page
    public function index()
    {

        // Fetch articles by content type (top 6 per type for homepage)
        $newsArticles = Article::news()->published()->with(['author', 'category', 'comments' => function ($query) {
            $query->where('is_spam', false);
        }])->latest()->take(6)->get();
        $shortNews = Article::shortNews()->published()->with(['author', 'category', 'comments' => function ($query) {
            $query->where('is_spam', false);
        }])->latest()->take(6)->get();
        $blogArticles = Article::blog()->published()->with(['author', 'category', 'comments' => function ($query) {
            $query->where('is_spam', false);
        }])->latest()->take(6)->get();
        $pressReleases = Article::pressReleases()->published()->with(['author', 'category', 'comments' => function ($query) {
            $query->where('is_spam', false);
        }])->latest()->take(6)->get();
        $sponsoredArticles = Article::sponsored()->published()->with(['author', 'category', 'comments' => function ($query) {
            $query->where('is_spam', false);
        }])->latest()->take(6)->get();
        $pricePredictions = Article::pricePredictions()->published()->with(['author', 'category', 'comments' => function ($query) {
            $query->where('is_spam', false);
        }])->latest()->take(6)->get();
        $guestPosts = Article::guestPosts()->published()->with(['author', 'category', 'comments' => function ($query) {
            $query->where('is_spam', false);
        }])->latest()->take(3)->get();
        $researchReports = Article::researchReports()->published()->with(['author', 'category', 'comments' => function ($query) {
            $query->where('is_spam', false);
        }])->latest()->take(6)->get();
        $web3Bulletins = Article::web3Bulletins()->published()->with(['author', 'category', 'comments' => function ($query) {
            $query->where('is_spam', false);
        }])->latest()->take(6)->get();
        $webStories = Article::webStories()->published()->with(['author', 'category', 'comments' => function ($query) {
            $query->where('is_spam', false);
        }])->latest()->take(6)->get();

        // Apply filters
        $featuredArticles = Article::featured()->published()->with(['author', 'category', 'comments' => function ($query) {
            $query->where('is_spam', false);
        }])->latest()->take(15)->get();
        $breakingNews = Article::breakingNews()->published()->with(['author', 'category', 'comments' => function ($query) {
            $query->where('is_spam', false);
        }])->latest()->take(15)->get();
        $trendingArticles = Article::trending()->published()->with(['author', 'category', 'comments' => function ($query) {
            $query->where('is_spam', false);
        }])->latest()->take(15)->get();
        $topArticles = Article::topByViewCount()->published()->with(['author', 'category', 'comments' => function ($query) {
            $query->where('is_spam', false);
        }])->take(15)->get();
        $latestReactedArticles = Article::latestReacted()->published()->with(['author', 'category', 'comments' => function ($query) {
            $query->where('is_spam', false);
        }])->take(15)->get();
        $timeSensitiveArticles = Article::timeSensitive()->published()->with(['author', 'category', 'comments' => function ($query) {
            $query->where('is_spam', false);
        }])->latest()->take(15)->get();

        // Fetch all published articles
        $articles = Article::published()
            ->with(['author', 'category', 'comments' => function ($query) {
                $query->where('is_spam', false);
            }])
            ->latest()
            ->take(15)  // Limit to 10 articles for CategoryByArticlesSection
            ->get();

        // Fetch categories and tags
        $categories = Category::ordered()
            ->root()
            ->withCount('articles')
            ->get()
            ->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'slug' => $category->slug,
                    'description' => $category->description,
                    'parent_id' => $category->parent_id,
                    'order' => $category->order,
                    'articles_count' => $category->articles_count,
                    'created_at' => $category->created_at,
                    'updated_at' => $category->updated_at,
                ];
            });
        $tags = Tag::trending()->get();

        // Fetch comments (optional, you can choose whether to include this)
        $comments = Comment::with('user')->latest()->take(10)->get();

        // Add to index() method
        $liveFeedNews = Article::liveFeed()->get();

        // Pass all the data to Inertia view
        return Inertia::render('welcome', [
            'newsArticles'        => $newsArticles,
            'shortNews'           => $shortNews,
            'blogArticles'        => $blogArticles,
            'pressReleases'        => $pressReleases,
            'sponsoredArticles'   => $sponsoredArticles,
            'pricePredictions'    => $pricePredictions,
            'guestPosts'          => $guestPosts,
            'researchReports'     => $researchReports,
            'web3Bulletins'       => $web3Bulletins,
            'webStories'          => $webStories,
            'featuredArticles'    => $featuredArticles,
            'breakingNews'        => $breakingNews,
            'trendingArticles'    => $trendingArticles,
            'topArticles'         => $topArticles,
            'latestReactedArticles' => $latestReactedArticles,
            'timeSensitiveArticles' => $timeSensitiveArticles,
            'categories'          => $categories,
            'tags'                => $tags,
            'comments'            => $comments,
            'articles' => $articles,
            'liveFeedNews'        => $liveFeedNews,
        ]);
    }

    // Articles Index (with filters and content types)
    public function articlesIndex()
    {
        $query = Article::published();

        // Apply content type filter if provided
        $contentType = request('content_type');
        if ($contentType) {
            $query->where('content_type', $contentType);
        }

        // Apply category filter if provided
        $categoryId = request('category_id');
        if ($categoryId) {
            $query->where('category_id', $categoryId);
        }

        // Apply other filters (like featured, breaking news, etc.)
        if (request()->has('featured')) {
            $query->featured();
        }
        if (request()->has('breaking_news')) {
            $query->breakingNews();
        }
        if (request()->has('trending')) {
            $query->trending();
        }
        if (request()->has('time_sensitive')) {
            $query->timeSensitive();
        }

        // Sorting options (latest, most commented, by view count)
        $sortBy = request('sort_by', 'latest');
        if ($sortBy == 'view_count') {
            $query->topByViewCount();
        } elseif ($sortBy == 'latest_reacted') {
            $query->latestReacted();
        } else {
            $query->latest();
        }

        // Fetch the articles based on the query
        $articles = $query->paginate(10);

        // Fetch categories and tags
        $categories = Category::ordered()->root()->get();
        $tags = Tag::trending()->get();

        // Pass data to Inertia view
        return Inertia::render('articles/index', [
            'articles'           => $articles,
            'categories'         => $categories,
            'tags'               => $tags,
            'filters'            => request()->all(), // To retain filter states
        ]);
    }

    // Show Single Article with Comments, Tags, and Meta/SEO Details
    public function show($slug)
    {
        // Fetch the article by slug
        $article = Article::with('author', 'category', 'tags', 'comments.user')
            ->where('slug', $slug)
            ->published()
            ->firstOrFail();

        // Pass data to Inertia view
        return Inertia::render('articles/show', [
            'article'            => $article,
            'comments'           => $article->comments,
            'meta_title'         => $article->meta_title,
            'meta_description'   => $article->meta_description,
            'meta_image'         => $article->banner_image, // Assuming you want banner_image as meta image
        ]);
    }

    // Category Page (list of articles in a category)
    public function category($slug)
    {
        $category = Category::with('articles')->where('slug', $slug)->firstOrFail();

        // Get articles in this category, apply sorting and filtering as needed
        $articles = Article::where('category_id', $category->id)
            ->published()
            ->latest()
            ->paginate(10);

        return Inertia::render('categories/show', [
            'category'   => $category,
            'articles'   => $articles,
        ]);
    }
}
