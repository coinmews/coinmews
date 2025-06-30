<?php

namespace App\Filament\Resources\ArticleResource\RelationManagers;

use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Model;

class CommentsRelationManager extends RelationManager
{
    protected static string $relationship = 'comments';

    protected static ?string $recordTitleAttribute = 'content';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('user.name')
                    ->label('Author')
                    ->disabled(),

                Forms\Components\RichEditor::make('content')
                    ->required()
                    ->disabled(),

                Forms\Components\Toggle::make('is_spam')
                    ->label('Mark as Spam'),

                Forms\Components\Toggle::make('is_approved')
                    ->label('Approve Comment'),

                Forms\Components\Textarea::make('moderation_notes')
                    ->label('Moderation Notes')
                    ->maxLength(1000),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('user.name')
                    ->label('Author')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('content')
                    ->searchable()
                    ->limit(50),

                Tables\Columns\IconColumn::make('is_spam')
                    ->boolean()
                    ->label('Spam'),

                Tables\Columns\IconColumn::make('is_approved')
                    ->boolean()
                    ->label('Approved'),

                Tables\Columns\TextColumn::make('report_count')
                    ->sortable(),

                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'approved' => 'Approved',
                        'spam' => 'Spam',
                        'reported' => 'Reported',
                    ])
                    ->query(function ($query, array $data) {
                        return match ($data['value']) {
                            'pending' => $query->pending(),
                            'approved' => $query->where('is_approved', true),
                            'spam' => $query->spam(),
                            'reported' => $query->reported(),
                            default => $query,
                        };
                    }),
            ])
            ->headerActions([
                Tables\Actions\CreateAction::make(),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
                Tables\Actions\Action::make('approve')
                    ->icon('heroicon-o-check')
                    ->color('success')
                    ->action(function (Model $record): void {
                        $record->approve(auth()->user);
                    })
                    ->visible(fn(Model $record): bool => ! $record->is_approved && ! $record->is_spam),
                Tables\Actions\Action::make('mark_spam')
                    ->icon('heroicon-o-shield-exclamation')
                    ->color('danger')
                    ->action(function (Model $record): void {
                        $record->markAsSpam();
                    })
                    ->visible(fn(Model $record): bool => ! $record->is_spam),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                    Tables\Actions\BulkAction::make('approve')
                        ->label('Approve Selected')
                        ->icon('heroicon-o-check')
                        ->color('success')
                        ->action(function ($records): void {
                            foreach ($records as $record) {
                                $record->approve(auth()->user);
                            }
                        }),
                    Tables\Actions\BulkAction::make('mark_spam')
                        ->label('Mark as Spam')
                        ->icon('heroicon-o-shield-exclamation')
                        ->color('danger')
                        ->action(function ($records): void {
                            foreach ($records as $record) {
                                $record->markAsSpam();
                            }
                        }),
                ]),
            ]);
    }
}
