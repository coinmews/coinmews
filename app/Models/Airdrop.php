<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Airdrop extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'status',
        'token_symbol',
        'type',
        'blockchain',
        'start_date',
        'end_date',
        'total_supply',
        'airdrop_qty',
        'winners_count',
        'upvotes_count',
        'tasks_count',
        'is_featured',
        'usd_value',
        'logo_image',
        'view_count',
        'created_by'
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'total_supply' => 'decimal:0',
        'airdrop_qty' => 'decimal:0',
        'usd_value' => 'decimal:2',
        'upvotes_count' => 'integer',
        'winners_count' => 'integer',
        'tasks_count' => 'integer',
        'view_count' => 'integer',
        'is_featured' => 'boolean'
    ];

    protected $appends = ['logo_url', 'time_remaining'];

    // Accessors
    public function getLogoUrlAttribute(): ?string
    {
        if (!$this->logo_image) {
            return null;
        }
        return Storage::url($this->logo_image);
    }

    public function getTimeRemainingAttribute(): ?string
    {
        if (!$this->end_date) {
            return 'Ongoing';
        }

        if ($this->end_date->isPast()) {
            return 'Ended';
        }

        $now = now();
        $diff = $now->diff($this->end_date);

        if ($diff->days > 0) {
            return $diff->days . ' days';
        } elseif ($diff->h > 0) {
            return $diff->h . ' hours';
        } else {
            return $diff->i . ' minutes';
        }
    }

    // Relationships
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // Scopes
    public function scopeOngoing($query)
    {
        return $query->where('status', 'ongoing')
            ->where('start_date', '<=', now())
            ->where(function ($q) {
                $q->whereNull('end_date')
                    ->orWhere('end_date', '>', now());
            });
    }

    public function scopeUpcoming($query)
    {
        return $query->where('status', 'upcoming')
            ->where('start_date', '>', now());
    }

    public function scopePotential($query)
    {
        return $query->where('status', 'potential');
    }

    public function scopeEnded($query)
    {
        return $query->where('status', 'ended')
            ->orWhere(function ($q) {
                $q->whereNotNull('end_date')
                    ->where('end_date', '<', now());
            });
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
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

    public function isOngoing(): bool
    {
        return $this->status === 'ongoing' &&
            $this->start_date <= now() &&
            ($this->end_date === null || $this->end_date > now());
    }

    public function isUpcoming(): bool
    {
        return $this->status === 'upcoming' && $this->start_date > now();
    }

    public function isPotential(): bool
    {
        return $this->status === 'potential';
    }

    public function isEnded(): bool
    {
        return $this->status === 'ended' ||
            ($this->end_date !== null && $this->end_date < now());
    }

    public function markAsFeatured(): void
    {
        $this->update(['is_featured' => true]);
    }

    public function unmarkAsFeatured(): void
    {
        $this->update(['is_featured' => false]);
    }

    public function end(): void
    {
        $this->update(['status' => 'ended']);
    }

    public function getPercentOfSupplyAttribute(): ?float
    {
        if ($this->total_supply === null || $this->airdrop_qty === null) {
            return null;
        }

        return round(($this->airdrop_qty / $this->total_supply) * 100, 6);
    }
}
