const BASE_URL = "http://localhost:8000/api/v1";

// JWT 토큰 파싱 헬퍼 함수
export function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

// 공통 요청 함수
async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  
  // 기본 헤더 설정
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // 로컬 스토리지에서 JWT 토큰 가져오기
  const token = localStorage.getItem("accessToken");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    
    // 204 No Content 처리
    if (response.status === 204) {
      return null;
    }

    const data = await response.json();

    if (!response.ok) {
      // 백엔드에서 제공하는 상세 에러 메시지가 있으면 우선 사용
      throw new Error(data.detail || "요청 처리에 실패했습니다.");
    }

    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

// API 객체 정의
export const api = {
  get: (endpoint, headers) => request(endpoint, { method: "GET", headers }),
  post: (endpoint, body, headers) =>
    request(endpoint, { method: "POST", body: JSON.stringify(body), headers }),
  put: (endpoint, body, headers) =>
    request(endpoint, { method: "PUT", body: JSON.stringify(body), headers }),
  patch: (endpoint, body, headers) =>
    request(endpoint, { method: "PATCH", body: JSON.stringify(body), headers }),
  delete: (endpoint, headers) => request(endpoint, { method: "DELETE", headers }),

  // 1. 인증 (Auth) API
  auth: {
    login: async (u_id, password) => {
      const response = await api.post("/auth/login", { u_id, password });
      if (response && response.access_token) {
        localStorage.setItem("accessToken", response.access_token);
        localStorage.setItem("refreshToken", response.refresh_token);
        
        // 토큰 해석하여 기본 사용자 정보 추출 및 저장
        const payload = parseJwt(response.access_token);
        if (payload) {
          const user = {
            id: payload.sub,
            role: payload.role,
            name: payload.sub === "admin1" ? "관리자" : "PB직원",
          };
          localStorage.setItem("currentUser", JSON.stringify(user));
          return user;
        }
      }
      throw new Error("로그인 응답 형식이 올바르지 않습니다.");
    },
    logout: () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("currentUser");
    },
    getCurrentUser: () => {
      const userStr = localStorage.getItem("currentUser");
      return userStr ? JSON.parse(userStr) : null;
    },
    isAuthenticated: () => {
      return !!localStorage.getItem("accessToken");
    }
  },

  // 2. 고객 (Customer) API
  customer: {
    getList: (tab = "all", page = 1, size = 1000) => {
      const queryTab = tab === "today" ? "today" : "all";
      return api.get(`/customers/?tab=${queryTab}&page=${page}&size=${size}`);
    },
    getDetail: (c_id) => api.get(`/customers/${c_id}`),
    create: (data) => api.post("/customers/", data),
    update: (c_id, data) => api.patch(`/customers/${c_id}`, data),
    delete: (c_id) => api.delete(`/customers/${c_id}`),
    
    // 추가 AI 인사이트 및 서포트 API
    getProductMatch: (c_id) => api.get(`/customers/${c_id}/main_product_match`),
    getFeatures: (c_id) => api.get(`/customers/${c_id}/feature`),
    getVisitStats: (c_id) => api.get(`/customers/${c_id}/visit-statistics`),
    getChurnRisk: (c_id) => api.get(`/customers/${c_id}/churn-risk`),
  },

  // 3. 일정 (Schedule) API
  schedule: {
    getList: () => api.get("/schedules"),
    create: (data) => api.post("/schedules", data),
    update: (u_id, schedule_id, data) => api.patch(`/users/${u_id}/schedules/${schedule_id}`, data),
    delete: (schedule_id) => api.delete(`/schedules/${schedule_id}`),
  },

  // 4. AI 투두 (AI To-Do) API
  aiTodo: {
    getList: (u_id) => api.get(`/ai-todo/${u_id ? `?u_id=${u_id}` : ""}`),
    confirm: (u_id, at_ids) => api.post("/ai-todo/confirm", { u_id, at_ids }),
    unconfirm: (at_id) => api.patch(`/ai-todo/${at_id}/unconfirm`),
  }
};
