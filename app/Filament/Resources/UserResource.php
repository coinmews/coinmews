<?php

namespace App\Filament\Resources;

use App\Filament\Resources\UserResource\Pages;
use App\Models\User;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Facades\Hash;
use App\Filament\Resources\UserResource\RelationManagers;

class UserResource extends Resource
{
    protected static ?string $model = User::class;

    protected static ?string $navigationIcon = 'heroicon-o-users';

    protected static ?string $navigationGroup = 'User Management';

    protected static ?int $navigationSort = 5;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Basic Information')
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('email')
                            ->email()
                            ->required()
                            ->maxLength(255)
                            ->unique(ignoreRecord: true),
                        Forms\Components\TextInput::make('username')
                            ->required()
                            ->maxLength(255)
                            ->unique(ignoreRecord: true),
                        Forms\Components\TextInput::make('phone')
                            ->nullable()
                            ->maxLength(15),
                        Forms\Components\TextInput::make('password')
                            ->password()
                            ->dehydrateStateUsing(fn($state) => Hash::make($state))
                            ->dehydrated(fn($state) => filled($state))
                            ->required(fn(string $operation): bool => $operation === 'create'),
                    ])->columns(2),

                Forms\Components\Section::make('Profile Information')
                    ->schema([
                        Forms\Components\Textarea::make('bio')
                            ->maxLength(500)
                            ->columnSpanFull(),
                        Forms\Components\TextInput::make('website')
                            ->url()
                            ->maxLength(255),
                        Forms\Components\DatePicker::make('birthday'),
                        Forms\Components\TextInput::make('location')
                            ->maxLength(255),
                        Forms\Components\FileUpload::make('avatar')
                            ->image()
                            ->nullable()
                            ->maxSize(1024) // Limit to 1MB
                            ->disk('r2') // Assuming you're using the public disk
                            ->directory('avatars'),
                    ])->columns(2),

                Forms\Components\Section::make('Social Media')
                    ->schema([
                        Forms\Components\TextInput::make('twitter')
                            ->url()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('telegram')
                            ->url()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('discord')
                            ->url()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('facebook')
                            ->url()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('instagram')
                            ->url()
                            ->maxLength(255),
                    ])->columns(2),

                Forms\Components\Section::make('Administration')
                    ->schema([
                        Forms\Components\Toggle::make('is_admin')
                            ->label('Admin Access'),
                        Forms\Components\Toggle::make('is_influencer')
                            ->label('Influencer Status'),
                        Forms\Components\Toggle::make('email_verified_at')
                            ->label('Email Verified')
                            ->default(false),
                        Forms\Components\Toggle::make('phone_verified_at')
                            ->label('Phone Verified')
                            ->default(false),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('avatar')
                    ->disk('r2')
                    ->circular(),
                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('email')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('phone')
                    ->searchable()
                    ->sortable(),
                // ->nullable(),
                Tables\Columns\TextColumn::make('username')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\IconColumn::make('is_admin')
                    ->boolean()
                    ->label('Admin')
                    ->sortable(),
                Tables\Columns\IconColumn::make('is_influencer')
                    ->boolean()
                    ->label('Influencer')
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
                Tables\Filters\TernaryFilter::make('is_admin')
                    ->label('Admin Users'),
                Tables\Filters\TernaryFilter::make('is_influencer')
                    ->label('Influencer Users'),
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
            RelationManagers\ArticlesRelationManager::class,
            RelationManagers\SubmissionsRelationManager::class,
            RelationManagers\AdCampaignsRelationManager::class,
            RelationManagers\ApprovedCampaignsRelationManager::class,
            RelationManagers\EventsRelationManager::class,
            RelationManagers\AirdropsRelationManager::class,
            RelationManagers\PresalesRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListUsers::route('/'),
            'create' => Pages\CreateUser::route('/create'),
            'edit' => Pages\EditUser::route('/{record}/edit'),
        ];
    }
}
