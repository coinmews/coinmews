<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('submissions', function (Blueprint $table) {
            $table->id();

            // Basic fields
            $table->string('title');
            $table->text('content');
            $table->enum('type', [
                'guest_post',
                'sponsored_content',
                'press_release',
                'airdrop',
                'presale',
                'ico',
                'ido',
                'ieo',
                'event'
            ]);
            $table->enum('status', [
                'pending',
                'reviewing',
                'approved',
                'rejected'
            ])->default('pending');

            // Review fields
            $table->text('feedback')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('submitted_by')->constrained('users')->onDelete('cascade');

            // SEO fields
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();

            // Guest Posts & Sponsored Content fields
            $table->text('author_bio')->nullable();
            $table->integer('reading_time')->nullable();

            // Press Release fields
            $table->string('company_name')->nullable();
            $table->string('contact_phone')->nullable();
            $table->json('official_links')->nullable();

            // Airdrop fields
            $table->string('token_name')->nullable();
            $table->string('token_symbol')->nullable();
            $table->string('token_network')->nullable();
            $table->decimal('total_supply', 65, 18)->nullable();
            $table->decimal('airdrop_amount', 65, 18)->nullable();
            $table->timestamp('start_date')->nullable();
            $table->timestamp('end_date')->nullable();
            $table->json('requirements')->nullable();

            // Presale/ICO/IDO/IEO fields
            $table->decimal('price', 65, 18)->nullable();
            $table->decimal('soft_cap', 65, 18)->nullable();
            $table->decimal('hard_cap', 65, 18)->nullable();
            $table->boolean('requires_kyc')->default(false);
            $table->json('kyc_requirements')->nullable();

            // Event fields
            $table->string('location')->nullable();
            $table->boolean('is_virtual')->default(false);
            $table->string('virtual_link')->nullable();
            $table->string('registration_link')->nullable();
            $table->integer('max_participants')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('submissions');
    }
};
