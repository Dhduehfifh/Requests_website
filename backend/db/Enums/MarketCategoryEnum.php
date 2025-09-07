<?php
namespace App\Enums;

enum MarketCategoryEnum: string {
    case Electronics = 'electronics';
    case Furniture = 'furniture';
    case HomeAppliances = 'home_appliances';
    case Vehicles = 'vehicles';
    case Books = 'books';
    case Fashion = 'fashion';
    case Sports = 'sports';
    case Entertainment = 'entertainment';
    case Digital = 'digital';
    case Other = 'other';
}