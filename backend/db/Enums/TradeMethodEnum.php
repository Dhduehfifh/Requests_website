<?php
namespace App\Enums;

enum TradeMethodEnum: string {
    case Meetup = 'meetup';
    case Pickup = 'pickup';
    case Delivery = 'delivery';
    case Shipping = 'shipping';
}