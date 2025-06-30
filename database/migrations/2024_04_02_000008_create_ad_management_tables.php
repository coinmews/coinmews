<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ad_spaces', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->enum('location', [
                'homepage_top',
                'homepage_side',
                'homepage_inline',
                'post_top',
                'post_mid',
                'post_bottom',
                'partner_zone'
            ]);
            $table->enum('size', [
                'banner_728x90',
                'banner_300x250',
                'banner_160x600',
                'banner_320x100',
                'banner_468x60'
            ]);
            $table->boolean('is_premium')->default(false);
            $table->decimal('price_per_day', 10, 2)->nullable();
            $table->boolean('is_active')->default(true);

            // Stats
            $table->integer('impression_count')->default(0);
            $table->integer('click_count')->default(0);

            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('ad_campaigns', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('ad_space_id')->constrained();
            $table->foreignId('advertiser_id')->constrained('users');

            // Campaign details
            $table->text('ad_content');
            $table->string('ad_image')->nullable();
            $table->string('ad_link');
            $table->dateTime('start_date');
            $table->dateTime('end_date');
            $table->enum('status', ['pending', 'active', 'paused', 'completed', 'cancelled']);

            // Budget
            $table->decimal('budget', 10, 2);
            $table->decimal('spent', 10, 2)->default(0);

            // Targeting
            $table->json('targeting_rules')->nullable();

            // Stats
            $table->integer('impression_count')->default(0);
            $table->integer('click_count')->default(0);
            $table->decimal('ctr', 5, 2)->default(0);

            // Approval
            $table->boolean('is_approved')->default(false);
            $table->timestamp('approved_at')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users');

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ad_campaigns');
        Schema::dropIfExists('ad_spaces');
    }
};
