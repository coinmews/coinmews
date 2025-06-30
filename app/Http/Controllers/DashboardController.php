<?php

namespace App\Http\Controllers;

use App\Models\Submission;
use App\Models\Airdrop;
use App\Models\Event;
use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Get authenticated user
        $user = Auth::user();

        // Get submissions count
        $presaleSubmissions = $user->submissions()->count();
        $airdropSubmissions = Airdrop::where('created_by', $user->id)->count();
        $eventSubmissions = Event::where('organizer_id', $user->id)->count();
        $articleSubmissions = Article::where('author_id', $user->id)->count();

        // Calculate total submissions
        $totalSubmissions = $presaleSubmissions + $airdropSubmissions + $eventSubmissions + $articleSubmissions;

        // Get published content count
        $publishedAirdrops = Airdrop::where('created_by', $user->id)
            ->whereIn('status', ['ongoing', 'upcoming'])
            ->count();

        $publishedEvents = Event::where('organizer_id', $user->id)
            ->whereIn('status', ['upcoming', 'ongoing'])
            ->count();

        $publishedArticles = Article::where('author_id', $user->id)
            ->where('status', 'published')
            ->count();

        $publishedPresales = $user->submissions()
            ->whereIn('status', ['ongoing', 'upcoming'])
            ->count();

        $totalPublished = $publishedPresales + $publishedAirdrops + $publishedEvents + $publishedArticles;

        // Count pending submissions
        $pendingAirdrops = Airdrop::where('created_by', $user->id)
            ->where('status', 'pending')
            ->count();

        $pendingEvents = Event::where('organizer_id', $user->id)
            ->where('status', 'pending')
            ->count();

        $pendingArticles = Article::where('author_id', $user->id)
            ->where('status', 'pending')
            ->count();

        $pendingPresales = $user->submissions()
            ->where('status', 'pending')
            ->count();

        $totalPending = $pendingPresales + $pendingAirdrops + $pendingEvents + $pendingArticles;

        // Get recent submissions
        $recentSubmissions = collect();

        // Presale submissions
        $presaleSubmissions = $user->submissions()->latest()->take(5)->get()
            ->map(function ($submission) {
                return [
                    'id' => $submission->id,
                    'name' => $submission->name,
                    'type' => $submission->type,
                    'status' => $submission->status,
                    'created_at' => $submission->created_at,
                    'url' => route('submissions.show', $submission->id)
                ];
            });

        // Airdrop submissions
        $airdropSubmissions = Airdrop::where('created_by', $user->id)->latest()->take(5)->get()
            ->map(function ($airdrop) {
                return [
                    'id' => $airdrop->id,
                    'name' => $airdrop->name,
                    'type' => 'airdrop',
                    'status' => $airdrop->status,
                    'created_at' => $airdrop->created_at,
                    'url' => route('airdrops.show', $airdrop->slug)
                ];
            });

        // Event submissions
        $eventSubmissions = Event::where('organizer_id', $user->id)->latest()->take(5)->get()
            ->map(function ($event) {
                return [
                    'id' => $event->id,
                    'name' => $event->title,
                    'type' => 'event',
                    'status' => $event->status,
                    'created_at' => $event->created_at,
                    'url' => route('events.show', $event->slug)
                ];
            });

        // Article submissions
        $articleSubmissions = Article::where('author_id', $user->id)->latest()->take(5)->get()
            ->map(function ($article) {
                return [
                    'id' => $article->id,
                    'name' => $article->title,
                    'type' => $article->content_type ?? 'article',
                    'status' => $article->status,
                    'created_at' => $article->created_at,
                    'url' => route('articles.show', $article->slug)
                ];
            });

        // Merge and sort recent submissions
        $recentSubmissions = $recentSubmissions
            ->merge($presaleSubmissions)
            ->merge($airdropSubmissions)
            ->merge($eventSubmissions)
            ->merge($articleSubmissions)
            ->sortByDesc('created_at')
            ->take(5)
            ->values();

        // Calculate month-over-month changes
        // For simplicity, we'll just provide placeholder values for now
        // In a real app, you'd calculate these based on historical data
        $submissionsChange = 2; // +2 from last month
        $publishedChange = 1;   // +1 since last week
        $pendingChange = 0;     // Set to 0 for now

        // Pass all data to the dashboard view
        return Inertia::render('dashboard', [
            'stats' => [
                'totalSubmissions' => $totalSubmissions,
                'totalPublished' => $totalPublished,
                'totalPending' => $totalPending,
                'submissionsChange' => $submissionsChange,
                'publishedChange' => $publishedChange,
                'pendingChange' => $pendingChange,
            ],
            'recentSubmissions' => $recentSubmissions,
        ]);
    }
}
