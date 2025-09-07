<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class ForumComment extends Model {
    use HasFactory, HasUuids;

    protected $fillable = ['post_id', 'author_id', 'content'];

    public function post() {
        return $this->belongsTo(ForumPost::class, 'post_id');
    }

    public function author() {
        return $this->belongsTo(User::class, 'author_id');
    }
}