from __future__ import annotations

from datetime import datetime
from typing import Optional
from uuid import UUID, uuid4
from .enums import StatusEnum

from sqlalchemy import Index, UniqueConstraint, func
from sqlmodel import Field, SQLModel

#论坛帖
class ForumPost(SQLModel, table=True):
    __tablename__ = "forum_posts"
    __table_args__ = (
        Index("idx_forum_city", "city"),
        Index("idx_forum_province", "province"),
        Index("idx_forum_created_at", "created_at"),
        Index("idx_forum_author", "author_id")
    )

    # PK, 论坛帖ID
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    # FK，只想用户ID（发布者）
    author_id: UUID = Field(foreign_key="users.id", nullable=False)
    # 标题，不可为空
    title: str = Field(nullable=False, max_length=150)
    # 正文，不可为空
    content: str = Field(nullable=False)
    # 城市，可以为空
    city: Optional[str] = Field(default=None, max_length=50)
    # 省份，可以为空
    province: Optional[str] = Field(default=None, max_length=50)
    # 状态，默认active，不可为空
    status: StatusEnum = Field(default=StatusEnum.active, nullable=False)
    # 创建日期
    created_at: datetime = Field(sa_column_kwargs={"server_default": func.now()}, nullable=False)

# 论坛帖评论
class ForumComment(SQLModel, table=True):
    __tablename__ = "forum_comments"
    __table_args__ = (
        Index("idx_comment_post", "post_id"),
        Index("idx_comment_author", "author_id"),
        Index("idx_comment_created_at", "created_at"),
    )

    # PK，评论ID
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    # FK，指向原帖
    post_id: UUID = Field(foreign_key="forum_posts.id", nullable=False)
    # FK, 用户ID（发布者）
    author_id: UUID = Field(foreign_key="users.id", nullable=False)
    # 正文，不可为空
    content: str = Field(nullable=False)
    # 创建日期
    created_at: datetime = Field(sa_column_kwargs={"server_default": func.now()}, nullable=False)

# 对于MVP来说，目前我还没有考虑做TAG，因为如果只是单纯给一个帖子加一个list of string，索引会比较难做，很也难做规范化和统计
# 未来可能会加上两个表，ForumTag 和 ForumPostTag，用来管理tag
# 加了一个active/closed的状态，可以考虑一个帖子过一段时间就close，不能评论了（我看有些论坛这么做），虽然咱们还没定但我先加上