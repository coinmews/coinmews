<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Submission extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'title',
        'content',
        'description',
        'type',
        'status',
        'token_symbol',
        'stage',
        'launchpad',
        'start_date',
        'end_date',
        'token_price',
        'token_price_currency',
        'total_supply',
        'tokens_for_sale',
        'percentage_of_supply',
        'soft_cap',
        'hard_cap',
        'fundraising_goal',
        'website_url',
        'whitepaper_url',
        'contract_address',
        'logo_image',
        'submitted_by',
        'model_type',
        'model_id',
        'slug',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
    ];

    /**
     * Get the user that owns the submission.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Relationships
    public function submitter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'submitted_by');
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeReviewing($query)
    {
        return $query->where('status', 'reviewing');
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }

    // Methods
    public function startReview(): void
    {
        $this->update(['status' => 'reviewing']);
    }

    public function approve(User $reviewer, ?string $feedback = null): void
    {
        $this->update([
            'status' => 'approved',
            'feedback' => $feedback,
            'reviewed_at' => now(),
            'reviewed_by' => $reviewer->id
        ]);
    }

    public function reject(User $reviewer, string $feedback): void
    {
        $this->update([
            'status' => 'rejected',
            'feedback' => $feedback,
            'reviewed_at' => now(),
            'reviewed_by' => $reviewer->id
        ]);
    }

    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    public function isReviewing(): bool
    {
        return $this->status === 'reviewing';
    }

    public function isApproved(): bool
    {
        return $this->status === 'approved';
    }

    public function isRejected(): bool
    {
        return $this->status === 'rejected';
    }
    
    /**
     * Check if the submission was made by an influencer.
     *
     * @return bool
     */
    public function isFromInfluencer(): bool
    {
        return $this->submitter && $this->submitter->is_influencer === true;
    }
}
