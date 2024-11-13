<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('doctors', function (Blueprint $table) {
            $table->id();
            $table->string('name',100);
            $table->string('email',30)->unique();
            $table->string('phone',20);
            $table->string('password')->nullable();
            $table->string('password_text',50)->nullable();
            $table->string('degree',100);
            $table->string('experience',100);
            $table->string('speciality',100);
            $table->string('fees',50);
            $table->text('about');
            $table->text('image')->nullable();
            $table->text('address');
            $table->boolean('availability')->default(1);
            $table->text('slots_booked')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('doctors');
    }
};
