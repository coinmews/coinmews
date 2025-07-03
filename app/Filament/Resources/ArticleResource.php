<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ArticleResource\Pages;
use App\Models\Article;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Str;
use App\Filament\Resources\ArticleResource\RelationManagers;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use Livewire\Features\SupportFileUploads\TemporaryUploadedFile;

class ArticleResource extends Resource
{
    protected static ?string $model = Article::class;

    protected static ?string $navigationIcon = 'heroicon-o-document-text';

    protected static ?string $navigationGroup = 'Content';

    protected static ?int $navigationSort = 1;

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
                            ->afterStateUpdated(fn(string $state, Forms\Set $set) =>
                            $set('slug', Str::slug($state))),

                        Forms\Components\TextInput::make('slug')
                            ->required()
                            ->maxLength(255)
                            ->unique(ignoreRecord: true)
                            ->regex('/^[a-z0-9-]+$/')
                            ->helperText('Only lowercase letters, numbers, and hyphens are allowed.'),

                        Forms\Components\Select::make('content_type')
                            ->options([
                                'news' => 'News',
                                'blog' => 'Blog',
                                'press_release' => 'Press Release',
                                'sponsored' => 'Sponsored',
                                'price_prediction' => 'Price Prediction',
                                'guest_post' => 'Guest Post',
                                'research_report' => 'Research Report',
                                'web3_bulletin' => 'Web3 Bulletin',
                                'web_story' => 'Web Story',
                                'short_news' => 'Short News',
                            ])
                            ->required()
                            ->live(),

                        Forms\Components\RichEditor::make('content')
                            ->required()
                            ->columnSpanFull(),

                        Forms\Components\TextInput::make('excerpt')
                            ->maxLength(255),

                        Forms\Components\Select::make('category_id')
                            ->relationship('category', 'name')
                            ->required()
                            ->searchable()
                            ->preload(),

                        Forms\Components\Select::make('author_id')
                            ->relationship('author', 'name')
                            ->required()
                            ->searchable()
                            ->preload()
                            ->live()
                            ->afterStateUpdated(function ($state, Forms\Set $set) {
                                if (!$state) return;

                                $author = \App\Models\User::find($state);
                                if (!$author) return;

                                $set('author_bio', $author->bio ?? null);
                            }),

                        Forms\Components\Select::make('tags')
                            ->relationship('tags', 'name')
                            ->multiple()
                            ->searchable()
                            ->preload(),

                        Forms\Components\Toggle::make('is_featured')
                            ->label('Featured Article'),

                        Forms\Components\Toggle::make('is_breaking_news')
                            ->label('Breaking News'),

                        Forms\Components\Select::make('status')
                            ->options([
                                'draft' => 'Draft',
                                'published' => 'Published',
                                'featured' => 'Featured',
                            ])
                            ->default('draft')
                            ->required()
                            ->live()
                            ->afterStateUpdated(function (string $state, string $old, Forms\Set $set, ?Model $record) {
                                if (
                                    in_array($state, ['published', 'featured']) &&
                                    $old !== $state &&
                                    (!$record || !$record->published_at)
                                ) {
                                    $set('published_at', now());
                                }
                            }),

