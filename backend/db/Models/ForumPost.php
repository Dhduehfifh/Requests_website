<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class ForumPost extends Model {
    use HasFactory, HasUuids;

    protected $fillable = [
        'author_id', 
        'title', 
        'content', 
        'city', 
        'province', 
        'status', 
        'post_type',
        'tags'
    ];

    protected $casts = [
        'tags' => 'array',
    ];

    // 帖子与发布者是一对一关系
    public function author() {
        return $this->belongsTo(User::class, 'author_id');
    }

    // 帖子可以有多个评论
    public function comments() {
        return $this->hasMany(ForumComment::class, 'post_id');
    }

    // 与特殊帖子类型的一对一关系
    public function marketListing() {
        return $this->hasOne(MarketListing::class, 'forum_post_id');
    }

    public function housingListing() {
        return $this->hasOne(HousingListing::class, 'forum_post_id');
    }

    public function lfgPost() {
        return $this->hasOne(LfgPost::class, 'forum_post_id');
    }
}