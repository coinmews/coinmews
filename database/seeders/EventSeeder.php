<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Event;

class EventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(): void
    {
        // Create 10 upcoming events
        Event::factory(10)->create();

        // Create 3 ongoing events
        Event::factory(3)->state(['status' => 'ongoing'])->create();

        // Create 3 completed events
        Event::factory(3)->state(['status' => 'completed'])->create();

        // Create 2 cancelled events
        Event::factory(2)->state(['status' => 'cancelled'])->create();
    }
}
