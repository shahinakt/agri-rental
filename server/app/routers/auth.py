from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.user import UserCreate, UserLogin, UserOut
from app.schemas.auth import Token
from app.services.auth_service import register_user, authenticate_user, build_token_for_user
from app.auth.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=Token, status_code=201)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    user = register_user(db, user_in)
    token = build_token_for_user(user)
    return Token(access_token=token, user=user)


@router.post("/login", response_model=Token)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = authenticate_user(db, credentials.email, credentials.password)
    token = build_token_for_user(user)
    return Token(access_token=token, user=user)


@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
