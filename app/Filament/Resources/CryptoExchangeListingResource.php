<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CryptoExchangeListingResource\Pages;
use App\Filament\Resources\CryptoExchangeListingResource\RelationManagers;
use App\Models\CryptoExchangeListing;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Filament\Support\Enums\FontWeight;
use Livewire\Features\SupportFileUploads\TemporaryUploadedFile;

class CryptoExchangeListingResource extends Resource
{
    protected static ?string $model = CryptoExchangeListing::class;

    protected static ?string $navigationIcon = 'heroicon-o-currency-dollar';

    protected static ?string $navigationGroup = 'Crypto';

    protected static ?int $navigationSort = 1;

    protected static ?string $recordTitleAttribute = 'coin_name';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Basic Information')
                    ->schema([
                        Forms\Components\TextInput::make('coin_name')
                            ->required()
                            ->maxLength(255)
                            ->live(onBlur: true)
                            ->afterStateUpdated(function (string $operation, $state, Forms\Set $set) {
                                if ($operation === 'create') {
                                    $set('slug', Str::slug($state));
                                }
                            }),

                        Forms\Components\TextInput::make('coin_symbol')
                            ->required()
                            ->maxLength(20),

                        Forms\Components\TextInput::make('slug')
                            ->required()
                            ->maxLength(255)
                            ->unique(ignoreRecord: true),

                        Forms\Components\FileUpload::make('coin_logo')
                            ->image()
                            ->disk('r2')
                            ->directory('crypto/coins')
                            ->visibility('public')
                            ->imageResizeMode('cover')
                            ->imageCropAspectRatio('1:1')
                            ->imageResizeTargetWidth('150')
                            ->imageResizeTargetHeight('150')
                            ->maxSize(1024) // 1MB max size
                            ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp'])
                            ->helperText('Upload a square image (JPG, PNG, or WebP) up to 1MB')
                            ->afterStateUpdated(function (string $operation, $state) {
                                if ($operation === 'create' || $operation === 'edit') {
                                    // Log the upload state for debugging
                                    Log::info('Coin logo upload state: ' . json_encode($state));
                                }
                            }),

                        Forms\Components\TextInput::make('exchange_name')
                            ->required()
                            ->maxLength(255),

                        Forms\Components\FileUpload::make('exchange_logo')
                            ->image()
                            ->disk('r2')
                            ->directory('crypto/exchanges')
                            ->visibility('public')
                            ->imageResizeMode('cover')
                            ->imageCropAspectRatio('1:1')
                            ->imageResizeTargetWidth('150')
                            ->imageResizeTargetHeight('150')
                            ->maxSize(1024) // 1MB max size
                            ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp'])
                            ->helperText('Upload a square image (JPG, PNG, or WebP) up to 1MB')
                            ->afterStateUpdated(function (string $operation, $state) {
                                if ($operation === 'create' || $operation === 'edit') {
                                    // Log the upload state for debugging
                                    Log::info('Exchange logo upload state: ' . json_encode($state));
                                }
                            }),

                        Forms\Components\Select::make('listing_type')
                            ->label('Type')
                            ->options([
                                'listing' => 'Listing',
                                'delisting' => 'Delisting',
                            ])
                            ->default('listing')
                            ->required(),

                        Forms\Components\DateTimePicker::make('listing_date')
                            ->required()
                            ->seconds(false),

                        Forms\Components\TextInput::make('trading_pairs')
                            ->maxLength(255)
                            ->placeholder('e.g., BTC/USDT, ETH/USDT'),

                        Forms\Components\TextInput::make('already_listing_count')
                            ->numeric()
                            ->default(0)
                            ->required(),
                    ])
                    ->columns(2),

                Forms\Components\Section::make('URLs')
                    ->schema([
                        Forms\Components\TextInput::make('website_url')
                            ->label('Website URL')
                            ->url()
                            ->maxLength(255),

                        Forms\Components\TextInput::make('explorer_url')
                            ->label('Blockchain Explorer URL')
                            ->url()
                            ->maxLength(255),
                    ])
                    ->columns(2),

