<?php

namespace App\Filament\Resources\PresaleResource\Pages;

use App\Filament\Resources\PresaleResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListPresales extends ListRecords
{
    protected static string $resource = PresaleResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
