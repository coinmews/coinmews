<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Presale;
use App\Models\User;

class PresaleFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Presale::class;

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
            'status' => $this->faker->randomElement(['upcoming', 'ongoing', 'ended']),
            'token_symbol' => strtoupper($this->faker->word()),
            'total_supply' => $this->faker->randomNumber(9),
            'tokens_for_sale' => $this->faker->randomNumber(8),
            'percentage_of_supply' => $this->faker->randomFloat(2, 1, 100),
            'stage' => $this->faker->randomElement(['ICO', 'IDO', 'IEO', 'Presale', 'Privatesale']),
            'launchpad' => $this->faker->optional()->randomElement(['p2pb2b', '', 'On Website']),
            'start_date' => $this->faker->dateTimeThisYear(),
            'end_date' => $this->faker->dateTimeThisYear(),
            'token_price' => $this->faker->randomFloat(8, 0.0001, 100),
            'token_price_currency' => $this->faker->randomElement(['USDT', 'USD', 'ETH', 'BNB']),
            'exchange_rate' => $this->faker->optional()->numberBetween(1, 100) . ' ' . $this->faker->currencyCode(),
            'soft_cap' => $this->faker->optional()->randomFloat(8, 0.0001, 1000),
            'hard_cap' => $this->faker->optional()->randomFloat(8, 0.0001, 1000),
            'personal_cap' => $this->faker->optional()->randomFloat(8, 0.0001, 10),
            'fundraising_goal' => $this->faker->optional()->randomFloat(2, 1000, 10000),
            'website_url' => $this->faker->optional()->url(),
            'whitepaper_url' => $this->faker->optional()->url(),
            'social_media_links' => [
                'twitter' => $this->faker->optional()->url(),
                'telegram' => $this->faker->optional()->url(),
                'discord' => $this->faker->optional()->url(),
                'medium' => $this->faker->optional()->url(),
            ],
            'project_category' => $this->faker->optional()->randomElement(['DeFi', 'GameFi', 'NFT', 'Metaverse', 'AI']),
            'contract_address' => $this->faker->optional()->sha256(),
            'logo_image' => $this->faker->imageUrl(512, 512),
            'upvotes_count' => $this->faker->numberBetween(0, 2000),
            'view_count' => $this->faker->numberBetween(10, 5000),
            'created_by' => User::factory(),
        ];
    }
}
