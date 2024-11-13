<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $users = [
            [
                'name' => 'Tony Stark',
                'role_id' =>1,
                'email' => 'stark@gmail.com',
                'password' => bcrypt('password'),
                'password_text'=>'password',
                'phone' => '9876543210',
                'created_at' =>now(),
            ],
            [
                'name' => 'test',
                'role_id' =>2,
                'email' => 'test@gmail.com',
                'password' => bcrypt('password'),
                'password_text'=>'password',
                'phone' => '9876543210',
                'created_at' =>now(),
            ],
            [
                'name' => 'pravin',
                'role_id' =>2,
                'email' => 'pravin@gmail.com',
                'password' => bcrypt('password'),
                'password_text'=>'password',
                'phone' => '9876543210',
                'created_at' =>now(),

            ]

        ];

        foreach ($users as $userData) {
            $user = User::create($userData);

            // Assign roles to the user
            $role = Role::findById($userData['role_id']);
            $user->assignRole($role);
        }
    }
}
