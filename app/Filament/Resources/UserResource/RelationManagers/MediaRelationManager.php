<?php

namespace App\Filament\Resources\UserResource\RelationManagers;

use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;

class MediaRelationManager extends RelationManager
{
    protected static string $relationship = 'media';

    protected static ?string $recordTitleAttribute = 'name';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('folder')
                    ->maxLength(255),
                Forms\Components\TextInput::make('alt_text')
                    ->maxLength(255),
                Forms\Components\FileUpload::make('file')
                    ->required()
                    ->disk('r2')
                    ->directory('media'),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('folder')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('alt_text')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\ImageColumn::make('file')
                    ->disk('r2'),
                Tables\Columns\TextColumn::make('mime_type')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('size')
                    ->formatStateUsing(fn($state) => number_format($state / 1024, 2) . ' KB')
                    ->sortable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('mime_type')
                    ->options([
                        'image/jpeg' => 'JPEG',
                        'image/png' => 'PNG',
                        'image/gif' => 'GIF',
                        'image/webp' => 'WebP',
                        'video/mp4' => 'MP4',
                        'video/webm' => 'WebM',
                        'application/pdf' => 'PDF',
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
