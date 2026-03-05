import { useState, useEffect } from "react";

const STORAGE_KEYS = {
  themes: "themewatch_themes",
};

const DEFAULT_THEMES = [
  {
    id: "nuclear",
    title: "Nuclear Energy — India",
    status: "Watching",
    summary: "Importing uranium from Cameco, Canada — $2.6B deal. Additional deal struck with Kazakhstan (details unknown). All tied to nuclear reactor expansion program.",
    stocks: ["NPCIL", "L&T (nuclear contracts)", "BHEL"],
    notes: [],
    newsLog: [
      { date: "2025-03", headline: "India signs $2.6B uranium deal with Cameco, Canada", source: "Mint" },
      { date: "2025-03", headline: "Second uranium deal signed with Kazakhstan — details pending", source: "ET Markets" },
    ],
    causeEffect: [
      { cause: "India secures long-term uranium supply", effect: "Nuclear capacity expansion becomes viable" },
      { cause: "Nuclear capacity grows", effect: "BHEL & L&T win reactor construction contracts" },
      { cause: "Steady baseload power from nuclear", effect: "Reduces dependence on coal imports; positive for INR" },
    ],
    keyFigures: ["Deal size: $2.6B with Cameco", "India target: 100 GW nuclear by 2047"],
  },
  {
    id: "commodities",
    title: "Commodities & Mining — India",
    status: "Watching",
    summary: "New government initiatives increasing demand for domestic mining. Critical minerals push tied to EV and defence manufacturing.",
    stocks: ["NMDC", "Vedanta", "Hindustan Zinc", "Coal India"],
    notes: [],
    newsLog: [],
    causeEffect: [
      { cause: "Govt pushes critical mineral mining", effect: "NMDC, Vedanta get new licensing priority" },
      { cause: "EV demand rises domestically", effect: "Lithium, cobalt, nickel demand spikes" },
    ],
    keyFigures: [],
  },
  {
    id: "healthcare",
    title: "Indian Healthcare",
    status: "Digging",
    summary: "Rising population, increasingly unhealthy habits, medical tourism boom, and relatively cheap healthcare make India a structurally strong healthcare market.",
    stocks: ["Apollo Hospitals", "Fortis", "Max Health", "Narayana Health", "Dr Reddy's"],
    notes: [],
    newsLog: [],
    causeEffect: [
      { cause: "Rising lifestyle diseases (diabetes, cardiac)", effect: "Hospital occupancy & diagnostics demand rise structurally" },
      { cause: "Cheap procedures vs US/UK", effect: "Medical tourism inflow grows; foreign exchange earner" },
      { cause: "Insurance penetration rising", effect: "More people can afford private hospitals; revenue upside" },
    ],
    keyFigures: ["India medical tourism market: $9B (2023)", "Healthcare sector CAGR est. 16% till 2030"],
  },
  {
    id: "japan-rates",
    title: "Japan Rate Hike Watch",
    status: "Watching",
    summary: "Bank of Japan potentially exiting ultra-loose policy. Rate hike would unwind the yen carry trade — global implications including FII outflows from India.",
    stocks: ["Monitor: Bank Nifty, IT sector (FII-heavy)"],
    notes: [],
    newsLog: [],
    causeEffect: [
      { cause: "BOJ hikes interest rates", effect: "Yen strengthens; carry trade unwinds" },
      { cause: "Carry trade unwinds", effect: "Investors sell EM assets (India, Brazil) to repay yen loans" },
      { cause: "FIIs pull out of India", effect: "Selling pressure on Nifty; rupee weakens" },
      { cause: "FIIs heavy in IT & Banks", effect: "These sectors face sharpest correction" },
    ],
    keyFigures: ["BOJ rate as of early 2025: 0.5%", "Yen carry trade estimated size: $4 trillion globally"],
  },
  {
    id: "multibagger",
    title: "Mid & Small Cap Screener",
    status: "Watching",
    summary: "Actively looking for potential multibagger candidates. Focus on low market cap, high growth sectors, promoter holding, low debt.",
    stocks: [],
    notes: [],
    newsLog: [],
    causeEffect: [],
    keyFigures: ["Screen: Mcap < 5000 Cr", "ROE > 15%", "Debt/Equity < 0.5", "Revenue growth > 20% YoY"],
  },
];

