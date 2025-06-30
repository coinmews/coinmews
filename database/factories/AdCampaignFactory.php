<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\AdCampaign;
use App\Models\User;
use App\Models\AdSpace;

class AdCampaignFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = AdCampaign::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->word(),
            'ad_space_id' => AdSpace::factory(),
            'advertiser_id' => User::factory(),
            'ad_content' => $this->faker->paragraph(),
            'ad_image' => $this->faker->imageUrl(),
            'ad_link' => $this->faker->url(),
            'start_date' => $this->faker->dateTimeThisMonth(),
            'end_date' => $this->faker->dateTimeThisYear(),
            'status' => $this->faker->randomElement(['pending', 'active', 'paused', 'completed', 'cancelled']),
            'budget' => $this->faker->randomFloat(2, 100, 1000),
            'spent' => $this->faker->randomFloat(2, 0, 1000),
            'targeting_rules' => $this->faker->optional()->randomElement([null, []]),
            'impression_count' => $this->faker->randomNumber(4),
            'click_count' => $this->faker->randomNumber(3),
            'ctr' => $this->faker->randomFloat(2, 0, 100),
            'is_approved' => $this->faker->boolean(),
            'approved_at' => $this->faker->optional()->dateTimeThisYear(),
            'approved_by' => User::factory(),
        ];
    }
}
