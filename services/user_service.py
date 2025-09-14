BASE = "https://cheese.app"

def get_user_activities(user_id: int):
    return {
        "rent_posts": 2,
        "second_posts": 5,
        "general_posts": 3,
        "confession_posts": 1,
        "team_posts": 2,
        "ride_posts": 0,
        "rent_posts_url": f"{BASE}/user/{user_id}/posts/rent",
        "second_posts_url": f"{BASE}/user/{user_id}/posts/second_hand",
        "general_posts_url": f"{BASE}/user/{user_id}/posts/general",
        "confession_posts_url": f"{BASE}/user/{user_id}/posts/confession",
        "team_posts_url": f"{BASE}/user/{user_id}/posts/team",
        "ride_posts_url": f"{BASE}/user/{user_id}/posts/ride"
    }

def get_edit_profile_info(user_id: int):
    return {
        "profile_photo": f"{BASE}/cdn/avatars/{user_id}.jpg",
        "name": "Alice",
        "username": "alice123",
        "brief": "CS student at UBC",
        "email": "alice@example.com",
        "phone": "+1-111-222-3333",
        "city": "Vancouver",
        "school": "UBC",
        "major": "Computer Science",
        "grade": "Sophomore",
        "birthday": "2002-05-10",
        "hobbies": ["#coding", "#music"]
    }

def edit_profile_submit(user_id: int, data: dict):
    return {"status": "OK", "user_id": user_id, "updated": data}

def logout_user(user_id: int):
    return {"status": "LOGGED_OUT", "user_id": user_id}

def get_user_profile(user_id: int, watcher_id: int):
    if watcher_id == 999:  # 假设 999 在 block 列表
        return {"username": "blocked"}
    return {
        "user_id": user_id,
        "username": "alice",
        "major": "CS",
        "school": "UBC",
        "create_time": "2025-09-13T10:00:00Z",
        "profile_photo": f"{BASE}/cdn/avatars/{user_id}.jpg",
        "posted": 12,
        "likes": 56,
        "followers": 8,
        "following": 5,
        "edit_profile": f"{BASE}/user/{user_id}/edit_profile/info"
    }