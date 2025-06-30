<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PresaleResource\Pages;
use App\Models\Presale;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Str;
use App\Filament\Resources\PresaleResource\RelationManagers;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use Livewire\Features\SupportFileUploads\TemporaryUploadedFile;

class PresaleResource extends Resource
{
    protected static ?string $model = Presale::class;

    protected static ?string $navigationIcon = 'heroicon-o-currency-dollar';

    protected static ?string $navigationGroup = 'Token';

    protected static ?int $navigationSort = 2;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Basic Information')
                    ->schema([
                        Forms\Components\TextInput::make('name')
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

                        Forms\Components\RichEditor::make('description')
                            ->columnSpanFull(),

                        Forms\Components\TextInput::make('token_symbol')
                            ->required()
                            ->maxLength(10),

                        Forms\Components\TextInput::make('total_supply')
                            ->numeric()
                            ->minValue(0),

                        Forms\Components\TextInput::make('tokens_for_sale')
                            ->numeric()
                            ->minValue(0),

                        Forms\Components\TextInput::make('percentage_of_supply')
                            ->numeric()
                            ->minValue(0)
                            ->maxValue(100)
                            ->step(0.01),

                        Forms\Components\TextInput::make('token_price')
                            ->numeric()
                            ->minValue(0)
                            ->required(),

                        Forms\Components\TextInput::make('token_price_currency')
                            ->default('USDT')
                            ->maxLength(10),

                        Forms\Components\TextInput::make('exchange_rate')
                            ->maxLength(255),

                        Forms\Components\TextInput::make('soft_cap')
                            ->numeric()
                            ->minValue(0),

                        Forms\Components\TextInput::make('hard_cap')
                            ->numeric()
                            ->minValue(0),

                        Forms\Components\TextInput::make('personal_cap')
                            ->numeric()
                            ->minValue(0),

                        Forms\Components\TextInput::make('fundraising_goal')
                            ->numeric()
                            ->minValue(0),

                        Forms\Components\Select::make('stage')
                            ->options([
                                'ICO' => 'ICO',
                                'IDO' => 'IDO',
                                'IEO' => 'IEO',
                                'Presale' => 'Presale',
                                'Privatesale' => 'Privatesale',
                            ])
                            ->required()
                            ->default('ICO'),

                        Forms\Components\TextInput::make('launchpad')
                            ->maxLength(255),

                        Forms\Components\DateTimePicker::make('start_date')
                            ->required()
                            ->after('today'),

                        Forms\Components\DateTimePicker::make('end_date')
                            ->required()
                            ->after('start_date'),

                        Forms\Components\Select::make('status')
                            ->options([
                                'upcoming' => 'Upcoming',
                                'ongoing' => 'Ongoing',
                                'ended' => 'Ended',
                            ])
                            ->required()
                            ->default('upcoming'),

                        Forms\Components\Select::make('created_by')
                            ->relationship('creator', 'name')
                            ->required()
                            ->searchable()
                            ->preload(),
                    ])->columns(2),

                Forms\Components\Section::make('Website & Resources')
                    ->schema([
                        Forms\Components\TextInput::make('website_url')
                            ->url()
                            ->maxLength(255),

                        Forms\Components\TextInput::make('whitepaper_url')
                            ->url()
                            ->maxLength(255),

                        Forms\Components\TextInput::make('project_category')
                            ->maxLength(255),

                        Forms\Components\TextInput::make('contract_address')
                            ->maxLength(255),

                        Forms\Components\KeyValue::make('social_media_links')
                            ->keyLabel('Platform')
                            ->valueLabel('URL')
                            ->columnSpanFull(),
                    ])->columns(2),

                Forms\Components\Section::make('Media')
                    ->schema([
                        Forms\Components\FileUpload::make('logo_image')
                            ->image()
                            ->required()
                            ->disk('r2')
                            ->visibility('public')
                            ->directory('presales/logos')
                            ->maxSize(2048)
                            ->imageResizeMode('contain')
                            ->imageCropAspectRatio('1:1')
                            ->imageResizeTargetWidth('512')
                            ->imageResizeTargetHeight('512')
                            ->imageResizeUpscale(false)
                            ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'])
                            ->storeFileNamesIn('original_filename')
                            ->getUploadedFileNameForStorageUsing(
                                fn(TemporaryUploadedFile $file): string => str()->slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME))
                                    . '_'
                                    . uniqid()
                                    . '.'
                                    . $file->getClientOriginalExtension()
                            ),
                    ])->columns(1),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('logo_image')
                    ->label('Logo')
                    ->disk('r2')
                    ->circular()
                    ->size(40)
                    ->defaultImageUrl(url('/default-logo.png')),

                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('token_symbol')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('stage')
                    ->badge()
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('launchpad')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('upvotes_count')
                    ->sortable()
                    ->label('Upvotes'),

                Tables\Columns\TextColumn::make('token_price')
                    ->money($state = fn(Presale $record): string => $record->token_price_currency)
                    ->sortable(),

                Tables\Columns\TextColumn::make('fundraising_goal')
                    ->money('USD')
                    ->sortable(),

                Tables\Columns\TextColumn::make('start_date')
                    ->dateTime()
                    ->sortable(),

                Tables\Columns\TextColumn::make('end_date')
                    ->dateTime()
                    ->sortable(),

                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->color(fn(string $state): string => match ($state) {
                        'upcoming' => 'info',
                        'ongoing' => 'success',
                        'ended' => 'warning',
                    }),

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
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'upcoming' => 'Upcoming',
                        'ongoing' => 'Ongoing',
                        'ended' => 'Ended',
                    ]),

                Tables\Filters\SelectFilter::make('stage')
                    ->options([
                        'ICO' => 'ICO',
                        'IDO' => 'IDO',
                        'IEO' => 'IEO',
                        'Presale' => 'Presale',
                        'Privatesale' => 'Privatesale',
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
            //  
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListPresales::route('/'),
            'create' => Pages\CreatePresale::route('/create'),
            'edit' => Pages\EditPresale::route('/{record}/edit'),
        ];
    }
}
