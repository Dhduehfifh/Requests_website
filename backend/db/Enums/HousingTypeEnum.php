<?php
namespace App\Enums;

enum HousingTypeEnum: string {
    case House = 'house';
    case Apartment = 'apartment';
    case Condo = 'condo';
    case Townhouse = 'townhouse';
    case Other = 'other';
}