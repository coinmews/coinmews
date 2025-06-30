<?php

namespace App\Filament\Resources;

use App\Filament\Resources\EventResource\Pages;
use App\Models\Event;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Str;
use App\Filament\Resources\EventResource\RelationManagers;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use Livewire\Features\SupportFileUploads\TemporaryUploadedFile;

class EventResource extends Resource
{
    protected static ?string $model = Event::class;

    protected static ?string $navigationIcon = 'heroicon-o-calendar';

    protected static ?string $navigationGroup = 'Events';

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

                        Forms\Components\FileUpload::make('banner_image')
                            ->image()
                            ->required()
                            ->disk('r2')
                            ->visibility('public')
                            ->directory('events')
                            ->maxSize(5120)
                            ->imageResizeMode('cover')
                            ->imageCropAspectRatio('1200:630')
                            ->imageResizeTargetWidth('1200')
                            ->imageResizeTargetHeight('630')
                            ->imageResizeUpscale(false)
                            ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp'])
                            ->storeFileNamesIn('original_filename')
                            ->getUploadedFileNameForStorageUsing(
                                fn(TemporaryUploadedFile $file): string => str()->slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME))
                                    . '_'
                                    . uniqid()
                                    . '.'
                                    . $file->getClientOriginalExtension()
                            )
                            ->helperText('This image will be used as banner, thumbnail, and social media preview.')
                            ->columnSpanFull(),

                        Forms\Components\RichEditor::make('description')
                            ->required()
                            ->columnSpanFull(),

                        Forms\Components\Select::make('type')
                            ->options([
                                'crypto_event' => 'Crypto Event',
                                'web3_event' => 'Web3 Event',
                                'community_event' => 'Community Event',
                                'ai_event' => 'AI Event',
                            ])
                            ->required(),

                        Forms\Components\DateTimePicker::make('start_date')
                            ->required()
                            ->after('today'),

                        Forms\Components\DateTimePicker::make('end_date')
                            ->required()
                            ->after('start_date'),

                        Forms\Components\TextInput::make('location')
                            ->maxLength(255)
                            ->requiredIf('is_virtual', false),

                        Forms\Components\Toggle::make('is_virtual')
                            ->label('Virtual Event')
                            ->default(false),

                        Forms\Components\TextInput::make('virtual_link')
                            ->url()
                            ->requiredIf('is_virtual', true),

                        Forms\Components\TextInput::make('registration_link')
                            ->url(),

                        Forms\Components\TextInput::make('max_participants')
                            ->numeric()
                            ->minValue(0),

                        Forms\Components\Select::make('status')
                            ->options([
                                'upcoming' => 'Upcoming',
                                'ongoing' => 'Ongoing',
                                'completed' => 'Completed',
                                'cancelled' => 'Cancelled',
                            ])
                            ->required()
                            ->default('upcoming'),

                        Forms\Components\TextInput::make('meta_title')
                            ->maxLength(255)
                            ->helperText('Leave empty to use event title'),

                        Forms\Components\Textarea::make('meta_description')
                            ->maxLength(160)
                            ->helperText('Leave empty to use event description'),

                        Forms\Components\Select::make('organizer_id')
                            ->relationship('organizer', 'name')
                            ->required()
                            ->searchable()
                            ->preload(),
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

                Tables\Columns\TextColumn::make('type')
                    ->badge()
                    ->color(fn(string $state): string => match ($state) {
                        'crypto_event' => 'primary',
                        'web3_event' => 'success',
                        'community_event' => 'warning',
                        'ai_event' => 'info',
                    }),

                Tables\Columns\TextColumn::make('start_date')
                    ->dateTime()
                    ->sortable(),

                Tables\Columns\TextColumn::make('end_date')
                    ->dateTime()
                    ->sortable(),

                Tables\Columns\TextColumn::make('location')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\IconColumn::make('is_virtual')
                    ->boolean(),

                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->color(fn(string $state): string => match ($state) {
                        'upcoming' => 'info',
                        'ongoing' => 'success',
                        'completed' => 'gray',
                        'cancelled' => 'danger',
                    }),

                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

                Tables\Columns\TextColumn::make('deleted_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('type')
                    ->options([
                        'crypto_event' => 'Crypto Event',
                        'web3_event' => 'Web3 Event',
                        'community_event' => 'Community Event',
                        'ai_event' => 'AI Event',
                    ]),

                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'upcoming' => 'Upcoming',
                        'ongoing' => 'Ongoing',
                        'completed' => 'Completed',
                        'cancelled' => 'Cancelled',
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
            // Remove MediaRelationManager
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListEvents::route('/'),
            'create' => Pages\CreateEvent::route('/create'),
            'edit' => Pages\EditEvent::route('/{record}/edit'),
        ];
    }
}
