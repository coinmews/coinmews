<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('presales', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->enum('status', ['ongoing', 'upcoming', 'ended'])->default('upcoming');

            // Token details
            $table->string('token_symbol');
            $table->decimal('total_supply', 65, 0)->nullable();
            $table->decimal('tokens_for_sale', 65, 0)->nullable();
            $table->decimal('percentage_of_supply', 8, 2)->nullable();

            // Presale details
            $table->enum('stage', ['ICO', 'IDO', 'IEO', 'Presale', 'Privatesale'])->default('ICO');
            $table->string('launchpad')->nullable();
            $table->dateTime('start_date');
            $table->dateTime('end_date');
            $table->decimal('token_price', 20, 8);
            $table->string('token_price_currency')->default('USDT');
            $table->string('exchange_rate')->nullable();
            $table->decimal('soft_cap', 20, 8)->nullable();
            $table->decimal('hard_cap', 20, 8)->nullable();
            $table->decimal('personal_cap', 20, 8)->nullable();
            $table->decimal('fundraising_goal', 20, 2)->nullable();

            // Website & Resources
            $table->string('website_url')->nullable();
            $table->string('whitepaper_url')->nullable();
            $table->json('social_media_links')->nullable();
            $table->string('project_category')->nullable();
            $table->string('contract_address')->nullable();

            // Media
            $table->string('logo_image')->nullable();

            // Engagement metrics
            $table->integer('upvotes_count')->default(0);

            // Stats
            $table->integer('view_count')->default(0);

            // Creator
            $table->foreignId('created_by')->constrained('users');

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('presales');
    }
};
