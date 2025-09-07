from __future__ import annotations

from datetime import datetime
from typing import Optional
from uuid import UUID, uuid4
from .enums import StatusEnum

from sqlalchemy import Index, UniqueConstraint, func
from sqlmodel import Field, SQLModel

#找搭子帖信息
class LFGPost(SQLModel, table=True):
    __tablename__ = "lfg_posts"
    __table_args__ =(
        Index("idx_lfg_city", "city"),
        Index("idx_lfg_province", "province"),
        Index("idx_lfg_created_at", "created_at")
    )

    # PK，搭子帖ID
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    # FK，指向用户ID（发布者）
    author_id: UUID = Field(foreign_key="users.id", nullable=False)
    # 标题，不可为空
    title: str = Field(nullable=False, max_length=120)
    # 描述，可以为空
    desc: Optional[str] = Field(default=None)
    # 主题，不可为空
    topic: str = Field(nullable=False, max_length=100)
    # 需要人数，可以为空
    people_needed: Optional[int] = Field(default=None, ge=1)
    # 期望总人数，可以为空
    total_expected: Optional[int] = Field(default=None, ge=1)
    # 城市，可以为空
    city: Optional[int] = Field(default=None, max_length=50)
    # 省份，可以为空
    province: Optional[int] = Field(default=None, max_length=50)
    # 地点，可以为空
    location: Optional[str] = Field(default=None, max_length=999)
    # 时间，可以为空
    time_text: Optional[str] = Field(default=None, max_length=999)
    # 状态，默认active，不可为空
    status: StatusEnum = Field(default=StatusEnum.active, nullable=False)
    # 创建日期
    created_at: datetime = Field(sa_column_kwargs={"server_default": func.now()}, nullable=False)

# LFG -> Looking For Group
# 除了标题外基本都能为空，我那意思大伙爱咋着咋着
# 城市留空的话，就当是“线上”
# 一个LFG帖子可以开关以便重复使用