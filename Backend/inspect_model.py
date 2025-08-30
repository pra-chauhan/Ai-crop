# backend/inspect_model.py
import joblib, json, os
model_path = "model/crop_model.joblib"
if not os.path.exists(model_path):
    raise SystemExit(f"Put your model at {model_path}")
m = joblib.load(model_path)
print("Model type:", type(m))
print("Has predict_proba?:", hasattr(m, "predict_proba"))
print("Has classes_?:", hasattr(m, "classes_"))
if hasattr(m, "classes_"):
    print("classes_:", getattr(m, "classes_"))
if hasattr(m, "feature_names_in_"):
    print("feature_names_in_:", list(getattr(m, "feature_names_in_")))
# If pipeline, show named steps
try:
    from sklearn.pipeline import Pipeline
    if isinstance(m, Pipeline):
        print("Pipeline steps:", m.named_steps.keys())
        # try to show ColumnTransformer info
        from sklearn.compose import ColumnTransformer
        for name, step in m.named_steps.items():
            print(" step:", name, "->", type(step))
            if isinstance(step, ColumnTransformer):
                print("  ColumnTransformer transformers_:", step.transformers_)
except Exception:
    pass
