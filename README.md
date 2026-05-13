# WooriFISA WebApp

변환된 Figma/Locofy 페이지 코드를 `frontend/`(React) + `backend/`(FastAPI) 구조로 통합하는 작업 공간입니다.

## 실행

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
python3 -m venv .venv
./.venv/bin/pip install -r requirements.txt
./.venv/bin/uvicorn app.main:app --reload --port 8000
```

