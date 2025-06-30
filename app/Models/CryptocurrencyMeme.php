<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class CryptocurrencyMeme extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'slug',
        'description',
        'media_type',
        'media_url',
        'view_count',
        'upvotes_count',
        'category_id',
        'user_id',
        'is_featured',
        'status',
        'published_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_featured' => 'boolean',
        'published_at' => 'datetime',
    ];

    /**
     * Get the full URL for the media file.
     */
    protected function getMediaUrlAttribute($value)
    {
        if (filter_var($value, FILTER_VALIDATE_URL)) {
            return $value;
        }

        // If it's just a path, construct the full R2 URL
        $r2BaseUrl = rtrim(config('filesystems.disks.r2.url'), '/');
        return $r2BaseUrl . '/' . ltrim($value, '/');
    }

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($meme) {
            if (empty($meme->slug)) {
                $meme->slug = Str::slug($meme->title);
            }

            if (empty($meme->published_at) && $meme->status === 'published') {
                $meme->published_at = now();
            }
        });
    }

    /**
     * Get the user that owns the meme.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the category that the meme belongs to.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Scope a query to only include published memes.
     */
    public function scopePublished($query)
    {
        return $query->where('status', 'published')
            ->where('published_at', '<=', now());
    }

    /**
     * Scope a query to only include featured memes.
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Scope a query to only include image memes.
     */
    public function scopeImages($query)
    {
        return $query->where('media_type', 'image');
    }

    /**
     * Scope a query to only include video memes.
     */
    public function scopeVideos($query)
    {
        return $query->where('media_type', 'video');
    }

    /**
     * Increment the view count.
     */
    public function incrementViewCount(): void
    {
        $this->increment('view_count');
    }

    /**
     * Increment the upvotes count.
     */
    public function incrementUpvotes(): void
    {
        $this->increment('upvotes_count');
    }

    /**
     * Check if this is an image meme.
     */
    public function isImage(): bool
    {
        return $this->media_type === 'image';
    }

    /**
     * Check if this is a video meme.
     */
    public function isVideo(): bool
    {
        return $this->media_type === 'video';
    }
}
