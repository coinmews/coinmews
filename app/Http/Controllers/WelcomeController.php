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
        // Define the relationships to eager load
        $with = [
            'author:id,name,username',
            'category:id,name,slug',
            'comments' => function ($query) {
                $query->where('is_spam', false)->select('id', 'commentable_id', 'content', 'user_id', 'created_at');
            },
        ];

        // Fetch articles by content type (top 6 per type for homepage)
        $newsArticles = Article::news()->published()->with($with)->latest('published_at')->take(6)->get(['id','title','slug','banner_image','content_type','status','published_at','author_id','category_id']);
        $shortNews = Article::shortNews()->published()->with($with)->latest('published_at')->take(6)->get(['id','title','slug','banner_image','content_type','status','published_at','author_id','category_id']);
        $blogArticles = Article::blog()->published()->with($with)->latest('published_at')->take(6)->get(['id','title','slug','banner_image','content_type','status','published_at','author_id','category_id']);
        $pressReleases = Article::pressReleases()->published()->with($with)->latest('published_at')->take(6)->get(['id','title','slug','banner_image','content_type','status','published_at','author_id','category_id']);
        $sponsoredArticles = Article::sponsored()->published()->with($with)->latest('published_at')->take(6)->get(['id','title','slug','banner_image','content_type','status','published_at','author_id','category_id']);
        $pricePredictions = Article::pricePredictions()->published()->with($with)->latest('published_at')->take(6)->get(['id','title','slug','banner_image','content_type','status','published_at','author_id','category_id']);
        $guestPosts = Article::guestPosts()->published()->with($with)->latest('published_at')->take(3)->get(['id','title','slug','banner_image','content_type','status','published_at','author_id','category_id']);
        $researchReports = Article::researchReports()->published()->with($with)->latest('published_at')->take(6)->get(['id','title','slug','banner_image','content_type','status','published_at','author_id','category_id']);
        $web3Bulletins = Article::web3Bulletins()->published()->with($with)->latest('published_at')->take(6)->get(['id','title','slug','banner_image','content_type','status','published_at','author_id','category_id']);
        $webStories = Article::webStories()->published()->with($with)->latest('published_at')->take(6)->get(['id','title','slug','banner_image','content_type','status','published_at','author_id','category_id']);

        // Apply filters
        $featuredArticles = Article::featured()->published()->with($with)->latest('published_at')->take(15)->get(['id','title','slug','banner_image','content_type','status','published_at','created_at','excerpt','content','author_id','category_id']);
        $breakingNews = Article::breakingNews()->published()->with($with)->latest('published_at')->take(15)->get(['id','title','slug','banner_image','content_type','status','published_at','created_at','excerpt','content','author_id','category_id']);
        $trendingArticles = Article::trending()->published()->with($with)->latest('published_at')->take(15)->get(['id','title','slug','banner_image','content_type','status','published_at','created_at','excerpt','content','author_id','category_id']);
        $topArticles = Article::topByViewCount()->published()->with($with)->take(15)->get(['id','title','slug','banner_image','content_type','status','published_at','created_at','excerpt','content','author_id','category_id']);
        $latestReactedArticles = Article::latestReacted()->published()->with($with)->take(15)->get(['id','title','slug','banner_image','content_type','status','published_at','created_at','excerpt','content','author_id','category_id']);
        $timeSensitiveArticles = Article::timeSensitive()->published()->with($with)->latest('published_at')->take(15)->get(['id','title','slug','banner_image','content_type','status','published_at','created_at','excerpt','content','author_id','category_id']);

        // Fetch all published articles (for category section)
        $articles = Article::published()
            ->with($with)
            ->latest('published_at')
            ->take(15)
            ->get(['id','title','slug','banner_image','content_type','status','published_at','author_id','category_id']);

        // Fetch categories and tags
        $categories = Category::ordered()
            ->root()
            ->withCount('articles')
            ->get(['id','name','slug','description','parent_id','order','created_at','updated_at'])
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
        $tags = Tag::trending()->get(['id','name','slug']);

        // Fetch comments (optional, you can choose whether to include this)
        $comments = Comment::with('user:id,name')->latest()->take(10)->get(['id','commentable_id','content','user_id','created_at']);

        // Add to index() method
        $liveFeedNews = Article::liveFeed()->get(['id','title','slug','banner_image','content_type','status','published_at','author_id','category_id']);

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
