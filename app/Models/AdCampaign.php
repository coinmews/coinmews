<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AdCampaign extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'ad_space_id',
        'advertiser_id',
        'ad_content',
        'ad_image',
        'ad_link',
        'start_date',
        'end_date',
        'status',
        'budget',
        'spent',
        'targeting_rules',
        'impression_count',
        'click_count',
        'ctr',
        'is_approved',
        'approved_at',
        'approved_by'
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'budget' => 'decimal:2',
        'spent' => 'decimal:2',
        'targeting_rules' => 'array',
        'impression_count' => 'integer',
        'click_count' => 'integer',
        'ctr' => 'decimal:2',
        'is_approved' => 'boolean',
        'approved_at' => 'datetime'
    ];

    // Relationships
    public function adSpace(): BelongsTo
    {
        return $this->belongsTo(AdSpace::class);
    }

    public function advertiser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'advertiser_id');
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active')
            ->where('start_date', '<=', now())
            ->where('end_date', '>=', now());
    }

    public function scopePaused($query)
    {
        return $query->where('status', 'paused');
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

    public function scopeApproved($query)
    {
        return $query->where('is_approved', true);
    }

    // Methods
    public function incrementImpressionCount(): void
    {
        $this->increment('impression_count');
        $this->adSpace->incrementImpressionCount();
    }

    public function incrementClickCount(): void
    {
        $this->increment('click_count');
        $this->adSpace->incrementClickCount();
        $this->updateCtr();
    }

    public function updateCtr(): void
    {
        if ($this->impression_count > 0) {
            $this->ctr = round(($this->click_count / $this->impression_count) * 100, 2);
            $this->save();
        }
    }

    public function approve(User $approver): void
    {
        $this->update([
            'is_approved' => true,
            'approved_at' => now(),
            'approved_by' => $approver->id
        ]);
    }

    public function pause(): void
    {
        $this->update(['status' => 'paused']);
    }

    public function resume(): void
    {
        $this->update(['status' => 'active']);
    }

    public function complete(): void
    {
        $this->update(['status' => 'completed']);
    }

    public function cancel(): void
    {
        $this->update(['status' => 'cancelled']);
    }

    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    public function isActive(): bool
    {
        return $this->status === 'active' &&
            $this->start_date <= now() &&
            $this->end_date >= now();
    }

    public function isPaused(): bool
    {
        return $this->status === 'paused';
    }

    public function isCompleted(): bool
    {
        return $this->status === 'completed' || $this->end_date < now();
    }

    public function isCancelled(): bool
    {
        return $this->status === 'cancelled';
    }

    public function isApproved(): bool
    {
        return $this->is_approved;
    }

    public function getRemainingBudgetAttribute(): float
    {
        return max(0, $this->budget - $this->spent);
    }

    public function getDurationAttribute(): string
    {
        return $this->start_date->diffForHumans($this->end_date, true);
    }

    public function getStatusTextAttribute(): string
    {
        if ($this->isPending()) {
            return 'Pending';
        }
        if ($this->isActive()) {
            return 'Active';
        }
        if ($this->isPaused()) {
            return 'Paused';
        }
        if ($this->isCompleted()) {
            return 'Completed';
        }
        if ($this->isCancelled()) {
            return 'Cancelled';
        }
        return 'Unknown';
    }
}
