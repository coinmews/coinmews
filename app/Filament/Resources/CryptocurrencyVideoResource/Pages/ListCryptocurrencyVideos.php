<?php

namespace App\Filament\Resources\CryptocurrencyVideoResource\Pages;

use App\Filament\Resources\CryptocurrencyVideoResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListCryptocurrencyVideos extends ListRecords
{
    protected static string $resource = CryptocurrencyVideoResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
