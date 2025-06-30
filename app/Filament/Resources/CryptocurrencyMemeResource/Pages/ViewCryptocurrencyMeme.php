<?php

namespace App\Filament\Resources\CryptocurrencyMemeResource\Pages;

use App\Filament\Resources\CryptocurrencyMemeResource;
use Filament\Actions;
use Filament\Resources\Pages\ViewRecord;

class ViewCryptocurrencyMeme extends ViewRecord
{
    protected static string $resource = CryptocurrencyMemeResource::class;

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
