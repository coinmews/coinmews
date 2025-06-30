<?php

namespace App\Filament\Resources\CryptoExchangeListingResource\Pages;

use App\Filament\Resources\CryptoExchangeListingResource;
use Filament\Actions;
use Filament\Resources\Pages\ViewRecord;

class ViewCryptoExchangeListing extends ViewRecord
{
    protected static string $resource = CryptoExchangeListingResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\EditAction::make(),
            Actions\DeleteAction::make(),
            Actions\ForceDeleteAction::make(),
            Actions\RestoreAction::make(),
        ];
    }
}
