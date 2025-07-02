<?php

namespace App\Filament\Widgets;

use App\Models\Article;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Carbon;

class ContentChartWidget extends ChartWidget
{
    protected static ?string $heading = 'Content & User Growth';

    protected static ?int $sort = 2;

    protected function getData(): array
    {
        $type = request()->get('type', 'articles');
        if ($type === 'users') {
            $data = $this->getUserData();
            $label = 'Users Registered';
        } else {
            $data = $this->getContentData();
            $label = 'Articles Created';
        }
        return [
            'datasets' => [
                [
                    'label' => $label,
                    'data' => $data['counts'],
                    'backgroundColor' => [
                        'rgba(54, 162, 235, 0.5)',
                    ],
                    'borderColor' => [
                        'rgb(54, 162, 235)',
                    ],
                    'borderWidth' => 1
                ],
            ],
            'labels' => $data['labels'],
        ];
    }

    protected function getType(): string
    {
        $type = request()->get('type', 'articles');
        return $type === 'users' ? 'line' : 'bar';
    }

    protected function getContentData(): array
    {
        $startDate = Carbon::now()->subMonths(6)->startOfMonth();
        $endDate = Carbon::now()->endOfMonth();

        $articles = Article::query()
            ->selectRaw('COUNT(*) as count, EXTRACT(MONTH FROM created_at) as month, EXTRACT(YEAR FROM created_at) as year')
            ->where('created_at', '>=', $startDate)
            ->where('created_at', '<=', $endDate)
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get();

        $labels = [];
        $counts = [];

        $currentDate = $startDate->copy();
        while ($currentDate->lt($endDate)) {
            $month = (int) $currentDate->format('m');
            $year = (int) $currentDate->format('Y');

            $labels[] = $currentDate->format('M Y');

            $monthData = $articles->first(function ($item) use ($month, $year) {
                return (int)$item->month === $month && (int)$item->year === $year;
            });

            $counts[] = $monthData ? $monthData->count : 0;

            $currentDate->addMonth();
        }

        return [
            'labels' => $labels,
            'counts' => $counts,
        ];
    }

    protected function getUserData(): array
    {
        $startDate = Carbon::now()->subMonths(6)->startOfMonth();
        $endDate = Carbon::now()->endOfMonth();
        $users = 
            \App\Models\User::query()
            ->selectRaw('COUNT(*) as count, EXTRACT(MONTH FROM created_at) as month, EXTRACT(YEAR FROM created_at) as year')
            ->where('created_at', '>=', $startDate)
            ->where('created_at', '<=', $endDate)
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get();
        $labels = [];
        $counts = [];
        $currentDate = $startDate->copy();
        while ($currentDate->lt($endDate)) {
            $month = (int) $currentDate->format('m');
            $year = (int) $currentDate->format('Y');
            $labels[] = $currentDate->format('M Y');
            $monthData = $users->first(function ($item) use ($month, $year) {
                return (int)$item->month === $month && (int)$item->year === $year;
            });
            $counts[] = $monthData ? $monthData->count : 0;
            $currentDate->addMonth();
        }
        return [
            'labels' => $labels,
            'counts' => $counts,
        ];
    }
}