const STATUS_COLORS = {
  Watching: { bg: "#1a2744", text: "#5b8dee", border: "#2a3f6f" },
  Digging: { bg: "#2a1f00", text: "#f5a623", border: "#5a3f00" },
  Opportunity: { bg: "#0d2e1a", text: "#2ecc71", border: "#1a5c35" },
  Archived: { bg: "#1a1a1a", text: "#666", border: "#333" },
};

const STATUSES = ["Watching", "Digging", "Opportunity", "Archived"];

function AIModal({ theme, onClose }) {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [mode, setMode] = useState("analysis");

  const MODES = {
    analysis: `You are a sharp financial analyst. Give a concise 200-word analysis of the investment theme: "${theme.title}". Cover: current macro context, key risks, key opportunities, and which Indian sectors/stocks are most exposed. Be direct, no fluff.`,
    causeEffect: `You are a macro analyst. For the theme "${theme.title}", build a detailed cause-and-effect chain showing how this theme ripples through Indian markets. Format as numbered steps like: 1. [Trigger] → 2. [Effect] → 3. [Market impact]. Include which Indian sectors and FII behavior are affected. Current context: ${theme.summary}`,
    stocks: `You are an equity research analyst focused on Indian markets. For the theme "${theme.title}", suggest 5-8 specific Indian listed stocks (NSE/BSE) that are most directly exposed to this theme. For each stock give: stock name, ticker, and ONE line on why it's relevant. Context: ${theme.summary}`,
  };

  async function fetchAI() {
    setLoading(true);
    setResponse("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: MODES[mode] }],
        }),
      });
      const data = await res.json();
      const text = data.content?.map(b => b.text || "").join("\n") || "No response.";
      setResponse(text);
    } catch (e) {
      setResponse("Error fetching analysis. Please try again.");
    }
    setLoading(false);
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ background: "#0d1117", border: "1px solid #2a3f6f", borderRadius: "16px", width: "100%", maxWidth: "680px", maxHeight: "85vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "24px 28px 16px", borderBottom: "1px solid #1e2d4a", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", color: "#e8eaf0", marginBottom: "4px" }}>AI Analysis</div>
            <div style={{ fontSize: "12px", color: "#5b8dee", fontFamily: "monospace" }}>{theme.title}</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "1px solid #2a3f6f", borderRadius: "8px", color: "#8899bb", cursor: "pointer", padding: "6px 12px", fontSize: "12px" }}>✕ Close</button>
        </div>

        <div style={{ padding: "16px 28px", borderBottom: "1px solid #1e2d4a", display: "flex", gap: "8px" }}>
          {[["analysis", "📊 Theme Analysis"], ["causeEffect", "🔗 Cause & Effect"], ["stocks", "📈 Stock Ideas"]].map(([key, label]) => (
            <button key={key} onClick={() => setMode(key)} style={{ padding: "7px 14px", borderRadius: "8px", fontSize: "12px", cursor: "pointer", border: mode === key ? "1px solid #5b8dee" : "1px solid #2a3f6f", background: mode === key ? "#1a2744" : "transparent", color: mode === key ? "#5b8dee" : "#8899bb", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" }}>{label}</button>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "20px 28px" }}>
          {!response && !loading && (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "#4a5568" }}>
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>🤖</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px" }}>Select a mode above and click Generate</div>
            </div>
          )}
          {loading && (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <div style={{ width: "40px", height: "40px", border: "3px solid #1e2d4a", borderTop: "3px solid #5b8dee", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 16px" }}></div>
              <div style={{ color: "#5b8dee", fontFamily: "monospace", fontSize: "13px" }}>Analysing theme...</div>
            </div>
          )}
          {response && (
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", lineHeight: "1.8", color: "#c8d4e8", whiteSpace: "pre-wrap" }}>{response}</div>
          )}
        </div>

        <div style={{ padding: "16px 28px", borderTop: "1px solid #1e2d4a" }}>
          <button onClick={fetchAI} disabled={loading} style={{ width: "100%", padding: "12px", background: loading ? "#1e2d4a" : "#5b8dee", color: loading ? "#4a5a7a" : "#fff", border: "none", borderRadius: "10px", fontSize: "14px", fontFamily: "'DM Sans', sans-serif", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer", transition: "all 0.2s" }}>
            {loading ? "Generating..." : "⚡ Generate"}
          </button>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function ThemeDetail({ theme, onBack, onUpdate }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [showAI, setShowAI] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [newHeadline, setNewHeadline] = useState("");
  const [newHeadlineSource, setNewHeadlineSource] = useState("");
  const [newFigure, setNewFigure] = useState("");
  const [newStock, setNewStock] = useState("");
  const [newCause, setNewCause] = useState("");
  const [newEffect, setNewEffect] = useState("");
  const [editSummary, setEditSummary] = useState(false);
  const [summaryDraft, setSummaryDraft] = useState(theme.summary);

  const update = (field, value) => onUpdate({ ...theme, [field]: value });

  const today = new Date().toISOString().slice(0, 7);

  const TABS = [
    { id: "overview", label: "Overview" },
    { id: "causeEffect", label: "Cause & Effect" },
    { id: "news", label: "News Log" },
    { id: "stocks", label: "Stocks" },
    { id: "notes", label: "Notes & Figures" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#080c14", fontFamily: "'DM Sans', sans-serif" }}>
      {showAI && <AIModal theme={theme} onClose={() => setShowAI(false)} />}

      {/* Header */}
      <div style={{ background: "#0d1117", borderBottom: "1px solid #1e2d4a", padding: "20px 28px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: "860px", margin: "0 auto", display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
          <button onClick={onBack} style={{ background: "none", border: "1px solid #2a3f6f", borderRadius: "8px", color: "#8899bb", cursor: "pointer", padding: "6px 12px", fontSize: "12px", whiteSpace: "nowrap" }}>← Back</button>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", color: "#e8eaf0" }}>{theme.title}</div>
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <select value={theme.status} onChange={e => update("status", e.target.value)}
              style={{ background: STATUS_COLORS[theme.status].bg, border: `1px solid ${STATUS_COLORS[theme.status].border}`, borderRadius: "8px", color: STATUS_COLORS[theme.status].text, padding: "6px 10px", fontSize: "12px", cursor: "pointer" }}>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <button onClick={() => setShowAI(true)} style={{ background: "#1a2744", border: "1px solid #2a3f6f", borderRadius: "8px", color: "#5b8dee", cursor: "pointer", padding: "6px 14px", fontSize: "12px", fontWeight: "600" }}>⚡ AI Analysis</button>
          </div>
        </div>

        <div style={{ maxWidth: "860px", margin: "12px auto 0", display: "flex", gap: "4px", flexWrap: "wrap" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              style={{ padding: "6px 14px", borderRadius: "7px", fontSize: "12px", cursor: "pointer", border: "none", background: activeTab === t.id ? "#1a2744" : "transparent", color: activeTab === t.id ? "#5b8dee" : "#6677aa", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s" }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "28px" }}>

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div>
            <div style={{ background: "#0d1117", border: "1px solid #1e2d4a", borderRadius: "12px", padding: "20px", marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <div style={{ fontSize: "11px", color: "#5b8dee", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "1px" }}>Theme Summary</div>
                <button onClick={() => setEditSummary(!editSummary)} style={{ background: "none", border: "1px solid #2a3f6f", borderRadius: "6px", color: "#8899bb", cursor: "pointer", padding: "3px 10px", fontSize: "11px" }}>{editSummary ? "Save" : "Edit"}</button>
              </div>
              {editSummary ? (
                <textarea value={summaryDraft} onChange={e => setSummaryDraft(e.target.value)}
                  onBlur={() => { update("summary", summaryDraft); setEditSummary(false); }}
                  style={{ width: "100%", background: "#080c14", border: "1px solid #2a3f6f", borderRadius: "8px", color: "#c8d4e8", padding: "10px", fontSize: "14px", lineHeight: "1.6", minHeight: "100px", fontFamily: "'DM Sans', sans-serif", resize: "vertical", boxSizing: "border-box" }} />
              ) : (
                <p style={{ color: "#c8d4e8", lineHeight: "1.7", fontSize: "14px", margin: 0 }}>{theme.summary}</p>
              )}
            </div>

            {theme.keyFigures.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "12px", marginBottom: "20px" }}>
                {theme.keyFigures.map((fig, i) => (
                  <div key={i} style={{ background: "#0d1117", border: "1px solid #2a3f00", borderRadius: "10px", padding: "14px", position: "relative" }}>
                    <div style={{ fontSize: "11px", color: "#f5a623", fontFamily: "monospace", marginBottom: "4px" }}>KEY FIGURE</div>
                    <div style={{ fontSize: "13px", color: "#e8eaf0" }}>{fig}</div>
                    <button onClick={() => update("keyFigures", theme.keyFigures.filter((_, j) => j !== i))}
                      style={{ position: "absolute", top: "8px", right: "8px", background: "none", border: "none", color: "#4a5568", cursor: "pointer", fontSize: "11px" }}>✕</button>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: "flex", gap: "8px" }}>
              <input value={newFigure} onChange={e => setNewFigure(e.target.value)} placeholder="Add a key figure or data point..."
                style={{ flex: 1, background: "#0d1117", border: "1px solid #2a3f6f", borderRadius: "8px", color: "#c8d4e8", padding: "10px 14px", fontSize: "13px", fontFamily: "'DM Sans', sans-serif" }}
                onKeyDown={e => { if (e.key === "Enter" && newFigure.trim()) { update("keyFigures", [...theme.keyFigures, newFigure.trim()]); setNewFigure(""); } }} />
              <button onClick={() => { if (newFigure.trim()) { update("keyFigures", [...theme.keyFigures, newFigure.trim()]); setNewFigure(""); } }}
                style={{ background: "#1a2744", border: "1px solid #2a3f6f", borderRadius: "8px", color: "#5b8dee", cursor: "pointer", padding: "10px 16px", fontSize: "13px" }}>+ Add</button>
            </div>
          </div>
        )}

        {/* CAUSE & EFFECT */}
        {activeTab === "causeEffect" && (
          <div>
            <div style={{ marginBottom: "20px" }}>
              {theme.causeEffect.map((item, i) => (
                <div key={i} style={{ position: "relative" }}>
                  <div style={{ background: "#0d1117", border: "1px solid #1e2d4a", borderRadius: "10px", padding: "14px 40px 14px 16px", marginBottom: "4px" }}>
                    <div style={{ fontSize: "10px", color: "#5b8dee", fontFamily: "monospace", marginBottom: "4px" }}>STEP {i + 1} — {i % 2 === 0 ? "TRIGGER" : "EFFECT"}</div>
                    <div style={{ fontSize: "14px", color: "#c8d4e8" }}>{item.cause}</div>
                  </div>
                  {i < theme.causeEffect.length - 1 && (
                    <div style={{ textAlign: "center", color: "#2a3f6f", fontSize: "20px", lineHeight: "1", marginBottom: "4px" }}>↓</div>
                  )}
                  <div style={{ background: "#080c14", border: "1px solid #1a3a2a", borderRadius: "10px", padding: "14px 40px 14px 16px", marginBottom: i < theme.causeEffect.length - 1 ? "4px" : "16px" }}>
                    <div style={{ fontSize: "10px", color: "#2ecc71", fontFamily: "monospace", marginBottom: "4px" }}>→ RESULT</div>
                    <div style={{ fontSize: "14px", color: "#c8d4e8" }}>{item.effect}</div>
                  </div>
                  {i < theme.causeEffect.length - 1 && (
                    <div style={{ textAlign: "center", color: "#2a3f6f", fontSize: "20px", lineHeight: "1", marginBottom: "16px" }}>↓</div>
                  )}
                  <button onClick={() => update("causeEffect", theme.causeEffect.filter((_, j) => j !== i))}
                    style={{ position: "absolute", top: "10px", right: "10px", background: "none", border: "none", color: "#4a5568", cursor: "pointer", fontSize: "12px" }}>✕</button>
                </div>
              ))}
            </div>

            <div style={{ background: "#0d1117", border: "1px solid #1e2d4a", borderRadius: "12px", padding: "16px" }}>
              <div style={{ fontSize: "11px", color: "#5b8dee", fontFamily: "monospace", marginBottom: "12px" }}>ADD NEW CHAIN STEP</div>
              <input value={newCause} onChange={e => setNewCause(e.target.value)} placeholder="Trigger / Cause (e.g. BOJ hikes rates)"
                style={{ width: "100%", background: "#080c14", border: "1px solid #2a3f6f", borderRadius: "8px", color: "#c8d4e8", padding: "10px 14px", fontSize: "13px", fontFamily: "'DM Sans', sans-serif", marginBottom: "8px", boxSizing: "border-box" }} />
              <input value={newEffect} onChange={e => setNewEffect(e.target.value)} placeholder="→ Effect (e.g. Yen carry trade unwinds)"
                style={{ width: "100%", background: "#080c14", border: "1px solid #1a3a2a", borderRadius: "8px", color: "#c8d4e8", padding: "10px 14px", fontSize: "13px", fontFamily: "'DM Sans', sans-serif", marginBottom: "12px", boxSizing: "border-box" }} />
              <button onClick={() => { if (newCause.trim() && newEffect.trim()) { update("causeEffect", [...theme.causeEffect, { cause: newCause.trim(), effect: newEffect.trim() }]); setNewCause(""); setNewEffect(""); } }}
                style={{ background: "#1a2744", border: "1px solid #2a3f6f", borderRadius: "8px", color: "#5b8dee", cursor: "pointer", padding: "10px 20px", fontSize: "13px", fontWeight: "600" }}>+ Add Step</button>
            </div>
          </div>
        )}

        {/* NEWS LOG */}
        {activeTab === "news" && (
          <div>
            <div style={{ marginBottom: "20px" }}>
              {theme.newsLog.length === 0 && (
                <div style={{ textAlign: "center", padding: "40px", color: "#3a4a6a", fontSize: "14px" }}>No headlines yet. Paste one below.</div>
              )}
              {[...theme.newsLog].reverse().map((item, i) => (
                <div key={i} style={{ background: "#0d1117", border: "1px solid #1e2d4a", borderRadius: "10px", padding: "14px 40px 14px 16px", marginBottom: "8px", position: "relative" }}>
                  <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "6px" }}>
                    <div style={{ fontSize: "11px", color: "#f5a623", fontFamily: "monospace" }}>{item.date}</div>
                    {item.source && <div style={{ fontSize: "11px", color: "#5b8dee", background: "#1a2744", borderRadius: "4px", padding: "2px 7px" }}>{item.source}</div>}
                  </div>
                  <div style={{ fontSize: "14px", color: "#c8d4e8" }}>{item.headline}</div>
                  <button onClick={() => update("newsLog", theme.newsLog.filter((_, j) => j !== (theme.newsLog.length - 1 - i)))}
                    style={{ position: "absolute", top: "10px", right: "10px", background: "none", border: "none", color: "#4a5568", cursor: "pointer", fontSize: "12px" }}>✕</button>
                </div>
              ))}
            </div>

            <div style={{ background: "#0d1117", border: "1px solid #1e2d4a", borderRadius: "12px", padding: "16px" }}>
              <div style={{ fontSize: "11px", color: "#5b8dee", fontFamily: "monospace", marginBottom: "12px" }}>ADD HEADLINE</div>
              <input value={newHeadline} onChange={e => setNewHeadline(e.target.value)} placeholder="Paste headline here..."
                style={{ width: "100%", background: "#080c14", border: "1px solid #2a3f6f", borderRadius: "8px", color: "#c8d4e8", padding: "10px 14px", fontSize: "13px", fontFamily: "'DM Sans', sans-serif", marginBottom: "8px", boxSizing: "border-box" }} />
              <div style={{ display: "flex", gap: "8px" }}>
                <input value={newHeadlineSource} onChange={e => setNewHeadlineSource(e.target.value)} placeholder="Source (Mint, ET...)"
                  style={{ flex: 1, background: "#080c14", border: "1px solid #2a3f6f", borderRadius: "8px", color: "#c8d4e8", padding: "10px 14px", fontSize: "13px", fontFamily: "'DM Sans', sans-serif" }} />
                <button onClick={() => { if (newHeadline.trim()) { update("newsLog", [...theme.newsLog, { date: today, headline: newHeadline.trim(), source: newHeadlineSource.trim() }]); setNewHeadline(""); setNewHeadlineSource(""); } }}
                  style={{ background: "#1a2744", border: "1px solid #2a3f6f", borderRadius: "8px", color: "#5b8dee", cursor: "pointer", padding: "10px 20px", fontSize: "13px", fontWeight: "600", whiteSpace: "nowrap" }}>+ Add</button>
              </div>
            </div>
          </div>
        )}

        {/* STOCKS */}
        {activeTab === "stocks" && (
          <div>
            <div style={{ marginBottom: "20px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "10px" }}>
              {theme.stocks.map((stock, i) => (
                <div key={i} style={{ background: "#0d1117", border: "1px solid #1e2d4a", borderRadius: "10px", padding: "14px 36px 14px 16px", position: "relative" }}>
                  <div style={{ fontSize: "11px", color: "#5b8dee", fontFamily: "monospace", marginBottom: "4px" }}>WATCHLIST</div>
                  <div style={{ fontSize: "14px", color: "#e8eaf0", fontWeight: "600" }}>{stock}</div>
                  <button onClick={() => update("stocks", theme.stocks.filter((_, j) => j !== i))}
                    style={{ position: "absolute", top: "8px", right: "10px", background: "none", border: "none", color: "#4a5568", cursor: "pointer", fontSize: "12px" }}>✕</button>
                </div>
              ))}
              {theme.stocks.length === 0 && (
                <div style={{ color: "#3a4a6a", fontSize: "14px", padding: "20px" }}>No stocks added yet.</div>
              )}
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <input value={newStock} onChange={e => setNewStock(e.target.value)} placeholder="Add stock name or ticker..."
                style={{ flex: 1, background: "#0d1117", border: "1px solid #2a3f6f", borderRadius: "8px", color: "#c8d4e8", padding: "10px 14px", fontSize: "13px", fontFamily: "'DM Sans', sans-serif" }}
                onKeyDown={e => { if (e.key === "Enter" && newStock.trim()) { update("stocks", [...theme.stocks, newStock.trim()]); setNewStock(""); } }} />
              <button onClick={() => { if (newStock.trim()) { update("stocks", [...theme.stocks, newStock.trim()]); setNewStock(""); } }}
                style={{ background: "#1a2744", border: "1px solid #2a3f6f", borderRadius: "8px", color: "#5b8dee", cursor: "pointer", padding: "10px 16px", fontSize: "13px" }}>+ Add</button>
            </div>
          </div>
        )}

        {/* NOTES */}
        {activeTab === "notes" && (
          <div>
            <div style={{ marginBottom: "20px" }}>
              {theme.notes.length === 0 && (
                <div style={{ textAlign: "center", padding: "40px", color: "#3a4a6a", fontSize: "14px" }}>No notes yet.</div>
              )}
              {[...theme.notes].reverse().map((note, i) => (
                <div key={i} style={{ background: "#0d1117", border: "1px solid #1e2d4a", borderRadius: "10px", padding: "14px 40px 14px 16px", marginBottom: "8px", position: "relative" }}>
                  <div style={{ fontSize: "11px", color: "#f5a623", fontFamily: "monospace", marginBottom: "6px" }}>{note.date}</div>
                  <div style={{ fontSize: "14px", color: "#c8d4e8", lineHeight: "1.6", whiteSpace: "pre-wrap" }}>{note.text}</div>
                  <button onClick={() => update("notes", theme.notes.filter((_, j) => j !== (theme.notes.length - 1 - i)))}
                    style={{ position: "absolute", top: "10px", right: "10px", background: "none", border: "none", color: "#4a5568", cursor: "pointer", fontSize: "12px" }}>✕</button>
                </div>
              ))}
            </div>
            <div style={{ background: "#0d1117", border: "1px solid #1e2d4a", borderRadius: "12px", padding: "16px" }}>
              <textarea value={newNote} onChange={e => setNewNote(e.target.value)} placeholder="Add a note, observation, or analysis..."
                style={{ width: "100%", background: "#080c14", border: "1px solid #2a3f6f", borderRadius: "8px", color: "#c8d4e8", padding: "12px 14px", fontSize: "13px", fontFamily: "'DM Sans', sans-serif", minHeight: "100px", resize: "vertical", marginBottom: "10px", boxSizing: "border-box", lineHeight: "1.6" }} />
              <button onClick={() => { if (newNote.trim()) { update("notes", [...theme.notes, { date: today, text: newNote.trim() }]); setNewNote(""); } }}
                style={{ background: "#1a2744", border: "1px solid #2a3f6f", borderRadius: "8px", color: "#5b8dee", cursor: "pointer", padding: "10px 20px", fontSize: "13px", fontWeight: "600" }}>+ Add Note</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ThemeWatch() {
  const [themes, setThemes] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.themes);
      return saved ? JSON.parse(saved) : DEFAULT_THEMES;
    } catch { return DEFAULT_THEMES; }
  });
  const [activeTheme, setActiveTheme] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSummary, setNewSummary] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.themes, JSON.stringify(themes)); } catch {}
  }, [themes]);

  const updateTheme = (updated) => {
    setThemes(prev => prev.map(t => t.id === updated.id ? updated : t));
    setActiveTheme(updated);
  };

  const addTheme = () => {
    if (!newTitle.trim()) return;
    const t = { id: Date.now().toString(), title: newTitle.trim(), status: "Watching", summary: newSummary.trim() || "No summary yet.", stocks: [], notes: [], newsLog: [], causeEffect: [], keyFigures: [] };
    setThemes(prev => [...prev, t]);
    setNewTitle(""); setNewSummary(""); setShowAdd(false);
  };

  const filtered = filter === "All" ? themes : themes.filter(t => t.status === filter);

  if (activeTheme) {
    const live = themes.find(t => t.id === activeTheme.id) || activeTheme;
    return <ThemeDetail theme={live} onBack={() => setActiveTheme(null)} onUpdate={updateTheme} />;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#080c14", fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ background: "#0d1117", borderBottom: "1px solid #1e2d4a", padding: "24px 28px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "26px", color: "#e8eaf0", letterSpacing: "-0.5px" }}>ThemeWatch</div>
              <div style={{ fontSize: "12px", color: "#5b8dee", fontFamily: "monospace", marginTop: "2px" }}>Your personal market intelligence tracker</div>
            </div>
            <button onClick={() => setShowAdd(true)} style={{ background: "#5b8dee", border: "none", borderRadius: "10px", color: "#fff", cursor: "pointer", padding: "10px 20px", fontSize: "13px", fontWeight: "600", fontFamily: "'DM Sans', sans-serif" }}>+ New Theme</button>
          </div>

          <div style={{ display: "flex", gap: "6px", marginTop: "20px", flexWrap: "wrap" }}>
            {["All", ...STATUSES].map(s => (
              <button key={s} onClick={() => setFilter(s)}
                style={{ padding: "5px 14px", borderRadius: "20px", fontSize: "12px", cursor: "pointer", border: filter === s ? "1px solid #5b8dee" : "1px solid #2a3f6f", background: filter === s ? "#1a2744" : "transparent", color: filter === s ? "#5b8dee" : "#6677aa", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s" }}>
                {s} {s === "All" ? `(${themes.length})` : `(${themes.filter(t => t.status === s).length})`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Theme Grid */}
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "28px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
          {filtered.map(theme => {
            const sc = STATUS_COLORS[theme.status];
            return (
              <div key={theme.id} onClick={() => setActiveTheme(theme)} style={{ background: "#0d1117", border: `1px solid #1e2d4a`, borderRadius: "14px", padding: "20px", cursor: "pointer", transition: "all 0.2s", position: "relative", overflow: "hidden" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#2a3f6f"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#1e2d4a"; e.currentTarget.style.transform = "translateY(0)"; }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                  <div style={{ fontSize: "15px", color: "#e8eaf0", fontWeight: "600", lineHeight: "1.3", paddingRight: "10px" }}>{theme.title}</div>
                  <div style={{ background: sc.bg, border: `1px solid ${sc.border}`, borderRadius: "6px", color: sc.text, fontSize: "10px", padding: "3px 8px", whiteSpace: "nowrap", fontFamily: "monospace" }}>{theme.status}</div>
                </div>
                <p style={{ color: "#7888aa", fontSize: "12px", lineHeight: "1.6", margin: "0 0 14px", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{theme.summary}</p>
                <div style={{ display: "flex", gap: "12px", fontSize: "11px", color: "#4a5a7a" }}>
                  <span>📰 {theme.newsLog.length} news</span>
                  <span>📈 {theme.stocks.length} stocks</span>
                  <span>🔗 {theme.causeEffect.length} chains</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Theme Modal */}
      {showAdd && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ background: "#0d1117", border: "1px solid #2a3f6f", borderRadius: "16px", width: "100%", maxWidth: "500px", padding: "28px" }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", color: "#e8eaf0", marginBottom: "20px" }}>New Theme</div>
            <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Theme name (e.g. India Defence Spending)"
              style={{ width: "100%", background: "#080c14", border: "1px solid #2a3f6f", borderRadius: "8px", color: "#c8d4e8", padding: "12px 14px", fontSize: "14px", fontFamily: "'DM Sans', sans-serif", marginBottom: "12px", boxSizing: "border-box" }} />
            <textarea value={newSummary} onChange={e => setNewSummary(e.target.value)} placeholder="Brief summary of why you're watching this..."
              style={{ width: "100%", background: "#080c14", border: "1px solid #2a3f6f", borderRadius: "8px", color: "#c8d4e8", padding: "12px 14px", fontSize: "14px", fontFamily: "'DM Sans', sans-serif", minHeight: "80px", resize: "vertical", marginBottom: "16px", boxSizing: "border-box" }} />
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => { setShowAdd(false); setNewTitle(""); setNewSummary(""); }}
                style={{ flex: 1, background: "none", border: "1px solid #2a3f6f", borderRadius: "8px", color: "#8899bb", cursor: "pointer", padding: "11px", fontSize: "13px" }}>Cancel</button>
              <button onClick={addTheme}
                style={{ flex: 2, background: "#5b8dee", border: "none", borderRadius: "8px", color: "#fff", cursor: "pointer", padding: "11px", fontSize: "13px", fontWeight: "600" }}>Create Theme</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
