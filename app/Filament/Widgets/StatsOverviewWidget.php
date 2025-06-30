<?php

namespace App\Filament\Widgets;

use App\Models\Article;
use App\Models\Category;
use App\Models\Submission;
use App\Models\Tag;
use App\Models\User;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverviewWidget extends BaseWidget
{
    protected function getStats(): array
    {
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

            Stat::make('Submissions', Submission::count())
                ->description('Total submissions')
                ->descriptionIcon('heroicon-m-inbox-stack')
                ->chart([7, 2, 10, 3, 15, 4, 17])
                ->color('primary'),
        ];
    }
}
