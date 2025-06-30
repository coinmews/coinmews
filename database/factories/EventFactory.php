<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Event;
use App\Models\User;

class EventFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Event::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(),
            'slug' => $this->faker->slug(),
            'description' => $this->faker->paragraph(),
            'type' => $this->faker->randomElement([
                'crypto_event',
                'web3_event',
                'community_event',
                'ai_event'
            ]),
            'start_date' => $this->faker->dateTimeThisYear(),
            'end_date' => $this->faker->dateTimeThisYear(),
            'location' => $this->faker->city(),
            'virtual_link' => $this->faker->optional()->url(),
            'is_virtual' => $this->faker->boolean(),
            'registration_link' => $this->faker->optional()->url(),
            'max_participants' => $this->faker->randomNumber(3),
            'current_participants' => $this->faker->randomNumber(2),
            'banner_image' => $this->faker->imageUrl(1920, 1080),
            'meta_title' => $this->faker->sentence(),
            'meta_description' => $this->faker->paragraph(),
            'status' => $this->faker->randomElement(['upcoming', 'ongoing', 'completed', 'cancelled']),
            'organizer_id' => User::factory(),
        ];
    }
}
