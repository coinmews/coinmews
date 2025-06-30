<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = User::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'phone' => $this->faker->phoneNumber(),
            'username' => $this->faker->unique()->userName(),
            'password' => Hash::make('password'),
            'is_admin' => $this->faker->boolean(),
            'bio' => $this->faker->paragraph(),
            'website' => $this->faker->url(),
            'twitter' => $this->faker->userName(),
            'telegram' => $this->faker->userName(),
            'discord' => $this->faker->userName(),
            'facebook' => $this->faker->userName(),
            'instagram' => $this->faker->userName(),
            'avatar' => $this->faker->imageUrl(400, 400),
            'birthday' => $this->faker->date(),
            'location' => $this->faker->city(),
            'email_verified_at' => now(),
            'phone_verified_at' => now(),
        ];
    }

    /**
     * Define the admin user state.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function admin(): self
    {
        return $this->state([
            'is_admin' => true,
        ]);
    }
}
