<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('conversations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_a');
            $table->uuid('user_b');
            $table->uuid('related_post_id')->nullable();
            $table->timestamp('last_msg_at')->useCurrent();
            $table->timestamps();

            $table->foreign('user_a')->references('id')->on('users');
            $table->foreign('user_b')->references('id')->on('users');
            $table->foreign('related_post_id')->references('id')->on('forum_posts')->onDelete('set null');
            $table->unique(['user_a', 'user_b']);
        });
    }

    public function down(): void {
        Schema::dropIfExists('conversations');
    }
};