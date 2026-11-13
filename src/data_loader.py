
import pandas as pd
from pathlib import Path


def load_dataset(file_path):
    """
    Load a crop disease dataset from a CSV file.
    """

    file_path = Path(file_path)

    if not file_path.exists():
        raise FileNotFoundError(
            f"Dataset not found: {file_path}"
        )

    try:
        data = pd.read_csv(file_path)

        print("Dataset loaded successfully!")
        print(f"Dataset shape: {data.shape}")
        print("\nFirst five records:")
        print(data.head())

        return data

    except Exception as error:
        print(f"Error loading dataset: {error}")
        return None


if __name__ == "__main__":
    print("TerraSpectra Data Loader")
    print("Ready to load crop disease data.")
