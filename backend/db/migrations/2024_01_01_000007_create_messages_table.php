<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('messages', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('conv_id');
            $table->uuid('sender_id');
            $table->text('content');
            $table->string('image_url', 255)->nullable();
            $table->timestamps();

            $table->foreign('conv_id')->references('id')->on('conversations')->onDelete('cascade');
            $table->foreign('sender_id')->references('id')->on('users');
            $table->index(['conv_id', 'created_at']);
        });
    }

    public function down(): void {
        Schema::dropIfExists('messages');
    }
};