<?php

namespace App\Filament\Resources\AdCampaignResource\RelationManagers;

use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;
use App\Enums\AdSpaceLocation;
use App\Enums\AdSpaceSize;

class AdSpaceRelationManager extends RelationManager
{
    protected static string $relationship = 'adSpace';

    protected static ?string $recordTitleAttribute = 'name';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->required()
                    ->maxLength(255),
                Forms\Components\Textarea::make('description')
                    ->maxLength(1000),
                Forms\Components\Select::make('location')
                    ->options(AdSpaceLocation::class)
                    ->required(),
                Forms\Components\Select::make('size')
                    ->options(AdSpaceSize::class)
                    ->required(),
                Forms\Components\Toggle::make('is_premium')
                    ->required(),
                Forms\Components\TextInput::make('price_per_day')
                    ->numeric()
                    ->minValue(0)
                    ->required(),
                Forms\Components\TextInput::make('impression_count')
                    ->numeric()
                    ->minValue(0)
                    ->disabled(),
                Forms\Components\TextInput::make('click_count')
                    ->numeric()
                    ->minValue(0)
                    ->disabled(),
                Forms\Components\Select::make('status')
                    ->options([
                        'active' => 'Active',
                        'inactive' => 'Inactive',
                    ])
                    ->required()
                    ->default('active'),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('location')
                    ->badge()
                    ->sortable(),
                Tables\Columns\TextColumn::make('size')
                    ->badge()
                    ->sortable(),
                Tables\Columns\IconColumn::make('is_premium')
                    ->boolean(),
                Tables\Columns\TextColumn::make('price_per_day')
                    ->money('usd')
                    ->sortable(),
                Tables\Columns\TextColumn::make('impression_count')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('click_count')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->color(fn(string $state): string => match ($state) {
                        'active' => 'success',
                        'inactive' => 'danger',
                    }),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('location')
                    ->options(AdSpaceLocation::class),
                Tables\Filters\SelectFilter::make('size')
                    ->options(AdSpaceSize::class),
                Tables\Filters\TernaryFilter::make('is_premium'),
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'active' => 'Active',
                        'inactive' => 'Inactive',
                    ]),
            ])
            ->headerActions([
                Tables\Actions\CreateAction::make(),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }
}
