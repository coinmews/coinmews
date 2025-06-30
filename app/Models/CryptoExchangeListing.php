<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CryptoExchangeListing extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'coin_name',
        'coin_symbol',
        'exchange_name',
        'exchange_logo',
        'coin_logo',
        'listing_type',
        'listing_date',
        'trading_pairs',
        'description',
        'about_project',
        'website_url',
        'explorer_url',
        'what_happens',
        'final_thoughts',
        'already_listing_count',
        'banner_image',
        'yes_votes',
        'no_votes',
        'is_featured',
        'is_published',
        'slug',
    ];

    protected $casts = [
        'listing_date' => 'datetime',
        'is_featured' => 'boolean',
        'is_published' => 'boolean',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->slug)) {
                $model->slug = Str::slug($model->coin_name . ' ' . $model->coin_symbol);
            }
        });
    }

    public function getFormattedListingDateAttribute()
    {
        return $this->listing_date->format('d-M-Y') . '<br>UTC ' . $this->listing_date->format('H:i');
    }

    public function getReadMoreUrlAttribute()
    {
        return route('crypto-exchange-listings.show', $this->slug);
    }

    // Increment the vote counters
    public function vote(string $type)
    {
        if ($type === 'yes') {
            $this->increment('yes_votes');
        } elseif ($type === 'no') {
            $this->increment('no_votes');
        }
    }

    // Calculate percentage of yes votes
    public function getYesPercentageAttribute()
    {
        $total = $this->yes_votes + $this->no_votes;
        return $total > 0 ? round(($this->yes_votes / $total) * 100) : 0;
    }

    // Calculate percentage of no votes
    public function getNoPercentageAttribute()
    {
        $total = $this->yes_votes + $this->no_votes;
        return $total > 0 ? round(($this->no_votes / $total) * 100) : 0;
    }
    
    // Get the full URL for coin logo
    public function getCoinLogoUrlAttribute()
    {
        if (!$this->coin_logo) {
            return null;
        }
        
        return $this->getImageUrl($this->coin_logo);
    }
    
    // Get the full URL for exchange logo
    public function getExchangeLogoUrlAttribute()
    {
        if (!$this->exchange_logo) {
            return null;
        }
        
        return $this->getImageUrl($this->exchange_logo);
    }
    
    // Helper method to get image URL
    protected function getImageUrl($path)
    {
        if (empty($path)) {
            return null;
        }
        
        try {
            // Get the base URL from config
            $baseUrl = config('filesystems.disks.r2.url');
            
            // If no base URL is configured, try to use the AWS URL
            if (empty($baseUrl)) {
                $baseUrl = config('filesystems.disks.r2.endpoint');
            }
            
            // If we have a base URL, construct the full URL
            if (!empty($baseUrl)) {
                $bucket = config('filesystems.disks.r2.bucket');
                return rtrim($baseUrl, '/') . '/' . $bucket . '/' . ltrim($path, '/');
            }
            
            // Fallback to using the asset helper with the path
            return asset('storage/' . $path);
        } catch (\Exception $e) {
            Log::error('Failed to get image URL: ' . $e->getMessage());
            return null;
        }
    }
}
