<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Tag;

class TagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(): void
    {
        // Create 10 tags
        Tag::factory(10)->create();

        // Create 5 trending tags
        Tag::factory(5)->trending()->create();

        // Create 3 tags with associated articles
        Tag::factory(3)->withArticles()->create();
    }
}
