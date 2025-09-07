<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class HousingListing extends Model {
    use HasFactory, HasUuids;

    protected $fillable = ['forum_post_id', 'address', 'unit_number', 'postal_code', 'housing_type', 'rent', 'rent_unit', 'images'];

    protected $casts = [
        'images' => 'array',
    ];

    public function forumPost() {
        return $this->belongsTo(ForumPost::class, 'forum_post_id');
    }
}