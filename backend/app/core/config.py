
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DATABASE_URL: str
    APP_ENV: str = "development"
    SECRET_KEY: str = "supersecret"
    DEFAULT_BORROW_DAYS: int = 7
    FINE_PER_DAY: int = 10
    FRONTEND_URLS: str = "http://localhost:3000,http://127.0.0.1:3000"

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"   # 🔥 ignore unknown env vars
    )


settings = Settings()