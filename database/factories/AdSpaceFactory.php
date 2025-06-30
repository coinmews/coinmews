<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\AdSpace;
use App\Models\User;

class AdSpaceFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = AdSpace::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->word(),
            'slug' => $this->faker->slug(),
            'description' => $this->faker->paragraph(),
            'location' => $this->faker->randomElement(['homepage_top', 'homepage_side', 'post_top']),
            'size' => $this->faker->randomElement(['banner_728x90', 'banner_300x250', 'banner_160x600']),
            'is_premium' => $this->faker->boolean(),
            'price_per_day' => $this->faker->randomFloat(2, 10, 200),
            'is_active' => $this->faker->boolean(),
            'impression_count' => $this->faker->randomNumber(5),
            'click_count' => $this->faker->randomNumber(3),
        ];
    }
}
