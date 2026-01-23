<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Database\Seeders\RolesSeeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;
use Database\Seeders\ChartOfAccountsSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RolesSeeder::class,
            ChartOfAccountsSeeder::class,
        ]);
        
        //We make a admin role, this is how we will make accounts in the future <3
        User::truncate();
        User::factory()->create([
            'name' => 'admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
        ])->assignRole('admin');

        //We make a admin role, this is how we will make accounts in the future <3
        User::factory()->create([
            'name' => 'accounting head',
            'email' => 'head@example.com',
            'password' => Hash::make('password'),
        ])->assignRole('accounting head');   

        User::factory()->create([
            'name' => 'accounting assistant',
            'email' => 'assistant@example.com',
            'password' => Hash::make('password'),
        ])->assignRole('accounting assistant');  
    }
}
