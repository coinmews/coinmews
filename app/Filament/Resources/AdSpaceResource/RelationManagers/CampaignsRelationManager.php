<?php

namespace App\Filament\Resources\AdSpaceResource\RelationManagers;

use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;
use App\Http\Requests\AdCampaignRequest;

class CampaignsRelationManager extends RelationManager
{
    protected static string $relationship = 'campaigns';

    protected static ?string $recordTitleAttribute = 'name';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->required()
                    ->maxLength(255),

                Forms\Components\Select::make('advertiser_id')
                    ->relationship('advertiser', 'name')
                    ->required()
                    ->searchable()
                    ->preload(),

                Forms\Components\RichEditor::make('ad_content')
                    ->required(),

                Forms\Components\FileUpload::make('ad_image')
                    ->image()
                    ->imageEditor(),

                Forms\Components\TextInput::make('ad_link')
                    ->url()
                    ->maxLength(255)
                    ->required(),

                Forms\Components\DateTimePicker::make('start_date')
                    ->required(),

                Forms\Components\DateTimePicker::make('end_date')
                    ->required()
                    ->after('start_date'),

                Forms\Components\Select::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'active' => 'Active',
                        'paused' => 'Paused',
                        'completed' => 'Completed',
                        'cancelled' => 'Cancelled',
                    ])
                    ->required()
                    ->default('pending'),

                Forms\Components\TextInput::make('budget')
                    ->numeric()
                    ->minValue(0)
                    ->required(),

                Forms\Components\KeyValue::make('targeting_rules')
                    ->keyLabel('Rule')
                    ->valueLabel('Value'),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('advertiser.name')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('budget')
                    ->money('usd')
                    ->sortable(),

                Tables\Columns\TextColumn::make('spent')
                    ->money('usd')
                    ->sortable(),

                Tables\Columns\TextColumn::make('impression_count')
                    ->numeric()
                    ->sortable(),

                Tables\Columns\TextColumn::make('click_count')
                    ->numeric()
                    ->sortable(),

                Tables\Columns\TextColumn::make('ctr')
                    ->numeric(2)
                    ->suffix('%')
                    ->sortable(),

                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->color(fn(string $state): string => match ($state) {
                        'pending' => 'warning',
                        'active' => 'success',
                        'paused' => 'info',
                        'completed' => 'gray',
                        'cancelled' => 'danger',
                    }),

                Tables\Columns\IconColumn::make('is_approved')
                    ->boolean(),

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
                        'pending' => 'Pending',
                        'active' => 'Active',
                        'paused' => 'Paused',
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
