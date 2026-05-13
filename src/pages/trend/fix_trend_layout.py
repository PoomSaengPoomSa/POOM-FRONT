import os

filename = "TrendArchive.jsx"
with open(filename, "r", encoding="utf-8") as f:
    content = f.read()

if "import { Calendar, TrendingUp, Users, Bell, LogOut, MoreHorizontal, ChevronDown, Activity, Home, DollarSign } from \"lucide-react\";" in content:
    content = content.replace("import { Calendar, TrendingUp, Users, Bell, LogOut, MoreHorizontal, ChevronDown, Activity, Home, DollarSign } from \"lucide-react\";",
                              "import { Calendar, TrendingUp, Users, Bell, LogOut, MoreHorizontal, ChevronDown, Activity, Home, DollarSign, ChevronRight } from \"lucide-react\";")

old_news_title = """            <h2 className="trend-section-title">
              뉴스 아카이브
              <MoreHorizontal size={20} color="#94a3b8" />
            </h2>"""
new_news_title = """            <h2 className="trend-section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>뉴스 아카이브</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: '#0ea5e9', fontWeight: 600, background: '#f0f9ff', padding: '6px 12px', borderRadius: 20 }}>
                자세히 보기 <ChevronRight size={16} />
              </div>
            </h2>"""
content = content.replace(old_news_title, new_news_title)

old_eco_box = """        <div className="trend-section-box" style={{ background: 'transparent', padding: 0, boxShadow: 'none' }}>
          <Link to="/economic-indicator-archive" style={{ textDecoration: 'none' }}>
            <h2 className="trend-section-title" style={{ padding: '0 8px' }}>
              경제지표 아카이브
            </h2>
          </Link>"""
new_eco_box = """        <div className="trend-section-box">
          <Link to="/economic-indicator-archive" style={{ textDecoration: 'none' }}>
            <h2 className="trend-section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>경제지표 아카이브</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: '#0ea5e9', fontWeight: 600, background: '#f0f9ff', padding: '6px 12px', borderRadius: 20 }}>
                자세히 보기 <ChevronRight size={16} />
              </div>
            </h2>
          </Link>"""
content = content.replace(old_eco_box, new_eco_box)

with open(filename, "w", encoding="utf-8") as f:
    f.write(content)

print("Done")
