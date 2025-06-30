<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AdSpace;

class AdSpaceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(): void
    {
        AdSpace::factory(10)->create();
    }
}
