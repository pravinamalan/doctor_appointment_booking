<?php

namespace Database\Seeders;

use App\Models\Management;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AdminDetailsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'name' => 'test',
                'role_id' =>1,
                'role_management' =>'admin',
                'email' => 'test@gmail.com',
                'password' => bcrypt('password'),
                'password_text'=>'password',
                'created_at' =>now(),
            ],
            [
                'name' => 'pravin',
                'role_id' =>1,
                'role_management' =>'doctor',
                'email' => 'pravin@gmail.com',
                'password' => bcrypt('password'),
                'password_text'=>'password',
                'created_at' =>now(),

            ]

        ];
        $user = DB::table('management')->insert($users);
        // Management::create($users);
    }
}
