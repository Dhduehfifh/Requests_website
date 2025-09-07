from __future__ import annotations

from datetime import date, datetime
from typing import Optional
from uuid import UUID, uuid4
from .enums import LanguageEnum

from sqlalchemy import Index, UniqueConstraint, func
from sqlmodel import Field, SQLModel

# 用户档案
class User(SQLModel, table=True):
    __tablename__ = "users"

    # 索引表，其中手机号，邮箱与用户名不可重复
    __table_args__ = (
        UniqueConstraint("phone_e164", name="uq_users_phone"),
        UniqueConstraint("email", name="uq_users_email"),
        UniqueConstraint("username", name="uq_users_username"),
        Index("idx_users_city", "city"),
        Index("idx_users_school", "school"),
        Index("idx_users_created_at", "created_at")
    )
    
    # PK,用户ID
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    # 手机号，可以为空（以便以后添加微信登陆等功能）
    phone_e164: Optional[str] = Field(default=None, nullable=True, max_length=15)
    # 邮箱，可以为空
    email: Optional[str] = Field(default=None, max_length=255)
    # 生日，可以为空
    birthday: Optional[date] = Field(default=None)
    # 用户名，不可为空
    username: str = Field(nullable=False, max_length=30)
    # 头像链接，可以为空
    avatar_url: Optional[str] = Field(default=None)
    # 学校，可以为空
    school: Optional[str] = Field(default=None, max_length=50)
    # 城市，可以为空
    city: Optional[str] = Field(default=None, max_length=50)
    # 语言，默认为英语
    language: LanguageEnum = Field(default=LanguageEnum.en, nullable=False)
    # 账号创建日期
    created_at: datetime = Field(sa_column_kwargs={"server_default": func.now()}, nullable=False)
    # 封禁状态😈
    banned: bool = Field(default=False, nullable=False)