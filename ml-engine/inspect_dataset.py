
import numpy as np
from pathlib import Path

DATA_DIR = Path("ml-engine/data/raw")

for file in DATA_DIR.glob("*.npz"):
    print("\nDataset:", file.name)

    data = np.load(file)

    print("Available keys:", data.files)

    for key in data.files:
        array = data[key]
        print(f"{key}: Shape={array.shape}, Data type={array.dtype}")
import pandas as pd

metadata_path = DATA_DIR / "metadata.tab"

if metadata_path.exists():
    df = pd.read_csv(metadata_path, sep="\t")

    print("\nMetadata columns:")
    print(df.columns.tolist())

    print("\nFirst 5 rows:")
    print(df.head())

    print("\nDataset information:")
    print(df.info())
else:
    print("\nmetadata.tab not found!")

print("\n--- Pathogen Distribution ---")
print(df["pathogen"].value_counts(dropna=False))

print("\n--- Image ID 2436 ---")
print(df[df["image_id"] == 2436])

print("\n--- Unique Parts ---")
print(df["part"].value_counts(dropna=False))
