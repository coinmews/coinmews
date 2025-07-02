<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\User;
use App\Models\Article;
use App\Models\Submission;
use App\Observers\AuditLogObserver;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        User::observe(AuditLogObserver::class);
        Article::observe(AuditLogObserver::class);
        Submission::observe(AuditLogObserver::class);
        // Add more models as needed
    }
}
