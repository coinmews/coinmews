<?php

namespace App\Filament\Resources\CryptocurrencyVideoResource\Pages;

use App\Filament\Resources\CryptocurrencyVideoResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreateCryptocurrencyVideo extends CreateRecord
{
    protected static string $resource = CryptocurrencyVideoResource::class;

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}
