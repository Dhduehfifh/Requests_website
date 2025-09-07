from enum import Enum

class LanguageEnum(str, Enum):
    en = "en"
    zh = "zh"

class RentUnitEnum(str, Enum):
    year = "year"
    month = "month"
    day = "day"

class HousingTypeEnum(str, Enum):
    house = "house"           # 独栋房
    apartment = "apartment"   # 公寓
    condo = "condo"           # 公寓（产权式）
    townhouse = "townhouse"   # 联排
    other = "other"           # 其他

class MarketCategoryEnum(str, Enum):
    electronics = "electronics"             # 电子产品（手机、电脑、相机…）
    furniture = "furniture"                 # 家具
    home_appliances = "home_appliances"     # 家电
    vehicles = "vehicles"                   # 交通工具
    books = "books"                         # 书籍
    fashion = "fashion"                     # 服饰/箱包
    sports = "sports"                       # 运动
    entertainment = "entertainment"         # 娱乐
    digital = "digital"                     # 虚拟物品
    other = "other"                         # 其他

class TradeMethodEnum(str, Enum):
    meetup = "meetup"          # 当面交易（公共场所）
    pickup = "pickup"          # 买家自提
    delivery = "delivery"      # 卖家送货
    shipping = "shipping"      # 卖家邮寄

class StatusEnum(str, Enum):
    open = "active"
    closed = "closed"