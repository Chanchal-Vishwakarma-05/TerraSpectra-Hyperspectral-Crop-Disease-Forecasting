
from fastapi import APIRouter

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/stats")
def get_dashboard_stats():
    return {
        "total_datasets": 0,
        "processed_datasets": 0,
        "pending_datasets": 0,
        "total_predictions": 0,
        "message": "Dashboard statistics fetched successfully"
    }
