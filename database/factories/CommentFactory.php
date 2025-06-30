<?php

namespace Database\Factories;

use App\Models\Article;
use App\Models\Comment;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CommentFactory extends Factory
{
    protected $model = Comment::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'commentable_type' => Article::class,
            'commentable_id' => Article::factory(),
            'content' => fake()->paragraph(),
            'ip_address' => fake()->ipv4,
            'user_agent' => fake()->userAgent,
            'is_spam' => false,
            'is_approved' => fake()->boolean(80), // 80% chance of being approved
            'approved_at' => fn(array $attributes) => $attributes['is_approved'] ? fake()->dateTimeBetween('-1 year', 'now') : null,
            'approved_by' => fn(array $attributes) => $attributes['is_approved'] ? User::factory() : null,
            'moderation_notes' => fn(array $attributes) => $attributes['is_approved'] ? null : fake()->sentence(),
            'report_count' => 0,
            'last_reported_at' => null,
        ];
    }

    public function spam(): self
    {
        return $this->state(fn(array $attributes) => [
            'is_spam' => true,
            'is_approved' => false,
            'approved_at' => null,
            'approved_by' => null,
            'moderation_notes' => 'Detected as spam',
        ]);
    }

    public function pending(): self
    {
        return $this->state(fn(array $attributes) => [
            'is_spam' => false,
            'is_approved' => false,
            'approved_at' => null,
            'approved_by' => null,
            'moderation_notes' => null,
        ]);
    }

    public function reported(): self
    {
        return $this->state(fn(array $attributes) => [
            'report_count' => fake()->numberBetween(1, 5),
            'last_reported_at' => fake()->dateTimeBetween('-1 month', 'now'),
        ]);
    }
}
