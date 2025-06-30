<?php

namespace App\Http\Controllers;

use App\Models\CryptoExchangeListing;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CryptoExchangeListingController extends Controller
{
    public function index(Request $request)
    {
        $exchangeType = $request->input('exchange_type');
        $exchange = $request->input('exchange', 'all');
        $date = $request->input('date');
        $searchTerm = $request->input('search');

        $query = CryptoExchangeListing::query()
            ->where('is_published', true)
            ->orderBy('listing_date', 'desc');

        if ($exchangeType) {
            $query->where('listing_type', $exchangeType);
        }

        if ($exchange && $exchange !== 'all') {
            $query->where('exchange_name', $exchange);
        }

        if ($date) {
            $query->whereDate('listing_date', $date);
        }

        if ($searchTerm) {
            $query->where(function ($q) use ($searchTerm) {
                $q->where('coin_name', 'like', "%{$searchTerm}%")
                    ->orWhere('coin_symbol', 'like', "%{$searchTerm}%")
                    ->orWhere('exchange_name', 'like', "%{$searchTerm}%");
            });
        }

        $listings = $query->paginate(15);

        // Append formatted_listing_date to each listing
        $listings->through(function ($listing) {
            return $listing->append('formatted_listing_date');
        });

        // Get unique exchanges for filters
        $exchanges = CryptoExchangeListing::where('is_published', true)
            ->select('exchange_name')
            ->distinct()
            ->orderBy('exchange_name')
            ->pluck('exchange_name');

        return Inertia::render('crypto-exchange-listings/index', [
            'listings' => $listings,
            'exchanges' => $exchanges,
            'filters' => [
                'exchange_type' => $exchangeType,
                'exchange' => $exchange,
                'date' => $date,
                'search' => $searchTerm,
            ],
        ]);
    }

    public function show($slug)
    {
        $listing = CryptoExchangeListing::where('slug', $slug)
            ->where('is_published', true)
            ->firstOrFail();

        // Get related listings (same exchange or listing type)
        $relatedListings = CryptoExchangeListing::where('is_published', true)
            ->where('id', '!=', $listing->id)
            ->where(function ($query) use ($listing) {
                $query->where('exchange_name', $listing->exchange_name)
                    ->orWhere('listing_type', $listing->listing_type);
            })
            ->orderBy('listing_date', 'desc')
            ->limit(5)
            ->get();

        return Inertia::render('crypto-exchange-listings/show', [
            'listing' => $listing,
            'relatedListings' => $relatedListings,
            'meta' => [
                'title' => "{$listing->coin_name} ({$listing->coin_symbol}) {$listing->listing_type} on {$listing->exchange_name}",
                'description' => $listing->description ? strip_tags(substr($listing->description, 0, 160)) : null,
                'keywords' => "crypto, {$listing->coin_name}, {$listing->coin_symbol}, {$listing->exchange_name}, {$listing->listing_type}",
                'og' => [
                    'title' => "{$listing->coin_name} ({$listing->coin_symbol}) {$listing->listing_type} on {$listing->exchange_name}",
                    'description' => $listing->description ? strip_tags(substr($listing->description, 0, 160)) : null,
                    'image' => $listing->banner_image ?? ($listing->coin_logo ?? null),
                    'type' => 'article',
                    'url' => route('crypto-exchange-listings.show', $listing->slug),
                ],
                'twitter' => [
                    'card' => 'summary_large_image',
                    'title' => "{$listing->coin_name} ({$listing->coin_symbol}) {$listing->listing_type} on {$listing->exchange_name}",
                    'description' => $listing->description ? strip_tags(substr($listing->description, 0, 160)) : null,
                    'image' => $listing->banner_image ?? ($listing->coin_logo ?? null),
                ],
            ],
        ]);
    }

    public function vote(Request $request, $id)
    {
        $listing = CryptoExchangeListing::findOrFail($id);
        $voteType = $request->input('vote_type');

        if (!in_array($voteType, ['yes', 'no'])) {
            return response()->json(['error' => 'Invalid vote type'], 400);
        }

        $listing->vote($voteType);

        return response()->json([
            'yes_votes' => $listing->yes_votes,
            'no_votes' => $listing->no_votes,
            'yes_percentage' => $listing->yes_percentage,
            'no_percentage' => $listing->no_percentage,
        ]);
    }
}
