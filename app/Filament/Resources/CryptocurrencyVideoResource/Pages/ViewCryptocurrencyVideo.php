<?php

namespace App\Filament\Resources\CryptocurrencyVideoResource\Pages;

use App\Filament\Resources\CryptocurrencyVideoResource;
use Filament\Actions;
use Filament\Resources\Pages\ViewRecord;

class ViewCryptocurrencyVideo extends ViewRecord
{
    protected static string $resource = CryptocurrencyVideoResource::class;

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
