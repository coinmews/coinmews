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
        // We're going to update the existing submissions table instead of creating a new one
        Schema::table('submissions', function (Blueprint $table) {
            // Remove fields we don't need
            $table->dropColumn([
                'meta_title',
                'meta_description',
                'author_bio',
                'reading_time',
                'company_name',
                'contact_phone',
                'official_links',
                'token_name',
                'token_network',
                'airdrop_amount',
                'requirements',
                'price',
                'requires_kyc',
                'kyc_requirements',
                'location',
                'is_virtual',
                'virtual_link',
                'registration_link',
                'max_participants'
            ]);

            // Add new columns for presale submissions
            $table->string('name')->nullable();
            $table->string('stage')->nullable();
            $table->string('launchpad')->nullable();
            $table->string('token_price')->nullable();
            $table->string('token_price_currency')->nullable();
            $table->string('tokens_for_sale')->nullable();
            $table->string('percentage_of_supply')->nullable();
            $table->string('fundraising_goal')->nullable();
            $table->string('website_url')->nullable();
            $table->string('whitepaper_url')->nullable();
            $table->string('contract_address')->nullable();
            $table->string('logo_image')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('submissions', function (Blueprint $table) {
            // Drop new columns
            $table->dropColumn([
                'name',
                'stage',
                'launchpad',
                'token_price',
                'token_price_currency',
                'tokens_for_sale',
                'percentage_of_supply',
                'fundraising_goal',
                'website_url',
                'whitepaper_url',
                'contract_address',
                'logo_image'
            ]);

            // Restore old columns
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->text('author_bio')->nullable();
            $table->integer('reading_time')->nullable();
            $table->string('company_name')->nullable();
            $table->string('contact_phone')->nullable();
            $table->json('official_links')->nullable();
            $table->string('token_name')->nullable();
            $table->string('token_network')->nullable();
            $table->decimal('airdrop_amount', 65, 18)->nullable();
            $table->json('requirements')->nullable();
            $table->decimal('price', 65, 18)->nullable();
            $table->boolean('requires_kyc')->default(false);
            $table->json('kyc_requirements')->nullable();
            $table->string('location')->nullable();
            $table->boolean('is_virtual')->default(false);
            $table->string('virtual_link')->nullable();
            $table->string('registration_link')->nullable();
            $table->integer('max_participants')->nullable();
        });
    }
};
