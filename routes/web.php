<?php

use App\Http\Controllers\AirdropController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\WelcomeController;
use App\Http\Controllers\AllArticlesController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\PresaleController;
use App\Http\Controllers\SitemapController;
use App\Http\Controllers\CryptocurrencyVideoController;
use App\Http\Controllers\CryptocurrencyMemeController;
use App\Http\Controllers\CryptoExchangeListingController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\SearchController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Welcome Page
Route::get('/', [WelcomeController::class, 'index'])->name('home');

// Articles Page
Route::get('/articles', [AllArticlesController::class, 'index'])->name('articles.index');
Route::get('/articles/{slug}', [ArticleController::class, 'show'])->name('articles.show');

// News Page
Route::get('/news', [NewsController::class, 'index'])->name('news.index');
Route::get('/news/{slug}', [NewsController::class, 'show'])->name('news.show');

// Blog Page
Route::get('/blog', [BlogController::class, 'index'])->name('blog.index');
Route::get('/blog/{slug}', [BlogController::class, 'show'])->name('blog.show');

// Web Stories Page
// Route::get('/web-stories', [ArticleController::class, 'index'])->name('web-stories.index');
// Route::get('/stories/{slug}', [ArticleController::class, 'show'])->name('web-stories.show');

// Categories Page
Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');
Route::get('/categories/{slug}', [CategoryController::class, 'show'])->name('categories.show');

// Events Page
Route::get('/events', [EventController::class, 'index'])->name('events.index');
Route::get('/events/{slug}', [EventController::class, 'show'])->name('events.show');

// Airdrops Page
Route::get('/airdrops', [AirdropController::class, 'index'])->name('airdrops.index');
Route::get('/airdrops/{slug}', [AirdropController::class, 'show'])->name('airdrops.show');

// Presales Page
Route::get('/presales', [PresaleController::class, 'index'])->name('presales.index');
Route::get('/presales/{slug}', [PresaleController::class, 'show'])->name('presales.show');

// Cryptocurrency Videos
Route::get('/cryptocurrency-videos', [CryptocurrencyVideoController::class, 'index'])
    ->name('cryptocurrency-videos.index');
Route::get('/cryptocurrency-videos/{slug}', [CryptocurrencyVideoController::class, 'show'])
    ->name('cryptocurrency-videos.show');

// Cryptocurrency Memes
Route::get('/cryptocurrency-memes', [CryptocurrencyMemeController::class, 'index'])
    ->name('cryptocurrency-memes.index');
Route::get('/cryptocurrency-memes/{slug}', [CryptocurrencyMemeController::class, 'show'])
    ->name('cryptocurrency-memes.show');

// Crypto Exchange Listings
Route::get('/crypto-exchange-listings', [CryptoExchangeListingController::class, 'index'])->name('crypto-exchange-listings.index');
Route::get('/crypto-exchange-listings/{slug}', [CryptoExchangeListingController::class, 'show'])->name('crypto-exchange-listings.show');
Route::post('/crypto-exchange-listings/{id}/vote', [CryptoExchangeListingController::class, 'vote'])->name('crypto-exchange-listings.vote');

// API Routes
Route::prefix('api')->group(function () {
    // Airdrops
    Route::post('/airdrops/{id}/upvote', [AirdropController::class, 'upvote'])
        ->name('airdrops.upvote')
        ->middleware('auth');

    // Videos
    Route::post('/cryptocurrency-videos/{id}/upvote', [CryptocurrencyVideoController::class, 'upvote'])
        ->name('cryptocurrency-videos.upvote')
        ->middleware('auth');

    // Memes
    Route::post('/cryptocurrency-memes/{id}/upvote', [CryptocurrencyMemeController::class, 'upvote'])
        ->name('cryptocurrency-memes.upvote')
        ->middleware('auth');
    Route::post('/cryptocurrency-memes/upload', [CryptocurrencyMemeController::class, 'upload'])
        ->name('cryptocurrency-memes.upload')
        ->middleware('auth');
});

// Legal Pages
Route::prefix('legal')->group(function () {
    Route::get('/terms', function () {
        return Inertia::render('legal/terms');
    })->name('legal.terms');

    Route::get('/privacy', function () {
        return Inertia::render('legal/privacy');
    })->name('legal.privacy');

    Route::get('/cookies', function () {
        return Inertia::render('legal/cookies');
    })->name('legal.cookies');

    Route::get('/sitemap', function () {
        return Inertia::render('legal/sitemap');
    })->name('legal.sitemap');

    Route::get('/accessibility', function () {
        return Inertia::render('legal/accessibility');
    })->name('legal.accessibility');
});

// Sitemap Routes
Route::get('sitemap.xml', [SitemapController::class, 'index'])->name('sitemap');
Route::get('sitemap-news.xml', [SitemapController::class, 'newsSitemap'])->name('sitemap.news');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('submissions', function () {
        return Inertia::render('submissions/index');
    })->name('submissions.index');

    Route::get('saved', function () {
        return Inertia::render('saved/index');
    })->name('saved.index');

    Route::get('notifications', function () {
        return Inertia::render('notifications/index');
    })->name('notifications.index');
});

Route::middleware(['auth'])->group(function () {
    // Submissions routes
    Route::resource('submissions', \App\Http\Controllers\SubmissionController::class);

    // Submission approval/rejection routes
    Route::post('submissions/{submission}/approve', [\App\Http\Controllers\SubmissionController::class, 'approve'])
        ->name('submissions.approve')
        ->middleware('can:approve,submission');

    Route::post('submissions/{submission}/reject', [\App\Http\Controllers\SubmissionController::class, 'reject'])
        ->name('submissions.reject')
        ->middleware('can:reject,submission');
});

// Search route - before require statements
Route::get('/search', [SearchController::class, 'search'])
    ->name('search')
    ->middleware(['web']);

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
