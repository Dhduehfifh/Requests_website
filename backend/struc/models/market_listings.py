from __future__ import annotations

from datetime import datetime
from typing import List, Optional
from uuid import UUID, uuid4
from .enums import MarketCategoryEnum, TradeMethodEnum

from sqlalchemy import CheckConstraint, Index, func
from sqlalchemy import JSON
from sqlmodel import Field, SQLModel, Column

# 售卖帖信息
class MarketListing(SQLModel, table=True):
    __tablename__ = "market_listings"
    __table_args__ = (
        Index("idx_market_city", "city"),
        Index("idx_market_province", "province"),
        Index("idx_market_category", "category"),
        Index("idx_market_created_at", "created_at"),
        Index("idx_market_owner", "owner_id"),
        CheckConstraint(
            "(category = 'digital') OR (city IS NOT NULL)",
            name="ck_market_non_digit_city"
        )
    )

    # PK, 售卖帖ID
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    # FK，指向用户ID（发布者）
    owner_id: UUID = Field(foreign_key="users.id", nullable=False)
    # 标题，不可为空
    title: str = Field(nullable=False, max_length=120)
    # 描述，可以为空
    desc: Optional[str] = Field(default=None)
    # 城市，可以为空
    city: Optional[int] = Field(default=None, max_length=50)
    # 省份，可以为空
    province: Optional[int] = Field(default=None, max_length=50)
    # 分类，不可为空
    category: MarketCategoryEnum = Field(nullable=False)
    # 价格，可以为空
    price: Optional[int] = Field(default=None, ge=0)
    # 交易方式
    trade_methods: List[TradeMethodEnum] = Field( default_factory=list, sa_column=Column(JSON, nullable=False, server_default="[]"), )
    # 图片，可以为空
    images: List[str] = Field(default_factory=list, sa_column=Column(JSON, nullable=False, server_default="[]"),)
    # 创建日期
    created_at: datetime = Field(sa_column_kwargs={"server_default": func.now()}, nullable=False)

# 我参考了Kijiji，首先分类不能为空，以便用户筛选
# 价格可以为空，留空表示“面议”
# 城市虽然可以为空，但必须是线上产品（比如游戏账号之类的）