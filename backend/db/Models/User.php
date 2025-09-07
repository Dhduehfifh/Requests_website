<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class User extends Model {
    use HasFactory, HasUuids;

    protected $fillable = [
        'phone_e164',
        'email',
        'birthday',
        'username',
        'avatar_url',
        'school',
        'city',
        'language',
        'banned_until',
    ];

    protected $casts = [
        'banned_until' => 'datetime',
    ];

    public function posts() {
        return $this->hasMany(ForumPost::class, 'author_id');
    }
}