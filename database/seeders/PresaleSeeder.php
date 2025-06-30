<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Presale;

class PresaleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(): void
    {
        Presale::factory(10)->create();
    }
}
