# Simulador de Equações - Análise de Processos Químicos

A full-stack chemical process simulator for experimental data analysis and mathematical model evaluation.

## Features

- **FastAPI backend** with SymPy-based safe expression evaluation
- **React + Vite frontend** with Material-UI components
- Interactive DataGrid for experimental data input
- GUI model builder for polynomial equations
- Plotly charts: scatter plots, 3D response surface, boxplot
- CSV export of simulation results
- Docker multi-stage build

## Quick Start

### With Docker

```bash
docker build -t simulador-eq .
docker run -p 8000:8000 simulador-eq
```

Then open http://localhost:8000

### Development

**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## API

- `GET /health` — Health check
- `POST /simulate` — Run simulation with model expression and data

## Tech Stack

- **Backend:** FastAPI, SymPy, NumPy, SciPy
- **Frontend:** React, Vite, Material-UI, Plotly, Axios
