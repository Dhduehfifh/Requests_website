<?php
// validate.php — Centralized validation utilities
declare(strict_types=1);

/**
 * Validate UUID format
 */
function is_valid_uuid(string $uuid): bool {
    return preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i', $uuid) === 1;
}

/**
 * Validate email format
 */
function is_valid_email(string $email): bool {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

/**
 * Validate phone number in E.164 format
 */
function is_valid_phone_e164(string $phone): bool {
    return preg_match('/^\+[1-9]\d{1,14}$/', $phone) === 1;
}

/**
 * Validate date in YYYY-MM-DD format
 */
function is_valid_date(string $date): bool {
    $d = DateTime::createFromFormat('Y-m-d', $date);
    return $d && $d->format('Y-m-d') === $date;
}

/**
 * Validate required fields
 */
function validate_required(array $data, array $required_fields): void {
    foreach ($required_fields as $field) {
        if (!isset($data[$field]) || $data[$field] === '' || $data[$field] === null) {
            throw new ValidationException("Field '{$field}' is required");
        }
    }
}

/**
 * Validate field length
 */
function validate_length(string $value, int $min = 0, int $max = PHP_INT_MAX): void {
    $length = strlen($value);
    if ($length < $min) {
        throw new ValidationException("Value too short (minimum {$min} characters)");
    }
    if ($length > $max) {
        throw new ValidationException("Value too long (maximum {$max} characters)");
    }
}

/**
 * Validate enum values
 */
function validate_enum($value, array $allowed_values, string $field_name): void {
    if (!in_array($value, $allowed_values, true)) {
        throw new ValidationException("Invalid value for '{$field_name}'. Allowed values: " . implode(', ', $allowed_values));
    }
}

/**
 * Validate numeric range
 */
function validate_numeric_range($value, ?float $min = null, ?float $max = null): void {
    if (!is_numeric($value)) {
        throw new ValidationException("Value must be numeric");
    }
    $num = (float) $value;
    if ($min !== null && $num < $min) {
        throw new ValidationException("Value must be at least {$min}");
    }
    if ($max !== null && $num > $max) {
        throw new ValidationException("Value must be at most {$max}");
    }
}

/**
 * Validate array of enum values
 */
function validate_array_enum(array $values, array $allowed_values, string $field_name): void {
    foreach ($values as $value) {
        if (!in_array($value, $allowed_values, true)) {
            throw new ValidationException("Invalid value '{$value}' in '{$field_name}'. Allowed values: " . implode(', ', $allowed_values));
        }
    }
}

/**
 * Custom validation exception
 */
class ValidationException extends Exception {
    public function __construct(string $message, int $code = 400) {
        parent::__construct($message, $code);
    }
}

/**
 * Validate user data
 */
function validate_user_data(array $data, bool $creating = true): void {
    if ($creating) {
        validate_required($data, ['username']);
    }
    
    if (isset($data['username'])) {
        validate_length($data['username'], 1, 50);
    }
    
    if (isset($data['email']) && $data['email'] !== null) {
        if (!is_valid_email($data['email'])) {
            throw new ValidationException('Invalid email format');
        }
    }
    
    if (isset($data['phone_e164']) && $data['phone_e164'] !== null) {
        if (!is_valid_phone_e164($data['phone_e164'])) {
            throw new ValidationException('Invalid phone format. Use E.164 format (e.g., +1234567890)');
        }
    }
    
    if (isset($data['birthday']) && $data['birthday'] !== null) {
        if (!is_valid_date($data['birthday'])) {
            throw new ValidationException('Invalid date format. Use YYYY-MM-DD');
        }
    }
    
    if (isset($data['language']) && $data['language'] !== null) {
        validate_enum($data['language'], ['zh', 'en'], 'language');
    }
}

/**
 * Validate forum post data
 */
function validate_forum_post_data(array $data, bool $creating = true): void {
    if ($creating) {
        validate_required($data, ['author_id', 'title', 'content', 'post_type']);
    }
    
    if (isset($data['author_id']) && !is_valid_uuid($data['author_id'])) {
        throw new ValidationException('Invalid author_id format');
    }
    
    if (isset($data['title'])) {
        validate_length($data['title'], 1, 200);
    }
    
    if (isset($data['content'])) {
        validate_length($data['content'], 1, 10000);
    }
    
    if (isset($data['visibility'])) {
        validate_enum($data['visibility'], ['public', 'friends', 'private'], 'visibility');
    }
    
    if (isset($data['post_type'])) {
        validate_enum($data['post_type'], ['general', 'market', 'housing', 'lfg'], 'post_type');
    }
    
    if (isset($data['status'])) {
        validate_enum($data['status'], ['active', 'closed', 'deleted'], 'status');
    }
    
    if (isset($data['tags']) && !is_array($data['tags'])) {
        throw new ValidationException('tags must be an array');
    }
    
    if (isset($data['images']) && !is_array($data['images'])) {
        throw new ValidationException('images must be an array');
    }
}

/**
 * Validate market listing data
 */
function validate_market_listing_data(array $data, bool $creating = true): void {
    if ($creating) {
        validate_required($data, ['forum_post_id', 'category', 'price', 'trade_methods']);
    }
    
    if (isset($data['forum_post_id']) && !is_valid_uuid($data['forum_post_id'])) {
        throw new ValidationException('Invalid forum_post_id format');
    }
    
    if (isset($data['category'])) {
        validate_enum($data['category'], [
            'electronics', 'furniture', 'home_appliances', 'vehicles', 
            'books', 'fashion', 'sports', 'entertainment', 'digital', 'other'
        ], 'category');
    }
    
    if (isset($data['price'])) {
        validate_numeric_range($data['price'], 0);
    }
    
    if (isset($data['trade_methods'])) {
        if (!is_array($data['trade_methods'])) {
            throw new ValidationException('trade_methods must be an array');
        }
        validate_array_enum($data['trade_methods'], ['meetup', 'pickup', 'delivery', 'shipping'], 'trade_methods');
    }
}

/**
 * Validate conversation data
 */
function validate_conversation_data(array $data, bool $creating = true): void {
    if ($creating) {
        validate_required($data, ['user_a', 'user_b']);
    }
    
    if (isset($data['user_a']) && !is_valid_uuid($data['user_a'])) {
        throw new ValidationException('Invalid user_a format');
    }
    
    if (isset($data['user_b']) && !is_valid_uuid($data['user_b'])) {
        throw new ValidationException('Invalid user_b format');
    }
    
    if (isset($data['user_a']) && isset($data['user_b']) && $data['user_a'] === $data['user_b']) {
        throw new ValidationException('user_a and user_b must be different');
    }
}

/**
 * Validate message data
 */
function validate_message_data(array $data, bool $creating = true): void {
    if ($creating) {
        validate_required($data, ['conv_id', 'sender_id', 'content']);
    }
    
    if (isset($data['conv_id']) && !is_valid_uuid($data['conv_id'])) {
        throw new ValidationException('Invalid conv_id format');
    }
    
    if (isset($data['sender_id']) && !is_valid_uuid($data['sender_id'])) {
        throw new ValidationException('Invalid sender_id format');
    }
    
    if (isset($data['ref_post_id']) && $data['ref_post_id'] !== null && !is_valid_uuid($data['ref_post_id'])) {
        throw new ValidationException('Invalid ref_post_id format');
    }
    
    if (isset($data['content'])) {
        validate_length($data['content'], 1, 2000);
    }
    
    if (isset($data['images']) && !is_array($data['images'])) {
        throw new ValidationException('images must be an array');
    }
}
