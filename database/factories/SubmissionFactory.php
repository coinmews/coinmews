<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Submission;
use App\Models\User;
use Illuminate\Support\Str;

class SubmissionFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Submission::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(),
            'content' => $this->faker->paragraph(),
            'name' => $this->faker->company(),
            'description' => $this->faker->paragraph(),
            'type' => $this->faker->randomElement([
                'guest_post',
                'sponsored_content',
                'press_release',
                'airdrop',
                'presale',
                'event'
            ]),
            'status' => $this->faker->randomElement([
                'pending',
                'reviewing',
                'approved',
                'rejected'
            ]),
            'feedback' => $this->faker->optional()->text(),
            'reviewed_at' => $this->faker->optional()->dateTime(),
            'reviewed_by' => User::where('is_admin', true)->exists()
                ? User::where('is_admin', true)->inRandomOrder()->first()->id
                : null,
            'submitted_by' => User::exists()
                ? User::inRandomOrder()->first()->id
                : User::factory(),
            'token_symbol' => strtoupper($this->faker->lexify('???')),
            'stage' => $this->faker->randomElement(['ICO', 'IDO', 'IEO', 'Presale', 'Privatesale']),
            'launchpad' => $this->faker->randomElement(['PinkSale', 'DxSale', 'Unicrypt', null]),
            'start_date' => $this->faker->dateTimeBetween('now', '+2 months'),
            'end_date' => $this->faker->dateTimeBetween('+2 months', '+4 months'),
            'token_price' => $this->faker->randomFloat(8, 0.00001, 0.1),
            'token_price_currency' => $this->faker->randomElement(['USD', 'ETH', 'BNB']),
            'total_supply' => $this->faker->numberBetween(100000000, 10000000000),
            'tokens_for_sale' => $this->faker->numberBetween(1000000, 100000000),
            'percentage_of_supply' => $this->faker->numberBetween(5, 50),
            'soft_cap' => $this->faker->numberBetween(50, 500),
            'hard_cap' => $this->faker->numberBetween(500, 5000),
            'fundraising_goal' => $this->faker->numberBetween(50000, 5000000),
            'website_url' => $this->faker->url(),
            'whitepaper_url' => $this->faker->url(),
            'contract_address' => '0x' . $this->faker->sha1(),
            'logo_image' => 'presales/logos/logo_' . $this->faker->word() . '.png',
            'banner_image' => 'presales/banners/banner_' . $this->faker->word() . '.png',
            'slug' => function (array $attributes) {
                return Str::slug($attributes['name']);
            },
            'model_type' => null,
            'model_id' => null,
        ];
    }

    public function guestPost(): self
    {
        return $this->state([
            'type' => 'guest_post',
            'logo_image' => 'logos/logo_' . $this->faker->word() . '.png',
            'banner_image' => 'articles/banner_' . $this->faker->word() . '.png',
            'website_url' => $this->faker->url(),
        ]);
    }

    public function sponsoredContent(): self
    {
        return $this->state([
            'type' => 'sponsored_content',
            'logo_image' => 'logos/logo_' . $this->faker->word() . '.png',
            'banner_image' => 'articles/banner_' . $this->faker->word() . '.png',
            'website_url' => $this->faker->url(),
        ]);
    }

    public function pressRelease(): self
    {
        return $this->state([
            'type' => 'press_release',
            'logo_image' => 'logos/logo_' . $this->faker->word() . '.png',
            'banner_image' => 'articles/banner_' . $this->faker->word() . '.png',
            'website_url' => $this->faker->url(),
        ]);
    }

    public function airdrop(): self
    {
        return $this->state([
            'type' => 'airdrop',
            'token_symbol' => strtoupper($this->faker->lexify('???')),
            'start_date' => $this->faker->dateTimeBetween('now', '+2 months'),
            'end_date' => $this->faker->dateTimeBetween('+2 months', '+4 months'),
            'total_supply' => $this->faker->numberBetween(10000000, 1000000000),
            'logo_image' => 'airdrops/logo_' . $this->faker->word() . '.png',
            'banner_image' => 'airdrops/banner_' . $this->faker->word() . '.png',
            'contract_address' => '0x' . $this->faker->sha1(),
            'website_url' => $this->faker->url(),
        ]);
    }

    public function presale(): self
    {
        return $this->state([
            'type' => 'presale',
            'token_symbol' => strtoupper($this->faker->lexify('???')),
            'stage' => $this->faker->randomElement(['ICO', 'IDO', 'IEO', 'Presale', 'Privatesale']),
            'launchpad' => $this->faker->randomElement(['PinkSale', 'DxSale', 'Unicrypt', 'DAOPad', 'TrustPad']),
            'start_date' => $this->faker->dateTimeBetween('now', '+2 months'),
            'end_date' => $this->faker->dateTimeBetween('+2 months', '+4 months'),
            'token_price' => $this->faker->randomFloat(8, 0.00001, 0.1),
            'token_price_currency' => $this->faker->randomElement(['USD', 'ETH', 'BNB']),
            'total_supply' => $this->faker->numberBetween(100000000, 10000000000),
            'tokens_for_sale' => $this->faker->numberBetween(1000000, 100000000),
            'percentage_of_supply' => $this->faker->numberBetween(5, 50),
            'soft_cap' => $this->faker->numberBetween(50, 500),
            'hard_cap' => $this->faker->numberBetween(500, 5000),
            'fundraising_goal' => $this->faker->numberBetween(50000, 5000000),
            'logo_image' => 'presales/logos/logo_' . $this->faker->word() . '.png',
            'banner_image' => 'presales/banners/banner_' . $this->faker->word() . '.png',
            'website_url' => $this->faker->url(),
            'whitepaper_url' => $this->faker->url(),
            'contract_address' => '0x' . $this->faker->sha1(),
        ]);
    }

    public function event(): self
    {
        return $this->state([
            'type' => 'event',
            'start_date' => $this->faker->dateTimeBetween('now', '+2 months'),
            'end_date' => $this->faker->dateTimeBetween('+2 months', '+4 months'),
            'banner_image' => 'events/banner_' . $this->faker->word() . '.png',
            'website_url' => $this->faker->url(),
        ]);
    }

    /**
     * Define a submission with a specific status.
     *
     * @param string $status
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function withStatus(string $status): self
    {
        return $this->state([
            'status' => $status,
        ]);
    }
}
