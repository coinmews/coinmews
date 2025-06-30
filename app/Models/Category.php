<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Category extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'image',
        'parent_id',
        'order',
        'meta_title',
        'meta_description',
        'meta_image',
        'article_count',
        'view_count'
    ];

    // Relationships
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    public function articles(): HasMany
    {
        return $this->hasMany(Article::class);
    }

    public function tags()
    {
        return $this->hasMany(Tag::class);
    }

    public function cryptocurrencyVideos()
    {
        return $this->hasMany(CryptocurrencyVideo::class);
    }

    public function cryptocurrencyMemes()
    {
        return $this->hasMany(CryptocurrencyMeme::class);
    }

    // Scopes
    public function scopeRoot($query)
    {
        return $query->whereNull('parent_id');
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order', 'asc');
    }

    // Methods
    public function incrementArticleCount(): void
    {
        $this->increment('article_count');
    }

    public function decrementArticleCount(): void
    {
        $this->decrement('article_count');
    }

    public function incrementViewCount(): void
    {
        $this->increment('view_count');
    }

    public function getFullPath(): string
    {
        $path = [$this->name];
        $parent = $this->parent;

        while ($parent) {
            array_unshift($path, $parent->name);
            $parent = $parent->parent;
        }

        return implode(' > ', $path);
    }

    public function getAllChildren(): array
    {
        $children = $this->children->toArray();
        foreach ($this->children as $child) {
            $children = array_merge($children, $child->getAllChildren());
        }
        return $children;
    }
}
