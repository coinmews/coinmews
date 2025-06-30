<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Category;

class CategoryFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Category::class;

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
            'image' => $this->faker->imageUrl(),
            'parent_id' => $this->faker->optional()->randomElement(Category::pluck('id')->toArray()), // optional parent
            'order' => $this->faker->randomNumber(2),
            'meta_title' => $this->faker->sentence(),
            'meta_description' => $this->faker->text(),
            'meta_image' => $this->faker->imageUrl(),
            'article_count' => $this->faker->randomNumber(2),
            'view_count' => $this->faker->randomNumber(3),
        ];
    }
}
