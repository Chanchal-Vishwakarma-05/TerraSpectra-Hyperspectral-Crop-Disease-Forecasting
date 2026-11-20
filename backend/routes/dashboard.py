
from fastapi import APIRouter
from backend.services.data_service import get_dashboard_counts

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/stats")
def get_dashboard_stats():

    counts = get_dashboard_counts()

    return {
        "total_datasets": counts["total_datasets"],
        "processed_datasets": counts["processed_datasets"],
        "pending_datasets": counts["pending_datasets"],
        "total_predictions": 0,
        "message": "Dashboard statistics fetched successfully"
    }
