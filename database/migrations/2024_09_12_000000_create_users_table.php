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
        Schema::create('users', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedBigInteger('role_id');
            $table->string('name',100);
            $table->string('email',50)->unique();
            $table->string('password')->nullable();
            $table->string('password_text',50)->nullable();
            $table->string('phone', 18)->nullable();
            $table->softDeletes();
            $table->timestamp('created_at')->useCurrent();
            $table->integer('created_by')->nullable();
            $table->timestamp('updated_at')->useCurrentOnUpdate()->nullable();
            $table->integer('updated_by')->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->rememberToken();

            $table->foreign('role_id')->references('id')->on('roles')->onDelete('cascade');
            $table->index('id');
            $table->index('role_id');
            $table->index('email');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
