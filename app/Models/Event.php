<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Event extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'type',
        'start_date',
        'end_date',
        'location',
        'virtual_link',
        'is_virtual',
        'registration_link',
        'max_participants',
        'current_participants',
        'banner_image',
        'meta_title',
        'meta_description',
        'status',
        'organizer_id'
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'is_virtual' => 'boolean',
        'max_participants' => 'integer',
        'current_participants' => 'integer'
    ];

    /**
     * Get the banner image URL.
     */
    public function getBannerUrlAttribute(): ?string
    {
        return $this->banner_image ? Storage::url($this->banner_image) : null;
    }

    // Relationships
    public function organizer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'organizer_id');
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

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed')
            ->orWhere('end_date', '<', now());
    }

    public function scopeCancelled($query)
    {
        return $query->where('status', 'cancelled');
    }

    public function scopeVirtual($query)
    {
        return $query->where('is_virtual', true);
    }

    public function scopeInPerson($query)
    {
        return $query->where('is_virtual', false);
    }

    // Methods
    public function registerParticipant(): bool
    {
        if ($this->isFull()) {
            return false;
        }

        $this->increment('current_participants');
        return true;
    }

    public function unregisterParticipant(): void
    {
        if ($this->current_participants > 0) {
            $this->decrement('current_participants');
        }
    }

    public function isFull(): bool
    {
        return $this->max_participants !== null &&
            $this->current_participants >= $this->max_participants;
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

    public function isCompleted(): bool
    {
        return $this->status === 'completed' || $this->end_date < now();
    }

    public function isCancelled(): bool
    {
        return $this->status === 'cancelled';
    }

    public function cancel(): void
    {
        $this->update(['status' => 'cancelled']);
    }

    public function complete(): void
    {
        $this->update(['status' => 'completed']);
    }

    public function getDurationAttribute(): string
    {
        if (!$this->start_date || !$this->end_date) {
            return 'Duration not available';
        }

        return $this->start_date->diffForHumans($this->end_date, true);
    }

    public function getRegistrationStatusAttribute(): string
    {
        if ($this->isFull()) {
            return 'full';
        }

        if ($this->isUpcoming()) {
            return 'open';
        }

        if ($this->isOngoing()) {
            return 'ongoing';
        }

        return 'closed';
    }
}
