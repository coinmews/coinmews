<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user with a hashed password and verified email
        User::create([
            'name' => 'Vivek',
            'email' => 'vivek@CoinMews.io',
            'username' => 'vivek',
            'password' => Hash::make('Vivek@373#92'),
            'is_admin' => true,
            'email_verified_at' => now(),
            'bio' => 'Administrator of CoinMews',
            'website' => 'https://CoinMews.io',
            'avatar' => null, // We'll handle avatar uploads through the admin panel
            'twitter' => 'https://twitter.com/prince_CoinMews',
            'telegram' => 'https://t.me/prince_CoinMews',
            'discord' => 'https://discord.com/invite/prince_CoinMews',
            'facebook' => 'https://facebook.com/prince_CoinMews',
            'instagram' => 'https://instagram.com/prince_CoinMews',
            'birthday' => now()->subYears(25), // Just an example, adjust as needed
            'location' => 'India',
        ]);

        // User::create([
        //     'name' => 'Radhe',
        //     'email' => 'radhe@CoinMews.io',
        //     'username' => 'radhe',
        //     'password' => Hash::make('Radhe@242#28'),
        //     'is_admin' => true,
        //     'email_verified_at' => now(),
        //     'bio' => 'Administrator of CoinMews',
        //     'website' => 'https://CoinMews.io',
        //     'avatar' => null, // We'll handle avatar uploads through the admin panel
        //     'twitter' => 'https://twitter.com/radhe_CoinMews',
        //     'telegram' => 'https://t.me/radhe_CoinMews',
        //     'discord' => 'https://discord.com/invite/radhe_CoinMews',
        //     'facebook' => 'https://facebook.com/radhe_CoinMews',
        //     'instagram' => 'https://instagram.com/radhe_CoinMews',
        //     'birthday' => now()->subYears(25), // Just an example, adjust as needed
        //     'location' => 'India',
        // ]);

        // Create some regular users
        // User::factory(10)->create();
    }
}