                Forms\Components\Section::make('Banner Image')
                    ->schema([
                        Forms\Components\FileUpload::make('banner_image')
                            ->image()
                            ->disk('r2')
                            ->directory('crypto/banners')
                            ->visibility('public')
                            ->imageResizeMode('cover')
                            ->imageCropAspectRatio('16:9')
                            ->imageResizeTargetWidth('1200')
                            ->imageResizeTargetHeight('630')
                            ->columnSpanFull(),
                    ]),

                Forms\Components\Section::make('Content')
                    ->schema([
                        Forms\Components\RichEditor::make('description')
                            ->label('Brief Description')
                            ->columnSpanFull(),

                        Forms\Components\RichEditor::make('about_project')
                            ->label('About Project')
                            ->columnSpanFull(),

                        Forms\Components\RichEditor::make('what_happens')
                            ->label('What Happens After Listing/Delisting')
                            ->columnSpanFull(),

                        Forms\Components\RichEditor::make('final_thoughts')
                            ->label('Final Thoughts')
                            ->columnSpanFull(),
                    ]),

                Forms\Components\Section::make('Status')
                    ->schema([
                        Forms\Components\Toggle::make('is_featured')
                            ->label('Featured')
                            ->default(false),

                        Forms\Components\Toggle::make('is_published')
                            ->label('Published')
                            ->default(true),
                    ])
                    ->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('listing_date', 'desc')
            ->columns([
                Tables\Columns\TextColumn::make('listing_date')
                    ->label('Date / Time')
                    ->html()
                    ->getStateUsing(fn(CryptoExchangeListing $record): string => $record->formatted_listing_date)
                    ->sortable(),

                Tables\Columns\ImageColumn::make('coin_logo_url')
                    ->label('')
                    ->size(32)
                    ->circular()
                    ->defaultImageUrl(function () {
                        return asset('images/placeholder-coin.png');
                    }),

                Tables\Columns\TextColumn::make('coin_name')
                    ->label('Coin Name')
                    ->description(fn(CryptoExchangeListing $record): string => $record->coin_symbol)
                    ->searchable()
                    ->sortable(),

                Tables\Columns\ImageColumn::make('exchange_logo_url')
                    ->label('')
                    ->size(32)
                    ->circular()
                    ->defaultImageUrl(function () {
                        return asset('images/placeholder-exchange.png');
                    }),

                Tables\Columns\TextColumn::make('exchange_name')
                    ->label('Exchange')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('listing_type')
                    ->label('Listing/Delisting')
                    ->badge()
                    ->color(fn(string $state): string => match ($state) {
                        'listing' => 'success',
                        'delisting' => 'danger',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn(string $state): string => ucfirst($state))
                    ->sortable(),

                Tables\Columns\TextColumn::make('already_listing_count')
                    ->label('Already Listing')
                    ->sortable()
                    ->alignCenter(),

                Tables\Columns\IconColumn::make('is_featured')
                    ->label('Featured')
                    ->boolean()
                    ->sortable(),

                Tables\Columns\IconColumn::make('is_published')
                    ->label('Published')
                    ->boolean()
                    ->sortable(),

                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('listing_type')
                    ->options([
                        'listing' => 'Listing',
                        'delisting' => 'Delisting',
                    ]),

                Tables\Filters\SelectFilter::make('exchange_name')
                    ->label('Exchange')
                    ->options(function () {
                        return CryptoExchangeListing::pluck('exchange_name', 'exchange_name')->toArray();
                    })
                    ->searchable(),

                Tables\Filters\TernaryFilter::make('is_featured')
                    ->label('Featured'),

                Tables\Filters\TernaryFilter::make('is_published')
                    ->label('Published'),

                Tables\Filters\TrashedFilter::make(),
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
                        ->action(fn($records) => $records->each->update(['is_featured' => true])),
                    Tables\Actions\BulkAction::make('publishSelected')
                        ->label('Publish Selected')
                        ->icon('heroicon-o-eye')
                        ->action(fn($records) => $records->each->update(['is_published' => true])),
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
            'index' => Pages\ListCryptoExchangeListings::route('/'),
            'create' => Pages\CreateCryptoExchangeListing::route('/create'),
            'edit' => Pages\EditCryptoExchangeListing::route('/{record}/edit'),
            'view' => Pages\ViewCryptoExchangeListing::route('/{record}'),
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
