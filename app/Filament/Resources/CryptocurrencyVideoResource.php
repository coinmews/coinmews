<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CryptocurrencyVideoResource\Pages;
use App\Models\CryptocurrencyVideo;
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
use Filament\Tables\Columns\TextColumn;
use Illuminate\Support\Collection;

class CryptocurrencyVideoResource extends Resource
{
    protected static ?string $model = CryptocurrencyVideo::class;

    protected static ?string $navigationIcon = 'heroicon-o-play';

    protected static ?string $navigationGroup = 'Content';

    protected static ?int $navigationSort = 70;

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
                            ->unique(CryptocurrencyVideo::class, 'slug', ignoreRecord: true),

                        Forms\Components\Select::make('category_id')
                            ->label('Category')
                            ->options(Category::all()->pluck('name', 'id'))
                            ->searchable(),

                        Forms\Components\TextInput::make('youtube_url')
                            ->required()
                            ->url()
                            ->maxLength(255)
                            ->helperText('Enter a valid YouTube URL (e.g., https://www.youtube.com/watch?v=VIDEO_ID)'),

                        Forms\Components\Textarea::make('description')
                            ->rows(4)
                            ->columnSpanFull(),
                    ]),

                Forms\Components\Section::make('Media Information')
                    ->schema([
                        Forms\Components\Tabs::make('thumbnail_tabs')
                            ->tabs([
                                Forms\Components\Tabs\Tab::make('External URL')
                                    ->schema([
                                        Forms\Components\TextInput::make('thumbnail_url')
                                            ->url()
                                            ->maxLength(255)
                                            ->helperText('Enter URL for custom thumbnail or leave empty to use YouTube default'),
                                    ]),
                                Forms\Components\Tabs\Tab::make('Upload Image')
                                    ->schema([
                                        Forms\Components\FileUpload::make('thumbnail_upload')
                                            ->image()
                                            ->disk('r2')
                                            ->directory('videos/thumbnails')
                                            ->visibility('public')
                                            ->imageResizeMode('cover')
                                            ->imageCropAspectRatio('16:9')
                                            ->imageResizeTargetWidth('1280')
                                            ->imageResizeTargetHeight('720')
                                            ->helperText('Upload a custom thumbnail image (16:9 aspect ratio recommended)'),
                                    ]),
                            ])->columnSpanFull(),

                        Forms\Components\TextInput::make('duration')
                            ->maxLength(20)
                            ->helperText('Video duration (e.g., 10:32)'),
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
                Tables\Columns\ImageColumn::make('thumbnail_url')
                    ->label('Thumbnail')
                    ->defaultImageUrl(fn(CryptocurrencyVideo $record): string => $record->thumbnail_url ?? "https://img.youtube.com/vi/{$record->youtube_id}/mqdefault.jpg")
                    ->square(),

                Tables\Columns\TextColumn::make('title')
                    ->searchable()
                    ->sortable()
                    ->weight(FontWeight::Bold)
                    ->limit(50),

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

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Created Date')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\TrashedFilter::make(),
                Tables\Filters\SelectFilter::make('category_id')
                    ->label('Category')
                    ->options(Category::pluck('name', 'id'))
                    ->searchable(),
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
            'index' => Pages\ListCryptocurrencyVideos::route('/'),
            'create' => Pages\CreateCryptocurrencyVideo::route('/create'),
            'edit' => Pages\EditCryptocurrencyVideo::route('/{record}/edit'),
            'view' => Pages\ViewCryptocurrencyVideo::route('/{record}'),
        ];
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->withoutGlobalScopes([
                SoftDeletingScope::class,
            ]);
    }

    public static function mutateFormDataBeforeCreate(array $data): array
    {
        if (!empty($data['thumbnail_upload'])) {
            $data['thumbnail_url'] = config('filesystems.disks.r2.url') . '/' . $data['thumbnail_upload'];
        }

        unset($data['thumbnail_upload']);

        return $data;
    }

    public static function mutateFormDataBeforeUpdate(array $data): array
    {
        if (!empty($data['thumbnail_upload'])) {
            $data['thumbnail_url'] = config('filesystems.disks.r2.url') . '/' . $data['thumbnail_upload'];
        }

        unset($data['thumbnail_upload']);

        return $data;
    }
}