                        Forms\Components\DateTimePicker::make('published_at')
                            ->label('Published Date')
                            ->helperText('Leave empty to automatically set when published'),
                    ])->columns(2),

                // News & Short News Fields
                Forms\Components\Section::make('News Details')
                    ->schema([
                        Forms\Components\TextInput::make('source'),
                        Forms\Components\TextInput::make('location'),
                        Forms\Components\Toggle::make('is_time_sensitive'),
                    ])
                    ->columns(3)
                    ->visible(fn(Forms\Get $get): bool => in_array($get('content_type'), ['news', 'short_news'])),

                // Blog & Guest Post Fields
                Forms\Components\Section::make('Blog Details')
                    ->schema([
                        Forms\Components\Textarea::make('author_bio'),
                        Forms\Components\TextInput::make('reading_time')
                            ->numeric()
                            ->suffix('minutes'),
                    ])
                    ->columns(2)
                    ->visible(fn(Forms\Get $get): bool => in_array($get('content_type'), ['blog', 'guest_post'])),

                // Price Prediction & Research Report Fields
                Forms\Components\Section::make('Analysis Details')
                    ->schema([
                        Forms\Components\TextInput::make('price_target_low')
                            ->numeric()
                            ->prefix('$'),
                        Forms\Components\TextInput::make('price_target_high')
                            ->numeric()
                            ->prefix('$'),
                        Forms\Components\TextInput::make('time_horizon'),
                        Forms\Components\Textarea::make('methodology'),
                        Forms\Components\KeyValue::make('data_sources')
                            ->label('Data Sources'),
                        Forms\Components\Textarea::make('risk_factors'),
                    ])
                    ->columns(3)
                    ->visible(fn(Forms\Get $get): bool => in_array($get('content_type'), ['price_prediction', 'research_report'])),

                // Press Release & Web3 Bulletin Fields
                Forms\Components\Section::make('Company Details')
                    ->schema([
                        Forms\Components\TextInput::make('company_name'),
                        Forms\Components\TextInput::make('contact_email')
                            ->email(),
                        Forms\Components\TextInput::make('contact_phone'),
                        Forms\Components\KeyValue::make('official_links')
                            ->label('Official Links'),
                    ])
                    ->columns(2)
                    ->visible(fn(Forms\Get $get): bool => in_array($get('content_type'), ['press_release', 'web3_bulletin'])),

                // Web Story Fields
                Forms\Components\Section::make('Story Details')
                    ->schema([
                        Forms\Components\Toggle::make('is_vertical')
                            ->label('Vertical Story')
                            ->default(true)
                            ->helperText('Instagram/Facebook style vertical stories'),

                        Forms\Components\TextInput::make('story_duration')
                            ->numeric()
                            ->suffix('seconds'),

                        Forms\Components\Repeater::make('story_slides')
                            ->schema([
                                Forms\Components\FileUpload::make('image')
                                    ->image()
                                    ->required()
                                    ->directory('story-slides')
                                    ->imageResizeMode('cover')
                                    ->imageCropAspectRatio(fn($get) => $get('../../is_vertical') ? '9:16' : '16:9')
                                    ->imageResizeTargetWidth(fn($get) => $get('../../is_vertical') ? '1080' : '1920')
                                    ->imageResizeTargetHeight(fn($get) => $get('../../is_vertical') ? '1920' : '1080'),

                                Forms\Components\RichEditor::make('content')
                                    ->required()
                                    ->toolbarButtons([
                                        'bold',
                                        'italic',
                                        'link',
                                    ]),

                                Forms\Components\TextInput::make('duration')
                                    ->numeric()
                                    ->suffix('seconds')
                                    ->default(5),

                                Forms\Components\Repeater::make('interactive_elements')
                                    ->label('Interactive Elements')
                                    ->schema([
                                        Forms\Components\Select::make('type')
                                            ->options([
                                                'button' => 'Call to Action Button',
                                                'poll' => 'Poll',
                                                'link' => 'Swipe-up Link',
                                                'mention' => 'Mention/Tag',
                                                'location' => 'Location Tag',
                                            ])
                                            ->required()
                                            ->live(),

                                        Forms\Components\TextInput::make('text')
                                            ->required()
                                            ->label('Display Text'),

                                        Forms\Components\TextInput::make('url')
                                            ->label('URL/Link')
                                            ->url()
                                            ->visible(fn(Forms\Get $get) => in_array($get('type'), ['button', 'link'])),

                                        Forms\Components\Repeater::make('poll_options')
                                            ->schema([
                                                Forms\Components\TextInput::make('option')
                                                    ->required(),
                                            ])
                                            ->visible(fn(Forms\Get $get) => $get('type') === 'poll')
                                            ->addActionLabel('Add Poll Option')
                                            ->minItems(2)
                                            ->maxItems(4),
                                    ])
                                    ->addActionLabel('Add Interactive Element')
                                    ->collapsible(),
                            ])
                            ->addActionLabel('Add Slide')
                            ->defaultItems(1)
                            ->reorderableWithButtons()
                            ->collapsible()
                            ->itemLabel(fn(array $state): ?string => $state['content'] ? Str::limit(strip_tags($state['content']), 30) : null),

                        Forms\Components\Placeholder::make('slides_count')
                            ->label('Total Slides')
                            ->content(fn($record) => $record?->slides_count ?? 0),
                    ])
                    ->visible(fn(Forms\Get $get): bool => $get('content_type') === 'web_story')
                    ->columns(1),

                Forms\Components\Section::make('Media')
                    ->schema([
                        Forms\Components\FileUpload::make('banner_image')
                            ->label('Banner Image')
                            ->required()
                            ->disk('r2')
                            ->visibility('public')
                            ->directory('articles')
                            ->maxSize(10240)
                            ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
                            ->storeFileNamesIn('original_filename')
                            ->getUploadedFileNameForStorageUsing(
                                fn (TemporaryUploadedFile $file): string => 
                                    str()->slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)) . 
                                    '_' . 
                                    uniqid() . 
                                    '.' . 
                                    strtolower($file->getClientOriginalExtension())
                            )
                            ->helperText('Upload a high-quality image (JPEG, PNG, WebP, or AVIF). Recommended size: 1200x630px. Max size: 10MB.')
                            ->downloadable()
                            ->openable()
                            ->previewable(true)
                            ->imagePreviewHeight('200px'),
                    ])->columns(1),

                Forms\Components\Section::make('SEO')
                    ->schema([
                        Forms\Components\TextInput::make('meta_title')
                            ->maxLength(255),
                        Forms\Components\Textarea::make('meta_description')
                            ->maxLength(500),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('banner_image')
                    ->label('Banner')
                    ->disk('r2')
                    ->size(40)
                    ->defaultImageUrl(url('/default-banner.png')),

                Tables\Columns\TextColumn::make('title')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('content_type')
                    ->badge()
                    ->color(fn(string $state): string => match ($state) {
                        'news' => 'success',
                        'blog' => 'info',
                        'press_release' => 'warning',
                        'sponsored' => 'primary',
                        'price_prediction' => 'success',
                        'guest_post' => 'info',
                        'research_report' => 'warning',
                        'web3_bulletin' => 'primary',
                        'web_story' => 'info',
                        'short_news' => 'success',
                    }),

                Tables\Columns\TextColumn::make('author.name')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('category.name')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\IconColumn::make('is_featured')
                    ->boolean()
                    ->sortable(),

                Tables\Columns\IconColumn::make('is_breaking_news')
                    ->boolean()
                    ->sortable(),

                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->color(fn(string $state): string => match ($state) {
                        'draft' => 'gray',
                        'published' => 'success',
                        'featured' => 'warning',
                    })
                    ->sortable(),

                Tables\Columns\TextColumn::make('view_count')
                    ->sortable(),

                Tables\Columns\TextColumn::make('published_at')
                    ->dateTime()
                    ->sortable(),
            ])
            ->defaultSort('published_at', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('content_type')
                    ->options([
                        'news' => 'News',
                        'blog' => 'Blog',
                        'press_release' => 'Press Release',
                        'sponsored' => 'Sponsored',
                        'price_prediction' => 'Price Prediction',
                        'guest_post' => 'Guest Post',
                        'research_report' => 'Research Report',
                        'web3_bulletin' => 'Web3 Bulletin',
                        'web_story' => 'Web Story',
                        'short_news' => 'Short News',
                    ]),
                Tables\Filters\SelectFilter::make('category')
                    ->relationship('category', 'name'),
                Tables\Filters\TernaryFilter::make('is_featured')
                    ->label('Featured'),
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'draft' => 'Draft',
                        'published' => 'Published',
                        'featured' => 'Featured',
                    ]),
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

    public static function getRelations(): array
    {
        return [
            RelationManagers\TagsRelationManager::class,
            RelationManagers\AuthorRelationManager::class,
            RelationManagers\CommentsRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListArticles::route('/'),
            'create' => Pages\CreateArticle::route('/create'),
            'edit' => Pages\EditArticle::route('/{record}/edit'),
        ];
    }

    public static function getWidgets(): array
    {
        return [
            ArticleResource\Widgets\ArticleStatsOverview::class,
        ];
    }
}
