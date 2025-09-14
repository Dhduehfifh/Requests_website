BASE = "https://cheese.app"

def get_chats(user_id: int):
    return {
        "items": [
            {
                "chat_name": "Tom",
                "chat_url": f"{BASE}/dm/1",
                "newest_msg": "Hi Alice!",
                "newest_msg_time": "2025-09-13T09:00:00Z",
                "profile_photo_url": f"{BASE}/cdn/avatars/2.jpg",
                "type": "general"
            }
        ]
    }