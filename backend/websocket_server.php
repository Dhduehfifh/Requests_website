<?php
// websocket_server.php — Simple WebSocket server for real-time communication
declare(strict_types=1);

require_once __DIR__ . '/api/config.php';
require_once __DIR__ . '/api/migrations.php';
migrate($pdo);
require_once __DIR__ . '/api/orm.php';

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;

class WebSocketHandler implements MessageComponentInterface {
    protected $clients;
    protected $userConnections;

    public function __construct() {
        $this->clients = new \SplObjectStorage;
        $this->userConnections = [];
    }

    public function onOpen(ConnectionInterface $conn) {
        $this->clients->attach($conn);
        echo "New connection! ({$conn->resourceId})\n";
    }

    public function onMessage(ConnectionInterface $from, $msg) {
        $data = json_decode($msg, true);
        
        if (!$data || !isset($data['type'])) {
            $from->send(json_encode(['error' => 'Invalid message format']));
            return;
        }

        switch ($data['type']) {
            case 'subscribe':
                if (isset($data['user_id'])) {
                    $this->userConnections[$data['user_id']] = $from;
                    $from->send(json_encode(['type' => 'subscribed', 'user_id' => $data['user_id']]));
                }
                break;
                
            case 'ping':
                $from->send(json_encode(['type' => 'pong']));
                break;
                
            default:
                $from->send(json_encode(['error' => 'Unknown message type']));
        }
    }

    public function onClose(ConnectionInterface $conn) {
        $this->clients->detach($conn);
        
        // Remove from user connections
        foreach ($this->userConnections as $userId => $connection) {
            if ($connection === $conn) {
                unset($this->userConnections[$userId]);
                break;
            }
        }
        
        echo "Connection {$conn->resourceId} has disconnected\n";
    }

    public function onError(ConnectionInterface $conn, \Exception $e) {
        echo "An error has occurred: {$e->getMessage()}\n";
        $conn->close();
    }

    public function broadcastToUser(string $userId, array $data) {
        if (isset($this->userConnections[$userId])) {
            $this->userConnections[$userId]->send(json_encode($data));
        }
    }

    public function broadcastToAll(array $data) {
        foreach ($this->clients as $client) {
            $client->send(json_encode($data));
        }
    }
}

// Check if Ratchet is available
if (!class_exists('Ratchet\Server\IoServer')) {
    echo "Ratchet is not installed. Install with: composer require cboden/ratchet\n";
    echo "Falling back to SSE-only mode.\n";
    exit(1);
}

$server = IoServer::factory(
    new HttpServer(
        new WsServer(
            new WebSocketHandler()
        )
    ),
    8080
);

echo "WebSocket server running on port 8080\n";
$server->run();
