<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Article;
use App\Models\User;
use App\Models\Category;
use App\Models\Tag;
use App\Models\Comment;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;

class RealArticleSeeder extends Seeder
{
    public function run(): void
    {
        // Use null for banner_image so the model accessor handles the default
        $bannerImage = null;

        // Get existing admin users
        $prince = User::where('email', 'prince@coinmews.io')->first();
        $radhe = User::where('email', 'radhe@CoinMews.io')->first();

        if (!$prince || !$radhe) {
            $this->command->error('Admin users not found. Please run UserSeeder first.');
            return;
        }

        // Create categories if they don't exist
        $categories = [
            'General' => 'general',
            'Bitcoin' => 'bitcoin',
            'Ethereum' => 'ethereum',
            'DeFi' => 'defi',
            'NFTs' => 'nfts',
            'Web3' => 'web3',
            'Trading' => 'trading',
            'Technology' => 'technology',
            'Regulation' => 'regulation',
            'Market Analysis' => 'market-analysis'
        ];

        foreach ($categories as $name => $slug) {
            Category::firstOrCreate(
                ['slug' => $slug],
                ['name' => $name]
            );
        }

        // Create tags if they don't exist
        $tags = [
            'Crypto' => 'crypto',
            'Blockchain' => 'blockchain',
            'Bitcoin' => 'bitcoin',
            'Ethereum' => 'ethereum',
            'DeFi' => 'defi',
            'NFT' => 'nft',
            'Web3' => 'web3',
            'Trading' => 'trading',
            'Technology' => 'technology',
            'Finance' => 'finance',
            'Investment' => 'investment',
            'Market' => 'market',
            'Analysis' => 'analysis',
            'News' => 'news',
            'Research' => 'research'
        ];

        foreach ($tags as $name => $slug) {
            Tag::firstOrCreate(
                ['slug' => $slug],
                ['name' => $name]
            );
        }

        // Get the first category and tag for default use
        $defaultCategory = Category::where('slug', 'general')->first();
        $defaultTags = Tag::whereIn('slug', ['crypto', 'blockchain'])->get();

        // Alternate between Prince and Radhe as authors
        $authors = [$prince, $radhe];
        $authorIndex = 0;

        // 1. News Article
        Article::create([
            'title' => 'Bitcoin Reaches New All-Time High Amid Market Rally',
            'slug' => 'bitcoin-reaches-new-all-time-high',
            'content' => 'Bitcoin has reached a new all-time high of $70,000, marking a significant milestone in the cryptocurrency market. The rally comes amid increasing institutional adoption and positive market sentiment.',
            'excerpt' => 'Bitcoin reaches new all-time high as institutional adoption grows.',
            'banner_image' => $bannerImage,
            'content_type' => 'news',
            'status' => 'published',
            'is_breaking_news' => true,
            'is_featured' => true,
            'is_trending' => true,
            'view_count' => 15000,
            'category_id' => $defaultCategory->id,
            'source' => 'Crypto News Network',
            'location' => 'Global',
            'is_time_sensitive' => true,
            'meta_title' => 'Bitcoin Reaches New All-Time High | Latest Crypto News',
            'meta_description' => 'Breaking news: Bitcoin reaches new all-time high amid market rally.',
            'author_id' => $authors[$authorIndex]->id,
            'published_at' => now(),
        ]);
        $authorIndex = ($authorIndex + 1) % 2;

        // 2. Short News Article
        Article::create([
            'title' => 'Ethereum Gas Fees Drop Significantly',
            'slug' => 'ethereum-gas-fees-drop',
            'content' => 'Ethereum network gas fees have dropped to their lowest levels in months, making transactions more affordable for users.',
            'excerpt' => 'Ethereum gas fees reach new lows.',
            'banner_image' => $bannerImage,
            'content_type' => 'short_news',
            'status' => 'published',
            'is_breaking_news' => false,
            'is_featured' => false,
            'is_trending' => true,
            'view_count' => 5000,
            'category_id' => $defaultCategory->id,
            'source' => 'Blockchain Daily',
            'location' => 'Global',
            'is_time_sensitive' => true,
            'meta_title' => 'Ethereum Gas Fees Drop | Quick Crypto Update',
            'meta_description' => 'Ethereum network gas fees reach new lows.',
            'author_id' => $authors[$authorIndex]->id,
            'published_at' => now(),
        ]);
        $authorIndex = ($authorIndex + 1) % 2;

        // 3. Blog Article
        Article::create([
            'title' => 'Understanding DeFi: A Comprehensive Guide',
            'slug' => 'understanding-defi-guide',
            'content' => 'Decentralized Finance (DeFi) is revolutionizing the financial industry. This comprehensive guide explores the fundamentals, benefits, and risks of DeFi protocols.',
            'excerpt' => 'A detailed guide to understanding DeFi and its impact on finance.',
            'banner_image' => $bannerImage,
            'content_type' => 'blog',
            'status' => 'published',
            'is_breaking_news' => false,
            'is_featured' => true,
            'is_trending' => false,
            'view_count' => 8000,
            'category_id' => $defaultCategory->id,
            'author_bio' => 'Expert in blockchain technology and decentralized finance.',
            'reading_time' => 15,
            'meta_title' => 'Understanding DeFi: Complete Guide | Crypto Blog',
            'meta_description' => 'Learn everything about DeFi in this comprehensive guide.',
            'author_id' => $authors[$authorIndex]->id,
            'published_at' => now(),
        ]);
        $authorIndex = ($authorIndex + 1) % 2;

        // 4. Press Release
        Article::create([
            'title' => 'Blockchain Company Announces Major Partnership',
            'slug' => 'blockchain-company-partnership',
            'content' => 'Leading blockchain company announces strategic partnership with major financial institution to revolutionize cross-border payments.',
            'excerpt' => 'Major partnership announcement in blockchain industry.',
            'banner_image' => $bannerImage,
            'content_type' => 'press_release',
            'status' => 'published',
            'is_breaking_news' => false,
            'is_featured' => true,
            'is_trending' => false,
            'view_count' => 3000,
            'category_id' => $defaultCategory->id,
            'company_name' => 'Blockchain Solutions Inc.',
            'contact_email' => 'press@blockchainsolutions.com',
            'contact_phone' => '+1-555-123-4567',
            'official_links' => [
                'website' => 'https://blockchainsolutions.com',
                'twitter' => 'https://twitter.com/blockchainsol',
                'linkedin' => 'https://linkedin.com/company/blockchainsolutions',
            ],
            'meta_title' => 'Blockchain Company Announces Partnership | Press Release',
            'meta_description' => 'Major partnership announcement in blockchain industry.',
            'author_id' => $authors[$authorIndex]->id,
            'published_at' => now(),
        ]);
        $authorIndex = ($authorIndex + 1) % 2;

        // 5. Sponsored Article
        Article::create([
            'title' => 'The Future of Digital Assets: Expert Analysis',
            'slug' => 'future-digital-assets-analysis',
            'content' => 'Sponsored content: Expert analysis of the future of digital assets and their role in the global economy.',
            'excerpt' => 'Sponsored analysis of digital assets future.',
            'banner_image' => $bannerImage,
            'content_type' => 'sponsored',
            'status' => 'published',
            'is_breaking_news' => false,
            'is_featured' => false,
            'is_trending' => false,
            'view_count' => 2000,
            'category_id' => $defaultCategory->id,
            'company_name' => 'Digital Asset Solutions',
            'contact_email' => 'info@digitalassets.com',
            'official_links' => [
                'website' => 'https://digitalassets.com',
                'social_media' => 'https://twitter.com/digitalassets',
            ],
            'meta_title' => 'Future of Digital Assets | Sponsored Content',
            'meta_description' => 'Expert analysis of digital assets future.',
            'author_id' => $authors[$authorIndex]->id,
            'published_at' => now(),
        ]);
        $authorIndex = ($authorIndex + 1) % 2;

        // 6. Price Prediction
        Article::create([
            'title' => 'Bitcoin Price Prediction: Q4 2024 Analysis',
            'slug' => 'bitcoin-price-prediction-q4-2024',
            'content' => 'Comprehensive analysis of Bitcoin price trends and predictions for Q4 2024 based on technical and fundamental analysis.',
            'excerpt' => 'Expert Bitcoin price prediction for Q4 2024.',
            'banner_image' => $bannerImage,
            'content_type' => 'price_prediction',
            'status' => 'published',
            'is_breaking_news' => false,
            'is_featured' => true,
            'is_trending' => true,
            'view_count' => 12000,
            'category_id' => $defaultCategory->id,
            'price_target_low' => '75000.00000000',
            'price_target_high' => '95000.00000000',
            'time_horizon' => '3 months',
            'methodology' => 'Technical analysis, on-chain metrics, and market sentiment analysis.',
            'data_sources' => [
                'technical_analysis' => true,
                'fundamental_analysis' => true,
                'market_sentiment' => true,
            ],
            'risk_factors' => 'Market volatility, regulatory changes, macroeconomic conditions.',
            'meta_title' => 'Bitcoin Price Prediction Q4 2024 | Expert Analysis',
            'meta_description' => 'Detailed Bitcoin price prediction and analysis for Q4 2024.',
            'author_id' => $authors[$authorIndex]->id,
            'published_at' => now(),
        ]);
        $authorIndex = ($authorIndex + 1) % 2;

        // 7. Guest Post
        Article::create([
            'title' => 'The Impact of Blockchain on Traditional Finance',
            'slug' => 'blockchain-impact-finance',
            'content' => 'Guest post by industry expert discussing the transformative impact of blockchain technology on traditional financial systems.',
            'excerpt' => 'Expert analysis of blockchain\'s impact on finance.',
            'banner_image' => $bannerImage,
            'content_type' => 'guest_post',
            'status' => 'published',
            'is_breaking_news' => false,
            'is_featured' => true,
            'is_trending' => false,
            'view_count' => 6000,
            'category_id' => $defaultCategory->id,
            'author_bio' => 'Financial technology expert with 15 years of experience in banking and blockchain.',
            'reading_time' => 12,
            'meta_title' => 'Blockchain Impact on Finance | Guest Post',
            'meta_description' => 'Expert analysis of blockchain\'s impact on traditional finance.',
            'author_id' => $authors[$authorIndex]->id,
            'published_at' => now(),
        ]);
        $authorIndex = ($authorIndex + 1) % 2;

        // 8. Research Report
        Article::create([
            'title' => '2024 DeFi Market Research Report',
            'slug' => '2024-defi-market-research',
            'content' => 'Comprehensive research report analyzing the DeFi market trends, growth potential, and future outlook for 2024.',
            'excerpt' => 'In-depth research report on DeFi market trends.',
            'banner_image' => $bannerImage,
            'content_type' => 'research_report',
            'status' => 'published',
            'is_breaking_news' => false,
            'is_featured' => true,
            'is_trending' => true,
            'view_count' => 9000,
            'category_id' => $defaultCategory->id,
            'methodology' => 'Quantitative and qualitative analysis of DeFi protocols, market data, and user behavior.',
            'data_sources' => [
                'on_chain_data' => true,
                'market_data' => true,
                'interviews' => true,
                'surveys' => true,
            ],
            'risk_factors' => 'Market volatility, smart contract risks, regulatory uncertainty.',
            'meta_title' => '2024 DeFi Market Research Report | Comprehensive Analysis',
            'meta_description' => 'Detailed research report on DeFi market trends and future outlook.',
            'author_id' => $authors[$authorIndex]->id,
            'published_at' => now(),
        ]);
        $authorIndex = ($authorIndex + 1) % 2;

        // 9. Web3 Bulletin
        Article::create([
            'title' => 'Web3 Gaming Platform Launches New Features',
            'slug' => 'web3-gaming-platform-launch',
            'content' => 'Leading Web3 gaming platform announces new features and partnerships to enhance user experience.',
            'excerpt' => 'Web3 gaming platform announces major updates.',
            'banner_image' => $bannerImage,
            'content_type' => 'web3_bulletin',
            'status' => 'published',
            'is_breaking_news' => false,
            'is_featured' => false,
            'is_trending' => true,
            'view_count' => 4000,
            'category_id' => $defaultCategory->id,
            'company_name' => 'Web3 Gaming Solutions',
            'contact_email' => 'info@web3gaming.com',
            'contact_phone' => '+1-555-987-6543',
            'official_links' => [
                'website' => 'https://web3gaming.com',
                'twitter' => 'https://twitter.com/web3gaming',
                'discord' => 'https://discord.gg/web3gaming',
                'telegram' => 'https://t.me/web3gaming',
            ],
            'meta_title' => 'Web3 Gaming Platform Updates | Latest News',
            'meta_description' => 'New features and partnerships announced by Web3 gaming platform.',
            'author_id' => $authors[$authorIndex]->id,
            'published_at' => now(),
        ]);
        $authorIndex = ($authorIndex + 1) % 2;

        // 10. Web Story
        Article::create([
            'title' => 'The Evolution of Cryptocurrency',
            'slug' => 'evolution-of-cryptocurrency',
            'content' => 'Interactive web story exploring the evolution of cryptocurrency from Bitcoin to modern DeFi.',
            'excerpt' => 'Interactive journey through cryptocurrency history.',
            'banner_image' => $bannerImage,
            'content_type' => 'web_story',
            'status' => 'published',
            'is_breaking_news' => false,
            'is_featured' => true,
            'is_trending' => true,
            'view_count' => 10000,
            'category_id' => $defaultCategory->id,
            'story_duration' => 30,
            'is_vertical' => true,
            'slides_count' => 5,
            'story_slides' => [
                [
                    'image' => $bannerImage,
                    'content' => 'The birth of Bitcoin in 2009 marked the beginning of cryptocurrency.',
                    'duration' => 5,
                    'interactive_elements' => [
                        [
                            'type' => 'button',
                            'text' => 'Learn More',
                            'url' => 'https://example.com/bitcoin-history'
                        ]
                    ]
                ],
                [
                    'image' => $bannerImage,
                    'content' => 'Ethereum introduced smart contracts in 2015.',
                    'duration' => 5,
                    'interactive_elements' => [
                        [
                            'type' => 'poll',
                            'text' => 'What do you think about smart contracts?',
                            'poll_options' => [
                                ['option' => 'Revolutionary'],
                                ['option' => 'Important'],
                                ['option' => 'Overrated'],
                                ['option' => 'Not sure']
                            ]
                        ]
                    ]
                ],
                [
                    'image' => $bannerImage,
                    'content' => 'DeFi emerged in 2020, transforming finance.',
                    'duration' => 5,
                    'interactive_elements' => [
                        [
                            'type' => 'link',
                            'text' => 'Explore DeFi',
                            'url' => 'https://example.com/defi'
                        ]
                    ]
                ],
                [
                    'image' => $bannerImage,
                    'content' => 'NFTs became mainstream in 2021.',
                    'duration' => 5,
                    'interactive_elements' => [
                        [
                            'type' => 'mention',
                            'text' => '@NFTCommunity',
                            'url' => 'https://twitter.com/NFTCommunity'
                        ]
                    ]
                ],
                [
                    'image' => $bannerImage,
                    'content' => 'The future of Web3 and blockchain technology.',
                    'duration' => 5,
                    'interactive_elements' => [
                        [
                            'type' => 'location',
                            'text' => 'Global Impact',
                            'url' => 'https://example.com/global-impact'
                        ]
                    ]
                ]
            ],
            'media_elements' => [
                'videos' => [],
                'images' => [$bannerImage],
                'audio' => []
            ],
            'interactive_elements' => [
                'polls' => true,
                'quizzes' => false,
                'surveys' => false
            ],
            'meta_title' => 'Evolution of Cryptocurrency | Interactive Web Story',
            'meta_description' => 'Interactive journey through the history of cryptocurrency.',
            'author_id' => $authors[$authorIndex]->id,
            'published_at' => now(),
        ]);
        $authorIndex = ($authorIndex + 1) % 2;

        // Attach multiple tags to all articles
        $articles = Article::all();
        foreach ($articles as $article) {
            $article->tags()->attach($defaultTags->pluck('id')->toArray());
        }

        // After creating all articles, add comments
        $articles = Article::all();
        $categories = Category::all();
        $categoryIndex = 0;

        foreach ($articles as $article) {
            // Update article category to use different categories
            $article->update(['category_id' => $categories[$categoryIndex]->id]);
            $categoryIndex = ($categoryIndex + 1) % count($categories);

            // Add 2 comments from each admin
            foreach ([$prince, $radhe] as $admin) {
                // First comment (approved)
                $comment1 = Comment::create([
                    'user_id' => $admin->id,
                    'commentable_type' => Article::class,
                    'commentable_id' => $article->id,
                    'content' => $this->getCommentContent($article->content_type, 1),
                    'ip_address' => '192.168.1.1',
                    'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'is_spam' => false,
                    'is_approved' => true,
                    'approved_at' => now(),
                    'approved_by' => $admin->id,
                    'moderation_notes' => null,
                    'report_count' => 0,
                ]);

                // Second comment (pending approval with reports)
                $comment2 = Comment::create([
                    'user_id' => $admin->id,
                    'commentable_type' => Article::class,
                    'commentable_id' => $article->id,
                    'content' => $this->getCommentContent($article->content_type, 2),
                    'ip_address' => '192.168.1.2',
                    'user_agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
                    'is_spam' => false,
                    'is_approved' => false,
                    'approved_at' => null,
                    'approved_by' => null,
                    'moderation_notes' => 'Pending review',
                    'report_count' => 3,
                    'last_reported_at' => now(),
                ]);

                // Third comment (spam)
                $comment3 = Comment::create([
                    'user_id' => $admin->id,
                    'commentable_type' => Article::class,
                    'commentable_id' => $article->id,
                    'content' => 'Buy cheap crypto! Visit our website: http://scam.com',
                    'ip_address' => '192.168.1.4',
                    'user_agent' => 'Mozilla/5.0 (compatible; MSIE 6.0; Windows NT 5.1)',
                    'is_spam' => true,
                    'is_approved' => false,
                    'approved_at' => null,
                    'approved_by' => null,
                    'moderation_notes' => 'Automatically marked as spam',
                    'report_count' => 5,
                    'last_reported_at' => now(),
                ]);

                // Add a reply to the first comment
                Comment::create([
                    'user_id' => $admin->id,
                    'commentable_type' => Comment::class,
                    'commentable_id' => $comment1->id,
                    'content' => 'Thank you for your feedback! We appreciate your insights.',
                    'ip_address' => '192.168.1.3',
                    'user_agent' => 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
                    'is_spam' => false,
                    'is_approved' => true,
                    'approved_at' => now(),
                    'approved_by' => $admin->id,
                    'moderation_notes' => null,
                    'report_count' => 0,
                ]);
            }
        }
    }

