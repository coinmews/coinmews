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
        Schema::create('airdrops', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->enum('status', ['ongoing', 'upcoming', 'potential', 'ended']);

            // Token details
            $table->string('token_symbol');
            $table->enum('type', ['token', 'nft', 'other'])->default('token');
            $table->string('blockchain')->nullable();

            // Airdrop details
            $table->dateTime('start_date');
            $table->dateTime('end_date')->nullable();
            $table->decimal('total_supply', 65, 0)->nullable();
            $table->decimal('airdrop_qty', 65, 0)->nullable();
            $table->integer('winners_count')->nullable();
            $table->decimal('usd_value', 20, 2)->nullable();

            // Engagement metrics
            $table->integer('upvotes_count')->default(0);
            $table->integer('tasks_count')->default(0);
            $table->boolean('is_featured')->default(false);

            // Media
            $table->string('logo_image')->nullable();

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
        Schema::dropIfExists('airdrops');
    }
};
