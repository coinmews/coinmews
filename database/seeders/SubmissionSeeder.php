<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Submission;

class SubmissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(): void
    {
        // Create submissions with different types and statuses
        $types = [
            'guest_post' => 'guestPost',
            'sponsored_content' => 'sponsoredContent',
            'press_release' => 'pressRelease',
            'airdrop' => 'airdrop',
            'presale' => 'presale',
            'event' => 'event'
        ];

        foreach ($types as $type => $factoryMethod) {
            // Pending submissions
            Submission::factory(2)
                ->$factoryMethod()
                ->withStatus('pending')
                ->create();

            // Reviewing submissions
            Submission::factory(1)
                ->$factoryMethod()
                ->withStatus('reviewing')
                ->create();

            // Approved submissions
            Submission::factory(1)
                ->$factoryMethod()
                ->withStatus('approved')
                ->create();

            // Rejected submissions
            Submission::factory(1)
                ->$factoryMethod()
                ->withStatus('rejected')
                ->create();
        }

        // Create ICO/IDO/IEO submissions
        $tokenTypes = ['ico', 'ido', 'ieo'];
        foreach ($tokenTypes as $type) {
            // Pending submissions
            Submission::factory(2)
                ->state(['type' => $type])
                ->withStatus('pending')
                ->create();

            // Reviewing submissions
            Submission::factory(1)
                ->state(['type' => $type])
                ->withStatus('reviewing')
                ->create();

            // Approved submissions
            Submission::factory(1)
                ->state(['type' => $type])
                ->withStatus('approved')
                ->create();

            // Rejected submissions
            Submission::factory(1)
                ->state(['type' => $type])
                ->withStatus('rejected')
                ->create();
        }
    }
}
