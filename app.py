from flask import Flask, jsonify, render_template, send_from_directory, request
from services.user_service import get_user_activities, get_edit_profile_info, edit_profile_submit, logout_user, get_user_profile
from services.post_service import get_posts_by_category, send_post
from services.chat_service import get_chats
from services.explore_service import recommend_posts, search_posts

app = Flask(__name__, template_folder="templates", static_folder="static")

# ---------------------
# 静态页面 & 静态文件
# ---------------------
@app.route("/")
def index():
    return render_template("index.html")

@app.route("/style.css")
def css():
    return send_from_directory("static", "style.css")

@app.route("/script.js")
def js():
    return send_from_directory("static", "script.js")

# =====================================================
# 用户域
# =====================================================
@app.get("/user/<int:user_id>/activities")
def activities(user_id: int):
    return jsonify(get_user_activities(user_id))

@app.get("/user/<int:user_id>/edit_profile/info")
def edit_profile_info(user_id: int):
    return jsonify(get_edit_profile_info(user_id))

@app.post("/user/<int:user_id>/edit_profile/edit")
def edit_profile_edit(user_id: int):
    payload = request.get_json(silent=True) or request.form
    return jsonify(edit_profile_submit(user_id, payload))

@app.get("/user/<int:user_id>/logout")
def logout(user_id: int):
    return jsonify(logout_user(user_id))

@app.get("/user/<int:user_id>/profile/<int:watcher_id>")
def profile(user_id: int, watcher_id: int):
    return jsonify(get_user_profile(user_id, watcher_id))

# =====================================================
# 帖子域
# =====================================================
@app.get("/user/<int:user_id>/posts/<string:category>")
def posts(user_id: int, category: str):
    return jsonify(get_posts_by_category(user_id, category))

@app.post("/user/<int:user_id>/sendpost")
def sendpost(user_id: int):
    payload = request.get_json(silent=True) or request.form
    return jsonify(send_post(user_id, payload))

# =====================================================
# 消息域
# =====================================================
@app.get("/user/<int:user_id>/chats")
def chats(user_id: int):
    return jsonify(get_chats(user_id))

# =====================================================
# 广场/探索域
# =====================================================
@app.get("/recommend/<int:user_id>")
def recommend(user_id: int):
    return jsonify(recommend_posts(user_id))

@app.post("/search/<string:category>/<int:user_id>")
def search(category: str, user_id: int):
    payload = request.get_json(silent=True) or request.form
    return jsonify(search_posts(category, user_id, payload))

# ---------------------
# Main
# ---------------------
if __name__ == "__main__":
    app.run(debug=True)