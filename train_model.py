import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestRegressor
import joblib

# Synthetic Data Generation
np.random.seed(42)
n_rows = 2000

timestamps = pd.date_range(start="2026-01-01", periods=n_rows, freq="h")
worker_ids = np.random.randint(101, 106, size=n_rows)
task_types = np.random.choice(["Coding", "Design", "QA", "Support"], size=n_rows)
base_time = np.random.normal(loc=45.0, scale=5.0, size=n_rows)

temp_df = pd.DataFrame({
    "timestamp": timestamps,
    "worker_id": worker_ids,
    "task_type": task_types,
    "base_time": base_time
})

is_weekend = temp_df["timestamp"].dt.dayofweek >= 5
temp_df.loc[is_weekend, "base_time"] += 15.0

is_coding = temp_df["task_type"] == "Coding"
temp_df.loc[is_coding, "base_time"] += 20.0

df = temp_df.copy()
df["completion_time_min"] = np.clip(df["base_time"], 10, 180)
df = df.drop(columns=["base_time"])

df["hour_of_day"] = df["timestamp"].dt.hour
df["day_of_week"] = df["timestamp"].dt.dayofweek
df["is_weekend"] = (df["day_of_week"] >= 5).astype(int)

X = df[["worker_id", "task_type", "hour_of_day", "day_of_week", "is_weekend"]]
y = df["completion_time_min"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

preprocessor = ColumnTransformer(
    transformers=[
        ("text_to_numbers", OneHotEncoder(drop="first", handle_unknown="ignore"), ["task_type"])
    ],
    remainder="passthrough"
)

ai_pipeline = Pipeline(steps=[
    ("preprocessing_step", preprocessor),
    ("ml_model_step", RandomForestRegressor(n_estimators=100, random_state=42))
])

ai_pipeline.fit(X_train, y_train)

joblib.dump(ai_pipeline, "worker_platform_model.joblib")
print("🎉 Locally trained model saved successfully as worker_platform_model.joblib!")
