<?php

namespace App\Filament\Resources\UserResource\RelationManagers;

use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;

class AirdropsRelationManager extends RelationManager
{
    protected static string $relationship = 'airdrops';

    protected static ?string $recordTitleAttribute = 'title';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('title')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('slug')
                    ->required()
                    ->maxLength(255),
                Forms\Components\RichEditor::make('description')
                    ->required(),
                Forms\Components\Select::make('status')
                    ->options([
                        'draft' => 'Draft',
                        'upcoming' => 'Upcoming',
                        'ongoing' => 'Ongoing',
                        'completed' => 'Completed',
                        'cancelled' => 'Cancelled',
                        'potential' => 'Potential',
                    ])
                    ->required(),
                Forms\Components\TextInput::make('token_name')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('token_symbol')
                    ->required()
                    ->maxLength(10),
                Forms\Components\TextInput::make('token_network')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('token_contract_address')
                    ->required()
                    ->maxLength(255),
                Forms\Components\DateTimePicker::make('start_date')
                    ->required(),
                Forms\Components\DateTimePicker::make('end_date')
                    ->required(),
                Forms\Components\TextInput::make('total_supply')
                    ->numeric()
                    ->required(),
                Forms\Components\TextInput::make('airdrop_amount')
                    ->numeric()
                    ->required(),
                Forms\Components\KeyValue::make('requirements')
                    ->keyLabel('Requirement')
                    ->valueLabel('Value'),
                Forms\Components\Toggle::make('is_verified')
                    ->label('Verified'),
                Forms\Components\KeyValue::make('verification_rules')
                    ->keyLabel('Rule')
                    ->valueLabel('Value'),
                Forms\Components\FileUpload::make('banner_image')
                    ->image()
                    ->disk('r2')
                    ->directory('airdrops'),
                Forms\Components\FileUpload::make('logo_image')
                    ->image()
                    ->disk('r2')
                    ->directory('airdrops'),
                Forms\Components\TextInput::make('meta_title')
                    ->maxLength(255),
                Forms\Components\Textarea::make('meta_description')
                    ->maxLength(255),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('title')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->color(fn(string $state): string => match ($state) {
                        'draft' => 'gray',
                        'upcoming' => 'info',
                        'ongoing' => 'success',
                        'completed' => 'primary',
                        'cancelled' => 'danger',
                        'potential' => 'warning',
                    }),
                Tables\Columns\TextColumn::make('token_name')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('token_symbol')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('token_network')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\IconColumn::make('is_verified')
                    ->boolean(),
                Tables\Columns\TextColumn::make('participant_count')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('view_count')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('start_date')
                    ->dateTime()
                    ->sortable(),
                Tables\Columns\TextColumn::make('end_date')
                    ->dateTime()
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'draft' => 'Draft',
                        'upcoming' => 'Upcoming',
                        'ongoing' => 'Ongoing',
                        'completed' => 'Completed',
                        'cancelled' => 'Cancelled',
                        'potential' => 'Potential',
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
