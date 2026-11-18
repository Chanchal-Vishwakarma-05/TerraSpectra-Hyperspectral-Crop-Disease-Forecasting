
import rasterio
import numpy as np
from pathlib import Path


UPLOAD_DIR = Path("uploads")


def process_tiff_dataset(filename: str):
    file_path = UPLOAD_DIR / Path(filename).name

    if not file_path.exists() or not file_path.is_file():
        raise FileNotFoundError("Dataset not found")

    if file_path.suffix.lower() not in {".tif", ".tiff"}:
        raise ValueError("Only TIFF datasets are supported")

    with rasterio.open(file_path) as dataset:

        band_statistics = []

        for band_number in range(1, dataset.count + 1):
            band = dataset.read(band_number, masked=True)

            valid_values = band.compressed()

            if valid_values.size == 0:
                band_statistics.append({
                    "band": band_number,
                    "status": "No valid pixel values"
                })
                continue

            band_statistics.append({
                "band": band_number,
                "mean": float(np.mean(valid_values)),
                "minimum": float(np.min(valid_values)),
                "maximum": float(np.max(valid_values)),
                "missing_pixels": int(band.size - valid_values.size)
            })

        return {
            "filename": filename,
            "width": dataset.width,
            "height": dataset.height,
            "total_bands": dataset.count,
            "band_statistics": band_statistics,
            "status": "processed"
        }
