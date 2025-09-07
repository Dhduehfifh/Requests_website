from __future__ import annotations
from contextlib import contextmanager
from typing import Iterator

from sqlmodel import Session
from .engine import get_engine

# 新建session
def new_session() -> Session:
    engine = get_engine()
    return Session(engine)

# 上下文管理器（常用入口）
# 目前不会自动提交，使用时需要手动调用session.commit()
@contextmanager
def get_session() -> Iterator[Session]:
    session = new_session()

    try:
        yield session         #生成器（暂停执行，等待下一次恢复继续执行）
    except Exception:
        session.rollback()    #出错时回滚
        raise                 #报错
    finally:
        session.close()

# FastAPI风格的依赖函数，用来自动管理会话
def session_dependency() -> Iterator[Session]:
    with get_session() as session:
        yield session