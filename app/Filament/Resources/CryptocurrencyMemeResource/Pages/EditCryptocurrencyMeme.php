<?php

namespace App\Filament\Resources\CryptocurrencyMemeResource\Pages;

use App\Filament\Resources\CryptocurrencyMemeResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditCryptocurrencyMeme extends EditRecord
{
    protected static string $resource = CryptocurrencyMemeResource::class;

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
