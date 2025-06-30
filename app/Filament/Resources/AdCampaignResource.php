<?php

namespace App\Filament\Resources;

use App\Filament\Resources\AdCampaignResource\Pages;
use App\Models\AdCampaign;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use App\Filament\Resources\AdCampaignResource\RelationManagers;
use Illuminate\Database\Eloquent\Builder;

class AdCampaignResource extends Resource
{
    protected static ?string $model = AdCampaign::class;

    protected static ?string $navigationIcon = 'heroicon-o-megaphone';

    protected static ?string $navigationGroup = 'Advertising';

    protected static ?int $navigationSort = 3;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Campaign Details')
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->required()
                            ->maxLength(255),

                        Forms\Components\Select::make('ad_space_id')
                            ->relationship('adSpace', 'name')
                            ->required()
                            ->searchable()
                            ->preload(),

                        Forms\Components\Select::make('advertiser_id')
                            ->relationship('advertiser', 'name')
                            ->required()
                            ->searchable()
                            ->preload(),

                        Forms\Components\RichEditor::make('ad_content')
                            ->required(),

                        Forms\Components\FileUpload::make('ad_image')
                            ->image()
                            ->imageEditor(),

                        Forms\Components\TextInput::make('ad_link')
                            ->url()
                            ->maxLength(255),

                        Forms\Components\DateTimePicker::make('start_date')
                            ->required(),

                        Forms\Components\DateTimePicker::make('end_date')
                            ->required()
                            ->after('start_date'),

                        Forms\Components\Select::make('status')
                            ->options([
                                'pending' => 'Pending',
                                'active' => 'Active',
                                'paused' => 'Paused',
                                'completed' => 'Completed',
                                'cancelled' => 'Cancelled',
                            ])
                            ->required(),

                        Forms\Components\TextInput::make('budget')
                            ->numeric()
                            ->minValue(0)
                            ->required(),

                        Forms\Components\TextInput::make('spent')
                            ->numeric()
                            ->minValue(0)
                            ->disabled(),

                        Forms\Components\TextInput::make('ctr')
                            ->numeric()
                            ->minValue(0)
                            ->maxValue(100)
                            ->disabled(),

                        Forms\Components\Toggle::make('is_approved')
                            ->disabled(),

                        Forms\Components\DateTimePicker::make('approved_at')
                            ->disabled(),

                        Forms\Components\Select::make('approved_by')
                            ->relationship('approver', 'name')
                            ->disabled(),
                    ])->columns(2),

                Forms\Components\Section::make('Targeting Rules')
                    ->schema([
                        Forms\Components\KeyValue::make('targeting_rules')
                            ->keyLabel('Rule')
                            ->valueLabel('Value'),
                    ]),

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

                Tables\Columns\TextColumn::make('adSpace.name')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('advertiser.name')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->color(fn(string $state): string => match ($state) {
                        'pending' => 'gray',
                        'active' => 'success',
                        'paused' => 'warning',
                        'completed' => 'info',
                        'cancelled' => 'danger',
                    }),

                Tables\Columns\TextColumn::make('budget')
                    ->money('usd')
                    ->sortable(),

                Tables\Columns\TextColumn::make('spent')
                    ->money('usd')
                    ->sortable(),

                Tables\Columns\TextColumn::make('impression_count')
                    ->numeric()
                    ->sortable(),

                Tables\Columns\TextColumn::make('click_count')
                    ->numeric()
                    ->sortable(),

                Tables\Columns\TextColumn::make('ctr')
                    ->numeric(2)
                    ->suffix('%')
                    ->sortable(),

                Tables\Columns\IconColumn::make('is_approved')
                    ->boolean(),

                Tables\Columns\TextColumn::make('start_date')
                    ->dateTime()
                    ->sortable(),

                Tables\Columns\TextColumn::make('end_date')
                    ->dateTime()
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
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'active' => 'Active',
                        'paused' => 'Paused',
                        'completed' => 'Completed',
                        'cancelled' => 'Cancelled',
                    ]),

                Tables\Filters\SelectFilter::make('ad_space')
                    ->relationship('adSpace', 'name'),

                Tables\Filters\SelectFilter::make('advertiser')
                    ->relationship('advertiser', 'name'),
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
            RelationManagers\AdSpaceRelationManager::class,
            RelationManagers\AdvertiserRelationManager::class,
            RelationManagers\ApproverRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListAdCampaigns::route('/'),
            'create' => Pages\CreateAdCampaign::route('/create'),
            'edit' => Pages\EditAdCampaign::route('/{record}/edit'),
        ];
    }

    public static function getEloquentQuery(): Builder
    {
        $query = parent::getEloquentQuery();
        $user = auth()->guard()->user();

        // Admins can see all campaigns
        if ($user->isAdmin()) {
            return $query;
        }

        // Regular users can only see their own campaigns
        return $query->where('advertiser_id', $user->id);
    }
}
