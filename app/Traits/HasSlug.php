<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

trait HasSlug
{
    /**
     * Boot the trait.
     */
    protected static function bootHasSlug(): void
    {
        static::creating(function (Model $model) {
            if (empty($model->{$model->getSlugColumn()})) {
                $model->{$model->getSlugColumn()} = static::generateSlug($model);
            }
        });

        static::updating(function (Model $model) {
            $slugColumn = $model->getSlugColumn();
            $sourceColumn = $model->getSlugSourceColumn();

            // Only regenerate slug if source column changed and slug hasn't been manually set
            if ($model->isDirty($sourceColumn) && !$model->isDirty($slugColumn)) {
                $model->{$slugColumn} = static::generateSlug($model);
            }
        });
    }

    /**
     * Generate a unique slug.
     */
    protected static function generateSlug(Model $model): string
    {
        $slug = Str::slug($model->{$model->getSlugSourceColumn()});
        $originalSlug = $slug;
        $i = 1;

        while (static::slugExists($model, $slug)) {
            $slug = $originalSlug . '-' . $i++;
        }

        return $slug;
    }

    /**
     * Check if slug exists.
     */
    protected static function slugExists(Model $model, string $slug): bool
    {
        $query = static::where($model->getSlugColumn(), $slug);

        if ($model->exists) {
            $query->where($model->getKeyName(), '!=', $model->getKey());
        }

        return $query->exists();
    }

    /**
     * Get the source column for the slug.
     */
    public function getSlugSourceColumn(): string
    {
        return $this->slugSourceColumn ?? 'name';
    }

    /**
     * Get the column name for the slug.
     */
    public function getSlugColumn(): string
    {
        return $this->slugColumn ?? 'slug';
    }

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName(): string
    {
        return $this->getSlugColumn();
    }
}
