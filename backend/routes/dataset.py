from backend.services.data_service import update_dataset_status
from backend.services.data_service import remove_dataset_status
from fastapi import APIRouter, UploadFile, File, HTTPException
from pathlib import Path
import shutil

router = APIRouter(prefix="/dataset", tags=["Dataset"])

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

ALLOWED_EXTENSIONS = {".tif", ".tiff", ".h5", ".hdf5", ".nc"}

@router.post("/upload")
async def upload_dataset(file: UploadFile = File(...)):
    safe_filename = Path(file.filename).name
    extension = Path(safe_filename).suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file format"
        )

    file_path = UPLOAD_DIR / safe_filename

    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Automatically mark newly uploaded dataset as pending
    update_dataset_status(safe_filename, "pending")

    return {
        "message": "Dataset uploaded successfully",
        "filename": safe_filename,
        "status": "pending"
    }


@router.get("/validate/{filename}")
def validate_dataset(filename: str):
    safe_filename = Path(filename).name

    if safe_filename != filename:
        raise HTTPException(status_code=400, detail="Invalid filename")

    file_path = UPLOAD_DIR / safe_filename

    if not file_path.exists() or not file_path.is_file():
        raise HTTPException(status_code=404, detail="Dataset not found")

    if file_path.stat().st_size == 0:
        raise HTTPException(status_code=400, detail="Dataset file is empty")

    extension = file_path.suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Unsupported file format")

    return {
        "filename": safe_filename,
        "format": extension,
        "file_size_bytes": file_path.stat().st_size,
        "status": "uploaded",
        "message": "Basic file validation successful"
    }


@router.get("/list")
def list_datasets():
    from backend.services.data_service import get_dataset_status

    statuses = get_dataset_status()
    datasets = []

    for file_path in UPLOAD_DIR.iterdir():
        if file_path.is_file() and file_path.suffix.lower() in ALLOWED_EXTENSIONS:
            datasets.append({
                "filename": file_path.name,
                "format": file_path.suffix.lower(),
                "file_size_bytes": file_path.stat().st_size,
                "status": statuses.get(file_path.name, "pending")
            })

    return {
        "total_datasets": len(datasets),
        "datasets": datasets
    }

@router.delete("/delete/{filename}")
def delete_dataset(filename: str):
    safe_filename = Path(filename).name

    if safe_filename != filename:
        raise HTTPException(status_code=400, detail="Invalid filename")

    file_path = UPLOAD_DIR / safe_filename

    if not file_path.exists() or not file_path.is_file():
        raise HTTPException(status_code=404, detail="Dataset not found")

    if file_path.suffix.lower() not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Unsupported file format")

    file_path.unlink()
    remove_dataset_status(safe_filename)

    return {
        "message": "Dataset deleted successfully",
        "filename": safe_filename
    }
@router.post("/status/{filename}")
def mark_dataset_processed(filename: str):

    safe_filename = Path(filename).name

    if safe_filename != filename:
        raise HTTPException(status_code=400, detail="Invalid filename")

    file_path = UPLOAD_DIR / safe_filename

    if not file_path.exists() or not file_path.is_file():
        raise HTTPException(status_code=404, detail="Dataset not found")

    if file_path.suffix.lower() not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Unsupported file format")

    update_dataset_status(safe_filename, "processed")

    return {
        "filename": safe_filename,
        "status": "processed",
        "message": "Dataset status updated successfully"
    }