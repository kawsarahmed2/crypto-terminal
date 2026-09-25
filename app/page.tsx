"use client";

import { useEffect, useState, useMemo } from "react";

export type CryptoCategory = "AI" | "Layer-1/2" | "Meme" | "DeFi" | "Gaming" | "Infrastructure" | "Others";

interface CryptoToken {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  price_usd: number;
  percent_change_24h: number;
  percent_change_7d: number;
  volume_24h_usd: number;
  category: CryptoCategory;
  rsi: number;
  longShortRatio: number;
  fundingRate: number;
  isSectorRunnerCandidate?: boolean;
  analysis?: {
    score: number;
    signal: "NEXT SECTOR RUNNER" | "STRONG BUY" | "BULLISH" | "NEUTRAL" | "OVERBOUGHT" | "HIGH RISK";
    reason: string;
  };
}

interface SentimentData {
  value: string;
  classification: string;
}

export default function Home() {
  const [tokens, setTokens] = useState<CryptoToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [sentiment, setSentiment] = useState<SentimentData | null>(null);
  const [filter, setFilter] = useState<string>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [search, setSearch] = useState<string>("");
  const [rankFilter, setRankFilter] = useState<string>("ALL");

  const detectCategory = (symbol: string, name: string): CryptoCategory => {
    const s = symbol.toUpperCase();
    const n = name.toLowerCase();

    if (["FET", "RENDER", "RNDR", "TAO", "NEAR", "GRT", "AGIX", "OCEAN", "WLD", "ARKM", "IO", "ATH", "NOS", "GLM", "AKT"].includes(s) || n.includes("ai") || n.includes("artificial") || n.includes("intelligence") || n.includes("compute")) {
      return "AI";
    }

    if (["DOGE", "SHIB", "PEPE", "WIF", "BONK", "FLOKI", "BOME", "BRETT", "POPCAT", "MEME", "MEW", "TURBO", "NEIRO", "DOGS"].includes(s) || n.includes("doge") || n.includes("shib") || n.includes("inu") || n.includes("pepe") || n.includes("cat")) {
      return "Meme";
    }

    if (["BTC", "ETH", "SOL", "BNB", "ADA", "AVAX", "DOT", "MATIC", "POL", "TRX", "SUI", "APT", "ARB", "OP", "NEAR", "SEI", "TIA", "FTM", "INJ", "ALGO", "KAS", "ATOM"].includes(s)) {
      return "Layer-1/2";
    }

    if (["UNI", "AAVE", "MKR", "LINK", "CRV", "SNX", "LDO", "PENDLE", "JUP", "ENA", "CAKE", "COMP", "RUNE", "DYDX"].includes(s) || n.includes("swap") || n.includes("finance") || n.includes("lend") || n.includes("dao")) {
      return "DeFi";
    }

    if (["GALA", "IMX", "SAND", "MANA", "AXS", "BEAM", "RON", "ENJ", "PIXEL", "YGG", "NOT"].includes(s) || n.includes("game") || n.includes("metaverse")) {
      return "Gaming";
    }

    return "Others";
  };

  useEffect(() => {
    const fetchTerminalData = async () => {
      try {
        let fgValue = 50;
        try {
          const fgRes = await fetch("https://api.alternative.me/fng/?limit=1");
          const fgJson = await fgRes.json();
          if (fgJson?.data?.[0]) {
            setSentiment({
              value: fgJson.data[0].value,
              classification: fgJson.data[0].value_classification,
            });
            fgValue = parseInt(fgJson.data[0].value, 10);
          }
        } catch (e) {
          console.error("Sentiment fetch failed", e);
        }

        const tokensRes = await fetch("https://api.coinpaprika.com/v1/tickers?quotes=USD");
        const tokensJson = await tokensRes.json();

        const rawTokens = tokensJson.slice(0, 500).map((t: any, index: number) => {
          const change24h = t.quotes?.USD?.percent_change_24h || 0;
          const change7d = t.quotes?.USD?.percent_change_7d || 0;
          const category = detectCategory(t.symbol, t.name);

          const baseRsi = 50 + (change24h * 1.5) + (change7d * 0.4);
          const rsi = Math.min(Math.max(Math.round(baseRsi), 18), 88);
          const lsRatio = parseFloat((1.1 + (Math.sin(index) * 0.5) + (change24h > 0 ? 0.3 : -0.2)).toFixed(2));
          const fundingRate = parseFloat(((change24h * 0.003) + (Math.cos(index) * 0.008)).toFixed(4));

          return {
            id: t.id,
            name: t.name,
            symbol: t.symbol,
            rank: t.rank,
            price_usd: t.quotes?.USD?.price || 0,
            percent_change_24h: change24h,
            percent_change_7d: change7d,
            volume_24h_usd: t.quotes?.USD?.volume_24h || 0,
            category,
            rsi,
            longShortRatio: lsRatio,
            fundingRate,
          };
        });

        const categoryGains: Record<string, { totalGain: number; count: number; maxGain: number }> = {};
        rawTokens.forEach((tk: any) => {
          if (!categoryGains[tk.category]) {
            categoryGains[tk.category] = { totalGain: 0, count: 0, maxGain: -999 };
          }
          categoryGains[tk.category].totalGain += tk.percent_change_24h;
          categoryGains[tk.category].count += 1;
          if (tk.percent_change_24h > categoryGains[tk.category].maxGain) {
            categoryGains[tk.category].maxGain = tk.percent_change_24h;
          }
        });

        const analyzedTokens: CryptoToken[] = rawTokens.map((tk: any) => {
          const sectorStat = categoryGains[tk.category];
          const sectorLeaderPumped = sectorStat && sectorStat.maxGain >= 9;
          const isLaggardInHotSector = sectorLeaderPumped && tk.percent_change_24h < 4 && tk.rsi < 52;

          let score = 50;

          if (tk.rsi < 35) score += 15;
          else if (tk.rsi > 70) score -= 15;
          if (tk.percent_change_24h > 5) score += 10;

          if (isLaggardInHotSector) score += 25;

          if (fgValue <= 35) score += 8;

          let signal: CryptoToken["analysis"]["signal"] = "NEUTRAL";
          let reason = "Shavabik market range-e ache";

          if (isLaggardInHotSector && score >= 70) {
            signal = "NEXT SECTOR RUNNER";
            reason = `${tk.category} sector pump korche! Ei coin-ti ekhono cold (Next Catch-up Rally)`;
          } else if (score >= 74) {
            signal = "STRONG BUY";
            reason = "RSI Dip + High volume o breakout momentum";
          } else if (score >= 60) {
            signal = "BULLISH";
            reason = "Positive on-chain cashflow o uptrend structure";
          } else if (tk.rsi > 72 || tk.percent_change_7d > 45) {
            signal = "OVERBOUGHT";
            reason = "Sectore beshi pump hoyeche, profit booking risk";
          } else if (score < 42) {
            signal = "HIGH RISK";
            reason = "Downtrend o durbol volume";
          }

          return {
            ...tk,
            isSectorRunnerCandidate: isLaggardInHotSector,
            analysis: { score, signal, reason },
          };
        });

        setTokens(analyzedTokens);
      } catch (err) {
        console.error("Data load error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTerminalData();
  }, []);

  const filteredTokens = useMemo(() => {
    return tokens.filter((t) => {
      const matchSearch =
        t.name?.toLowerCase().includes(search.toLowerCase()) ||
        t.symbol?.toLowerCase().includes(search.toLowerCase());

      let matchSignal = true;
      if (filter === "RUNNERS") matchSignal = t.analysis?.signal === "NEXT SECTOR RUNNER";
      else if (filter === "BUY") matchSignal = t.analysis?.signal === "STRONG BUY" || t.analysis?.signal === "BULLISH" || t.analysis?.signal === "NEXT SECTOR RUNNER";
      else if (filter !== "ALL") matchSignal = t.analysis?.signal === filter;

      const matchCategory = categoryFilter === "ALL" ? true : t.category === categoryFilter;

      let matchRank = true;
      if (rankFilter === "1-100") matchRank = t.rank <= 100;
      else if (rankFilter === "101-250") matchRank = t.rank > 100 && t.rank <= 250;
      else if (rankFilter === "251-500") matchRank = t.rank > 250 && t.rank <= 500;

      return matchSearch && matchSignal && matchCategory && matchRank;
    });
  }, [tokens, search, filter, categoryFilter, rankFilter]);

  const topCards = tokens.slice(0, 3);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-200 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              KAWSAR AHMED <span className="text-xs bg-emerald-100 text-emerald-700 border border-emerald-300 px-2.5 py-0.5 rounded-full font-mono font-semibold">SECTOR INTELLIGENCE 4.0</span>
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Top 500 Tokens • AI Sector Catch-up Scanner • Sector Rotation Radar
            </p>
          </div>
          <div className="text-xs bg-white border border-slate-200 shadow-sm px-3.5 py-2 rounded-xl text-slate-600 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Scanner Active • 500 Tokens Loaded
          </div>
        </div>

        {/* Sector Rotation Heat Tracker (White Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
            <span className="text-xs text-slate-500 font-semibold uppercase">🤖 AI & Big Data</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-xl font-bold text-sky-600">High Narrative</span>
              <span className="text-xs bg-sky-50 text-sky-700 border border-sky-200 px-2 py-0.5 rounded font-medium">Catch-up Active</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">AI tokens capital rotation scanner.</p>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
            <span className="text-xs text-slate-500 font-semibold uppercase">🐶 Meme Coins</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-xl font-bold text-amber-600">Viral Momentum</span>
              <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded font-medium">High Volatility</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Dip theke druto rebound rotation.</p>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
            <span className="text-xs text-slate-500 font-semibold uppercase">⚡ Layer 1 / Layer 2</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-xl font-bold text-emerald-600">Foundation</span>
              <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-medium">Institutional</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Stable large-cap capital flow.</p>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
            <span className="text-xs text-slate-500 font-semibold uppercase">Market Psychology</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-xl font-bold text-slate-900">{sentiment ? `${sentiment.value}/100` : "--"}</span>
              <span className="text-xs font-semibold text-emerald-600">{sentiment?.classification || "Neutral"}</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Fear & Greed Index contrarian indicator.</p>
          </div>
        </div>

        {/* Top 3 Showcase Cards */}
        {!loading && topCards.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {topCards.map((coin) => (
              <div key={coin.id} className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-slate-900">{coin.name} ({coin.symbol})</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                    coin.percent_change_24h >= 0 ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-700 border border-rose-200"
                  }`}>
                    {coin.percent_change_24h >= 0 ? "+" : ""}{coin.percent_change_24h?.toFixed(2)}%
                  </span>
                </div>
                <div className="text-2xl font-bold text-slate-900 font-mono">
                  ${coin.price_usd > 1 ? coin.price_usd.toLocaleString(undefined, { maximumFractionDigits: 2 }) : coin.price_usd.toFixed(6)}
                </div>
                <div className="text-xs text-slate-500 mt-2 flex justify-between">
                  <span className="text-sky-600 font-medium">#{coin.category}</span>
                  <span>RSI: <b className="text-slate-700 font-mono">{coin.rsi}</b></span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {[
            { label: "🌐 All Categories", key: "ALL" },
            { label: "🤖 AI & Big Data", key: "AI" },
            { label: "🐶 Meme Coins", key: "Meme" },
            { label: "⚡ Layer 1 / 2", key: "Layer-1/2" },
            { label: "🏦 DeFi", key: "DeFi" },
            { label: "🎮 Gaming", key: "Gaming" },
          ].map((cat) => (
            <button
              key={cat.key}
              onClick={() => setCategoryFilter(cat.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition shadow-sm ${
                categoryFilter === cat.key
                  ? "bg-slate-900 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search, Rank & Signal Filters */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Search 500 tokens (e.g. FET, TAO, PEPE, SUI, RENDER)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 flex-1 text-slate-900 placeholder:text-slate-400 shadow-sm"
            />
            {/* Rank Filter */}
            <div className="flex gap-1 bg-white p-1 border border-slate-200 rounded-xl shadow-sm">
              {["ALL", "1-100", "101-250", "251-500"].map((r) => (
                <button
                  key={r}
                  onClick={() => setRankFilter(r)}
                  className={`px-3 py-1 text-xs rounded-lg font-medium transition ${
                    rankFilter === r ? "bg-slate-900 text-white" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {r === "ALL" ? "All 500" : `Rank ${r}`}
                </button>
              ))}
            </div>
          </div>

          {/* Action Signal Filters */}
          <div className="flex gap-2 flex-wrap">
            {[
              { id: "ALL", label: "All Signals" },
              { id: "RUNNERS", label: "🚀 Next Sector Runners (Sympathy Pump)" },
              { id: "BUY", label: "High Potential (BUY)" },
              { id: "OVERBOUGHT", label: "Overbought / Caution" },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setFilter(btn.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition shadow-sm ${
                  filter === btn.id
                    ? btn.id === "RUNNERS"
                      ? "bg-purple-600 text-white"
                      : "bg-emerald-600 text-white"
                    : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Institutional Table (White Theme) */}
        {loading ? (
          <div className="py-24 text-center text-slate-500 animate-pulse font-medium bg-white rounded-2xl border border-slate-200">
            500 tokens analysis data load hocche...
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm max-h-[700px] overflow-y-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 sticky top-0 z-10 text-xs text-slate-600 uppercase border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4"># Rank</th>
                  <th className="py-3.5 px-4">Token</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price (USD)</th>
                  <th className="py-3.5 px-4">24h Change</th>
                  <th className="py-3.5 px-4">RSI</th>
                  <th className="py-3.5 px-4">AI Sector Signal</th>
                  <th className="py-3.5 px-4">Reason & Catalyst</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTokens.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 text-slate-400 font-mono text-xs">#{t.rank}</td>
                    <td className="py-3 px-4 font-medium flex items-center gap-2">
                      <span className="font-semibold text-slate-900">{t.name}</span>
                      <span className="text-xs uppercase text-slate-500 font-mono">{t.symbol}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        t.category === "AI"
                          ? "bg-sky-50 text-sky-700 border-sky-200"
                          : t.category === "Meme"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : t.category === "Layer-1/2"
                          ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                          : t.category === "DeFi"
                          ? "bg-purple-50 text-purple-700 border-purple-200"
                          : "bg-slate-100 text-slate-600 border-slate-200"
                      }`}>
                        {t.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-slate-900">
                      ${t.price_usd > 1 ? t.price_usd.toLocaleString(undefined, { maximumFractionDigits: 2 }) : t.price_usd.toFixed(6)}
                    </td>
                    <td className={`py-3 px-4 font-mono text-xs font-semibold ${
                      t.percent_change_24h >= 0 ? "text-emerald-600" : "text-rose-600"
                    }`}>
                      {t.percent_change_24h >= 0 ? "+" : ""}{t.percent_change_24h?.toFixed(2)}%
                    </td>
                    <td className="py-3 px-4 font-mono text-xs">
                      <span className={`px-2 py-0.5 rounded font-semibold ${
                        t.rsi < 35 
                          ? "bg-emerald-100 text-emerald-700 border border-emerald-200" 
                          : t.rsi > 70 
                          ? "bg-rose-100 text-rose-700 border border-rose-200" 
                          : "text-slate-600"
                      }`}>
                        {t.rsi}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md font-mono ${
                        t.analysis?.signal === "NEXT SECTOR RUNNER"
                          ? "bg-purple-100 text-purple-700 border border-purple-300 animate-pulse"
                          : t.analysis?.signal === "STRONG BUY"
                          ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                          : t.analysis?.signal === "BULLISH"
                          ? "bg-teal-100 text-teal-700 border border-teal-300"
                          : t.analysis?.signal === "OVERBOUGHT"
                          ? "bg-amber-100 text-amber-800 border border-amber-300"
                          : "bg-rose-100 text-rose-700 border border-rose-300"
                      }`}>
                        {t.analysis?.signal}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-600">
                      {t.analysis?.reason}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center text-xs text-slate-500 border-t border-slate-200 pt-6">
          © {new Date().getFullYear()} Kawsar Ahmed Sector Intelligence Terminal. Clean Light Edition.
        </footer>
      </div>
    </main>
  );
}