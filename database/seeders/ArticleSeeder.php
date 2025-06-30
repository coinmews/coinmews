<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Article;
use App\Models\Tag;

class ArticleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(): void
    {
        // Create 10 articles of each type
        Article::factory(10)->news()->create();
        Article::factory(10)->blog()->create();
        Article::factory(10)->pressRelease()->create();
        Article::factory(10)->sponsored()->create();
        Article::factory(10)->priceAnalysis()->create();
        Article::factory(10)->guestPost()->create();
        Article::factory(10)->researchReport()->create();
        Article::factory(10)->web3Bulletin()->create();
        Article::factory(10)->webStory()->create();
        Article::factory(10)->shortNews()->create();

        // Create featured articles (2 of each type)
        Article::factory(2)->news()->featured()->create();
        Article::factory(2)->blog()->featured()->create();
        Article::factory(2)->priceAnalysis()->featured()->create();
        Article::factory(2)->webStory()->featured()->create();
        Article::factory(2)->researchReport()->featured()->create();

        // Create breaking news (5 articles)
        Article::factory(5)->breakingNews()->create();

        // Create tags and attach them to articles
        $tags = Tag::factory(20)->create(); // Creating more tags for variety
        Article::all()->each(function ($article) use ($tags) {
            $article->tags()->attach(
                $tags->random(rand(2, 5))->pluck('id')->toArray() // Attaching 2-5 tags per article
            );
        });
    }
}
