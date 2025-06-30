<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('content');
            $table->string('excerpt')->nullable();
            $table->string('banner_image')->nullable();
            $table->enum('content_type', [
                'news',
                'blog',
                'press_release',
                'sponsored',
                'price_prediction',
                'guest_post',
                'research_report',
                'web3_bulletin',
                'web_story',
                'short_news'
            ]);

            // Common fields
            $table->enum('status', ['draft', 'published', 'featured'])->default('draft');
            $table->boolean('is_breaking_news')->default(false);
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_trending')->default(false);
            $table->integer('view_count')->default(0);
            $table->foreignId('category_id')->constrained('categories');

            // News & Short News specific fields
            $table->string('source')->nullable();
            $table->string('location')->nullable();
            $table->boolean('is_time_sensitive')->default(false);

            // Blog & Guest Post specific fields
            $table->text('author_bio')->nullable();
            $table->integer('reading_time')->nullable(); // in minutes

            // Price Prediction & Research Report specific fields
            $table->decimal('price_target_low', 20, 8)->nullable();
            $table->decimal('price_target_high', 20, 8)->nullable();
            $table->string('time_horizon')->nullable();
            $table->text('methodology')->nullable();
            $table->json('data_sources')->nullable();
            $table->text('risk_factors')->nullable();

            // Press Release & Web3 Bulletin specific fields
            $table->string('company_name')->nullable();
            $table->string('contact_email')->nullable();
            $table->string('contact_phone')->nullable();
            $table->json('official_links')->nullable();

            // Web Story specific fields
            $table->integer('story_duration')->nullable(); // in seconds
            $table->json('story_slides')->nullable(); // Array of slides with image, text, duration
            $table->json('media_elements')->nullable();
            $table->json('interactive_elements')->nullable();
            $table->boolean('is_vertical')->default(true); // Instagram/Facebook style vertical stories
            $table->integer('slides_count')->default(0);

            // SEO fields
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();

            // Author information
            $table->foreignId('author_id')->constrained('users');

            // Timestamps
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
