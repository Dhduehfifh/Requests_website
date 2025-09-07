<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Message extends Model {
    use HasFactory, HasUuids;

    protected $fillable = ['conv_id', 'sender_id', 'content', 'image_url'];

    public function conversation() {
        return $this->belongsTo(Conversation::class, 'conv_id');
    }

    public function sender() {
        return $this->belongsTo(User::class, 'sender_id');
    }
}