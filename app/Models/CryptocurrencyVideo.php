<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class CryptocurrencyVideo extends Model
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
        'youtube_url',
        'thumbnail_url',
        'duration',
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
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = ['youtube_id', 'youtube_embed_url'];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($video) {
            if (empty($video->slug)) {
                $video->slug = Str::slug($video->title);
            }

            if (empty($video->published_at) && $video->status === 'published') {
                $video->published_at = now();
            }
        });
    }

    /**
     * Get the user that owns the video.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the category that the video belongs to.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Scope a query to only include published videos.
     */
    public function scopePublished($query)
    {
        return $query->where('status', 'published')
            ->where('published_at', '<=', now());
    }

    /**
     * Scope a query to only include featured videos.
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
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
     * Get the YouTube video ID from the URL.
     */
    public function getYoutubeIdAttribute(): ?string
    {
        $url = $this->youtube_url;

        \Log::info('Extracting YouTube ID', [
            'url' => $url,
            'video_id' => $this->id,
            'title' => $this->title
        ]);

        if (empty($url)) {
            \Log::warning('Empty YouTube URL for video', [
                'video_id' => $this->id,
                'title' => $this->title
            ]);
            return null;
        }

        if (preg_match('/youtube\.com\/watch\?v=([^\&\?\/]+)/', $url, $matches)) {
            \Log::info('YouTube ID extracted (watch format)', ['id' => $matches[1]]);
            return $matches[1];
        } elseif (preg_match('/youtube\.com\/embed\/([^\&\?\/]+)/', $url, $matches)) {
            \Log::info('YouTube ID extracted (embed format)', ['id' => $matches[1]]);
            return $matches[1];
        } elseif (preg_match('/youtube\.com\/v\/([^\&\?\/]+)/', $url, $matches)) {
            \Log::info('YouTube ID extracted (v format)', ['id' => $matches[1]]);
            return $matches[1];
        } elseif (preg_match('/youtu\.be\/([^\&\?\/]+)/', $url, $matches)) {
            \Log::info('YouTube ID extracted (short format)', ['id' => $matches[1]]);
            return $matches[1];
        }

        \Log::warning('No YouTube ID pattern matched', [
            'url' => $url,
            'video_id' => $this->id,
            'title' => $this->title
        ]);
        return null;
    }

    /**
     * Get the YouTube embed URL.
     */
    public function getYoutubeEmbedUrlAttribute(): ?string
    {
        $youtubeId = $this->youtube_id;

        if ($youtubeId) {
            return "https://www.youtube.com/embed/{$youtubeId}";
        }

        return null;
    }
}
