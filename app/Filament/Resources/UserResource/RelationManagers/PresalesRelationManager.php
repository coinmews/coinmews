<?php

namespace App\Filament\Resources\UserResource\RelationManagers;

use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;

class PresalesRelationManager extends RelationManager
{
    protected static string $relationship = 'presales';

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
                        'active' => 'Active',
                        'completed' => 'Completed',
                        'cancelled' => 'Cancelled',
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
                Forms\Components\TextInput::make('price')
                    ->numeric()
                    ->required(),
                Forms\Components\TextInput::make('min_buy')
                    ->numeric()
                    ->required(),
                Forms\Components\TextInput::make('max_buy')
                    ->numeric()
                    ->required(),
                Forms\Components\TextInput::make('soft_cap')
                    ->numeric()
                    ->required(),
                Forms\Components\TextInput::make('hard_cap')
                    ->numeric()
                    ->required(),
                Forms\Components\Toggle::make('requires_kyc')
                    ->label('Requires KYC'),
                Forms\Components\KeyValue::make('kyc_requirements')
                    ->keyLabel('Requirement')
                    ->valueLabel('Value'),
                Forms\Components\FileUpload::make('banner_image')
                    ->image()
                    ->disk('r2')
                    ->directory('presales'),
                Forms\Components\FileUpload::make('logo_image')
                    ->image()
                    ->disk('r2')
                    ->directory('presales'),
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
                        'active' => 'success',
                        'completed' => 'primary',
                        'cancelled' => 'danger',
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
                Tables\Columns\TextColumn::make('price')
                    ->money('USD')
                    ->sortable(),
                Tables\Columns\TextColumn::make('soft_cap')
                    ->money('USD')
                    ->sortable(),
                Tables\Columns\TextColumn::make('hard_cap')
                    ->money('USD')
                    ->sortable(),
                Tables\Columns\TextColumn::make('total_raised')
                    ->money('USD')
                    ->sortable(),
                Tables\Columns\IconColumn::make('requires_kyc')
                    ->boolean(),
                Tables\Columns\TextColumn::make('participant_count')
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
                        'active' => 'Active',
                        'completed' => 'Completed',
                        'cancelled' => 'Cancelled',
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
