<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('users', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('phone_e164', 15)->unique()->nullable();
            $table->string('email', 255)->unique()->nullable();
            $table->date('birthday')->nullable();
            $table->string('username', 30)->unique();
            $table->string('avatar_url', 255)->nullable();
            $table->string('school', 50)->nullable();
            $table->string('city', 50)->nullable();
            $table->string('language', 2)->default('en');
            $table->timestamp('banned_until')->nullable();
            $table->timestamps();

            $table->index('city');
            $table->index('school');
        });
    }

    public function down(): void {
        Schema::dropIfExists('users');
    }
};