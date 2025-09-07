<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('forum_posts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('author_id');
            $table->string('title', 150);
            $table->text('content');
            $table->string('city', 50)->nullable();
            $table->string('province', 50)->nullable();
            $table->string('status')->default('active'); // 'active', 'archived', 'deleted'
            $table->string('post_type'); // 'general', 'market', 'housing', 'lfg'
            $table->json('tags')->nullable(); // 新增字段，用于自定义标签
            $table->timestamps(); // 自动生成 created_at 和 updated_at

            $table->foreign('author_id')->references('id')->on('users');
            $table->index(['city', 'province', 'created_at', 'author_id']);
        });
    }

    public function down(): void {
        Schema::dropIfExists('forum_posts');
    }
};