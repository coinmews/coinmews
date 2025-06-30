<?php

namespace App\Filament\Resources\AirdropResource\Pages;

use App\Filament\Resources\AirdropResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditAirdrop extends EditRecord
{
    protected static string $resource = AirdropResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
