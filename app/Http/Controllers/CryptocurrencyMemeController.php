<?php

namespace App\Http\Controllers;

use App\Models\CryptocurrencyMeme;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class CryptocurrencyMemeController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = CryptocurrencyMeme::with(['user:id,name,username,avatar'])
                ->published()
                ->when($request->category_id, function ($query, $category_id) {
                    return $query->where('category_id', $category_id);
                })
                ->when($request->media_type, function ($query, $media_type) {
                    return $query->where('media_type', $media_type);
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

            $memes = $query->paginate(16)->withQueryString();

            // Get categories for filter
            $categories = Cache::remember('meme_categories', 3600, function () {
                return Category::whereHas('cryptocurrencyMemes')->get(['id', 'name', 'slug']);
            });

            // Get stats
            $stats = Cache::remember('meme_stats', 300, function () {
                return [
                    'total' => CryptocurrencyMeme::published()->count(),
                    'images' => CryptocurrencyMeme::published()->images()->count(),
                    'videos' => CryptocurrencyMeme::published()->videos()->count(),
                    'featured' => CryptocurrencyMeme::published()->featured()->count(),
                ];
            });

            // Make sure filters is an object, not an array
            $filters = (object) $request->only(['category_id', 'media_type', 'search', 'sort']);

            return Inertia::render('cryptocurrency-memes/index', [
                'memes' => $memes,
                'categories' => $categories,
                'stats' => $stats,
                'filters' => $filters,
            ]);
        } catch (\Exception $e) {
            Log::error('Error loading cryptocurrency memes: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Error loading cryptocurrency memes');
        }
    }

    public function show($slug)
    {
        try {
            $meme = CryptocurrencyMeme::with(['user:id,name,username,avatar,bio', 'category:id,name,slug'])
                ->where('slug', $slug)
                ->firstOrFail();

            // Increment view count with cache prevention
            $cacheKey = "meme_view_{$meme->id}_" . (Auth::user()?->id ?? request()->ip());
            if (!Cache::has($cacheKey)) {
                $meme->incrementViewCount();
                Cache::put($cacheKey, true, 60); // prevent multiple increments for 1 minute
            }

            // Get related memes
            $relatedMemes = CryptocurrencyMeme::where('id', '!=', $meme->id)
                ->when($meme->category_id, function ($query, $categoryId) {
                    return $query->where('category_id', $categoryId);
                })
                ->where('media_type', $meme->media_type)
                ->published()
                ->orderBy('published_at', 'desc')
                ->take(6)
                ->get();

            // Prepare SEO metadata
            $meta = [
                'title' => $meme->title,
                'description' => substr(strip_tags($meme->description ?? ''), 0, 160),
                'keywords' => 'cryptocurrency, crypto memes, ' . $meme->title,
                'og' => [
                    'title' => $meme->title,
                    'description' => substr(strip_tags($meme->description ?? ''), 0, 160),
                    'image' => $meme->isImage() ? $meme->media_url : null,
                    'type' => $meme->isImage() ? 'image' : 'video',
                    'url' => url()->current()
                ],
                'twitter' => [
                    'card' => 'summary_large_image',
                    'title' => $meme->title,
                    'description' => substr(strip_tags($meme->description ?? ''), 0, 160),
                    'image' => $meme->isImage() ? $meme->media_url : null
                ]
            ];

            return Inertia::render('cryptocurrency-memes/show', [
                'meme' => $meme,
                'relatedMemes' => $relatedMemes,
                'meta' => $meta,
            ]);
        } catch (ModelNotFoundException $e) {
            Log::error('Cryptocurrency meme not found: ' . $e->getMessage());
            return redirect()->route('cryptocurrency-memes.index')->with('error', 'Meme not found');
        } catch (\Exception $e) {
            Log::error('Error loading cryptocurrency meme: ' . $e->getMessage());
            return redirect()->route('cryptocurrency-memes.index')->with('error', 'Error loading meme');
        }
    }

    public function upload(Request $request)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'category_id' => 'nullable|exists:categories,id',
                'media' => 'required|file|mimes:jpeg,png,jpg,gif,mp4,webm|max:20480', // 20MB max
            ]);

            $file = $request->file('media');
            $fileType = $file->getMimeType();
            $mediaType = Str::startsWith($fileType, 'image/') ? 'image' : 'video';

            // Store the file in R2 bucket and get the full URL
            $path = $file->store('memes', 'r2');
            // Ensure we store the complete URL by combining the R2 base URL with the path
            $r2BaseUrl = rtrim(config('filesystems.disks.r2.url'), '/');
            $mediaUrl = $r2BaseUrl . '/' . ltrim($path, '/');

            $meme = CryptocurrencyMeme::create([
                'title' => $validated['title'],
                'slug' => Str::slug($validated['title']),
                'description' => $validated['description'] ?? null,
                'media_type' => $mediaType,
                'media_url' => $mediaUrl,
                'category_id' => $validated['category_id'] ?? null,
                'user_id' => Auth::user()?->id,
                'status' => 'published',
                'published_at' => now(),
            ]);

            return redirect()->route('cryptocurrency-memes.show', $meme->slug)
                ->with('success', 'Meme uploaded successfully!');
        } catch (\Exception $e) {
            Log::error('Error uploading meme: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Error uploading meme: ' . $e->getMessage())
                ->withInput();
        }
    }

    public function upvote(Request $request, $id)
    {
        try {
            $meme = CryptocurrencyMeme::findOrFail($id);

            // Check if user has already upvoted this meme
            $cacheKey = "meme_upvote_{$meme->id}_user_{$request->user()->id}";
            if (Cache::has($cacheKey)) {
                return response()->json(['message' => 'Already upvoted'], 400);
            }

            $meme->incrementUpvotes();
            Cache::put($cacheKey, true, 86400); // 24 hours

            return response()->json([
                'upvotes_count' => $meme->upvotes_count
            ]);
        } catch (\Exception $e) {
            Log::error('Error upvoting cryptocurrency meme: ' . $e->getMessage());
            return response()->json(['message' => 'Error upvoting meme'], 500);
        }
    }
}
