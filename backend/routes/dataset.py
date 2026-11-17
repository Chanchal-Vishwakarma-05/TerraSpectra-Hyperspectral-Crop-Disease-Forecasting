
from fastapi import APIRouter, UploadFile, File, HTTPException
from pathlib import Path
import shutil
import rasterio

router = APIRouter(prefix="/dataset", tags=["Dataset"])

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

ALLOWED_EXTENSIONS = {".tif", ".tiff", ".h5", ".hdf5", ".nc"}

@router.post("/upload")
async def upload_dataset(file: UploadFile = File(...)):
    extension = Path(file.filename).suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file format"
        )

    file_path = UPLOAD_DIR / Path(file.filename).name

    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {
        "message": "Dataset uploaded successfully",
        "filename": file.filename
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

    # TIFF metadata validation
    if extension in {".tif", ".tiff"}:
        try:
            with rasterio.open(file_path) as dataset:
                if dataset.width <= 0 or dataset.height <= 0 or dataset.count <= 0:
                    raise HTTPException(
                        status_code=400,
                        detail="Invalid TIFF dimensions or bands"
                    )

                return {
                    "filename": safe_filename,
                    "format": extension,
                    "file_size_bytes": file_path.stat().st_size,
                    "width": dataset.width,
                    "height": dataset.height,
                    "bands": dataset.count,
                    "data_types": list(dataset.dtypes),
                    "crs": str(dataset.crs) if dataset.crs else None,
                    "status": "valid",
                    "message": "TIFF metadata validation successful"
                }

        except rasterio.errors.RasterioError:
            raise HTTPException(
                status_code=400,
                detail="Unable to read TIFF dataset"
            )

    return {
        "filename": safe_filename,
        "format": extension,
        "file_size_bytes": file_path.stat().st_size,
        "status": "uploaded",
        "message": "Basic file validation successful; metadata validation not implemented for this format"
    }

@router.get("/list")
def list_datasets():
    datasets = []

    for file_path in UPLOAD_DIR.iterdir():
        if file_path.is_file() and file_path.suffix.lower() in ALLOWED_EXTENSIONS:
            datasets.append({
                "filename": file_path.name,
                "format": file_path.suffix.lower(),
                "file_size_bytes": file_path.stat().st_size
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

    return {
        "message": "Dataset deleted successfully",
        "filename": safe_filename
    }