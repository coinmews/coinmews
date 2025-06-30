<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class Article extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'slug',
        'content',
        'excerpt',
        'banner_image',
        'content_type',
        'status',
        'is_breaking_news',
        'is_featured',
        'is_trending',
        'view_count',
        'category_id',
        // News & Short News fields
        'source',
        'location',
        'is_time_sensitive',
        // Blog & Guest Post fields
        'author_bio',
        'reading_time',
        // Price Prediction & Research Report fields
        'price_target_low',
        'price_target_high',
        'time_horizon',
        'methodology',
        'data_sources',
        'risk_factors',
        // Press Release & Web3 Bulletin fields
        'company_name',
        'contact_email',
        'contact_phone',
        'official_links',
        // Web Story fields
        'story_duration',
        'story_slides',
        'media_elements',
        'interactive_elements',
        'is_vertical',
        'slides_count',
        // SEO fields
        'meta_title',
        'meta_description',
        'author_id',
        'published_at'
    ];

    protected $casts = [
        'is_breaking_news' => 'boolean',
        'is_featured' => 'boolean',
        'is_trending' => 'boolean',
        'is_time_sensitive' => 'boolean',
        'is_vertical' => 'boolean',
        'view_count' => 'integer',
        'slides_count' => 'integer',
        'story_duration' => 'integer',
        'published_at' => 'datetime',
        'data_sources' => 'array',
        'official_links' => 'array',
        'story_slides' => 'array',
        'interactive_elements' => 'array',
        'media_elements' => 'array',
        'price_target_low' => 'float',
        'price_target_high' => 'float',
    ];

    protected $appends = ['banner_url'];

    // Accessors
    public function getBannerUrlAttribute(): ?string
    {
        if (!$this->banner_image) {
            return asset('default-banner.png');
        }
        
        // Check if the file exists in storage
        if (!Storage::disk('r2')->exists($this->banner_image)) {
            return asset('default-banner.png');
        }
        
        return Storage::url($this->banner_image);
    }

    public function getBannerImageUrlAttribute()
    {
        if (!$this->banner_image) {
            return asset('default-banner.png');
        }
        
        // Check if the file exists in storage
        if (!Storage::disk('r2')->exists($this->banner_image)) {
            return asset('default-banner.png');
        }
        
        return Storage::url($this->banner_image);
    }

    // Relationships
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class, 'commentable_id')
            ->where('commentable_type', Article::class);
    }

    // Event Listeners
    protected static function booted()
    {
        static::saving(function ($article) {
            // Auto-populate author details if empty
            if ($article->author_id && !$article->author_bio) {
                $author = $article->author;
                $article->author_bio = $author->bio ?? null;
            }

            // Update slides count for web stories
            if ($article->content_type === 'web_story' && $article->story_slides) {
                $slides = is_string($article->story_slides)
                    ? json_decode($article->story_slides, true)
                    : $article->story_slides;
                $article->slides_count = is_array($slides) ? count($slides) : 0;
            }
        });
    }

    // Scopes for content types
    public function scopeNews($query)
    {
        return $query->where('content_type', 'news');
    }

    public function scopeNewsAndShortNews($query)
    {
        return $query->whereIn('content_type', ['news', 'short_news']);
    }

    public function scopeBlog($query)
    {
        return $query->where('content_type', 'blog');
    }

    public function scopePressReleases($query)
    {
        return $query->where('content_type', 'press_release');
    }

    public function scopeSponsored($query)
    {
        return $query->where('content_type', 'sponsored');
    }

    public function scopePricePredictions($query)
    {
        return $query->where('content_type', 'price_prediction');
    }

    public function scopeGuestPosts($query)
    {
        return $query->where('content_type', 'guest_post');
    }

    public function scopeResearchReports($query)
    {
        return $query->where('content_type', 'research_report');
    }

    public function scopeWeb3Bulletins($query)
    {
        return $query->where('content_type', 'web3_bulletin');
    }

    public function scopeWebStories($query)
    {
        return $query->where('content_type', 'web_story');
    }

    public function scopeShortNews($query)
    {
        return $query->where('content_type', 'short_news');
    }

    // Scopes for filters
    public function scopeFeatured($query)
    {
        return $query->where(function ($q) {
            $q->where('is_featured', true)
                ->orWhere('status', 'featured');
        });
    }

    public function scopePopular($query)
    {
        return $query->where(function ($q) {
            $q->where('is_trending', true)
                ->orWhere('view_count', '>', 1000);
        })->orderByDesc('view_count');
    }

    public function scopeBreakingNews($query)
    {
        return $query->where('is_breaking_news', true);
    }

    public function scopeTrending($query)
    {
        return $query->where('is_trending', true);
    }

    public function scopeTopByViewCount($query)
    {
        return $query->orderBy('view_count', 'desc');
    }

    public function scopeLatestReacted($query)
    {
        return $query->withCount('comments')->orderByDesc('comments_count');
    }

    public function scopeTimeSensitive($query)
    {
        return $query->where('is_time_sensitive', true);
    }

    public function scopeByCategory($query, $categoryId)
    {
        return $query->where('category_id', $categoryId);
    }

    public function scopeLatest($query)
    {
        return $query->orderByDesc('published_at');
    }

    public function scopePublished($query)
    {
        return $query->where(function ($q) {
            $q->where('status', 'published')
                ->orWhere('status', 'featured');
        })
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }

    // Additional useful scopes
    public function scopeByAuthor($query, $authorId)
    {
        return $query->where('author_id', $authorId);
    }

    public function scopeByTag($query, $tagId)
    {
        return $query->whereHas('tags', function ($q) use ($tagId) {
            $q->where('tags.id', $tagId);
        });
    }

    public function scopeByContentType($query, $contentType)
    {
        return $query->where('content_type', $contentType);
    }

    public function scopeWithHighViewCount($query, $minViews = 1000)
    {
        return $query->where('view_count', '>=', $minViews);
    }

    public function scopeRecent($query, $days = 7)
    {
        return $query->where('published_at', '>=', now()->subDays($days));
    }

    // Methods
    public function incrementViewCount(): void
    {
        $this->increment('view_count');
    }

    public function publish(): void
    {
        $this->update([
            'status' => 'published',
            'published_at' => now()
        ]);
    }

    public function unpublish(): void
    {
        $this->update([
            'status' => 'draft',
            'published_at' => null
        ]);
    }

    public function scopeLiveFeed($query)
    {
        return $query->published()
            ->where(function ($q) {
                $q->where('is_breaking_news', true)
                    ->orWhere('is_time_sensitive', true)
                    ->orWhere('content_type', 'short_news');
            })
            ->latest()
            ->take(10);
    }
}
