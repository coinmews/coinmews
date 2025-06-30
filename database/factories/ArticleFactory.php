<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Article;
use App\Models\User;
use App\Models\Category;
use App\Models\Tag;

class ArticleFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Article::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence,
            'slug' => $this->faker->slug,
            'content' => $this->faker->paragraphs(3, true),
            'excerpt' => $this->faker->text(150),
            'banner_image' => $this->faker->imageUrl(1920, 1080),
            'content_type' => $this->faker->randomElement([
                'news',
                'blog',
                'press_release',
                'sponsored',
                'price_prediction',
                'guest_post',
                'research_report',
                'web3_bulletin',
                'web_story',
                'short_news'
            ]),
            'status' => $this->faker->randomElement(['draft', 'published', 'featured']),
            'is_breaking_news' => $this->faker->boolean(),
            'is_featured' => $this->faker->boolean(),
            'view_count' => $this->faker->numberBetween(0, 1000),
            'category_id' => Category::factory(),
            'meta_title' => $this->faker->sentence,
            'meta_description' => $this->faker->text(200),
            'author_id' => User::factory(),
            'published_at' => $this->faker->dateTimeThisYear(),

            // News & Short News fields
            'source' => null,
            'location' => null,
            'is_time_sensitive' => false,

            // Blog & Guest Post fields
            'author_bio' => null,
            'reading_time' => null,

            // Price Prediction & Research Report fields
            'price_target_low' => null,
            'price_target_high' => null,
            'time_horizon' => null,
            'methodology' => null,
            'data_sources' => null,
            'risk_factors' => null,

            // Press Release & Web3 Bulletin fields
            'company_name' => null,
            'contact_email' => null,
            'contact_phone' => null,
            'official_links' => null,

            // Web Story fields
            'story_duration' => null,
            'story_slides' => null,
            'media_elements' => null,
            'interactive_elements' => null,
            'is_vertical' => true,
            'slides_count' => 0,
        ];
    }

    /**
     * Define a news article.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function news(): self
    {
        return $this->state([
            'content_type' => 'news',
            'source' => $this->faker->company,
            'location' => $this->faker->city,
            'is_time_sensitive' => $this->faker->boolean,
        ]);
    }

    /**
     * Define a short news article.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function shortNews(): self
    {
        return $this->state([
            'content_type' => 'short_news',
            'source' => $this->faker->company,
            'location' => $this->faker->city,
            'is_time_sensitive' => true,
            'content' => $this->faker->paragraph, // Shorter content
        ]);
    }

    /**
     * Define a blog article.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function blog(): self
    {
        return $this->state([
            'content_type' => 'blog',
            'author_bio' => $this->faker->paragraph,
            'reading_time' => $this->faker->numberBetween(3, 20),
        ]);
    }

    /**
     * Define a guest post article.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function guestPost(): self
    {
        return $this->state([
            'content_type' => 'guest_post',
            'author_bio' => $this->faker->paragraph,
            'reading_time' => $this->faker->numberBetween(3, 20),
        ]);
    }

    /**
     * Define a price analysis article.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function priceAnalysis(): self
    {
        return $this->state([
            'content_type' => 'price_prediction',
            'price_target_low' => $this->faker->randomFloat(2, 100, 10000),
            'price_target_high' => $this->faker->randomFloat(2, 10000, 100000),
            'time_horizon' => $this->faker->randomElement(['1 month', '3 months', '6 months', '1 year']),
            'methodology' => $this->faker->paragraph,
            'data_sources' => [
                'technical_analysis' => $this->faker->boolean,
                'fundamental_analysis' => $this->faker->boolean,
                'market_sentiment' => $this->faker->boolean,
            ],
            'risk_factors' => $this->faker->paragraphs(2, true),
        ]);
    }

    /**
     * Define a research report article.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function researchReport(): self
    {
        return $this->state([
            'content_type' => 'research_report',
            'methodology' => $this->faker->paragraph,
            'data_sources' => [
                'on_chain_data' => $this->faker->boolean,
                'market_data' => $this->faker->boolean,
                'interviews' => $this->faker->boolean,
                'surveys' => $this->faker->boolean,
            ],
            'risk_factors' => $this->faker->paragraphs(2, true),
        ]);
    }

    /**
     * Define a press release article.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function pressRelease(): self
    {
        return $this->state([
            'content_type' => 'press_release',
            'company_name' => $this->faker->company,
            'contact_email' => $this->faker->companyEmail,
            'contact_phone' => $this->faker->phoneNumber,
            'official_links' => [
                'website' => $this->faker->url,
                'twitter' => $this->faker->url,
                'linkedin' => $this->faker->url,
            ],
        ]);
    }

    /**
     * Define a web3 bulletin article.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function web3Bulletin(): self
    {
        return $this->state([
            'content_type' => 'web3_bulletin',
            'company_name' => $this->faker->company,
            'contact_email' => $this->faker->companyEmail,
            'contact_phone' => $this->faker->phoneNumber,
            'official_links' => [
                'website' => $this->faker->url,
                'twitter' => $this->faker->url,
                'discord' => $this->faker->url,
                'telegram' => $this->faker->url,
            ],
        ]);
    }

    /**
     * Define a sponsored article.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function sponsored(): self
    {
        return $this->state([
            'content_type' => 'sponsored',
            'company_name' => $this->faker->company,
            'contact_email' => $this->faker->companyEmail,
            'official_links' => [
                'website' => $this->faker->url,
                'social_media' => $this->faker->url,
            ],
        ]);
    }

    /**
     * Define a web story article.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function webStory(): self
    {
        $slides = [];
        $slideCount = $this->faker->numberBetween(3, 8);

        for ($i = 0; $i < $slideCount; $i++) {
            $interactiveElement = [
                'type' => $this->faker->randomElement(['button', 'link', 'mention', 'poll', 'location']),
                'text' => $this->faker->words(3, true),
                'url' => $this->faker->url,
            ];

            // Enhanced poll data structure
            if ($interactiveElement['type'] === 'poll') {
                $interactiveElement['poll_options'] = [
                    ['option' => $this->faker->words(3, true)],
                    ['option' => $this->faker->words(3, true)],
                    ['option' => $this->faker->words(3, true)],
                    ['option' => $this->faker->words(3, true)]
                ];
            }

            $slides[] = [
                'image' => $this->faker->imageUrl(1080, 1920),
                'content' => $this->faker->paragraph,
                'duration' => $this->faker->numberBetween(3, 8),
                'interactive_elements' => [$interactiveElement]
            ];
        }

        // Force at least one slide to have a poll
        $pollSlideIndex = $this->faker->numberBetween(0, $slideCount - 1);
        $pollElement = [
            'type' => 'poll',
            'text' => $this->faker->sentence(4),
            'poll_options' => [
                ['option' => $this->faker->words(3, true)],
                ['option' => $this->faker->words(3, true)],
                ['option' => $this->faker->words(3, true)],
                ['option' => $this->faker->words(3, true)]
            ]
        ];
        $slides[$pollSlideIndex]['interactive_elements'] = [$pollElement];

        return $this->state([
            'content_type' => 'web_story',
            'story_duration' => $slideCount * 5,
            'story_slides' => $slides,
            'is_vertical' => true,
            'slides_count' => $slideCount,
        ]);
    }

    /**
     * Define a featured article.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function featured(): self
    {
        return $this->state([
            'is_featured' => true,
            'status' => 'published',
        ]);
    }

    /**
     * Define a breaking news article.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function breakingNews(): self
    {
        return $this->news()->state([
            'is_breaking_news' => true,
            'status' => 'published',
            'is_time_sensitive' => true,
        ]);
    }
}
