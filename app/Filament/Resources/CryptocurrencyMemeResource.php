<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CryptocurrencyMemeResource\Pages;
use App\Models\CryptocurrencyMeme;
use App\Models\Category;
use App\Models\User;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Filament\Support\Enums\FontWeight;
use Illuminate\Support\Str;
use Illuminate\Support\Collection;
use Filament\Tables\Columns\TextColumn;

class CryptocurrencyMemeResource extends Resource
{
    protected static ?string $model = CryptocurrencyMeme::class;

    protected static ?string $navigationIcon = 'heroicon-o-photo';

    protected static ?string $navigationGroup = 'Content';

    protected static ?int $navigationSort = 71;

    protected static ?string $recordTitleAttribute = 'title';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Basic Information')
                    ->schema([
                        Forms\Components\TextInput::make('title')
                            ->required()
                            ->maxLength(255)
                            ->live(onBlur: true)
                            ->afterStateUpdated(fn(string $operation, $state, Forms\Set $set) => $operation === 'create' ? $set('slug', Str::slug($state)) : null),

                        Forms\Components\TextInput::make('slug')
                            ->required()
                            ->maxLength(255)
                            ->unique(CryptocurrencyMeme::class, 'slug', ignoreRecord: true),

                        Forms\Components\Select::make('category_id')
                            ->label('Category')
                            ->options(Category::all()->pluck('name', 'id'))
                            ->searchable(),

                        Forms\Components\Textarea::make('description')
                            ->rows(4)
                            ->columnSpanFull(),
                    ]),

                Forms\Components\Section::make('Media Information')
                    ->schema([
                        Forms\Components\Select::make('media_type')
                            ->label('Media Type')
                            ->options([
                                'image' => 'Image',
                                'video' => 'Video',
                            ])
                            ->required()
                            ->default('image'),

                        Forms\Components\FileUpload::make('media_url')
                            ->label('Media File')
                            ->image()
                            ->disk('r2')
                            ->directory('memes')
                            ->visibility('public')
                            ->imageResizeMode('cover')
                            ->imageCropAspectRatio('1:1')
                            ->imageResizeTargetWidth('800')
                            ->imageResizeTargetHeight('800')
                            ->visible(fn(callable $get) => $get('media_type') === 'image'),

                        Forms\Components\FileUpload::make('media_url_video')
                            ->label('Video File')
                            ->disk('r2')
                            ->directory('memes')
                            ->visibility('public')
                            ->acceptedFileTypes(['video/mp4', 'video/webm'])
                            ->maxSize(20480) // 20MB
                            ->visible(fn(callable $get) => $get('media_type') === 'video'),

                        Forms\Components\TextInput::make('media_url_external')
                            ->label('External Media URL')
                            ->url()
                            ->helperText('For videos or images hosted elsewhere'),
                    ]),

                Forms\Components\Section::make('Publication Details')
                    ->schema([
                        Forms\Components\Select::make('user_id')
                            ->label('Author')
                            ->relationship('user', 'name')
                            ->searchable()
                            ->preload()
                            ->required(),

                        Forms\Components\Toggle::make('is_featured')
                            ->label('Featured')
                            ->default(false),

                        Forms\Components\Select::make('status')
                            ->options([
                                'draft' => 'Draft',
                                'published' => 'Published',
                                'archived' => 'Archived',
                            ])
                            ->default('published')
                            ->required(),

                        Forms\Components\DateTimePicker::make('published_at')
                            ->default(now()),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('media_url')
                    ->label('Media')
                    ->disk('r2')
                    ->visibility('public')
                    ->square()
                    ->visible(fn(?CryptocurrencyMeme $record): bool => $record?->media_type === 'image')
                    ->getStateUsing(function (?CryptocurrencyMeme $record): ?string {
                        if (!$record) return null;
                        if (filter_var($record->media_url, FILTER_VALIDATE_URL)) {
                            return $record->media_url;
                        }
                        return $record->media_url;
                    }),

                Tables\Columns\TextColumn::make('media_url')
                    ->label('Media')
                    ->visible(fn(?CryptocurrencyMeme $record): bool => $record?->media_type === 'video')
                    ->formatStateUsing(fn() => 'Video')
                    ->icon('heroicon-o-video-camera'),

                Tables\Columns\TextColumn::make('title')
                    ->searchable()
                    ->sortable()
                    ->weight(FontWeight::Bold)
                    ->limit(50),

                Tables\Columns\TextColumn::make('media_type')
                    ->label('Type')
                    ->badge()
                    ->icon(fn(string $state): string => match ($state) {
                        'image' => 'heroicon-o-photo',
                        'video' => 'heroicon-o-video-camera',
                        default => 'heroicon-o-document',
                    })
                    ->color(fn(string $state): string => match ($state) {
                        'image' => 'info',
                        'video' => 'success',
                        default => 'gray',
                    }),

                Tables\Columns\TextColumn::make('user.name')
                    ->label('Author')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('category.name')
                    ->label('Category')
                    ->sortable(),

                Tables\Columns\IconColumn::make('is_featured')
                    ->label('Featured')
                    ->boolean()
                    ->sortable(),

                Tables\Columns\TextColumn::make('view_count')
                    ->label('Views')
                    ->sortable()
                    ->alignRight(),

                Tables\Columns\TextColumn::make('upvotes_count')
                    ->label('Upvotes')
                    ->sortable()
                    ->alignRight(),

                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->color(fn(string $state): string => match ($state) {
                        'published' => 'success',
                        'draft' => 'gray',
                        'archived' => 'danger',
                        default => 'gray',
                    }),

                Tables\Columns\TextColumn::make('published_at')
                    ->label('Published Date')
                    ->dateTime()
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\TrashedFilter::make(),
                Tables\Filters\SelectFilter::make('category_id')
                    ->label('Category')
                    ->options(Category::pluck('name', 'id'))
                    ->searchable(),
                Tables\Filters\SelectFilter::make('media_type')
                    ->options([
                        'image' => 'Image',
                        'video' => 'Video',
                    ]),
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'draft' => 'Draft',
                        'published' => 'Published',
                        'archived' => 'Archived',
                    ]),
                Tables\Filters\TernaryFilter::make('is_featured')
                    ->label('Featured'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\ViewAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                    Tables\Actions\ForceDeleteBulkAction::make(),
                    Tables\Actions\RestoreBulkAction::make(),
                    Tables\Actions\BulkAction::make('markAsFeatured')
                        ->label('Mark as Featured')
                        ->icon('heroicon-o-star')
                        ->action(fn(Collection $records) => $records->each->update(['is_featured' => true])),
                    Tables\Actions\BulkAction::make('removeFromFeatured')
                        ->label('Remove from Featured')
                        ->icon('heroicon-o-star')
                        ->color('gray')
                        ->action(fn(Collection $records) => $records->each->update(['is_featured' => false])),
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
            'index' => Pages\ListCryptocurrencyMemes::route('/'),
            'create' => Pages\CreateCryptocurrencyMeme::route('/create'),
            'edit' => Pages\EditCryptocurrencyMeme::route('/{record}/edit'),
            'view' => Pages\ViewCryptocurrencyMeme::route('/{record}'),
        ];
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->withoutGlobalScopes([
                SoftDeletingScope::class,
            ]);
    }
}
