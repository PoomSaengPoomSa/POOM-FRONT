# 🖥️ POOM-FRONT

> **POOM** — PB(Private Banker) 업무 지원 AI Assistant 플랫폼의 프론트엔드

---

## 📌 개요

POOM 플랫폼의 React 기반 웹 클라이언트 레포지토리입니다.
PB의 상담 전·중·후 업무를 지원하는 UI를 제공하며,
상담 시뮬레이터, 메모 어시스턴트, AI To-Do, 고객 관리, 경제지표 시각화 화면으로 구성됩니다.

---

## 🗂 프로젝트 구조
src/

├── api.js                   # 백엔드 API 연동 모듈

├── App.css / App.jsx

├── main.jsx / index.css

├── components/

│   └── common/

│       └── Sidebar.jsx      # 공통 사이드바

├── layouts/

│   └── AppLayout.jsx        # 공통 레이아웃

├── router/

│   └── AppRouter.jsx        # 전체 라우터 정의

├── styles/

│   └── global.css           # 글로벌 CSS

└── pages/

├── admin/               # 관리자 대시보드 및 권한 설정

├── auth/                # 로그인 및 회원가입

├── main/                # 메인 대시보드

├── calendar/            # 일정 관리

├── customer/            # 고객 정보 및 관리

├── assistant/           # AI 상담 보조

├── notification/        # 알림 센터

└── trend/               # 트렌드 분석 및 뉴스 아카이브

---

## ⚙️ 기술 스택

| 분류 | 기술 |
|---|---|
| **Framework** | React 19 |
| **Build Tool** | Vite 8 |
| **라우팅** | React Router DOM v7 |
| **차트/시각화** | Recharts |
| **아이콘** | Lucide React |
| **Lint** | ESLint 10 |

---

## 🚀 실행 방법

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:5173)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

---

## 🔗 연관 레포지토리

| 레포 | 역할 |
|---|---|
| [POOM-BACK](https://github.com/PoomSaengPoomSa/POOM-BACK) | FastAPI 백엔드 서버 |
| [POOM-AI](https://github.com/PoomSaengPoomSa/POOM-AI) | LangGraph 멀티 에이전트 |
| [POOM-AIRFLOW](https://github.com/PoomSaengPoomSa/POOM-AIRFLOW) | MLOps 데이터 파이프라인 |
| [POOM-MLFLOW](https://github.com/PoomSaengPoomSa/POOM-MLFLOW) | 모델 실험 관리 |
| [POOM-ELK](https://github.com/PoomSaengPoomSa/POOM-ELK) | 로그 모니터링 |

---

> 우리FISA AI 엔지니어링 1팀 | POOM 프로젝트
