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
        // Drop the existing tables
        Schema::dropIfExists('airdrops');
        Schema::dropIfExists('presales');
    }

    /**
     * Reverse the migrations.
     * 
     * This is intentionally empty since we can't restore the
     * tables with their original schema without additional code.
     */
    public function down(): void
    {
        // We cannot easily recreate the tables with the same schema
        // in a rollback scenario without additional code
    }
};
