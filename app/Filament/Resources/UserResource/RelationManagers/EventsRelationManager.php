<?php

namespace App\Filament\Resources\UserResource\RelationManagers;

use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;

class EventsRelationManager extends RelationManager
{
    protected static string $relationship = 'events';

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
                Forms\Components\Select::make('type')
                    ->options([
                        'conference' => 'Conference',
                        'meetup' => 'Meetup',
                        'workshop' => 'Workshop',
                        'hackathon' => 'Hackathon',
                        'other' => 'Other',
                    ])
                    ->required(),
                Forms\Components\DateTimePicker::make('start_date')
                    ->required(),
                Forms\Components\DateTimePicker::make('end_date')
                    ->required(),
                Forms\Components\TextInput::make('location')
                    ->maxLength(255),
                Forms\Components\TextInput::make('virtual_link')
                    ->url()
                    ->maxLength(255),
                Forms\Components\Toggle::make('is_virtual')
                    ->label('Virtual Event'),
                Forms\Components\TextInput::make('registration_link')
                    ->url()
                    ->maxLength(255),
                Forms\Components\TextInput::make('max_participants')
                    ->numeric()
                    ->minValue(0),
                Forms\Components\FileUpload::make('banner_image')
                    ->image()
                    ->disk('r2')
                    ->directory('events'),
                Forms\Components\FileUpload::make('thumbnail_image')
                    ->image()
                    ->disk('r2')
                    ->directory('events'),
                Forms\Components\Select::make('status')
                    ->options([
                        'draft' => 'Draft',
                        'upcoming' => 'Upcoming',
                        'ongoing' => 'Ongoing',
                        'completed' => 'Completed',
                        'cancelled' => 'Cancelled',
                    ])
                    ->required(),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('title')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('type')
                    ->badge()
                    ->color(fn(string $state): string => match ($state) {
                        'conference' => 'primary',
                        'meetup' => 'success',
                        'workshop' => 'warning',
                        'hackathon' => 'info',
                        'other' => 'gray',
                    }),
                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->color(fn(string $state): string => match ($state) {
                        'draft' => 'gray',
                        'upcoming' => 'info',
                        'ongoing' => 'success',
                        'completed' => 'primary',
                        'cancelled' => 'danger',
                    }),
                Tables\Columns\TextColumn::make('location')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\IconColumn::make('is_virtual')
                    ->boolean(),
                Tables\Columns\TextColumn::make('current_participants')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('max_participants')
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
                Tables\Filters\SelectFilter::make('type')
                    ->options([
                        'conference' => 'Conference',
                        'meetup' => 'Meetup',
                        'workshop' => 'Workshop',
                        'hackathon' => 'Hackathon',
                        'other' => 'Other',
                    ]),
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'draft' => 'Draft',
                        'upcoming' => 'Upcoming',
                        'ongoing' => 'Ongoing',
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