    private function getCommentContent(string $contentType, int $commentNumber): string
    {
        $comments = [
            'news' => [
                1 => 'This is a significant development in the crypto market. The institutional adoption mentioned in the article is particularly noteworthy.',
                2 => 'I would like to see more details about the market sentiment analysis. Could you provide more sources?'
            ],
            'short_news' => [
                1 => 'Great to see gas fees dropping! This will make Ethereum more accessible to users.',
                2 => 'How long do you think these low gas fees will last?'
            ],
            'blog' => [
                1 => 'Excellent breakdown of DeFi concepts. The explanation of yield farming was particularly clear.',
                2 => 'Could you add more examples of real-world DeFi applications?'
            ],
            'press_release' => [
                1 => 'This partnership could be a game-changer for cross-border payments. Looking forward to seeing the implementation.',
                2 => 'What are the expected timelines for this partnership to go live?'
            ],
            'sponsored' => [
                1 => 'Interesting analysis of digital assets. The future potential is clearly explained.',
                2 => 'Would like to see more data backing up these predictions.'
            ],
            'price_prediction' => [
                1 => 'The technical analysis seems solid. The price targets look achievable based on current market conditions.',
                2 => 'How does this prediction account for potential regulatory changes?'
            ],
            'guest_post' => [
                1 => 'The impact of blockchain on traditional finance is well-articulated. The comparison with existing systems is insightful.',
                2 => 'Could you elaborate more on the security aspects of blockchain implementation?'
            ],
            'research_report' => [
                1 => 'Comprehensive analysis of the DeFi market. The methodology section is particularly thorough.',
                2 => 'Would be helpful to see more historical data comparisons.'
            ],
            'web3_bulletin' => [
                1 => 'The new features sound promising. The focus on user experience is commendable.',
                2 => 'What are the system requirements for these new features?'
            ],
            'web_story' => [
                1 => 'Great interactive journey through crypto history! The timeline is well-structured.',
                2 => 'Could you add more interactive elements to the story?'
            ]
        ];

        return $comments[$contentType][$commentNumber] ?? 'Generic comment for content type: ' . $contentType;
    }
}
