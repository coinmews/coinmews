<?php

namespace App\Filament\Widgets;

use App\Models\Submission;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class SubmissionQueueWidget extends BaseWidget
{
    protected static ?int $sort = 3;

    protected int | string | array $columnSpan = 'full';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                Submission::query()
                    ->whereIn('status', ['pending', 'reviewing'])
                    ->latest()
                    ->limit(5)
            )
            ->columns([
                Tables\Columns\TextColumn::make('title')
                    ->searchable()
                    ->limit(50),

                Tables\Columns\TextColumn::make('type')
                    ->badge()
                    ->color(fn(string $state): string => match ($state) {
                        'guest_post' => 'primary',
                        'sponsored_content' => 'purple',
                        'press_release' => 'info',
                        'airdrop' => 'warning',
                        'presale', 'ico', 'ido', 'ieo' => 'success',
                        'event' => 'danger',
                    }),

                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->color(fn(string $state): string => match ($state) {
                        'pending' => 'gray',
                        'reviewing' => 'warning',
                    }),

                Tables\Columns\TextColumn::make('submitted_by.name')
                    ->label('Submitted By'),

                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable(),
            ])
            ->actions([
                Tables\Actions\Action::make('review')
                    ->url(fn(Submission $record): string => route('filament.admin.resources.submissions.edit', $record))
                    ->icon('heroicon-o-eye'),
            ])
            ->defaultSort('created_at', 'desc');
    }
}
