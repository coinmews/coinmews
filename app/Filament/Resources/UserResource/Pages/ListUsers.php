<?php

namespace App\Filament\Resources\UserResource\Pages;

use App\Filament\Resources\UserResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use Filament\Tables;
use Filament\Tables\Actions\Action;
use Filament\Tables\Actions\BulkAction;
use Filament\Tables\Actions\ExportBulkAction;
use Filament\Tables\Filters\Filter;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Forms;

class ListUsers extends ListRecords
{
    protected static string $resource = UserResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
            Action::make('export')
                ->label('Export Users')
                ->icon('heroicon-o-arrow-down-tray')
                ->action(fn () => $this->exportUsers()),
        ];
    }

    protected function getTableBulkActions(): array
    {
        return [
            BulkAction::make('impersonate')
                ->label('Impersonate')
                ->icon('heroicon-o-user')
                ->action(fn (array $records) => $this->impersonateUsers($records))
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
            Filter::make('created_at')
                ->label('Registered Date')
                ->form([
                    DatePicker::make('from'),
                    DatePicker::make('until'),
                ])
                ->query(fn ($query, $data) => $query
                    ->when($data['from'], fn ($q) => $q->whereDate('created_at', '>=', $data['from']))
                    ->when($data['until'], fn ($q) => $q->whereDate('created_at', '<=', $data['until']))
                ),
        ];
    }

    protected function exportUsers()
    {
        // Implement export logic (CSV/Excel)
    }

    protected function impersonateUsers(array $records)
    {
        // Implement impersonation logic (admin only)
    }
}
