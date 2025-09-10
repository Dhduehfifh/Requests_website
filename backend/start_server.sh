#!/bin/bash
# start_server.sh — Start the backend server

echo "Starting International Student Life Hub Backend..."

# Check if PHP is available
if ! command -v php &> /dev/null; then
    echo "Error: PHP is not installed or not in PATH"
    exit 1
fi

# Start PHP built-in server
echo "Starting PHP server on http://127.0.0.1:8000"
echo "API endpoints available at:"
echo "  - Health: http://127.0.0.1:8000/json/health"
echo "  - Users: http://127.0.0.1:8000/json/users"
echo "  - Posts: http://127.0.0.1:8000/json/posts"
echo "  - Market Listings: http://127.0.0.1:8000/json/market_listings"
echo "  - Conversations: http://127.0.0.1:8000/json/conversations"
echo "  - Messages: http://127.0.0.1:8000/json/messages"
echo "  - Events (SSE): http://127.0.0.1:8000/json/events?user_id=USER_ID"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

php -S 127.0.0.1:8000 -t public/
