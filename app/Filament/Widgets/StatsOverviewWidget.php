<?php

namespace App\Filament\Widgets;

use App\Models\Article;
use App\Models\Category;
use App\Models\Submission;
use App\Models\Tag;
use App\Models\User;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Illuminate\Support\Carbon;

class StatsOverviewWidget extends BaseWidget
{
    protected function getStats(): array
    {
        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();
        return [
            Stat::make('Articles', Article::count())
                ->description('Total articles')
                ->descriptionIcon('heroicon-m-document-text')
                ->chart([7, 2, 10, 3, 15, 4, 17])
                ->color('success'),

            Stat::make('Categories', Category::count())
                ->description('Total categories')
                ->descriptionIcon('heroicon-m-folder')
                ->chart([7, 2, 10, 3, 15, 4, 17])
                ->color('warning'),

            Stat::make('Tags', Tag::count())
                ->description('Total tags')
                ->descriptionIcon('heroicon-m-tag')
                ->chart([7, 2, 10, 3, 15, 4, 17])
                ->color('info'),

            Stat::make('Users', User::count())
                ->description('Total users')
                ->descriptionIcon('heroicon-m-users')
                ->chart([7, 2, 10, 3, 15, 4, 17])
                ->color('danger'),

            Stat::make('New Users (This Month)', User::where('created_at', '>=', $startOfMonth)->count())
                ->description('Users registered this month')
                ->descriptionIcon('heroicon-m-user-plus')
                ->color('primary'),

            Stat::make('Pending Submissions', Submission::where('status', 'pending')->count())
                ->description('Awaiting review')
                ->descriptionIcon('heroicon-m-clock')
                ->color('warning'),

            Stat::make('Reviewing Submissions', Submission::where('status', 'reviewing')->count())
                ->description('Being reviewed')
                ->descriptionIcon('heroicon-m-eye')
                ->color('info'),

            Stat::make('Approved Submissions', Submission::where('status', 'approved')->count())
                ->description('Approved content')
                ->descriptionIcon('heroicon-m-check')
                ->color('success'),

            Stat::make('Rejected Submissions', Submission::where('status', 'rejected')->count())
                ->description('Rejected content')
                ->descriptionIcon('heroicon-m-x-mark')
                ->color('danger'),
        ];
    }
}
