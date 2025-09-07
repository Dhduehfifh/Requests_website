<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class LfgPost extends Model {
    use HasFactory, HasUuids;

    protected $fillable = ['forum_post_id', 'topic', 'people_needed', 'total_expected'];

    public function forumPost() {
        return $this->belongsTo(ForumPost::class, 'forum_post_id');
    }
}