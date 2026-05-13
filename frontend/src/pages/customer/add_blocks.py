import os

filename = "CustomerDashboard.jsx"
with open(filename, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add missing recharts imports
content = content.replace("import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from \"recharts\";", "import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, PieChart, Pie, Cell } from \"recharts\";")

# 2. Add new data constants
data_code = """
const assetData = [
  { name: '국내주식', value: 35, color: '#a855f7' },
  { name: '해외주식', value: 28, color: '#c084fc' },
  { name: '채권', value: 20, color: '#2dd4bf' },
  { name: '현금', value: 17, color: '#cbd5e1' },
];

const emotionHistory = [
  { date: '2026.04.27', emoji: '😊', type: '긍정', typeColor: '#2dd4bf', text: '리츠 관심, 방문 의지 높음' },
  { date: '2026.03.15', emoji: '😊', type: '긍정', typeColor: '#2dd4bf', text: '채권 제안 수락, 신뢰 표현' },
  { date: '2026.01.08', emoji: '😐', type: '중립', typeColor: '#94a3b8', text: '조용하게 진행, 큰 반응 없음' },
];
"""
if "const assetData" not in content:
    content = content.replace("const radarData = [", data_code + "\nconst radarData = [")

# 3. Insert new UI blocks before the existing ones
ui_blocks = """
            {/* Row 1: 자산 보유 현황 / 이탈 위험 수준 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              
              {/* 1. 자산 보유 현황 */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: 0 }}>자산 보유 현황</h3>
                  <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>포트폴리오 비중</span>
                </div>
                <div style={{ display: 'flex', flex: 1, alignItems: 'center' }}>
                  <div style={{ position: 'relative', width: 140, height: 140 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={assetData} innerRadius={45} outerRadius={70} paddingAngle={2} dataKey="value" stroke="none">
                          {assetData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>총자산</span>
                      <span style={{ fontSize: 16, fontWeight: 700, color: '#f59e0b' }}>32억</span>
                    </div>
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, marginLeft: 24 }}>
                    {assetData.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color }}></div>
                          <span style={{ fontSize: 12, color: '#475569', fontWeight: 600 }}>{item.name}</span>
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 2. 이탈 위험 수준 */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: 0 }}>이탈 위험 수준</h3>
                  <span style={{ fontSize: 14, color: '#2dd4bf', fontWeight: 700 }}>낮음</span>
                </div>
                <div style={{ background: '#14b8a6', borderRadius: 12, padding: '24px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24, boxShadow: '0 4px 6px -1px rgba(20, 184, 166, 0.3)' }}>
                  <div style={{ fontSize: 32, marginBottom: 4 }}>😊</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: 'white', marginBottom: 4 }}>양호</div>
                  <div style={{ fontSize: 12, color: 'white', fontWeight: 500 }}>이탈 위험이 낮습니다</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '0 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <span style={{ fontSize: 11, color: '#94a3b8', width: 50, textAlign: 'right' }}>방문 간격</span>
                    <div style={{ flex: 1, height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: '40%', height: '100%', background: '#14b8a6', borderRadius: 3 }}></div>
                    </div>
                    <span style={{ fontSize: 12, color: '#14b8a6', fontWeight: 600, width: 20 }}>38</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <span style={{ fontSize: 11, color: '#94a3b8', width: 50, textAlign: 'right' }}>메모 감정</span>
                    <div style={{ flex: 1, height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: '20%', height: '100%', background: '#14b8a6', borderRadius: 3 }}></div>
                    </div>
                    <span style={{ fontSize: 12, color: '#14b8a6', fontWeight: 600, width: 20 }}>20</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <span style={{ fontSize: 11, color: '#94a3b8', width: 50, textAlign: 'right' }}>자산 변화</span>
                    <div style={{ flex: 1, height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: '15%', height: '100%', background: '#14b8a6', borderRadius: 3 }}></div>
                    </div>
                    <span style={{ fontSize: 12, color: '#14b8a6', fontWeight: 600, width: 20 }}>10</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <span style={{ fontSize: 11, color: '#94a3b8', width: 50, textAlign: 'right' }}>응답 속도</span>
                    <div style={{ flex: 1, height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: '60%', height: '100%', background: '#14b8a6', borderRadius: 3 }}></div>
                    </div>
                    <span style={{ fontSize: 12, color: '#14b8a6', fontWeight: 600, width: 20 }}>53</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Row 2: 관심사 태그 / 상담 감정 분석 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              
              {/* 3. 관심사 태그 */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: 0 }}>관심사 태그</h3>
                  <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>누적 빈도 기반</span>
                </div>
                <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
                  <span style={{ position: 'absolute', top: '15%', left: '20%', fontSize: 18, color: '#6366f1', fontWeight: 600 }}>절세</span>
                  <span style={{ position: 'absolute', top: '15%', right: '20%', fontSize: 16, color: '#475569', fontWeight: 600 }}>부동산</span>
                  <span style={{ position: 'absolute', top: '40%', left: '35%', fontSize: 24, color: '#1e293b', fontWeight: 700 }}>국내 리츠</span>
                  <span style={{ position: 'absolute', top: '45%', right: '25%', fontSize: 12, color: '#64748b' }}>ISA</span>
                  <span style={{ position: 'absolute', top: '55%', left: '15%', fontSize: 12, color: '#6366f1' }}>배당주</span>
                  <span style={{ position: 'absolute', bottom: '25%', left: '25%', fontSize: 18, color: '#3b82f6', fontWeight: 600 }}>포트폴리오 재조정</span>
                  <span style={{ position: 'absolute', bottom: '15%', left: '20%', fontSize: 12, color: '#475569' }}>채권</span>
                </div>
              </div>

              {/* 4. 상담 감정 분석 */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: 0 }}>상담 감정 분석</h3>
                  <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>메모 기반 AI 분석</span>
                </div>
                
                {/* Bar chart area */}
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 100, borderBottom: '1px solid #e2e8f0', paddingBottom: 16, marginBottom: 24, padding: '0 16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 16 }}>😊</span>
                    <div style={{ width: 40, height: 70, background: '#2dd4bf', borderRadius: 8 }}></div>
                    <span style={{ fontSize: 11, color: '#94a3b8' }}>04.27</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 16 }}>😊</span>
                    <div style={{ width: 40, height: 70, background: '#2dd4bf', borderRadius: 8 }}></div>
                    <span style={{ fontSize: 11, color: '#94a3b8' }}>03.15</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 16 }}>😐</span>
                    <div style={{ width: 40, height: 35, background: '#cbd5e1', borderRadius: 8 }}></div>
                    <span style={{ fontSize: 11, color: '#94a3b8' }}>01.08</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 16 }}>😊</span>
                    <div style={{ width: 40, height: 70, background: '#2dd4bf', borderRadius: 8 }}></div>
                    <span style={{ fontSize: 11, color: '#94a3b8' }}>11.20</span>
                  </div>
                </div>

                {/* History list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {emotionHistory.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', background: 'white', padding: '12px 16px', borderRadius: 8, gap: 12, boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
                      <span style={{ fontSize: 16 }}>{item.emoji}</span>
                      <span style={{ fontSize: 12, color: '#94a3b8' }}>{item.date}</span>
                      <span style={{ background: item.typeColor, color: 'white', fontSize: 11, padding: '2px 8px', borderRadius: 12, fontWeight: 600 }}>{item.type}</span>
                      <span style={{ fontSize: 12, color: '#475569', fontWeight: 500, flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
"""

if "자산 보유 현황" not in content:
    content = content.replace("{/* Visit Frequency Graph Box */}", ui_blocks + "\n            {/* Visit Frequency Graph Box */}")

with open(filename, "w", encoding="utf-8") as f:
    f.write(content)

# Copy to CustomerRegistration1.jsx
with open("CustomerRegistration1.jsx", "w", encoding="utf-8") as f:
    f.write(content.replace('export default function CustomerDashboard() {', 'export default function CustomerRegistration1() {'))

print("Done")
