<?php

namespace App\Filament\Resources;

use App\Filament\Resources\AirdropResource\Pages;
use App\Models\Airdrop;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Str;
use App\Filament\Resources\AirdropResource\RelationManagers;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use Livewire\Features\SupportFileUploads\TemporaryUploadedFile;

class AirdropResource extends Resource
{
    protected static ?string $model = Airdrop::class;

    protected static ?string $navigationIcon = 'heroicon-o-gift';

    protected static ?string $navigationGroup = 'Token';

    protected static ?int $navigationSort = 3;

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
                            ->afterStateUpdated(function ($state, Forms\Set $set) {
                                if ($state !== null && $state !== '') {
                                    $set('slug', Str::slug($state));
                                }
                            }),

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

                        Forms\Components\Select::make('type')
                            ->options([
                                'token' => 'Token',
                                'nft' => 'NFT',
                                'other' => 'Other',
                            ])
                            ->required()
                            ->default('token'),

                        Forms\Components\TextInput::make('blockchain')
                            ->maxLength(50),

                        Forms\Components\TextInput::make('total_supply')
                            ->numeric()
                            ->minValue(0),

                        Forms\Components\TextInput::make('airdrop_qty')
                            ->numeric()
                            ->minValue(0),

                        Forms\Components\TextInput::make('winners_count')
                            ->numeric()
                            ->minValue(0),

                        Forms\Components\TextInput::make('usd_value')
                            ->numeric()
                            ->minValue(0)
                            ->prefix('$'),

                        Forms\Components\TextInput::make('tasks_count')
                            ->numeric()
                            ->integer()
                            ->minValue(0),

                        Forms\Components\Toggle::make('is_featured')
                            ->label('Featured')
                            ->default(false),

                        Forms\Components\DateTimePicker::make('start_date')
                            ->required()
                            ->after('today'),

                        Forms\Components\DateTimePicker::make('end_date')
                            ->after('start_date'),

                        Forms\Components\Select::make('status')
                            ->options([
                                'potential' => 'Potential',
                                'upcoming' => 'Upcoming',
                                'ongoing' => 'Ongoing',
                                'ended' => 'Ended',
                            ])
                            ->required()
                            ->default('potential'),

                        Forms\Components\Select::make('created_by')
                            ->relationship('creator', 'name')
                            ->required()
                            ->searchable()
                            ->preload(),
                    ])->columns(2),

                Forms\Components\Section::make('Media')
                    ->schema([
                        Forms\Components\FileUpload::make('logo_image')
                            ->image()
                            ->required()
                            ->disk('r2')
                            ->visibility('public')
                            ->directory('airdrops')
                            ->maxSize(5120)
                            ->imageResizeMode('cover')
                            ->imageCropAspectRatio('1:1')
                            ->imageResizeTargetWidth('400')
                            ->imageResizeTargetHeight('400')
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

                Tables\Columns\TextColumn::make('type')
                    ->badge()
                    ->color(fn(string $state): string => match ($state) {
                        'token' => 'success',
                        'nft' => 'warning',
                        'other' => 'gray',
                    }),

                Tables\Columns\TextColumn::make('blockchain')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('winners_count')
                    ->numeric()
                    ->sortable(),

                Tables\Columns\TextColumn::make('airdrop_qty')
                    ->numeric()
                    ->sortable(),

                Tables\Columns\TextColumn::make('upvotes_count')
                    ->numeric()
                    ->sortable(),

                Tables\Columns\IconColumn::make('is_featured')
                    ->boolean()
                    ->label('Featured'),

                Tables\Columns\TextColumn::make('start_date')
                    ->dateTime()
                    ->sortable(),

                Tables\Columns\TextColumn::make('end_date')
                    ->dateTime()
                    ->sortable(),

                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->color(fn(string $state): string => match ($state) {
                        'potential' => 'gray',
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
                        'potential' => 'Potential',
                        'upcoming' => 'Upcoming',
                        'ongoing' => 'Ongoing',
                        'ended' => 'Ended',
                    ]),
                Tables\Filters\Filter::make('is_featured')
                    ->toggle()
                    ->label('Featured')
                    ->query(fn($query) => $query->where('is_featured', true)),
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
            'index' => Pages\ListAirdrops::route('/'),
            'create' => Pages\CreateAirdrop::route('/create'),
            'edit' => Pages\EditAirdrop::route('/{record}/edit'),
        ];
    }
}
