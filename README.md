```bash
front/src
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
└── pages/                   # 각 도메인 페이지 컴포넌트
    ├── admin/               # 관리자 대시보드 및 권한 설정
    ├── auth/                # 로그인 및 회원가입 (LoginPage, SignUpPage)
    ├── main/                # 메인 대시보드
    ├── calendar/            # 일정 관리 컨텍스트 및 컴포넌트
    ├── customer/            # 고객 정보 및 관리
    ├── assistant/           # AI 상담 보조 
    ├── notification/        # 알림 센터
    └── trend/               # 트렌드 분석 및 뉴스 아카이브 
```