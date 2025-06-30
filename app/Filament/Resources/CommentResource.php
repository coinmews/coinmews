<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CommentResource\Pages;
use App\Models\Comment;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class CommentResource extends Resource
{
    protected static ?string $model = Comment::class;

    protected static ?string $navigationIcon = 'heroicon-o-chat-bubble-left-right';

    protected static ?string $navigationGroup = 'Content';

    protected static ?int $navigationSort = 5;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Comment Details')
                    ->schema([
                        Forms\Components\TextInput::make('user.name')
                            ->label('Author')
                            ->disabled(),

                        Forms\Components\TextInput::make('commentable_type')
                            ->label('Content Type')
                            ->disabled(),

                        Forms\Components\TextInput::make('commentable_id')
                            ->label('Content ID')
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
                    ])->columns(2),

                Forms\Components\Section::make('Additional Information')
                    ->schema([
                        Forms\Components\TextInput::make('ip_address')
                            ->disabled(),

                        Forms\Components\TextInput::make('user_agent')
                            ->disabled(),

                        Forms\Components\TextInput::make('report_count')
                            ->disabled(),

                        Forms\Components\DateTimePicker::make('last_reported_at')
                            ->disabled(),

                        Forms\Components\DateTimePicker::make('approved_at')
                            ->disabled(),

                        Forms\Components\TextInput::make('approver.name')
                            ->label('Approved By')
                            ->disabled(),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
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

                Tables\Columns\TextColumn::make('commentable_type')
                    ->label('Content Type')
                    ->badge(),

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

                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'approved' => 'Approved',
                        'spam' => 'Spam',
                        'reported' => 'Reported',
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return match ($data['value']) {
                            'pending' => $query->pending(),
                            'approved' => $query->where('is_approved', true),
                            'spam' => $query->spam(),
                            'reported' => $query->reported(),
                            default => $query,
                        };
                    }),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
                Tables\Actions\Action::make('approve')
                    ->icon('heroicon-o-check')
                    ->color('success')
                    ->action(function (Comment $record): void {
                        $record->approve(auth()->user());
                    })
                    ->visible(fn(Comment $record): bool => ! $record->is_approved && ! $record->is_spam),
                Tables\Actions\Action::make('mark_spam')
                    ->icon('heroicon-o-shield-exclamation')
                    ->color('danger')
                    ->action(function (Comment $record): void {
                        $record->markAsSpam();
                    })
                    ->visible(fn(Comment $record): bool => ! $record->is_spam),
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
                                $record->approve(auth()->user());
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

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListComments::route('/'),
            'edit' => Pages\EditComment::route('/{record}/edit'),
        ];
    }
}
