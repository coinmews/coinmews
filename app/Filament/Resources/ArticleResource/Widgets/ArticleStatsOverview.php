<?php

namespace App\Filament\Resources\ArticleResource\Widgets;

use App\Models\Article;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class ArticleStatsOverview extends BaseWidget
{
    protected function getStats(): array
    {
        return [
            Stat::make('Total Articles', Article::count())
                ->description('All articles in the system')
                ->descriptionIcon('heroicon-m-document-text')
                ->color('primary'),

            Stat::make('Published Articles', Article::where('status', 'published')->count())
                ->description('Currently published')
                ->descriptionIcon('heroicon-m-check-circle')
                ->color('success'),

            Stat::make('Average Views', number_format(Article::avg('view_count'), 2))
                ->description('Per article')
                ->descriptionIcon('heroicon-m-chart-bar')
                ->color('info'),
        ];
    }
}
