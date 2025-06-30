<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Presale extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'status',
        'token_symbol',
        'total_supply',
        'tokens_for_sale',
        'percentage_of_supply',
        'stage',
        'launchpad',
        'start_date',
        'end_date',
        'token_price',
        'token_price_currency',
        'exchange_rate',
        'soft_cap',
        'hard_cap',
        'personal_cap',
        'fundraising_goal',
        'website_url',
        'whitepaper_url',
        'social_media_links',
        'project_category',
        'contract_address',
        'logo_image',
        'upvotes_count',
        'view_count',
        'created_by'
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'total_supply' => 'decimal:0',
        'tokens_for_sale' => 'decimal:0',
        'percentage_of_supply' => 'decimal:2',
        'token_price' => 'decimal:8',
        'soft_cap' => 'decimal:8',
        'hard_cap' => 'decimal:8',
        'personal_cap' => 'decimal:8',
        'fundraising_goal' => 'decimal:2',
        'social_media_links' => 'array',
        'upvotes_count' => 'integer',
        'view_count' => 'integer'
    ];

    protected $appends = ['logo_url', 'formatted_token_price', 'remaining_time'];

    // Accessors
    public function getLogoUrlAttribute(): ?string
    {
        if (!$this->logo_image) {
            return null;
        }
        return Storage::url($this->logo_image);
    }

    public function getFormattedTokenPriceAttribute(): string
    {
        return number_format($this->token_price, 8) . ' ' . $this->token_price_currency;
    }

    public function getRemainingTimeAttribute(): string
    {
        if ($this->end_date < now()) {
            return 'Ended';
        }
        return now()->diffForHumans($this->end_date, true);
    }

    // Relationships
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // Scopes
    public function scopeUpcoming($query)
    {
        return $query->where('status', 'upcoming')
            ->where('start_date', '>', now());
    }

    public function scopeOngoing($query)
    {
        return $query->where('status', 'ongoing')
            ->where('start_date', '<=', now())
            ->where('end_date', '>=', now());
    }

    public function scopeEnded($query)
    {
        return $query->where('status', 'ended')
            ->orWhere('end_date', '<', now());
    }

    public function scopeByStage($query, $stage)
    {
        return $query->where('stage', $stage);
    }

    // Methods
    public function incrementViewCount(): void
    {
        $this->increment('view_count');
    }

    public function incrementUpvotes(): void
    {
        $this->increment('upvotes_count');
    }

    public function isUpcoming(): bool
    {
        return $this->status === 'upcoming' && $this->start_date > now();
    }

    public function isOngoing(): bool
    {
        return $this->status === 'ongoing' &&
            $this->start_date <= now() &&
            $this->end_date >= now();
    }

    public function isEnded(): bool
    {
        return $this->status === 'ended' || $this->end_date < now();
    }

    public function getDurationAttribute(): string
    {
        return $this->start_date->diffForHumans($this->end_date, true);
    }

    public function getStatusTextAttribute(): string
    {
        if ($this->isUpcoming()) {
            return 'Upcoming';
        }
        if ($this->isOngoing()) {
            return 'Ongoing';
        }
        if ($this->isEnded()) {
            return 'Ended';
        }
        return 'Unknown';
    }
}
