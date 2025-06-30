<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('airdrops', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description');
            $table->enum('status', ['ongoing', 'upcoming', 'potential', 'completed', 'cancelled']);

            // Token details
            $table->string('token_name');
            $table->string('token_symbol');
            $table->string('token_network');
            $table->string('token_contract_address')->nullable();

            // Airdrop details
            $table->dateTime('start_date');
            $table->dateTime('end_date')->nullable();
            $table->integer('total_supply')->nullable();
            $table->integer('airdrop_amount')->nullable();
            $table->json('requirements')->nullable();

            // Verification
            $table->boolean('is_verified')->default(false);
            $table->json('verification_rules')->nullable();

            // Media
            $table->string('banner_image')->nullable();
            $table->string('logo_image')->nullable();

            // SEO
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();

            // Stats
            $table->integer('participant_count')->default(0);
            $table->integer('view_count')->default(0);

            // Creator
            $table->foreignId('created_by')->constrained('users');

            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('presales', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description');
            $table->enum('status', ['upcoming', 'active', 'completed', 'cancelled']);

            // Token details
            $table->string('token_name');
            $table->string('token_symbol');
            $table->string('token_network');
            $table->string('token_contract_address')->nullable();

            // Presale details
            $table->dateTime('start_date');
            $table->dateTime('end_date');
            $table->decimal('price', 20, 8);
            $table->decimal('min_buy', 20, 8);
            $table->decimal('max_buy', 20, 8);
            $table->decimal('soft_cap', 20, 8);
            $table->decimal('hard_cap', 20, 8);

            // KYC
            $table->boolean('requires_kyc')->default(true);
            $table->json('kyc_requirements')->nullable();

            // Media
            $table->string('banner_image')->nullable();
            $table->string('logo_image')->nullable();

            // SEO
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();

            // Stats
            $table->integer('participant_count')->default(0);
            $table->decimal('total_raised', 20, 8)->default(0);

            // Creator
            $table->foreignId('created_by')->constrained('users');

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('presales');
        Schema::dropIfExists('airdrops');
    }
};
