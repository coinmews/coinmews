<?php

namespace App\Filament\Resources;

use App\Filament\Resources\SubmissionResource\Pages;
use App\Models\Submission;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use App\Filament\Resources\SubmissionResource\RelationManagers;
use Filament\Widgets\StatsOverviewWidget\Card;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;

class SubmissionResource extends Resource
{
    protected static ?string $model = Submission::class;

    protected static ?string $navigationIcon = 'heroicon-o-document-text';

    protected static ?string $navigationGroup = 'Content';

    protected static ?int $navigationSort = 4;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Basic Information')
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->label('Title/Name')
                            ->required()
                            ->maxLength(255),

                        Forms\Components\RichEditor::make('description')
                            ->label('Content/Description')
                            ->required(),

                        Forms\Components\Select::make('type')
                            ->options([
                                'presale' => 'Presale/ICO/IDO/IEO',
                                'airdrop' => 'Airdrop',
                                'event' => 'Event',
                                'press_release' => 'Press Release',
                                'guest_post' => 'Guest Post',
                                'sponsored_content' => 'Sponsored Content',
                            ])
                            ->required()
                            ->live(),

                        Forms\Components\Select::make('status')
                            ->options([
                                'pending' => 'Pending',
                                'reviewing' => 'Reviewing',
                                'approved' => 'Approved',
                                'rejected' => 'Rejected',
                            ])
                            ->required(),

                        Forms\Components\Textarea::make('feedback')
                            ->maxLength(1000),

                        Forms\Components\DateTimePicker::make('reviewed_at'),

                        Forms\Components\Select::make('reviewed_by')
                            ->relationship('reviewer', 'name'),

