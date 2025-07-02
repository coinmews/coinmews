<?php

namespace App\Filament\Resources\SubmissionResource\Pages;

use App\Filament\Resources\SubmissionResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use App\Filament\Resources\SubmissionResource\Widgets\SubmissionStatsOverview;
use Filament\Resources\Components\Tab;
use Filament\Tables;
use Filament\Tables\Actions\BulkAction;
use Filament\Tables\Actions\ExportBulkAction;
use Filament\Tables\Filters\Filter;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Forms;

class ListSubmissions extends ListRecords
{
    protected static string $resource = SubmissionResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
            Actions\Action::make('export')
                ->label('Export Submissions')
                ->icon('heroicon-o-arrow-down-tray')
                ->action(fn () => $this->exportSubmissions()),
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

    protected function getTableBulkActions(): array
    {
        return [
            BulkAction::make('approve')
                ->label('Approve')
                ->icon('heroicon-o-check')
                ->action(fn (array $records) => $this->bulkApprove($records))
                ->requiresConfirmation(),
            BulkAction::make('reject')
                ->label('Reject')
                ->icon('heroicon-o-x-mark')
                ->action(fn (array $records) => $this->bulkReject($records))
                ->requiresConfirmation(),
            ExportBulkAction::make('export')
                ->label('Export Selected')
                ->icon('heroicon-o-arrow-down-tray'),
            Tables\Actions\DeleteBulkAction::make(),
        ];
    }

    protected function getTableFilters(): array
    {
        return [
            Filter::make('status')
                ->label('Status')
                ->form([
                    Select::make('status')
                        ->options([
                            'pending' => 'Pending',
                            'reviewing' => 'Reviewing',
                            'approved' => 'Approved',
                            'rejected' => 'Rejected',
                        ]),
                ])
                ->query(fn ($query, $data) => $query->when($data['status'], fn ($q) => $q->where('status', $data['status']))),
        ];
    }

    protected function exportSubmissions()
    {
        // Implement export logic (CSV/Excel)
    }

    protected function bulkApprove(array $records)
    {
        // Implement bulk approve logic
    }

    protected function bulkReject(array $records)
    {
        // Implement bulk reject logic
    }
}
