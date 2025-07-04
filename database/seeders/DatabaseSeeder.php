<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            ArticleSeeder::class,
            CategorySeeder::class,
            TagSeeder::class,
            SubmissionSeeder::class,
            EventSeeder::class,
            AdSpaceSeeder::class,
            AdCampaignSeeder::class,
            PresaleSeeder::class,
            AirdropSeeder::class,
            CommentSeeder::class,
        ]);
    }
}
