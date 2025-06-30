<?php

namespace App\Filament\Resources\CryptoExchangeListingResource\Pages;

use App\Filament\Resources\CryptoExchangeListingResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditCryptoExchangeListing extends EditRecord
{
    protected static string $resource = CryptoExchangeListingResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
