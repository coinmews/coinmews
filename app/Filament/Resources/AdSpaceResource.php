<?php

namespace App\Filament\Resources;

use App\Filament\Resources\AdSpaceResource\Pages;
use App\Models\AdSpace;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Str;
use App\Filament\Resources\AdSpaceResource\RelationManagers;
use App\Enums\AdSpaceLocation;
use App\Enums\AdSpaceSize;
use Illuminate\Database\Eloquent\Builder;

class AdSpaceResource extends Resource
{
    protected static ?string $model = AdSpace::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    protected static ?string $navigationGroup = 'Advertising';

    protected static ?int $navigationSort = 4;

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

                        Forms\Components\Textarea::make('description')
                            ->maxLength(500),

                        Forms\Components\Select::make('size')
                            ->options(AdSpaceSize::class)
                            ->required(),

                        Forms\Components\Select::make('location')
                            ->options(AdSpaceLocation::class)
                            ->required(),

                        Forms\Components\Toggle::make('is_premium')
                            ->label('Premium Space')
                            ->default(false),

                        Forms\Components\TextInput::make('price_per_day')
                            ->numeric()
                            ->minValue(0)
                            ->prefix('$'),

                        Forms\Components\Toggle::make('is_active')
                            ->label('Active')
                            ->default(true),
                    ])->columns(2),

                Forms\Components\Section::make('Statistics')
                    ->schema([
                        Forms\Components\TextInput::make('impression_count')
                            ->numeric()
                            ->minValue(0)
                            ->disabled(),

                        Forms\Components\TextInput::make('click_count')
                            ->numeric()
                            ->minValue(0)
                            ->disabled(),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('size')
                    ->badge()
                    ->color('primary'),

                Tables\Columns\TextColumn::make('location')
                    ->badge()
                    ->color(fn(string $state): string => match ($state) {
                        AdSpaceLocation::HEADER->value, AdSpaceLocation::MOBILE_HEADER->value => 'success',
                        AdSpaceLocation::SIDEBAR->value => 'warning',
                        AdSpaceLocation::IN_CONTENT->value, AdSpaceLocation::MOBILE_IN_CONTENT->value => 'info',
                        AdSpaceLocation::POPUP->value, AdSpaceLocation::MOBILE_POPUP->value => 'danger',
                        default => 'gray',
                    }),

                Tables\Columns\IconColumn::make('is_premium')
                    ->boolean()
                    ->sortable(),

                Tables\Columns\TextColumn::make('price_per_day')
                    ->money('usd')
                    ->sortable(),

                Tables\Columns\IconColumn::make('is_active')
                    ->boolean()
                    ->sortable(),

                Tables\Columns\TextColumn::make('impression_count')
                    ->numeric()
                    ->sortable(),

                Tables\Columns\TextColumn::make('click_count')
                    ->numeric()
                    ->sortable(),

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
                Tables\Filters\SelectFilter::make('size')
                    ->options(AdSpaceSize::class),

                Tables\Filters\SelectFilter::make('location')
                    ->options(AdSpaceLocation::class),

                Tables\Filters\TernaryFilter::make('is_premium')
                    ->label('Premium Space'),
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
            RelationManagers\CampaignsRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListAdSpaces::route('/'),
            'create' => Pages\CreateAdSpace::route('/create'),
            'edit' => Pages\EditAdSpace::route('/{record}/edit'),
        ];
    }

    public static function getEloquentQuery(): Builder
    {
        $query = parent::getEloquentQuery();

        // Only admins can see ad spaces
        if (!auth()->guard()->user()->isAdmin()) {
            $query->where('id', 0); // This effectively hides all ad spaces
        }

        return $query;
    }
}
