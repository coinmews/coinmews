<?php

namespace App\Http\Controllers;

use App\Models\Airdrop;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class AirdropController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Airdrop::with(['creator:id,name,username,avatar'])
                ->when($request->status, function ($query, $status) {
                    switch ($status) {
                        case 'ongoing':
                            return $query->ongoing();
                        case 'upcoming':
                            return $query->upcoming();
                        case 'potential':
                            return $query->potential();
                        case 'ended':
                            return $query->ended();
                        default:
                            return $query;
                    }
                })
                ->when($request->blockchain, function ($query, $blockchain) {
                    return $query->where('blockchain', $blockchain);
                })
                ->when($request->featured, function ($query) {
                    return $query->featured();
                })
                ->when($request->search, function ($query, $search) {
                    return $query->where(function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                            ->orWhere('token_symbol', 'like', "%{$search}%");
                    });
                });

            // Sort options
            $query->when($request->sort, function ($query, $sort) {
                switch ($sort) {
                    case 'newest':
                        return $query->latest();
                    case 'oldest':
                        return $query->oldest();
                    case 'most_viewed':
                        return $query->orderBy('view_count', 'desc');
                    case 'most_upvotes':
                        return $query->orderBy('upvotes_count', 'desc');
                    case 'ending_soon':
                        return $query->whereNotNull('end_date')
                            ->where('end_date', '>', now())
                            ->orderBy('end_date', 'asc');
                    default:
                        return $query->latest();
                }
            });

            $airdrops = $query->paginate(12)->withQueryString();

            // Get networks for filter
            $blockchains = Cache::remember('airdrop_blockchains', 3600, function () {
                return Airdrop::distinct()->pluck('blockchain');
            });

            // Get stats
            $stats = Cache::remember('airdrop_stats', 300, function () {
                return [
                    'total' => Airdrop::count(),
                    'ongoing' => Airdrop::ongoing()->count(),
                    'upcoming' => Airdrop::upcoming()->count(),
                    'ended' => Airdrop::ended()->count(),
                    'featured' => Airdrop::featured()->count(),
                ];
            });

            return Inertia::render('airdrops/index', [
                'airdrops' => $airdrops,
                'blockchains' => $blockchains,
                'stats' => $stats,
                'filters' => $request->only(['status', 'blockchain', 'featured', 'search', 'sort']),
            ]);
        } catch (\Exception $e) {
            Log::error('Error loading airdrops: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Error loading airdrops');
        }
    }

    public function show($slug)
    {
        try {
            $airdrop = Airdrop::with(['creator:id,name,username,avatar,bio'])
                ->where('slug', $slug)
                ->firstOrFail();

            // Increment view count with cache prevention
            $cacheKey = "airdrop_view_{$airdrop->id}";
            if (!Cache::has($cacheKey)) {
                $airdrop->incrementViewCount();
                Cache::put($cacheKey, true, 60);
            }

            // Get similar airdrops
            $similarAirdrops = Airdrop::where('id', '!=', $airdrop->id)
                ->where('blockchain', $airdrop->blockchain)
                ->where(function ($query) {
                    $query->ongoing()->orWhere(function ($q) {
                        $q->upcoming();
                    });
                })
                ->take(3)
                ->get();

            // Prepare structured data for SEO
            $structuredData = $this->prepareStructuredData($airdrop);

            return Inertia::render('airdrops/show', [
                'airdrop' => $airdrop,
                'similarAirdrops' => $similarAirdrops,
                'structuredData' => $structuredData,
                'meta' => $this->prepareMetaData($airdrop),
            ]);
        } catch (ModelNotFoundException $e) {
            Log::error('Airdrop not found: ' . $e->getMessage());
            return redirect()->route('airdrops.index')->with('error', 'Airdrop not found');
        } catch (\Exception $e) {
            Log::error('Error loading airdrop: ' . $e->getMessage());
            return redirect()->route('airdrops.index')->with('error', 'Error loading airdrop');
        }
    }

    public function upvote(Request $request, $id)
    {
        try {
            $airdrop = Airdrop::findOrFail($id);

            // Check if user has already upvoted this airdrop
            $cacheKey = "airdrop_upvote_{$airdrop->id}_user_{$request->user()->id}";
            if (Cache::has($cacheKey)) {
                return response()->json(['message' => 'Already upvoted'], 400);
            }

            $airdrop->incrementUpvotes();
            Cache::put($cacheKey, true, 86400); // 24 hours

            return response()->json([
                'upvotes_count' => $airdrop->upvotes_count
            ]);
        } catch (\Exception $e) {
            Log::error('Error upvoting airdrop: ' . $e->getMessage());
            return response()->json(['message' => 'Error upvoting airdrop'], 500);
        }
    }

    private function prepareStructuredData($airdrop)
    {
        return [
            '@context' => 'https://schema.org',
            '@type' => 'Event',
            'name' => $airdrop->name,
            'description' => $airdrop->description,
            'startDate' => $airdrop->start_date->toISO8601String(),
            'endDate' => $airdrop->end_date?->toISO8601String(),
            'image' => $airdrop->logo_url,
            'organizer' => [
                '@type' => 'Person',
                'name' => $airdrop->creator->name
            ],
            'eventStatus' => $this->getEventStatus($airdrop),
            'eventAttendanceMode' => 'Online',
        ];
    }

    private function prepareMetaData($airdrop)
    {
        return [
            'title' => $airdrop->name,
            'description' => substr(strip_tags($airdrop->description), 0, 160),
            'keywords' => "{$airdrop->token_symbol}, airdrop, {$airdrop->blockchain}",
            'canonical' => url()->current(),
            'og' => [
                'title' => $airdrop->name,
                'description' => substr(strip_tags($airdrop->description), 0, 160),
                'image' => $airdrop->logo_url,
                'type' => 'website',
                'url' => url()->current()
            ],
            'twitter' => [
                'card' => 'summary_large_image',
                'title' => $airdrop->name,
                'description' => substr(strip_tags($airdrop->description), 0, 160),
                'image' => $airdrop->logo_url
            ]
        ];
    }

    private function getEventStatus($airdrop)
    {
        if ($airdrop->isEnded()) {
            return 'EventEnded';
        } elseif ($airdrop->isOngoing()) {
            return 'EventScheduled';
        } elseif ($airdrop->isUpcoming()) {
            return 'EventScheduled';
        } else {
            return 'EventPostponed';
        }
    }
}
