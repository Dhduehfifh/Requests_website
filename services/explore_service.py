BASE = "https://cheese.app"

def recommend_posts(user_id: int):
    return {
        "items": [
            {
                "type": "general",
                "title": "Hot topic",
                "description": "Campus event",
                "likes": 20,
                "comments": 5,
                "url": f"{BASE}/p/99"
            }
        ]
    }

def search_posts(category: str, user_id: int, data: dict):
    q = data.get("q", "")
    return {
        "items": [
            {
                "type": category,
                "title": f"Search result for {q}",
                "description": "Matched content",
                "likes": 1,
                "comments": 0,
                "url": f"{BASE}/p/101"
            }
        ]
    }