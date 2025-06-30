<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Airdrop;
use App\Models\User;

class AirdropFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Airdrop::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->sentence(),
            'slug' => $this->faker->slug(),
            'description' => $this->faker->paragraph(),
            'status' => $this->faker->randomElement(['ongoing', 'upcoming', 'potential', 'ended']),

            // Token details
            'token_symbol' => strtoupper($this->faker->word()),
            'type' => $this->faker->randomElement(['token', 'nft', 'other']),
            'blockchain' => $this->faker->randomElement(['Ethereum', 'Solana', 'Binance Smart Chain', 'Polygon', 'Arbitrum', 'Optimism', 'BASE']),

            // Airdrop details
            'start_date' => $this->faker->dateTimeThisYear(),
            'end_date' => $this->faker->optional()->dateTimeThisYear(),
            'total_supply' => $this->faker->numerify('##########'),
            'airdrop_qty' => $this->faker->numerify('#######'),
            'winners_count' => $this->faker->optional()->numberBetween(100, 10000),
            'usd_value' => $this->faker->optional()->randomFloat(2, 1000, 1000000),

            // Metrics
            'upvotes_count' => $this->faker->numberBetween(0, 5000),
            'tasks_count' => $this->faker->numberBetween(1, 5),
            'is_featured' => $this->faker->boolean(20), // 20% chance of being featured
            'view_count' => $this->faker->numberBetween(100, 50000),

            // Media
            'logo_image' => $this->faker->imageUrl(400, 400),

            // Creator
            'created_by' => User::factory(),
        ];
    }

    /**
     * Indicate that the airdrop is ongoing.
     */
    public function ongoing(): self
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'ongoing',
                'start_date' => now()->subDays(rand(1, 30)),
                'end_date' => now()->addDays(rand(1, 30)),
            ];
        });
    }

    /**
     * Indicate that the airdrop is upcoming.
     */
    public function upcoming(): self
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'upcoming',
                'start_date' => now()->addDays(rand(1, 30)),
                'end_date' => now()->addDays(rand(31, 60)),
            ];
        });
    }

    /**
     * Indicate that the airdrop is ended.
     */
    public function ended(): self
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'ended',
                'start_date' => now()->subDays(rand(31, 60)),
                'end_date' => now()->subDays(rand(1, 30)),
            ];
        });
    }

    /**
     * Indicate that the airdrop is featured.
     */
    public function featured(): self
    {
        return $this->state(function (array $attributes) {
            return [
                'is_featured' => true,
            ];
        });
    }
}
