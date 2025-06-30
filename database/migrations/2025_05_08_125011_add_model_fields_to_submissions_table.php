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
        Schema::table('submissions', function (Blueprint $table) {
            $table->string('model_type')->nullable()->after('submitted_by');
            $table->unsignedBigInteger('model_id')->nullable()->after('model_type');
            $table->string('slug')->nullable()->after('name');

            // Add an index for faster lookups
            $table->index(['model_type', 'model_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('submissions', function (Blueprint $table) {
            $table->dropIndex(['model_type', 'model_id']);
            $table->dropColumn(['model_type', 'model_id', 'slug']);
        });
    }
};
