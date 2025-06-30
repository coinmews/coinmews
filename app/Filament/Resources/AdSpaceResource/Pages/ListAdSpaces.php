<?php

namespace App\Filament\Resources\AdSpaceResource\Pages;

use App\Filament\Resources\AdSpaceResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListAdSpaces extends ListRecords
{
    protected static string $resource = AdSpaceResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
