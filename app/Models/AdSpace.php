<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AdSpace extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'type',
        'width',
        'height',
        'location',
        'priority',
        'is_active',
        'is_responsive',
        'target_pages',
        'target_categories',
        'target_tags',
    ];

    protected $casts = [
        'target_pages' => 'array',
        'target_categories' => 'array',
        'target_tags' => 'array',
        'is_active' => 'boolean',
        'is_responsive' => 'boolean',
        'width' => 'integer',
        'height' => 'integer',
        'priority' => 'integer',
    ];

    // Relationships

    public function campaigns(): HasMany
    {
        return $this->hasMany(AdCampaign::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopePremium($query)
    {
        return $query->where('is_premium', true);
    }

    public function scopeByLocation($query, string $location)
    {
        return $query->where('location', $location);
    }

    public function scopeBySize($query, string $size)
    {
        return $query->where('size', $size);
    }

    // Methods
    public function incrementImpressionCount(): void
    {
        $this->increment('impression_count');
    }

    public function incrementClickCount(): void
    {
        $this->increment('click_count');
    }

    public function getCtrAttribute(): float
    {
        if ($this->impression_count === 0) {
            return 0;
        }
        return round(($this->click_count / $this->impression_count) * 100, 2);
    }

    public function getActiveCampaignsAttribute()
    {
        return $this->campaigns()
            ->where('status', 'active')
            ->where('start_date', '<=', now())
            ->where('end_date', '>=', now())
            ->get();
    }

    public function getCurrentPriceAttribute(): float
    {
        return $this->is_premium ? $this->price_per_day : 0;
    }

    public function getActiveAds(): HasMany
    {
        return $this->ads()
            ->where('is_active', true)
            ->where('start_date', '<=', now())
            ->where('end_date', '>=', now())
            ->orderBy('priority', 'desc');
    }

    public function shouldShowOnPage(string $page): bool
    {
        if (empty($this->target_pages)) {
            return true;
        }

        return in_array($page, $this->target_pages);
    }

    public function shouldShowInCategory(Category $category): bool
    {
        if (empty($this->target_categories)) {
            return true;
        }

        return in_array($category->id, $this->target_categories);
    }

    public function shouldShowWithTag(Tag $tag): bool
    {
        if (empty($this->target_tags)) {
            return true;
        }

        return in_array($tag->id, $this->target_tags);
    }
}
