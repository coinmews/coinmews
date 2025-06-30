<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Airdrop;

class AirdropSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(): void
    {
        Airdrop::factory(10)->create();
    }
}
