export const deptConfig = [
  { name: '製造部', color: '#5b8ff9', bg: '#eff4ff' },
  { name: '物流部', color: '#ff7a45', bg: '#fff4ec' },
  { name: '研發部', color: '#5ad8a6', bg: '#e8faf5' },
  { name: '行銷部', color: '#f6c23e', bg: '#fffbe6' },
  { name: '行政部', color: '#9b59b6', bg: '#f9f0ff' },
  { name: '人資部', color: '#36cfc9', bg: '#e6fffb' },
]

export const deptAvg = {
  '製造部': { emissions: 3.60, waste: 70, paper:  4.9, electricity: 1600, travel:  208 },
  '物流部': { emissions: 3.17, waste: 42, paper:  3.3, electricity:  765, travel: 4133 },
  '研發部': { emissions: 2.98, waste: 40, paper:  4.7, electricity: 2380, travel:  800 },
  '行銷部': { emissions: 3.36, waste: 45, paper: 10.2, electricity:  800, travel: 4400 },
  '行政部': { emissions: 4.00, waste: 53, paper: 25.4, electricity: 1096, travel:  690 },
  '人資部': { emissions: 2.75, waste: 33, paper: 16.8, electricity:  750, travel:  750 },
}

export const allEmployees = [
  // ── 製造部 ────────────────────────────────────────────────────
  { id:  1, name: '張志遠', dept: '製造部', role: '生產工程師',     emissions: 4.2, waste:  85, paper:  5.0, electricity: 1820, travel:  200, trend: '+3.5%', up: true  },
  { id:  2, name: '林美玲', dept: '製造部', role: '品管專員',       emissions: 3.6, waste:  62, paper:  3.8, electricity: 1450, travel:   80, trend: '-1.2%', up: false },
  { id:  3, name: '陳建國', dept: '製造部', role: '機械操作員',     emissions: 3.9, waste:  92, paper:  2.1, electricity: 2100, travel:   50, trend: '+1.8%', up: true  },
  { id:  4, name: '王芳如', dept: '製造部', role: '廠務主任',       emissions: 3.2, waste:  58, paper:  8.5, electricity: 1350, travel:  450, trend: '-0.8%', up: false },
  { id:  5, name: '黃志豪', dept: '製造部', role: '物料管理員',     emissions: 3.8, waste:  78, paper:  3.5, electricity: 1680, travel:  120, trend: '+2.2%', up: true  },
  { id:  6, name: '許淑芬', dept: '製造部', role: '安全衛生專員',   emissions: 2.9, waste:  45, paper:  6.2, electricity: 1200, travel:  350, trend: '-2.5%', up: false },

  // ── 物流部 ────────────────────────────────────────────────────
  { id:  7, name: '劉春雨', dept: '物流部', role: '物流司機',       emissions: 4.8, waste:  38, paper:  1.5, electricity:  520, travel: 8500, trend: '+1.5%', up: true  },
  { id:  8, name: '吳宗霖', dept: '物流部', role: '倉管主任',       emissions: 3.1, waste:  72, paper:  4.2, electricity: 1100, travel: 1500, trend: '-1.8%', up: false },
  { id:  9, name: '蔡佳蓉', dept: '物流部', role: '配送規劃員',     emissions: 2.8, waste:  35, paper:  3.8, electricity:  820, travel: 4200, trend: '-0.5%', up: false },
  { id: 10, name: '謝明達', dept: '物流部', role: '車隊管理員',     emissions: 3.5, waste:  45, paper:  2.9, electricity:  780, travel: 5600, trend: '+3.1%', up: true  },
  { id: 11, name: '周雅婷', dept: '物流部', role: '客服協調',       emissions: 2.2, waste:  28, paper:  3.0, electricity:  650, travel: 1200, trend: '-3.2%', up: false },
  { id: 12, name: '鄭浩然', dept: '物流部', role: '進出口專員',     emissions: 2.6, waste:  32, paper:  4.5, electricity:  720, travel: 3800, trend: '+0.9%', up: true  },

  // ── 研發部 ────────────────────────────────────────────────────
  { id: 13, name: '楊明哲', dept: '研發部', role: '資深研發工程師', emissions: 3.2, waste:  42, paper:  5.8, electricity: 2200, travel: 1800, trend: '-2.1%', up: false },
  { id: 14, name: '曾麗娟', dept: '研發部', role: 'AI 工程師',      emissions: 2.9, waste:  35, paper:  4.1, electricity: 2800, travel:  600, trend: '-1.5%', up: false },
  { id: 15, name: '方俊傑', dept: '研發部', role: '硬體工程師',     emissions: 3.6, waste:  55, paper:  4.5, electricity: 2950, travel:  900, trend: '+0.8%', up: true  },
  { id: 16, name: '徐雅芳', dept: '研發部', role: '產品設計師',     emissions: 2.5, waste:  30, paper:  5.2, electricity: 1850, travel: 1200, trend: '-1.9%', up: false },
  { id: 17, name: '洪偉傑', dept: '研發部', role: '測試工程師',     emissions: 2.7, waste:  38, paper:  3.8, electricity: 2100, travel:  500, trend: '-2.8%', up: false },

  // ── 行銷部 ────────────────────────────────────────────────────
  { id: 18, name: '陳雅文', dept: '行銷部', role: '行銷總監',       emissions: 4.5, waste:  52, paper: 12.5, electricity:  980, travel: 8500, trend: '+2.8%', up: true  },
  { id: 19, name: '李志強', dept: '行銷部', role: '社群媒體專員',   emissions: 2.8, waste:  38, paper:  8.2, electricity:  720, travel: 2400, trend: '+1.2%', up: true  },
  { id: 20, name: '吳思穎', dept: '行銷部', role: '品牌設計師',     emissions: 2.6, waste:  40, paper:  9.8, electricity:  860, travel: 1800, trend: '-0.5%', up: false },
  { id: 21, name: '蕭文凱', dept: '行銷部', role: '市場分析師',     emissions: 3.1, waste:  45, paper: 11.0, electricity:  750, travel: 3500, trend: '+1.8%', up: true  },
  { id: 22, name: '許雅琪', dept: '行銷部', role: '公關專員',       emissions: 3.8, waste:  48, paper:  9.5, electricity:  690, travel: 5800, trend: '+0.2%', up: true  },

  // ── 行政部 ────────────────────────────────────────────────────
  { id: 23, name: '黃淑萍', dept: '行政部', role: '行政主任',       emissions: 5.2, waste:  68, paper: 28.5, electricity: 1250, travel: 1200, trend: '-1.5%', up: false },
  { id: 24, name: '林冬升', dept: '行政部', role: '文書管理員',     emissions: 3.6, waste:  48, paper: 32.0, electricity:  820, travel:  350, trend: '-3.2%', up: false },
  { id: 25, name: '鄭亞希', dept: '行政部', role: '接待專員',       emissions: 3.2, waste:  35, paper: 22.8, electricity:  950, travel:  250, trend: '-2.0%', up: false },
  { id: 26, name: '江明宏', dept: '行政部', role: '採購專員',       emissions: 4.1, waste:  52, paper: 25.5, electricity: 1080, travel:  850, trend: '-1.8%', up: false },
  { id: 27, name: '連玉珊', dept: '行政部', role: '設施管理員',     emissions: 3.9, waste:  60, paper: 18.2, electricity: 1380, travel:  800, trend: '-2.5%', up: false },

  // ── 人資部 ────────────────────────────────────────────────────
  { id: 28, name: '翁欣悅', dept: '人資部', role: '人資主管',       emissions: 3.2, waste:  45, paper: 20.5, electricity:  980, travel:  600, trend: '-0.8%', up: false },
  { id: 29, name: '游勝通', dept: '人資部', role: '招募顧問',       emissions: 2.6, waste:  32, paper: 15.8, electricity:  720, travel:  800, trend: '-1.5%', up: false },
  { id: 30, name: '石雅涵', dept: '人資部', role: '教育訓練師',     emissions: 2.8, waste:  28, paper: 12.2, electricity:  680, travel: 1200, trend: '-1.1%', up: false },
  { id: 31, name: '孫怡婷', dept: '人資部', role: '薪資福利專員',   emissions: 2.4, waste:  25, paper: 18.5, electricity:  620, travel:  400, trend: '-2.0%', up: false },
]

