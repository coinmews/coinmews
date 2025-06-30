<?php

namespace App\Services;

use App\Models\Article;
use App\Models\Airdrop;
use App\Models\Presale;
use App\Models\Category;
use App\Models\Event;
use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class SearchService
{
    protected $searchableModels = [
        'articles' => [
            'model' => Article::class,
            'searchableColumns' => ['title', 'content', 'excerpt']
        ],
        'airdrops' => [
            'model' => Airdrop::class,
            'searchableColumns' => ['name', 'description']
        ],
        'presales' => [
            'model' => Presale::class,
            'searchableColumns' => ['name', 'description']
        ],
        'events' => [
            'model' => Event::class,
            'searchableColumns' => ['title', 'description']
        ],
        'categories' => [
            'model' => Category::class,
            'searchableColumns' => ['name', 'description']
        ],
    ];

    public function search(string $query, string $type = 'all'): array
    {
        if (empty($query)) {
            return [];
        }

        // Log the search query for debugging
        Log::info('Search query:', ['query' => $query, 'type' => $type]);

        try {
            $results = collect();

            if ($type === 'all') {
                foreach ($this->searchableModels as $modelType => $modelConfig) {
                    $modelResults = $this->searchModel($modelConfig['model'], $query, $modelType, $modelConfig['searchableColumns']);
                    $results = $results->merge($modelResults);
                }
            } elseif (isset($this->searchableModels[$type])) {
                $modelConfig = $this->searchableModels[$type];
                $results = $this->searchModel($modelConfig['model'], $query, $type, $modelConfig['searchableColumns']);
            }

            // Log the results count for debugging
            Log::info('Search results count:', ['count' => $results->count()]);

            return $results->sortByDesc('created_at')->values()->toArray();
        } catch (\Exception $e) {
            Log::error('Search error:', ['error' => $e->getMessage()]);
            return [];
        }
    }

    protected function searchModel(string $modelClass, string $query, string $type, array $searchableColumns): Collection
    {
        $searchQuery = str_replace('%', '', $query); // Sanitize the query

        return $modelClass::query()
            ->where(function (Builder $builder) use ($searchQuery, $searchableColumns) {
                foreach ($searchableColumns as $column) {
                    $builder->orWhere($column, 'like', "%{$searchQuery}%");
                }
            })
            ->when($type === 'articles', function ($query) {
                return $query->published(); // Assuming you have a published scope
            })
            ->take(10)
            ->get()
            ->map(function ($item) use ($type) {
                $title = $item->title ?? $item->name ?? '';
                $excerpt = $this->getExcerpt($item);

                // Log individual item for debugging
                Log::debug('Search result item:', [
                    'type' => $type,
                    'id' => $item->id,
                    'title' => $title
                ]);

                return [
                    'id' => $item->id,
                    'title' => $title,
                    'type' => $type,
                    'url' => $this->getModelUrl($item, $type),
                    'excerpt' => $excerpt,
                    'created_at' => $item->created_at->toISOString(),
                ];
            });
    }

    protected function getModelUrl($model, string $type): string
    {
        return match ($type) {
            'articles' => route('articles.show', $model->slug),
            'airdrops' => route('airdrops.show', $model->slug),
            'presales' => route('presales.show', $model->slug),
            'categories' => route('categories.show', $model->slug),
            'events' => route('events.show', $model->slug),
            default => '#',
        };
    }

    protected function getExcerpt($model): string
    {
        if (!empty($model->excerpt)) {
            return $model->excerpt;
        }

        if (!empty($model->description)) {
            return \Str::limit(strip_tags($model->description), 150);
        }

        if (!empty($model->content)) {
            return \Str::limit(strip_tags($model->content), 150);
        }

        return '';
    }
}
