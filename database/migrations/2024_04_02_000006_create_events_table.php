<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description');
            $table->enum('type', [
                'crypto_event',
                'web3_event',
                'community_event',
                'ai_event'
            ]);

            // Event details
            $table->dateTime('start_date');
            $table->dateTime('end_date');
            $table->string('location')->nullable();
            $table->boolean('is_virtual')->default(false);
            $table->string('virtual_link')->nullable();
            $table->string('registration_link')->nullable();
            $table->integer('max_participants')->nullable();
            $table->integer('current_participants')->default(0);

            // Media
            $table->string('banner_image')->nullable();
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();

            // Status
            $table->enum('status', ['upcoming', 'ongoing', 'completed', 'cancelled'])->default('upcoming');

            // Organizer
            $table->foreignId('organizer_id')->constrained('users');

            $table->timestamps();
            $table->softDeletes();
        });

        // Event categories pivot table
        Schema::create('event_category', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id')->constrained()->onDelete('cascade');
            $table->string('category_name');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('event_category');
        Schema::dropIfExists('events');
    }
};