// ── 活動記錄檔產生器（依員工 id 決定性隨機）────────────────────
export function generateLogs(emp) {
  let state = emp.id * 9301 + 49297
  function rng() {
    state = (state * 9301 + 49297) % 233280
    return state / 233280
  }
  function pad(n) { return String(n).padStart(2, '0') }
  function randTime(hMin, hMax) {
    const h = Math.floor(hMin + rng() * (hMax - hMin))
    const m = Math.floor(rng() * 60)
    const s = Math.floor(rng() * 60)
    return `${pad(h)}:${pad(m)}:${pad(s)}`
  }

  const year = 2025
  const logs = []

  const wasteNotes  = ['一般廢棄物', '資源回收（紙類）', '資源回收（塑膠）', '有機廢棄物', '包裝材料廢棄', '廢棄紙盒', '廚餘回收']
  const paperNotes  = ['列印文件', '列印月報', '複印資料', '會議資料準備', '列印合約', '表單列印', '列印簡報']
  const elecNotes   = ['月度電表讀數', '辦公設備用電', '加班用電記錄', '月結電費申報']
  const travelNotes = ['出差台北', '客戶拜訪（台中）', '出差高雄', '跨部門會議', '業務拜訪（台南）', '出差台南', '赴外縣市開會']

  // 廢棄物：每月 4 筆（上班時、午休、下班時投丞）
  const wastePerEntry = emp.waste / 48
  for (let m = 1; m <= 12; m++) {
    for (let w = 0; w < 4; w++) {
      const day    = Math.min(28, Math.round(w * 7 + 1 + rng() * 5))
      const amount = +(wastePerEntry * (0.6 + rng() * 0.8)).toFixed(1)
      const time   = randTime(8, 18)   // 上班時段投丞
      logs.push({
        datetime: `${year}-${pad(m)}-${pad(day)} ${time}`,
        type: 'waste', color: '#ff7a45', amount, unit: 'kg',
        note: wasteNotes[Math.floor(rng() * wasteNotes.length)]
      })
    }
  }

  // 紙張：每月 2 筆（工作時段列印）
  const paperPerEntry = emp.paper / 24
  for (let m = 1; m <= 12; m++) {
    for (let w = 0; w < 2; w++) {
      const day    = Math.min(28, w === 0 ? Math.round(5 + rng() * 8) : Math.round(18 + rng() * 8))
      const amount = +(paperPerEntry * (0.5 + rng() * 1.0)).toFixed(1)
      const time   = randTime(9, 17)
      logs.push({
        datetime: `${year}-${pad(m)}-${pad(day)} ${time}`,
        type: 'paper', color: '#36cfc9', amount, unit: '令',
        note: paperNotes[Math.floor(rng() * paperNotes.length)]
      })
    }
  }

  // 用電：每月 1 筆（每月 28 日下午申報）
  const elecPerMonth = emp.electricity / 12
  for (let m = 1; m <= 12; m++) {
    const amount = Math.round(elecPerMonth * (0.85 + rng() * 0.3))
    const time   = randTime(13, 17)
    logs.push({
      datetime: `${year}-${pad(m)}-28 ${time}`,
      type: 'electricity', color: '#f6c23e', amount, unit: 'kWh',
      note: elecNotes[Math.floor(rng() * elecNotes.length)]
    })
  }

  // 差旅：依總里程決定筆數（早上出發時間）
  if (emp.travel > 0) {
    const tripCount = Math.max(3, Math.min(16, Math.round(emp.travel / 600)))
    for (let t = 0; t < tripCount; t++) {
      const m      = Math.min(12, Math.floor(t / tripCount * 12) + 1)
      const day    = Math.min(28, Math.round(3 + rng() * 24))
      const amount = Math.max(50, Math.round(emp.travel / tripCount * (0.6 + rng() * 0.8)))
      const time   = randTime(6, 10)   // 早上出發
      logs.push({
        datetime: `${year}-${pad(m)}-${pad(day)} ${time}`,
        type: 'travel', color: '#5b8ff9', amount, unit: 'km',
        note: travelNotes[Math.floor(rng() * travelNotes.length)]
      })
    }
  }

  return logs.sort((a, b) => new Date(b.datetime) - new Date(a.datetime))
}
