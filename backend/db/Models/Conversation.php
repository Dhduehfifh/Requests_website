<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Conversation extends Model {
    use HasFactory, HasUuids;

    protected $fillable = ['user_a', 'user_b', 'related_post_id'];

    public function userA() {
        return $this->belongsTo(User::class, 'user_a');
    }

    public function userB() {
        return $this->belongsTo(User::class, 'user_b');
    }

    public function relatedPost() {
        return $this->belongsTo(ForumPost::class, 'related_post_id');
    }

    public function messages() {
        return $this->hasMany(Message::class, 'conv_id');
    }
}