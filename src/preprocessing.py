
import pandas as pd
from sklearn.preprocessing import StandardScaler


def clean_data(data):
    """Clean the crop disease dataset."""

    data = data.copy()

    # Remove duplicate records
    data = data.drop_duplicates()

    # Handle missing numerical values
    numeric_columns = data.select_dtypes(
        include=["number"]
    ).columns

    for column in numeric_columns:
        data[column] = data[column].fillna(
            data[column].median()
        )

    print("Data cleaning completed!")
    return data


def scale_features(data, feature_columns):
    """Scale numerical features."""

    data = data.copy()

    scaler = StandardScaler()

    data[feature_columns] = scaler.fit_transform(
        data[feature_columns]
    )

    print("Feature scaling completed!")
    return data


if __name__ == "__main__":
    print("TerraSpectra Preprocessing Module")
    print("Ready for crop disease data preprocessing.")
