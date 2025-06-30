<?php

namespace App\Filament\Resources\SubmissionResource\Widgets;

use App\Models\Submission;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class SubmissionStatsOverview extends BaseWidget
{
    protected function getStats(): array
    {
        return [
            Stat::make('Total Submissions', Submission::count())
                ->description('All submissions')
                ->descriptionIcon('heroicon-m-document-text')
                ->color('primary'),

            Stat::make('Pending Submissions', Submission::where('status', 'pending')->count())
                ->description('Awaiting review')
                ->descriptionIcon('heroicon-m-clock')
                ->color('warning'),

            Stat::make('Approved Submissions', Submission::where('status', 'approved')->count())
                ->description('Published content')
                ->descriptionIcon('heroicon-m-check-circle')
                ->color('success'),

            Stat::make('Rejected Submissions', Submission::where('status', 'rejected')->count())
                ->description('Declined content')
                ->descriptionIcon('heroicon-m-x-circle')
                ->color('danger'),
        ];
    }
}
