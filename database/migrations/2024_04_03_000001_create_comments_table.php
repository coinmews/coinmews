<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->morphs('commentable'); // For articles, events, etc.
            $table->text('content');
            $table->string('ip_address')->nullable();
            $table->string('user_agent')->nullable();
            $table->boolean('is_spam')->default(false);
            $table->boolean('is_approved')->default(false);
            $table->timestamp('approved_at')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users')->onDelete('set null');
            $table->text('moderation_notes')->nullable();
            $table->integer('report_count')->default(0);
            $table->timestamp('last_reported_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            // Indexes for better performance
            $table->index('is_spam');
            $table->index('is_approved');
            $table->index('report_count');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('comments');
    }
};
