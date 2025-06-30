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
        Schema::create('crypto_exchange_listings', function (Blueprint $table) {
            $table->id();
            $table->string('coin_name');
            $table->string('coin_symbol');
            $table->string('exchange_name');
            $table->string('exchange_logo')->nullable();
            $table->string('coin_logo')->nullable();
            $table->enum('listing_type', ['listing', 'delisting']);
            $table->datetime('listing_date');
            $table->string('trading_pairs')->nullable();
            $table->text('description')->nullable();
            $table->text('about_project')->nullable();
            $table->string('website_url')->nullable();
            $table->string('explorer_url')->nullable();
            $table->text('what_happens')->nullable(); // What happens when listed/delisted
            $table->text('final_thoughts')->nullable();
            $table->integer('already_listing_count')->default(0);
            $table->string('banner_image')->nullable();
            $table->integer('yes_votes')->default(0);
            $table->integer('no_votes')->default(0);
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_published')->default(true);
            $table->string('slug')->unique();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('crypto_exchange_listings');
    }
};
