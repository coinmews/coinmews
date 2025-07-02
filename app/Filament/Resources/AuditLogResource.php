<?php

namespace App\Filament\Resources;

use App\Filament\Resources\AuditLogResource\Pages;
use App\Models\AuditLog;
use App\Models\User;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class AuditLogResource extends Resource
{
    protected static ?string $model = AuditLog::class;

    protected static ?string $navigationIcon = 'heroicon-o-clipboard-document-list';
    protected static ?string $navigationGroup = 'Admin';
    protected static ?int $navigationSort = 99;
    protected static ?string $label = 'Audit Log';
    protected static ?string $pluralLabel = 'Audit Logs';

    public static function form(Form $form): Form
    {
        return $form->schema([]); // Read-only resource
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('created_at')->label('Time')->dateTime()->sortable(),
                Tables\Columns\TextColumn::make('user.name')->label('User')->searchable(),
                Tables\Columns\TextColumn::make('action')->badge()->color(fn($state) => match($state) {
                    'created' => 'success',
                    'updated' => 'info',
                    'deleted' => 'danger',
                    default => 'gray',
                }),
                Tables\Columns\TextColumn::make('auditable_type')->label('Model')->searchable(),
                Tables\Columns\TextColumn::make('auditable_id')->label('ID'),
                Tables\Columns\TextColumn::make('ip_address')->label('IP'),
                Tables\Columns\TextColumn::make('user_agent')->label('User Agent')->limit(30),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('action')
                    ->options([
                        'created' => 'Created',
                        'updated' => 'Updated',
                        'deleted' => 'Deleted',
                    ]),
                Tables\Filters\SelectFilter::make('user_id')
                    ->label('User')
                    ->options(User::pluck('name', 'id')->toArray()),
            ])
            ->defaultSort('created_at', 'desc');
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListAuditLogs::route('/'),
        ];
    }
} 