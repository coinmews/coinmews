<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\Comment;
use App\Models\User;
use Illuminate\Database\Seeder;

class CommentSeeder extends Seeder
{
    public function run(): void
    {
        $articles = Article::all();
        $users = User::all();

        // Create 5-10 comments for each article
        $articles->each(function ($article) use ($users) {
            $commentCount = fake()->numberBetween(2, 5);

            // Create approved comments
            Comment::factory()
                ->count($commentCount)
                ->create([
                    'commentable_id' => $article->id,
                    'user_id' => $users->random()->id,
                ]);

            // Create some pending comments
            Comment::factory()
                ->count(2)
                ->pending()
                ->create([
                    'commentable_id' => $article->id,
                    'user_id' => $users->random()->id,
                ]);

            // Create some spam comments
            Comment::factory()
                ->count(1)
                ->spam()
                ->create([
                    'commentable_id' => $article->id,
                    'user_id' => $users->random()->id,
                ]);

            // Create some reported comments
            Comment::factory()
                ->count(1)
                ->reported()
                ->create([
                    'commentable_id' => $article->id,
                    'user_id' => $users->random()->id,
                ]);
        });
    }
}
