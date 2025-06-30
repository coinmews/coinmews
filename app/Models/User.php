<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage;
use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;

class User extends Authenticatable implements FilamentUser
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'phone',
        'username',
        'password',
        'bio',
        'website',
        'avatar',
        'is_admin',
        'is_influencer',
        'twitter',
        'telegram',
        'discord',
        'facebook',
        'instagram',
        'birthday',
        'location',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_admin' => 'boolean',
        'is_influencer' => 'boolean',
        'birthday' => 'date',
    ];

    /**
     * Get the avatar URL.
     */
    public function getAvatarUrlAttribute(): ?string
    {
        return $this->avatar ? Storage::url($this->avatar) : null;
    }

    /**
     * Get the articles for the user.
     */
    public function articles(): HasMany
    {
        return $this->hasMany(Article::class, 'author_id');
    }

    /**
     * Get the submissions for the user.
     */
    public function submissions(): HasMany
    {
        return $this->hasMany(Submission::class, 'submitted_by');
    }

    /**
     * Get the ad campaigns created by the user.
     */
    public function adCampaigns(): HasMany
    {
        return $this->hasMany(AdCampaign::class, 'advertiser_id');
    }

    /**
     * Get the events created by the user.
     */
    public function events(): HasMany
    {
        return $this->hasMany(Event::class, 'organizer_id');
    }

    /**
     * Get the ad campaigns approved by the user.
     */
    public function approvedCampaigns(): HasMany
    {
        return $this->hasMany(AdCampaign::class, 'approved_by');
    }

    /**
     * Get the presales created by the user.
     */
    public function presales(): HasMany
    {
        return $this->hasMany(Presale::class, 'created_by');
    }

    /**
     * Get the airdrops created by the user.
     */
    public function airdrops(): HasMany
    {
        return $this->hasMany(Airdrop::class, 'created_by');
    }

    /**
     * Check if the user is an admin.
     */
    public function isAdmin(): bool
    {
        return $this->is_admin === true;
    }
    
    /**
     * Check if the user is an influencer.
     */
    public function isInfluencer(): bool
    {
        return $this->is_influencer === true;
    }
    
    /**
     * Make the user an influencer.
     */
    public function makeInfluencer(): void
    {
        $this->update(['is_influencer' => true]);
    }
    
    /**
     * Remove influencer status from the user.
     */
    public function removeInfluencer(): void
    {
        $this->update(['is_influencer' => false]);
    }

    /**
     * Make the user an admin.
     */
    public function makeAdmin(): void
    {
        $this->update(['is_admin' => true]);
    }

    /**
     * Remove admin status from the user.
     */
    public function removeAdmin(): void
    {
        $this->update(['is_admin' => false]);
    }

    public function canAccessPanel(Panel $panel): bool
    {
        return $this->is_admin === true;
    }

    /**
     * Check if the user has the given role.
     *
     * @param string $role
     * @return bool
     */
    public function hasRole(string $role): bool
    {
        if ($role === 'admin') {
            return $this->is_admin === true;
        }
        
        if ($role === 'influencer') {
            return $this->is_influencer === true;
        }

        // Add other role checks here if needed in the future
        return false;
    }
}
