<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(): void
    {
        // Create 5 root categories
        Category::factory(5)->create();

        // Create 3 nested categories (with parent-child relationships)
        Category::factory()->create([
            'name' => 'Technology',
            'parent_id' => null,
            'slug' => 'technology-' . uniqid(),
        ])->each(function ($category) {
            $category->children()->createMany([
                ['name' => 'AI', 'slug' => 'ai-' . uniqid()],
                ['name' => 'Blockchain', 'slug' => 'blockchain-' . uniqid()],
            ]);
        });

        // Create 3 more categories
        Category::factory(3)->create();
    }
}
