<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('housing_listings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('forum_post_id')->unique(); // 确保一对一关联
            $table->string('address')->nullable();
            $table->string('unit_number')->nullable();
            $table->string('postal_code')->nullable();
            $table->string('housing_type');
            $table->integer('rent')->nullable();
            $table->string('rent_unit')->nullable();
            $table->json('images')->nullable();
            $table->timestamps();

            $table->foreign('forum_post_id')->references('id')->on('forum_posts')->onDelete('cascade');
        });
    }

    public function down(): void {
        Schema::dropIfExists('housing_listings');
    }
};