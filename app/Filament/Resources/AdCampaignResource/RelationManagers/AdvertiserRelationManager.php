<?php

namespace App\Filament\Resources\AdCampaignResource\RelationManagers;

use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;
use App\Http\Requests\AdvertiserRequest;

class AdvertiserRelationManager extends RelationManager
{
    protected static string $relationship = 'advertiser';

    protected static ?string $recordTitleAttribute = 'name';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('email')
                    ->email()
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('phone')
                    ->tel()
                    ->maxLength(20),
                Forms\Components\TextInput::make('company')
                    ->maxLength(255),
                Forms\Components\TextInput::make('website')
                    ->url()
                    ->maxLength(255),
                Forms\Components\TextInput::make('facebook')
                    ->url()
                    ->maxLength(255),
                Forms\Components\TextInput::make('twitter')
                    ->url()
                    ->maxLength(255),
                Forms\Components\TextInput::make('linkedin')
                    ->url()
                    ->maxLength(255),
                Forms\Components\Textarea::make('address')
                    ->maxLength(1000),
                Forms\Components\Textarea::make('notes')
                    ->maxLength(1000),
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
                Tables\Columns\TextColumn::make('email')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('phone')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('company')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('website')
                    ->url(fn($record) => $record->website)
                    ->openUrlInNewTab(true)
                    ->searchable(),
                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->color(fn(string $state): string => match ($state) {
                        'active' => 'success',
                        'inactive' => 'danger',
                    }),
            ])
            ->filters([
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
