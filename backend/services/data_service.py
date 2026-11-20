
import json
from pathlib import Path

UPLOAD_DIR = Path("uploads")
STATUS_FILE = Path("dataset_status.json")


def get_dataset_status():
    if not STATUS_FILE.exists():
        return {}

    with STATUS_FILE.open("r") as file:
        return json.load(file)


def update_dataset_status(filename: str, status: str):
    statuses = get_dataset_status()

    statuses[Path(filename).name] = status

    with STATUS_FILE.open("w") as file:
        json.dump(statuses, file, indent=4)


def get_dashboard_counts():
    datasets = [
        file for file in UPLOAD_DIR.iterdir()
        if file.is_file()
        and file.suffix.lower() in {".tif", ".tiff", ".h5", ".hdf5", ".nc"}
    ]

    statuses = get_dataset_status()

    total = len(datasets)

    processed = sum(
        1 for file in datasets
        if statuses.get(file.name) == "processed"
    )

    return {
        "total_datasets": total,
        "processed_datasets": processed,
        "pending_datasets": total - processed
    }
