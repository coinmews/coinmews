<?php

namespace App\Filament\Resources\CryptocurrencyVideoResource\Pages;

use App\Filament\Resources\CryptocurrencyVideoResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditCryptocurrencyVideo extends EditRecord
{
    protected static string $resource = CryptocurrencyVideoResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\ViewAction::make(),
            Actions\DeleteAction::make(),
            Actions\ForceDeleteAction::make(),
            Actions\RestoreAction::make(),
        ];
    }
}
