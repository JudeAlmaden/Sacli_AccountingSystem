<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class RolesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //We will be deleting everything first to prevent duplicates while seeding 
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        // Truncate in correct order
        User::truncate();
        DB::table('model_has_permissions')->truncate();
        DB::table('model_has_roles')->truncate();
        DB::table('role_has_permissions')->truncate();
        Permission::truncate();
        Role::truncate();

        // Re-enable FK checks
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        /*==========================================================================*/
        // List of currently available roles
        $admin = Role::create(['name' => 'admin']);
        $accountingAssistant = Role::create(['name' => 'accounting assistant']);
        $accountingHead = Role::create(['name' => 'accounting head']);
        $auditor = Role::create(['name' => 'auditor']);
        $svp = Role::create(['name' => 'SVP']);

        //List of permissions
        Permission::create(['name' => 'create accounts']);
        Permission::create(['name' => 'update accounts']);
        Permission::create(['name' => 'delete accounts']);
        Permission::create(['name' => 'view accounts']);

        //Assign permissions to roles
        $admin->givePermissionTo([
            'create accounts',
            'update accounts',
            'delete accounts',
            'view accounts',
        ]);


        //Roles are just labels, we can assign permissions to roles
        //We can also permissions directly to users
        //For now we will only focus on admin as the other ones are unlikely to change
    }
}
