
import json
from pathlib import Path

# Project root: TerraSpectra/
PROJECT_ROOT = Path(__file__).resolve().parents[2]

UPLOAD_DIR = PROJECT_ROOT / "uploads"
STATUS_FILE = PROJECT_ROOT / "dataset_status.json"

# Ensure upload directory exists
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


def get_dataset_status():
    if not STATUS_FILE.exists():
        return {}

    try:
        with STATUS_FILE.open("r", encoding="utf-8") as file:
            return json.load(file)
    except (json.JSONDecodeError, OSError):
        return {}


def save_dataset_status(statuses):
    with STATUS_FILE.open("w", encoding="utf-8") as file:
        json.dump(statuses, file, indent=4)


def update_dataset_status(filename: str, status: str):
    safe_filename = Path(filename).name

    statuses = get_dataset_status()
    statuses[safe_filename] = status

    save_dataset_status(statuses)


def remove_dataset_status(filename: str):
    safe_filename = Path(filename).name

    statuses = get_dataset_status()

    if safe_filename in statuses:
        del statuses[safe_filename]

    save_dataset_status(statuses)


def get_dashboard_counts():
    datasets = [
        file
        for file in UPLOAD_DIR.iterdir()
        if file.is_file()
        and file.suffix.lower() in {
            ".tif", ".tiff", ".h5", ".hdf5", ".nc"
        }
    ]

    statuses = get_dataset_status()

    total = len(datasets)

    processed = sum(
        1
        for file in datasets
        if statuses.get(file.name) == "processed"
    )

    return {
        "total_datasets": total,
        "processed_datasets": processed,
        "pending_datasets": total - processed
    }
