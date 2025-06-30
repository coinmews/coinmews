<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Tag;

class TagFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Tag::class;

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
            'description' => $this->faker->sentence(),
            'usage_count' => $this->faker->randomNumber(2),
            'trending_score' => $this->faker->randomNumber(2),
            'last_used_at' => $this->faker->dateTimeThisYear(),
            'meta_title' => $this->faker->sentence(),
            'meta_description' => $this->faker->paragraph(),
        ];
    }

    /**
     * Define a trending tag.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function trending(): self
    {
        return $this->state([
            'trending_score' => $this->faker->randomNumber(3), // higher trending score
        ]);
    }

    /**
     * Define a tag with articles.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function withArticles(): self
    {
        return $this->afterCreating(function (Tag $tag) {
            $tag->articles()->attach(\App\Models\Article::factory(3)->create());
        });
    }
}
