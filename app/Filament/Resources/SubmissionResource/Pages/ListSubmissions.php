<?php

namespace App\Filament\Resources\SubmissionResource\Pages;

use App\Filament\Resources\SubmissionResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use App\Filament\Resources\SubmissionResource\Widgets\SubmissionStatsOverview;
use Filament\Resources\Components\Tab;

class ListSubmissions extends ListRecords
{
    protected static string $resource = SubmissionResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }

    public function getTabs(): array
    {
        return [
            'all' => Tab::make('All Submissions'),
            'presale' => Tab::make('Presales')
                ->modifyQueryUsing(fn($query) => $query->whereNotNull('type')->where('type', 'presale')),
            'airdrop' => Tab::make('Airdrops')
                ->modifyQueryUsing(fn($query) => $query->whereNotNull('type')->where('type', 'airdrop')),
            'event' => Tab::make('Events')
                ->modifyQueryUsing(fn($query) => $query->whereNotNull('type')->where('type', 'event')),
            'press_release' => Tab::make('Press Releases')
                ->modifyQueryUsing(fn($query) => $query->whereNotNull('type')->where('type', 'press_release')),
            'guest_post' => Tab::make('Guest Posts')
                ->modifyQueryUsing(fn($query) => $query->whereNotNull('type')->where('type', 'guest_post')),
            'sponsored_content' => Tab::make('Sponsored Content')
                ->modifyQueryUsing(fn($query) => $query->whereNotNull('type')->where('type', 'sponsored_content')),
        ];
    }

    protected function getHeaderWidgets(): array
    {
        return [
            SubmissionStatsOverview::class,
        ];
    }
}