                        Forms\Components\Select::make('submitted_by')
                            ->relationship('submitter', 'name'),
                    ])->columns(2),

                // Presale specific fields
                Forms\Components\Section::make('Presale Details')
                    ->schema([
                        Forms\Components\TextInput::make('token_symbol')
                            ->required(),

                        Forms\Components\Select::make('stage')
                            ->options([
                                'ICO' => 'ICO',
                                'IDO' => 'IDO',
                                'IEO' => 'IEO',
                                'Presale' => 'Presale',
                                'Privatesale' => 'Privatesale',
                            ]),

                        Forms\Components\TextInput::make('launchpad'),

                        Forms\Components\DateTimePicker::make('start_date'),

                        Forms\Components\DateTimePicker::make('end_date'),

                        Forms\Components\TextInput::make('token_price')
                            ->numeric(),

                        Forms\Components\TextInput::make('token_price_currency'),

                        Forms\Components\TextInput::make('total_supply')
                            ->numeric(),

                        Forms\Components\TextInput::make('tokens_for_sale')
                            ->numeric(),

                        Forms\Components\TextInput::make('percentage_of_supply')
                            ->numeric(),

                        Forms\Components\TextInput::make('soft_cap')
                            ->numeric(),

                        Forms\Components\TextInput::make('hard_cap')
                            ->numeric(),

                        Forms\Components\TextInput::make('fundraising_goal')
                            ->numeric(),

                        Forms\Components\TextInput::make('website_url')
                            ->url(),

                        Forms\Components\TextInput::make('whitepaper_url')
                            ->url(),

                        Forms\Components\TextInput::make('contract_address'),
                    ])
                    ->columns(2)
                    ->visible(fn(Forms\Get $get): bool => $get('type') !== null && $get('type') === 'presale'),

                // Airdrop specific fields
                Forms\Components\Section::make('Airdrop Details')
                    ->schema([
                        Forms\Components\TextInput::make('token_symbol')
                            ->required(),

                        Forms\Components\Select::make('airdrop_type')
                            ->options([
                                'token' => 'Token',
                                'nft' => 'NFT',
                                'other' => 'Other',
                            ])
                            ->label('Type'),

                        Forms\Components\TextInput::make('blockchain'),

                        Forms\Components\DateTimePicker::make('start_date'),

                        Forms\Components\DateTimePicker::make('end_date'),

                        Forms\Components\TextInput::make('total_supply')
                            ->numeric(),

                        Forms\Components\TextInput::make('airdrop_qty')
                            ->numeric(),

                        Forms\Components\TextInput::make('winners_count')
                            ->numeric(),

                        Forms\Components\TextInput::make('usd_value')
                            ->numeric()
                            ->prefix('$'),

                        Forms\Components\TextInput::make('tasks_count')
                            ->numeric(),
                    ])
                    ->columns(2)
                    ->visible(fn(Forms\Get $get): bool => $get('type') !== null && $get('type') === 'airdrop'),

                // Event specific fields
                Forms\Components\Section::make('Event Details')
                    ->schema([
                        Forms\Components\Select::make('event_type')
                            ->options([
                                'crypto_event' => 'Crypto Event',
                                'web3_event' => 'Web3 Event',
                                'community_event' => 'Community Event',
                                'ai_event' => 'AI Event',
                            ])
                            ->label('Type'),

                        Forms\Components\DateTimePicker::make('start_date'),

                        Forms\Components\DateTimePicker::make('end_date'),

                        Forms\Components\TextInput::make('location'),

                        Forms\Components\Toggle::make('is_virtual'),

                        Forms\Components\TextInput::make('virtual_link')
                            ->url()
                            ->visible(fn(Forms\Get $get): bool => $get('is_virtual')),

                        Forms\Components\TextInput::make('registration_link')
                            ->url(),

                        Forms\Components\TextInput::make('max_participants')
                            ->numeric(),
                    ])
                    ->columns(2)
                    ->visible(fn(Forms\Get $get): bool => $get('type') !== null && $get('type') === 'event'),

                // Content submissions fields (Press Release, Guest Post, Sponsored Content)
                Forms\Components\Section::make('Content Details')
                    ->schema([
                        Forms\Components\TextInput::make('title')
                            ->required(),

                        Forms\Components\RichEditor::make('content')
                            ->required(),

                        Forms\Components\Textarea::make('excerpt'),

                        Forms\Components\TextInput::make('author_name')
                            ->visible(fn(Forms\Get $get): bool => $get('type') !== null && $get('type') === 'guest_post'),

                        Forms\Components\Textarea::make('author_bio')
                            ->visible(fn(Forms\Get $get): bool => $get('type') !== null && $get('type') === 'guest_post'),

                        Forms\Components\TextInput::make('reading_time')
                            ->numeric()
                            ->visible(fn(Forms\Get $get): bool => $get('type') !== null && $get('type') === 'guest_post')
                            ->suffix('minutes'),

                        Forms\Components\TextInput::make('company_name')
                            ->visible(fn(Forms\Get $get): bool => $get('type') !== null && in_array($get('type'), ['press_release', 'sponsored_content'])),

                        Forms\Components\TextInput::make('contact_email')
                            ->email()
                            ->visible(fn(Forms\Get $get): bool => $get('type') !== null && in_array($get('type'), ['press_release', 'sponsored_content'])),

                        Forms\Components\TextInput::make('contact_phone')
                            ->visible(fn(Forms\Get $get): bool => $get('type') !== null && in_array($get('type'), ['press_release', 'sponsored_content'])),

                        Forms\Components\TextInput::make('website_url')
                            ->url(),
                    ])
                    ->columns(2)
                    ->visible(fn(Forms\Get $get): bool => $get('type') !== null && in_array($get('type'), ['press_release', 'guest_post', 'sponsored_content'])),

                Forms\Components\Section::make('Media')
                    ->schema([
                        Forms\Components\FileUpload::make('logo_image')
                            ->image()
                            ->disk('r2')
                            ->visibility('public')
                            ->visible(fn(Forms\Get $get): bool => $get('type') !== null && in_array($get('type'), ['presale', 'airdrop'])),

                        Forms\Components\FileUpload::make('banner_image')
                            ->image()
                            ->disk('r2')
                            ->visibility('public')
                            ->visible(fn(Forms\Get $get): bool => $get('type') !== null && in_array($get('type'), ['event', 'press_release', 'guest_post', 'sponsored_content'])),
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
                    ->visible(fn(Tables\Columns\Column $column): bool =>
                    $column->getRecord() !== null &&
                        $column->getRecord()->type !== null &&
                        ($column->getRecord()->type === 'presale' || $column->getRecord()->type === 'airdrop')),

                Tables\Columns\ImageColumn::make('banner_image')
                    ->label('Banner')
                    ->disk('r2')
                    ->size(40)
                    ->visible(fn(Tables\Columns\Column $column): bool =>
                    $column->getRecord() !== null &&
                        $column->getRecord()->type !== null &&
                        in_array($column->getRecord()->type, ['event', 'press_release', 'guest_post', 'sponsored_content'])),

                Tables\Columns\TextColumn::make('name')
                    ->label('Title/Name')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('type')
                    ->badge()
                    ->color(fn(string $state = null): string => match ($state) {
                        'presale' => 'success',
                        'airdrop' => 'warning',
                        'event' => 'info',
                        'press_release' => 'primary',
                        'guest_post' => 'purple',
                        'sponsored_content' => 'pink',
                        default => 'gray',
                    }),

                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->color(fn(string $state = null): string => match ($state) {
                        'pending' => 'gray',
                        'reviewing' => 'warning',
                        'approved' => 'success',
                        'rejected' => 'danger',
                        default => 'gray',
                    }),

                Tables\Columns\TextColumn::make('user.name')
                    ->label('Submitted By')
                    ->searchable()
                    ->sortable()
                    ->description(fn (Submission $record): ?string => 
                        $record->isFromInfluencer() ? 'Influencer' : null)
                    ->color(fn (Submission $record): ?string => 
                        $record->isFromInfluencer() ? 'success' : null),

                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable(),

                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('type')
                    ->options([
                        'presale' => 'Presale/ICO/IDO/IEO',
                        'airdrop' => 'Airdrop',
                        'event' => 'Event',
                        'press_release' => 'Press Release',
                        'guest_post' => 'Guest Post',
                        'sponsored_content' => 'Sponsored Content',
                    ]),

                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'reviewing' => 'Reviewing',
                        'approved' => 'Approved',
                        'rejected' => 'Rejected',
                    ]),

                Tables\Filters\Filter::make('date')
                    ->form([
                        Forms\Components\DatePicker::make('created_from'),
                        Forms\Components\DatePicker::make('created_until'),
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query
                            ->when(
                                $data['created_from'],
                                fn(Builder $query, $date): Builder => $query->whereDate('created_at', '>=', $date),
                            )
                            ->when(
                                $data['created_until'],
                                fn(Builder $query, $date): Builder => $query->whereDate('created_at', '<=', $date),
                            );
                    }),

                Tables\Filters\Filter::make('review_date')
                    ->form([
                        Forms\Components\DatePicker::make('reviewed_from'),
                        Forms\Components\DatePicker::make('reviewed_until'),
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query
                            ->when(
                                $data['reviewed_from'],
                                fn(Builder $query, $date): Builder => $query->whereDate('reviewed_at', '>=', $date),
                            )
                            ->when(
                                $data['reviewed_until'],
                                fn(Builder $query, $date): Builder => $query->whereDate('reviewed_at', '<=', $date),
                            );
                    }),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
                Tables\Actions\Action::make('approve')
                    ->action(function (Submission $record) {
                        if ($record) {
                            $record->update(['status' => 'approved', 'reviewed_at' => now(), 'reviewed_by' => Auth::check() ? Auth::id() : null]);
                        }
                    })
                    ->requiresConfirmation()
                    ->icon('heroicon-o-check')
                    ->color('success')
                    ->visible(fn(Submission $record) => $record && $record->status !== 'approved'),
                Tables\Actions\Action::make('reject')
                    ->action(function (Submission $record, array $data) {
                        if ($record) {
                            $record->update(['status' => 'rejected', 'feedback' => $data['feedback'] ?? null, 'reviewed_at' => now(), 'reviewed_by' => Auth::check() ? Auth::id() : null]);
                        }
                    })
                    ->form([
                        Forms\Components\Textarea::make('feedback')
                            ->label('Rejection Reason')
                            ->required()
                    ])
                    ->requiresConfirmation()
                    ->icon('heroicon-o-x-mark')
                    ->color('danger')
                    ->visible(fn(Submission $record) => $record && $record->status !== 'rejected'),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                    Tables\Actions\BulkAction::make('approve_selected')
                        ->label('Approve Selected')
                        ->action(function (Collection $records) {
                            $records->each(function ($record) {
                                if ($record) {
                                    $record->update(['status' => 'approved', 'reviewed_at' => now(), 'reviewed_by' => Auth::check() ? Auth::id() : null]);
                                }
                            });
                        })
                        ->requiresConfirmation()
                        ->icon('heroicon-o-check')
                        ->color('success'),
                    Tables\Actions\BulkAction::make('reject_selected')
                        ->label('Reject Selected')
                        ->action(function (Collection $records, array $data) {
                            $records->each(function ($record) use ($data) {
                                if ($record) {
                                    $record->update(['status' => 'rejected', 'feedback' => $data['feedback'] ?? null, 'reviewed_at' => now(), 'reviewed_by' => Auth::check() ? Auth::id() : null]);
                                }
                            });
                        })
                        ->form([
                            Forms\Components\Textarea::make('feedback')
                                ->label('Rejection Reason')
                                ->required()
                        ])
                        ->requiresConfirmation()
                        ->icon('heroicon-o-x-mark')
                        ->color('danger'),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            RelationManagers\SubmitterRelationManager::class,
            RelationManagers\ReviewerRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListSubmissions::route('/'),
            'create' => Pages\CreateSubmission::route('/create'),
            'view' => Pages\ViewSubmission::route('/{record}'),
            'edit' => Pages\EditSubmission::route('/{record}/edit'),
        ];
    }

    public static function getWidgets(): array
    {
        return [
            SubmissionResource\Widgets\SubmissionStatsOverview::class,
        ];
    }
}
