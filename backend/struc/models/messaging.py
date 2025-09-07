from __future__ import annotations

from datetime import datetime
from typing import Optional
from uuid import UUID, uuid4

from sqlalchemy import Index, UniqueConstraint, func
from sqlmodel import Field, SQLModel

# 两人之间的会话
class Conversation(SQLModel, table=True):
    __tablename__ = "conversations"
    __table_args__ = (
        UniqueConstraint("user_a", "user_b", name="uq_conversation_users"),
        Index("idx_conversation_user_a", "user_a"),
        Index("idx_conversation_user_b", "user_b"),
        Index("idx_conversation_last_msg_at", "last_msg_at"),
    )

    # 会话ID
    id: UUID = Field(default_factory=uuid4, primary_key=True)

    # 双方用户
    user_a: UUID = Field(foreign_key="users.id", nullable=False)
    user_b: UUID = Field(foreign_key="users.id", nullable=False)
    # 最近一条消息的时间（方便排序）
    last_msg_at: datetime = Field(
        sa_column_kwargs={"server_default": func.now()}, nullable=False
    )
    # 创建时间
    created_at: datetime = Field(sa_column_kwargs={"server_default": func.now()}, nullable=False)

# 单个信息（属于某个会话）
class Message(SQLModel, table=True):
    __tablename__ = "messages"
    __table_args__ = (
        Index("idx_message_conv", "conv_id"),
        Index("idx_message_sender", "sender_id"),
        Index("idx_message_created_at", "created_at"),
    )
    # PK,信息ID    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    # FK，指向某个会话
    conv_id: UUID = Field(foreign_key="conversations.id", nullable=False)
    # FK，指向此信息的发起者
    sender_id: UUID = Field(foreign_key="users.id", nullable=False)
    # 正文，不可为空
    content: str = Field(nullable=False)
    # 图片（如果有）
    image_url: Optional[str] = Field(default=None, max_length=255)
    # 创建日期
    created_at: datetime = Field(sa_column_kwargs={"server_default": func.now()}, nullable=False)

# Converation指的是两人之间的会话，每个converation中的每条信息都是一个Message，目前来说应该够了 