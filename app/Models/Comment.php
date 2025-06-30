<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Comment extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'commentable_type',
        'commentable_id',
        'content',
        'ip_address',
        'user_agent',
        'is_spam',
        'is_approved',
        'approved_at',
        'approved_by',
        'moderation_notes',
        'report_count',
        'last_reported_at',
    ];

    protected $casts = [
        'is_spam' => 'boolean',
        'is_approved' => 'boolean',
        'approved_at' => 'datetime',
        'last_reported_at' => 'datetime',
        'report_count' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function commentable(): MorphTo
    {
        return $this->morphTo();
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function markAsSpam(): void
    {
        $this->update(['is_spam' => true]);
    }

    public function approve(User $approver): void
    {
        $this->update([
            'is_approved' => true,
            'approved_at' => now(),
            'approved_by' => $approver->id,
        ]);
    }

    public function reject(User $moderator, string $notes): void
    {
        $this->update([
            'is_approved' => false,
            'moderation_notes' => $notes,
        ]);
    }

    public function report(): void
    {
        $this->increment('report_count');
        $this->update(['last_reported_at' => now()]);
    }

    public function scopePending($query)
    {
        return $query->where('is_approved', false)
            ->where('is_spam', false);
    }

    public function scopeSpam($query)
    {
        return $query->where('is_spam', true);
    }

    public function scopeReported($query)
    {
        return $query->where('report_count', '>', 0);
    }
}
