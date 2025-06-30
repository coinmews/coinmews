<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AdCampaign;

class AdCampaignSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(): void
    {
        AdCampaign::factory(10)->create();
    }
}
