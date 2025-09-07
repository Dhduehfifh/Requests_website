<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('forum_comments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('post_id');
            $table->uuid('author_id');
            $table->text('content');
            $table->timestamps();

            $table->foreign('post_id')->references('id')->on('forum_posts')->onDelete('cascade');
            $table->foreign('author_id')->references('id')->on('users');
            $table->index(['post_id', 'created_at']);
        });
    }

    public function down(): void {
        Schema::dropIfExists('forum_comments');
    }
};