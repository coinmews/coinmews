<?php

namespace App\Http\Controllers;

use App\Models\Presale;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class PresaleController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Presale::query();

            // Search
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('token_symbol', 'like', "%{$search}%");
                });
            }

            // Filters
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            if ($request->has('stage')) {
                $query->where('stage', $request->stage);
            }

            // Sorting
            $sortField = $request->get('sort', 'start_date');
            $sortDirection = $request->get('direction', 'desc');
            $query->orderBy($sortField, $sortDirection);

            // Pagination
            $perPage = $request->get('per_page', 10);
            $presales = $query->paginate($perPage);

            // Get available stages for filter
            $stages = Presale::distinct()->pluck('stage');

            // Get stats
            $stats = [
                'total' => Presale::count(),
                'ongoing' => Presale::where('status', 'ongoing')->count(),
                'upcoming' => Presale::where('status', 'upcoming')->count(),
                'ended' => Presale::where('status', 'ended')->count(),
            ];

            return Inertia::render('presales/index', [
                'presales' => $presales,
                'stages' => $stages,
                'stats' => $stats,
                'filters' => $request->only(['search', 'status', 'stage']),
                'sort' => [
                    'field' => $sortField,
                    'direction' => $sortDirection,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Error in PresaleController@index: ' . $e->getMessage());
            return back()->with('error', 'An error occurred while loading presales.');
        }
    }

    public function show($slug)
    {
        try {
            $presale = Presale::where('slug', $slug)
                ->with('creator')
                ->firstOrFail();

            // Get similar presales
            $similarPresales = Presale::where('id', '!=', $presale->id)
                ->where(function ($query) use ($presale) {
                    $query->where('stage', $presale->stage)
                        ->orWhere('status', $presale->status);
                })
                ->limit(3)
                ->get();

            // Prepare structured data for SEO
            $structuredData = [
                '@context' => 'https://schema.org',
                '@type' => 'CrowdfundingCampaign',
                'name' => $presale->name,
                'description' => $presale->description,
                'startDate' => $presale->start_date,
                'endDate' => $presale->end_date,
                'currency' => $presale->token_symbol,
                'funder' => [
                    '@type' => 'Organization',
                    'name' => $presale->name,
                ],
            ];

            // Generate keywords from token symbol, stage, and status
            $keywords = implode(', ', [
                $presale->name,
                $presale->token_symbol,
                $presale->stage,
                $presale->status,
                'presale',
                'token sale',
                'cryptocurrency'
            ]);

            // Get the current URL for canonical and og:url
            $currentUrl = url()->current();

            return Inertia::render('presales/show', [
                'presale' => $presale,
                'similarPresales' => $similarPresales,
                'structuredData' => $structuredData,
                'meta' => [
                    'title' => $presale->name,
                    'description' => $presale->description,
                    'keywords' => $keywords,
                    'canonical' => $currentUrl,
                    'og' => [
                        'title' => $presale->name,
                        'description' => $presale->description,
                        'image' => $presale->logo_url,
                        'type' => 'website',
                        'url' => $currentUrl,
                    ],
                    'twitter' => [
                        'card' => 'summary_large_image',
                        'title' => $presale->name,
                        'description' => $presale->description,
                        'image' => $presale->logo_url,
                    ],
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Error in PresaleController@show: ' . $e->getMessage());
            return back()->with('error', 'Presale not found.');
        }
    }
}
