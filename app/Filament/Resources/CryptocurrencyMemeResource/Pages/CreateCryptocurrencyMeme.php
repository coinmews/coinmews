<?php

namespace App\Filament\Resources\CryptocurrencyMemeResource\Pages;

use App\Filament\Resources\CryptocurrencyMemeResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreateCryptocurrencyMeme extends CreateRecord
{
    protected static string $resource = CryptocurrencyMemeResource::class;

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}
