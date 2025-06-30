<?php

namespace App\Http\Controllers;

use App\Models\CryptocurrencyVideo;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Auth;

class CryptocurrencyVideoController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = CryptocurrencyVideo::with(['user:id,name,username,avatar'])
                ->published()
                ->when($request->category_id, function ($query, $category_id) {
                    return $query->where('category_id', $category_id);
                })
                ->when($request->search, function ($query, $search) {
                    return $query->where(function ($q) use ($search) {
                        $q->where('title', 'like', "%{$search}%")
                            ->orWhere('description', 'like', "%{$search}%");
                    });
                });

            // Sort options
            $query->when($request->sort, function ($query, $sort) {
                switch ($sort) {
                    case 'newest':
                        return $query->latest('published_at');
                    case 'oldest':
                        return $query->oldest('published_at');
                    case 'most_viewed':
                        return $query->orderBy('view_count', 'desc');
                    case 'most_upvotes':
                        return $query->orderBy('upvotes_count', 'desc');
                    default:
                        return $query->latest('published_at');
                }
            }, function ($query) {
                return $query->latest('published_at');
            });

            $videos = $query->paginate(12)->withQueryString();

            // Append youtube_id and youtube_embed_url to each video
            $videos->through(function ($video) {
                return $video->append(['youtube_id', 'youtube_embed_url']);
            });

            // Get categories for filter
            $categories = Cache::remember('video_categories', 3600, function () {
                return Category::whereHas('cryptocurrencyVideos')->get(['id', 'name', 'slug']);
            });

            // Get stats
            $stats = Cache::remember('video_stats', 300, function () {
                return [
                    'total' => CryptocurrencyVideo::published()->count(),
                    'featured' => CryptocurrencyVideo::published()->featured()->count(),
                ];
            });

            // Make sure filters is an object, not an array
            $filters = (object) $request->only(['category_id', 'search', 'sort']);

            return Inertia::render('cryptocurrency-videos/index', [
                'videos' => $videos,
                'categories' => $categories,
                'stats' => $stats,
                'filters' => $filters,
            ]);
        } catch (\Exception $e) {
            Log::error('Error loading cryptocurrency videos: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Error loading cryptocurrency videos');
        }
    }

    public function show($slug)
    {
        try {
            $video = CryptocurrencyVideo::with(['user:id,name,username,avatar,bio', 'category:id,name,slug'])
                ->where('slug', $slug)
                ->firstOrFail();

            // Debug video data
            \Log::info('Video Data:', [
                'youtube_url' => $video->youtube_url,
                'youtube_id' => $video->youtube_id,
                'youtube_embed_url' => $video->youtube_embed_url
            ]);

            // Increment view count with cache prevention
            $cacheKey = "video_view_{$video->id}_" . (Auth::user()?->id ?? request()->ip());
            if (!Cache::has($cacheKey)) {
                $video->incrementViewCount();
                Cache::put($cacheKey, true, 60); // prevent multiple increments for 1 minute
            }

            // Get related videos
            $relatedVideos = CryptocurrencyVideo::where('id', '!=', $video->id)
                ->when($video->category_id, function ($query, $categoryId) {
                    return $query->where('category_id', $categoryId);
                })
                ->published()
                ->orderBy('published_at', 'desc')
                ->take(6)
                ->get();

            // Prepare SEO metadata
            $meta = [
                'title' => $video->title,
                'description' => substr(strip_tags($video->description), 0, 160),
                'keywords' => 'cryptocurrency, crypto videos, ' . $video->title,
                'og' => [
                    'title' => $video->title,
                    'description' => substr(strip_tags($video->description), 0, 160),
                    'image' => $video->thumbnail_url,
                    'type' => 'video',
                    'url' => url()->current()
                ],
                'twitter' => [
                    'card' => 'summary_large_image',
                    'title' => $video->title,
                    'description' => substr(strip_tags($video->description), 0, 160),
                    'image' => $video->thumbnail_url
                ]
            ];

            return Inertia::render('cryptocurrency-videos/show', [
                'video' => $video,
                'relatedVideos' => $relatedVideos,
                'meta' => $meta,
            ]);
        } catch (ModelNotFoundException $e) {
            Log::error('Cryptocurrency video not found: ' . $e->getMessage());
            return redirect()->route('cryptocurrency-videos.index')->with('error', 'Video not found');
        } catch (\Exception $e) {
            Log::error('Error loading cryptocurrency video: ' . $e->getMessage());
            return redirect()->route('cryptocurrency-videos.index')->with('error', 'Error loading video');
        }
    }

    public function upvote(Request $request, $id)
    {
        try {
            $video = CryptocurrencyVideo::findOrFail($id);

            // Check if user has already upvoted this video
            $cacheKey = "video_upvote_{$video->id}_user_{$request->user()->id}";
            if (Cache::has($cacheKey)) {
                return response()->json(['message' => 'Already upvoted'], 400);
            }

            $video->incrementUpvotes();
            Cache::put($cacheKey, true, 86400); // 24 hours

            return response()->json([
                'upvotes_count' => $video->upvotes_count
            ]);
        } catch (\Exception $e) {
            Log::error('Error upvoting cryptocurrency video: ' . $e->getMessage());
            return response()->json(['message' => 'Error upvoting video'], 500);
        }
    }
}
