<?php

namespace App\Filament\Resources\UserResource\RelationManagers;

use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;

class SubmissionsRelationManager extends RelationManager
{
    protected static string $relationship = 'submissions';

    protected static ?string $recordTitleAttribute = 'title';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('title')
                    ->required()
                    ->maxLength(255),
                Forms\Components\RichEditor::make('content')
                    ->required(),
                Forms\Components\Select::make('type')
                    ->options([
                        'article' => 'Article',
                        'event' => 'Event',
                        'airdrop' => 'Airdrop',
                        'presale' => 'Presale',
                        'other' => 'Other',
                    ])
                    ->required(),
                Forms\Components\Select::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'reviewing' => 'Reviewing',
                        'approved' => 'Approved',
                        'rejected' => 'Rejected',
                        'auto_approved' => 'Auto Approved',
                        'auto_rejected' => 'Auto Rejected',
                    ])
                    ->required(),
                Forms\Components\Textarea::make('feedback')
                    ->maxLength(1000),
                Forms\Components\TextInput::make('contact_email')
                    ->email()
                    ->maxLength(255),
                Forms\Components\TextInput::make('contact_name')
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
                Tables\Columns\TextColumn::make('type')
                    ->badge()
                    ->color(fn(string $state): string => match ($state) {
                        'article' => 'primary',
                        'event' => 'success',
                        'airdrop' => 'warning',
                        'presale' => 'info',
                        'other' => 'gray',
                    }),
                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->color(fn(string $state): string => match ($state) {
                        'pending' => 'gray',
                        'reviewing' => 'warning',
                        'approved' => 'success',
                        'rejected' => 'danger',
                        'auto_approved' => 'success',
                        'auto_rejected' => 'danger',
                    }),
                Tables\Columns\TextColumn::make('contact_email')
                    ->searchable(),
                Tables\Columns\TextColumn::make('contact_name')
                    ->searchable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('type')
                    ->options([
                        'article' => 'Article',
                        'event' => 'Event',
                        'airdrop' => 'Airdrop',
                        'presale' => 'Presale',
                        'other' => 'Other',
                    ]),
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'reviewing' => 'Reviewing',
                        'approved' => 'Approved',
                        'rejected' => 'Rejected',
                        'auto_approved' => 'Auto Approved',
                        'auto_rejected' => 'Auto Rejected',
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
