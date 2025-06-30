<?php

namespace App\Filament\Resources\CryptocurrencyMemeResource\Pages;

use App\Filament\Resources\CryptocurrencyMemeResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListCryptocurrencyMemes extends ListRecords
{
    protected static string $resource = CryptocurrencyMemeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
