from __future__ import annotations
import os
from sqlalchemy import event
from sqlmodel import SQLModel, create_engine

# 数据库地址，可用"DB_URL"环境变量覆盖
DB_URL = os.getenv("DB_URL", "sqlite:///./app.db")

# 创建数据库引擎
engine = create_engine(
    DB_URL,
    echo=False,
    connect_args={"check_same_thread": False} if DB_URL.startswith("sqlite") else {},
)

if DB_URL.startswith("sqlite"):
    @event.listens_for(engine, "connect")
    def set_sqlite_pragma(dbapi_connection, connection_record):
        cursor = dbapi_connection.cursor()                 # 游标
        cursor.execute("PRAGMA foreign_keys=ON;")          # 开启外键约束
        cursor.execute("PRAGMA journal_mode=WAL;")         # Write-Ahead Logging日志模式
        cursor.execute("PRAGMA busy_timeout=5000;")        # 锁等待时间（当前为5秒）
        cursor.close()
    
def get_engine(): return engine

# 自动创建表(使用时需要import)
def create_db_and_tables():
     SQLModel.metadata.create_all(engine)