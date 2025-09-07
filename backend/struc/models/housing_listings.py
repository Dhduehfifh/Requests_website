from __future__ import annotations

from datetime import date, datetime
from typing import List, Optional
from uuid import UUID, uuid4
from .enums import RentUnitEnum, HousingTypeEnum

from sqlalchemy import Index, UniqueConstraint, func
from sqlalchemy import JSON
from sqlmodel import Field, SQLModel, Column

# 房源帖信息
class HousingListing(SQLModel, table=True):
    __tablename__ = "housing_listings"
    __table_args__ = (
        Index("idx_housing_city", "city"),
        Index("idx_housing_province", "province"),
        Index("idx_housing_created_at", "created_at"),
        Index("idx_housing_type", "housing_type")
    )
    
    # PK, 租房帖ID
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    # FK，指向用户ID（发布者）
    owner_id: UUID = Field(foreign_key="users.id", nullable=False)
    # 标题，不可为空
    title: str = Field(nullable=False, max_length=100)
    # 描述，可以为空
    desc: Optional[str] = Field(default=None)
    # 城市，不可为空
    city: str = Field(nullable=False, max_length=50)
    # 省份，不可为空
    province: str = Field(nullable=False, max_length=50)
    # 地址，可以为空
    address: Optional[str] = Field(default=None, max_length=255)
    # 单元号，可以为空
    unit_number: Optional[str] = Field(default=None, max_length=20)
    # 邮编，可以为空
    postal_code: Optional[str] = Field(default=None, max_length=20)
    # 房屋类型，不可为空
    housing_type: HousingTypeEnum = Field(default=HousingTypeEnum.apartment, nullable=False)
    # 租金，可以为空
    rent: Optional[int] = Field(default=None, ge=0)
    # 租金类型（每年/每月/每日），可以为空
    rent_unit: Optional[RentUnitEnum] = Field(default=None)
    # 图片，可以为空
    images: List[str] = Field(default_factory=list, sa_column=Column(JSON, nullable=False, server_default="[]"),)
    # 创建日期
    created_at: datetime = Field(sa_column_kwargs={"server_default": func.now()}, nullable=False)

# 目前我想的是城市肯定不能为空，省份估计不用用户填，直接根据城市来就好
# 地址和价格可以为空，留空表示“面议”