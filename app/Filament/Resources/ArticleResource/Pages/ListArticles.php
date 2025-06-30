<?php

namespace App\Filament\Resources\ArticleResource\Pages;

use App\Filament\Resources\ArticleResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use App\Filament\Resources\ArticleResource\Widgets\ArticleStatsOverview;
use Filament\Resources\Components\Tab;

class ListArticles extends ListRecords
{
    protected static string $resource = ArticleResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }

    public function getTabs(): array
    {
        return [
            'all' => Tab::make('All Articles'),
            'news' => Tab::make('News')
                ->modifyQueryUsing(fn($query) => $query->where('content_type', 'news')),
            'blog' => Tab::make('Blog')
                ->modifyQueryUsing(fn($query) => $query->where('content_type', 'blog')),
            'press_release' => Tab::make('Press Release')
                ->modifyQueryUsing(fn($query) => $query->where('content_type', 'press_release')),
            'sponsored' => Tab::make('Sponsored')
                ->modifyQueryUsing(fn($query) => $query->where('content_type', 'sponsored')),
            'price_prediction' => Tab::make('Price Prediction')
                ->modifyQueryUsing(fn($query) => $query->where('content_type', 'price_prediction')),
            'guest_post' => Tab::make('Guest Post')
                ->modifyQueryUsing(fn($query) => $query->where('content_type', 'guest_post')),
            'research_report' => Tab::make('Research Report')
                ->modifyQueryUsing(fn($query) => $query->where('content_type', 'research_report')),
            'web3_bulletin' => Tab::make('Web3 Bulletin')
                ->modifyQueryUsing(fn($query) => $query->where('content_type', 'web3_bulletin')),
            'web_story' => Tab::make('Web Story')
                ->modifyQueryUsing(fn($query) => $query->where('content_type', 'web_story')),
            'short_news' => Tab::make('Short News')
                ->modifyQueryUsing(fn($query) => $query->where('content_type', 'short_news')),
        ];
    }

    protected function getHeaderWidgets(): array
    {
        return [
            ArticleStatsOverview::class,
        ];
    }
}
