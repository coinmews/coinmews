<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class EventController extends Controller
{
    public function index(Request $request)
    {
        // Start with base query
        $query = Event::with(['organizer'])
            ->when($request->filled('type') && $request->type !== 'all', function ($query) use ($request) {
                $query->where('type', $request->type);
            })
            ->when($request->filled('status') && $request->status !== 'all', function ($query) use ($request) {
                switch ($request->status) {
                    case 'upcoming':
                        $query->upcoming();
                        break;
                    case 'ongoing':
                        $query->ongoing();
                        break;
                    case 'completed':
                        $query->completed();
                        break;
                    case 'cancelled':
                        $query->cancelled();
                        break;
                }
            })
            ->when($request->filled('event_type') && $request->event_type !== 'all', function ($query) use ($request) {
                if ($request->event_type === 'virtual') {
                    $query->virtual();
                } else {
                    $query->inPerson();
                }
            });

        // Sorting
        $query->when($request->sort_by, function ($query) use ($request) {
            switch ($request->sort_by) {
                case 'date_asc':
                    $query->orderBy('start_date', 'asc');
                    break;
                case 'date_desc':
                    $query->orderBy('start_date', 'desc');
                    break;
                case 'participants':
                    $query->orderBy('current_participants', 'desc');
                    break;
                default:
                    $query->orderBy('start_date', 'asc');
                    break;
            }
        }, function ($query) {
            $query->orderBy('start_date', 'asc');
        });

        // Get filter counts
        $filterCounts = $this->getFilterCounts();

        // Paginate the results
        $events = $query->paginate(9)->withQueryString();

        // Append computed attributes to each event
        $events->through(function ($event) {
            $event->start_date = $event->start_date?->format('Y-m-d H:i:s');
            $event->end_date = $event->end_date?->format('Y-m-d H:i:s');
            return $event->append(['banner_url', 'duration', 'registration_status']);
        });

        return Inertia::render('events/index', [
            'events' => $events,
            'filters' => $request->only([
                'type',
                'status',
                'event_type',
                'sort_by',
            ]),
            'filterCounts' => $filterCounts,
        ]);
    }

    public function show($slug)
    {
        // Find the event by slug
        $event = Event::with('organizer')->where('slug', $slug)->firstOrFail();

        // Convert dates to proper format
        $event->start_date = $event->start_date?->format('Y-m-d H:i:s');
        $event->end_date = $event->end_date?->format('Y-m-d H:i:s');

        // Make sure we get all the computed attributes
        $event = $event->append([
            'banner_url',
            'duration',
            'registration_status'
        ]);

        // Get related events (same type, excluding current event)
        $relatedEvents = Event::with('organizer')
            ->where('type', $event->type)
            ->where('id', '!=', $event->id)
            ->where('status', '!=', 'cancelled')
            ->limit(3)
            ->get()
            ->map(function ($relatedEvent) {
                $relatedEvent->start_date = $relatedEvent->start_date?->format('Y-m-d H:i:s');
                $relatedEvent->end_date = $relatedEvent->end_date?->format('Y-m-d H:i:s');
                return $relatedEvent;
            })
            ->append([
                'banner_url',
                'duration',
                'registration_status'
            ]);

        // Debug logging
        Log::info('Event data:', [
            'event_id' => $event->id,
            'start_date' => $event->start_date,
            'end_date' => $event->end_date,
            'has_organizer' => $event->organizer !== null,
            'computed_attributes' => [
                'banner_url' => $event->banner_url,
                'duration' => $event->duration,
                'registration_status' => $event->registration_status,
            ]
        ]);

        return Inertia::render('events/show', [
            'event' => $event,
            'relatedEvents' => $relatedEvents,
        ]);
    }

    private function getFilterCounts()
    {
        // Cache the counts for 5 minutes to improve performance
        return Cache::remember('event_filter_counts', 300, function () {
            $baseQuery = Event::query();

            // Total count
            $total = $baseQuery->clone()->count();

            // Event type counts
            $typeCounts = [
                'all' => $total,
                'crypto_event' => $baseQuery->clone()->where('type', 'crypto_event')->count(),
                'web3_event' => $baseQuery->clone()->where('type', 'web3_event')->count(),
                'community_event' => $baseQuery->clone()->where('type', 'community_event')->count(),
                'ai_event' => $baseQuery->clone()->where('type', 'ai_event')->count(),
            ];

            // Status counts
            $statusCounts = [
                'all' => $total,
                'upcoming' => $baseQuery->clone()->upcoming()->count(),
                'ongoing' => $baseQuery->clone()->ongoing()->count(),
                'completed' => $baseQuery->clone()->completed()->count(),
                'cancelled' => $baseQuery->clone()->cancelled()->count(),
            ];

            // Event type counts (virtual vs in-person)
            $eventTypeCounts = [
                'all' => $total,
                'virtual' => $baseQuery->clone()->virtual()->count(),
                'in_person' => $baseQuery->clone()->inPerson()->count(),
            ];

            // Sort option counts
            $sortCounts = [
                'date_asc' => $total,
                'date_desc' => $total,
                'participants' => $baseQuery->clone()->where('current_participants', '>', 0)->count(),
            ];

            return [
                'total' => $total,
                'types' => $typeCounts,
                'status' => $statusCounts,
                'eventTypes' => $eventTypeCounts,
                'sortOptions' => $sortCounts,
            ];
        });
    }
}
