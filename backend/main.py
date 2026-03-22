from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import os
import logging

from simulator import run_simulation

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Simulador de Equações - API",
    description="Backend para simulação de processos químicos e análise experimental",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class SimulationRequest(BaseModel):
    model: str
    data: List[Dict[str, Any]]


class SimulationResponse(BaseModel):
    predictions: List[float]
    model_used: str
    n_samples: int


@app.get("/health")
def health_check():
    return {"status": "ok", "message": "Simulador API running"}


@app.post("/simulate", response_model=SimulationResponse)
def simulate(request: SimulationRequest):
    if not request.model or not request.model.strip():
        raise HTTPException(status_code=400, detail="Model expression cannot be empty")
    if not request.data:
        raise HTTPException(status_code=400, detail="Data cannot be empty")
    
    try:
        predictions = run_simulation(request.model, request.data)
        return SimulationResponse(
            predictions=predictions,
            model_used=request.model,
            n_samples=len(predictions)
        )
    except Exception as e:
        logger.error(f"Simulation error: {e}")
        raise HTTPException(status_code=422, detail=f"Error evaluating model: {str(e)}")


# Serve React frontend if build exists
frontend_build_dir = os.path.join(os.path.dirname(__file__), "frontend_build")
if os.path.exists(frontend_build_dir):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_build_dir, "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        index_path = os.path.join(frontend_build_dir, "index.html")
        return FileResponse(index_path)
