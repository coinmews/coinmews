<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Tag extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'usage_count',
        'trending_score',
        'last_used_at',
        'meta_title',
        'meta_description'
    ];

    protected $casts = [
        'last_used_at' => 'datetime',
        'trending_score' => 'integer'
    ];

    // Relationships
    public function articles(): BelongsToMany
    {
        return $this->belongsToMany(Article::class);
    }

    // Scopes
    public function scopeTrending($query)
    {
        return $query->orderBy('trending_score', 'desc');
    }

    public function scopeMostUsed($query)
    {
        return $query->orderBy('usage_count', 'desc');
    }

    public function scopeRecentlyUsed($query)
    {
        return $query->orderBy('last_used_at', 'desc');
    }

    // Methods
    public function incrementUsageCount(): void
    {
        $this->increment('usage_count');
        $this->update(['last_used_at' => now()]);
    }

    public function decrementUsageCount(): void
    {
        $this->decrement('usage_count');
    }

    public function updateTrendingScore(): void
    {
        // Calculate trending score based on recent usage
        $recentUsage = $this->articles()
            ->where('created_at', '>=', now()->subDays(7))
            ->count();

        $this->update([
            'trending_score' => $recentUsage
        ]);
    }

    public function mergeInto(Tag $targetTag): void
    {
        // Move all article relationships to the target tag
        $this->articles()->syncWithoutDetaching($targetTag->articles()->pluck('articles.id'));

        // Update usage count
        $targetTag->increment('usage_count', $this->usage_count);

        // Delete this tag
        $this->delete();
    }
}
