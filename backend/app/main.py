from fastapi import FastAPI, Request
from app.api.routes import books, members, issue, fine, staff
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError


app = FastAPI(
    title="📚 Neighborhood Library API",
    description="Library Management System",
    version="1.0.0",
    contact={
        "name": "Vishal",
        "email": "vishalkhoje@gmail.com",
    }
)

from app.core.config import settings

# Configure CORS
origins = [url.strip() for url in settings.FRONTEND_URLS.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Allows GET, POST, PUT, DELETE, OPTIONS, etc.
    allow_headers=["*"],
)

# ✅ ROUTERS
app.include_router(books.router, prefix="/api")
app.include_router(members.router, prefix="/api")
app.include_router(issue.router, prefix="/api")
app.include_router(fine.router, prefix="/api")
app.include_router(staff.router, prefix="/api")


# ✅ HEALTH CHECK
@app.get("/")
def root():
    return {"message": "Library API Running 🚀"}

# ✅ EXCEPTION HANDLERS
@app.exception_handler(IntegrityError)
async def integrity_error_handler(request: Request, exc: IntegrityError):
    return JSONResponse(
        status_code=400,
        content={"detail": "Database integrity error: This operation violates a database constraint."},
    )