BASE = "https://cheese.app"

def get_posts_by_category(user_id: int, category: str):
    dummy = {
        "title": f"Sample {category} post",
        "description": "This is a demo description.",
        "location": "Campus A",
        "price": "100 CAD/month" if category in ["rent", "second_hand"] else None,
        "likes": 5,
        "comments": 2,
        "post_time": "2025-09-13T10:30:00Z",
        "post_url": f"{BASE}/p/1",
        "pic_url": [f"{BASE}/cdn/posts/1.jpg"]
    }
    return {"items": [dummy] * 10}

def send_post(user_id: int, data: dict):
    return {"status": "POST_CREATED", "user_id": user_id, "data": data}