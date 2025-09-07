<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class MarketListing extends Model {
    use HasFactory, HasUuids;

    protected $fillable = ['forum_post_id', 'category', 'price', 'trade_methods', 'images'];

    protected $casts = [
        'trade_methods' => 'array',
        'images' => 'array',
    ];

    // 一个市场关联只属于一个帖子
    public function forumPost() {
        return $this->belongsTo(ForumPost::class, 'forum_post_id');
    }
}