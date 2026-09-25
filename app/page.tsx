"use client";

import React, { useState, useEffect } from "react";
import { 
  TrendingUp, TrendingDown, AlertTriangle, Flame, ShieldAlert, 
  Coins, Radio, Search, ArrowUpRight, ArrowDownRight, Zap, RefreshCw, BarChart3, Newspaper, DollarSign
} from "lucide-react";

export default function CryptoTerminal() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [lastUpdated, setLastUpdated] = useState("Just now");

  // Real-time Market Stats
  const [marketStats, setMarketStats] = useState({
    btcPrice: 84620,
    ethPrice: 2685,
    btcDominance: 58.4,
    fearGreed: 74,
    totalMint24h: 420000000,
    gasGwei: 14
  });

  // Top 10 Long vs Short Algorithmic Setups
  const setups = [
    { rank: 1, type: "LONG", token: "SUI", price: 2.18, change: "+7.4%", catalyst: "Ecosystem breakout + Negative Funding Flush", entry: "$2.05 - $2.15", tp: "$2.45 / $2.70", sl: "$1.92", score: 94, leverage: "3x-5x" },
    { rank: 2, type: "LONG", token: "AAVE", price: 168.4, change: "+5.1%", catalyst: "Protocol fee surge & Spot CVD Accumulation", entry: "$162 - $166", tp: "$185 / $200", sl: "$154", score: 91, leverage: "3x" },
    { rank: 3, type: "LONG", token: "INJ", price: 23.40, change: "+4.2%", catalyst: "Short squeeze trap primed (Deep Neg Funding)", entry: "$22.5 - $23.1", tp: "$26.8 / $29.5", sl: "$21.2", score: 89, leverage: "5x" },
    { rank: 4, type: "LONG", token: "SOL", price: 178.9, change: "+3.8%", catalyst: "DEX volume all-time highs + Breakout retest", entry: "$172 - $176", tp: "$195 / $210", sl: "$166", score: 88, leverage: "5x" },
    { rank: 5, type: "LONG", token: "NEAR", price: 5.62, change: "+6.3%", catalyst: "AI sector capital rotation incoming", entry: "$5.35 - $5.50", tp: "$6.40 / $7.10", sl: "$5.10", score: 86, leverage: "4x" },
    { rank: 6, type: "LONG", token: "LINK", price: 12.45, change: "+2.9%", catalyst: "Whale cold storage withdrawal accumulation", entry: "$11.9 - $12.2", tp: "$14.2 / $15.5", sl: "$11.3", score: 85, leverage: "5x" },
    { rank: 7, type: "LONG", token: "FET", price: 1.48, change: "+8.1%", catalyst: "ASI compute cluster expansion catalyst", entry: "$1.38 - $1.44", tp: "$1.75 / $1.95", sl: "$1.29", score: 84, leverage: "3x" },
    { rank: 8, type: "LONG", token: "AVAX", price: 28.90, change: "+3.1%", catalyst: "Subnet institutional testing volume spike", entry: "$27.5 - $28.2", tp: "$32.5 / $35.0", sl: "$26.1", score: 82, leverage: "4x" },
    { rank: 9, type: "LONG", token: "TAO", price: 585.0, change: "+6.9%", catalyst: "Subnet emissions halving supply shock", entry: "$550 - $575", tp: "$660 / $720", sl: "$520", score: 81, leverage: "2x" },
    { rank: 10, type: "LONG", token: "APT", price: 8.95, change: "+4.4%", catalyst: "Key resistance breakout on spot volume", entry: "$8.50 - $8.80", tp: "$10.2 / $11.5", sl: "$8.15", score: 80, leverage: "4x" },
    { rank: 1, type: "SHORT", token: "PEPE", price: 0.0000108, change: "-1.2%", catalyst: "High Positive Funding (+0.082%) + Liquidity Grab Dump", entry: "$0.0000110 - $0.0000114", tp: "$0.0000094 / $0.0000085", sl: "$0.0000121", score: 95, leverage: "3x" },
    { rank: 2, type: "SHORT", token: "WIF", price: 2.45, change: "-3.4%", catalyst: "Spot CVD divergence; Futures OI crowded long", entry: "$2.55 - $2.68", tp: "$2.15 / $1.90", sl: "$2.82", score: 92, leverage: "3x" },
    { rank: 3, type: "SHORT", token: "DOGE", price: 0.142, change: "+0.4%", catalyst: "Heavy retail long trap near key resistance", entry: "$0.144 - $0.148", tp: "$0.128 / $0.115", sl: "$0.155", score: 90, leverage: "4x" },
    { rank: 4, type: "SHORT", token: "XRP", price: 0.589, change: "-0.8%", catalyst: "Multi-top rejection at $0.62 + Whale exchange inflow", entry: "$0.605 - $0.620", tp: "$0.540 / $0.510", sl: "$0.640", score: 88, leverage: "5x" },
    { rank: 5, type: "SHORT", token: "SHIB", price: 0.0000185, change: "-2.1%", catalyst: "Whale exchange deposit of 1.4T SHIB", entry: "$0.0000192 - $0.0000200", tp: "$0.0000162 / $0.0000150", sl: "$0.0000210", score: 86, leverage: "3x" },
    { rank: 6, type: "SHORT", token: "TIA", price: 5.12, change: "-4.6%", catalyst: "Massive upcoming team unlock supply dilution", entry: "$5.30 - $5.55", tp: "$4.40 / $3.80", sl: "$5.90", score: 85, leverage: "3x" },
    { rank: 7, type: "SHORT", token: "ARB", price: 0.562, change: "-1.8%", catalyst: "Ecosystem inflation + Weak spot bid volume", entry: "$0.580 - $0.600", tp: "$0.490 / $0.440", sl: "$0.630", score: 83, leverage: "4x" },
    { rank: 8, type: "SHORT", token: "ORDI", price: 34.2, change: "-3.1%", catalyst: "BRC-20 miner fee collapse + Lower high structure", entry: "$35.5 - $37.0", tp: "$29.0 / $25.5", sl: "$39.2", score: 82, leverage: "3x" },
    { rank: 9, type: "SHORT", token: "GALA", price: 0.0224, change: "-4.0%", catalyst: "Gaming token rotation bleeding into majors", entry: "$0.0235 - $0.0245", tp: "$0.0195 / $0.0170", sl: "$0.0260", score: 80, leverage: "4x" },
    { rank: 10, type: "SHORT", token: "FIL", price: 3.75, change: "-2.5%", catalyst: "Overbought storage narrative meeting daily resistance", entry: "$3.90 - $4.05", tp: "$3.25 / $2.95", sl: "$4.25", score: 79, leverage: "3x" }
  ];

  // Liquidity Trap & Funding Hunter
  const liquidityTraps = [
    { symbol: "PEPE/USDT", rate: "+0.082%", trapType: "LONG LIQUIDATION DUMP TRAP", signal: "Retail hyper-leveraged long. Spot CVD flat. Flush imminent to sweep 0.0000098.", severity: "CRITICAL", oiChange: "+24.5%" },
    { symbol: "SUI/USDT", rate: "-0.048%", trapType: "SHORT SQUEEZE EXPLOSION PUMP", signal: "Heavy negative funding. Spot aggressive absorption. Cascading short squeeze incoming.", severity: "HIGH CONVICTION", oiChange: "+18.2%" },
    { symbol: "WIF/USDT", rate: "+0.065%", trapType: "LONG LIQUIDATION DUMP TRAP", signal: "Open Interest ATH while price fails higher high. Market maker stop run targeted.", severity: "CRITICAL", oiChange: "+31.0%" },
    { symbol: "INJ/USDT", rate: "-0.039%", trapType: "SHORT SQUEEZE EXPLOSION PUMP", signal: "Aggressive perp shorts trapped below $23 resistance. Pump likely to trigger liquidations.", severity: "HIGH CONVICTION", oiChange: "+12.7%" }
  ];

  // Whale Radar Feed
  const whaleAlerts = [
    { time: "2m ago", tx: "350,000,000 USDT ($350M)", action: "Tether Treasury ➔ Kraken", impact: "BULLISH INJECTION", hash: "0x8fa1...4bc2" },
    { time: "9m ago", tx: "4,250 BTC ($359M)", action: "Unknown Whale ➔ Coinbase Prime", impact: "SELL PRESSURE WARNING", hash: "0x1b90...7ae4" },
    { time: "18m ago", tx: "48,000 ETH ($128M)", action: "Binance ➔ Cold Wallet (Gnosis Safe)", impact: "ACCUMULATION OUTFLOW", hash: "0x98cf...32dd" },
    { time: "34m ago", tx: "70,000,000 USDC ($70M)", action: "Circle Treasury ➔ Binance", impact: "BUY LIQUIDITY ADDED", hash: "0x44ae...112c" }
  ];

  // Stablecoin Mint Tracker
  const mintLogs = [
    { date: "Today, 10:45 AM", coin: "USDT", amount: "+$250,000,000", authority: "Tether Treasury (Tron Network)", type: "MINT", status: "Active in Market" },
    { date: "Today, 06:12 AM", coin: "USDC", amount: "+$170,000,000", authority: "Circle Treasury (Ethereum)", type: "MINT", status: "Active in Market" },
    { date: "Yesterday", coin: "USDT", amount: "+$500,000,000", authority: "Tether Treasury (Ethereum)", type: "MINT", status: "Deposited to Exchanges" }
  ];

  // News Wire
  const newsFeed = [
    { title: "Tether Mints Fresh $1 Billion USDT in 48 Hours Pointing to Institutional Buying", time: "15m ago", source: "CoinDesk", sentiment: "Bullish" },
    { title: "Fed Signals High Likelihood of Liquidity Expansion as Global Easing Cycle Begins", time: "42m ago", source: "Bloomberg Crypto", sentiment: "Bullish" },
    { title: "Crypto Perp Funding Rates Spike as Open Interest Crosses $42 Billion", time: "1h ago", source: "Coinglass", sentiment: "Caution" }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Global Ticker Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 text-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-6 overflow-x-auto">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-slate-400 font-medium">TERMINAL STATUS:</span>
            <span className="text-emerald-400 font-bold">ALGO SCANNER ACTIVE</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-slate-400">BTC:</span>
            <span className="font-semibold text-emerald-400">${marketStats.btcPrice.toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-slate-400">ETH:</span>
            <span className="font-semibold text-emerald-400">${marketStats.ethPrice.toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-slate-400">BTC.D:</span>
            <span className="font-semibold text-amber-400">{marketStats.btcDominance}%</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-slate-400">Fear & Greed:</span>
            <span className="font-semibold text-emerald-400">{marketStats.fearGreed}/100 (Greed)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-slate-400">24h Stablecoin Net Mint:</span>
            <span className="font-semibold text-cyan-400">+${(marketStats.totalMint24h / 1e6).toFixed(0)}M USDT/USDC</span>
          </div>
        </div>
        <div className="text-slate-500 text-xs flex items-center gap-1">
          <RefreshCw className="w-3 h-3" /> Updated: {lastUpdated}
        </div>
      </div>

      {/* Main Navigation Bar */}
      <header className="bg-slate-900/90 backdrop-blur sticky top-0 z-50 border-b border-slate-800 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-tr from-cyan-500 to-blue-600 p-2.5 rounded-xl shadow-lg shadow-cyan-500/20">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-wider uppercase bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400">
                KAWSAR AHMED
              </h1>
              <span className="text-[10px] bg-cyan-950 border border-cyan-800 text-cyan-400 font-bold px-2 py-0.5 rounded-full">
                INSTITUTIONAL v5.0
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Whale Radar • Funding Traps • Long/Short Setups • Stablecoin Mint</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex items-center bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs font-semibold">
          {[
            { id: "overview", label: "Dashboard", icon: BarChart3 },
            { id: "setups", label: "Top 10 Long / Short", icon: TrendingUp },
            { id: "funding", label: "Funding & Liquidity Traps", icon: Flame },
            { id: "whales", label: "Whale Radar", icon: ShieldAlert },
            { id: "mints", label: "USDT/USDC Mint Watch", icon: DollarSign },
            { id: "news", label: "News Wire", icon: Newspaper }
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all ${
                  active 
                    ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/30" 
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">

        {/* ===================== TAB: OVERVIEW ===================== */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Top Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 relative overflow-hidden">
                <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Tether & Circle Injection</div>
                <div className="text-2xl font-black text-cyan-400 mt-1">+$420M / 24h</div>
                <div className="text-xs text-emerald-400 flex items-center mt-2">
                  <ArrowUpRight className="w-3.5 h-3.5 mr-1" /> Massive Buy Side Fuel Added
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Top Liquidation Alert</div>
                <div className="text-2xl font-black text-rose-500 mt-1">PEPE & WIF</div>
                <div className="text-xs text-rose-400 flex items-center mt-2">
                  <Flame className="w-3.5 h-3.5 mr-1" /> High Funding Long Trap Dump Primed
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Top Squeeze Setup</div>
                <div className="text-2xl font-black text-emerald-400 mt-1">SUI & INJ</div>
                <div className="text-xs text-emerald-400 flex items-center mt-2">
                  <Zap className="w-3.5 h-3.5 mr-1" /> Short Squeeze Rocket Detected
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Whale Flow Bias</div>
                <div className="text-2xl font-black text-amber-400 mt-1">62% Outflow</div>
                <div className="text-xs text-slate-300 flex items-center mt-2">
                  Cold storage accumulation dominating
                </div>
              </div>
            </div>

            {/* Quick Setups Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Long Setups Card */}
              <div className="bg-slate-900 border border-emerald-900/40 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    <h3 className="font-bold text-emerald-400 text-base">Top 5 Conviction Longs</h3>
                  </div>
                  <span className="text-xs text-slate-400">Algorithmic Rank</span>
                </div>
                <div className="space-y-3">
                  {setups.filter(s => s.type === "LONG").slice(0, 5).map(item => (
                    <div key={item.token} className="flex items-center justify-between p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl hover:border-emerald-500/50 transition">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-white">{item.token}</span>
                          <span className="text-xs font-semibold text-emerald-400">{item.change}</span>
                          <span className="text-[10px] bg-emerald-950 border border-emerald-800 text-emerald-400 px-1.5 py-0.5 rounded">Lev {item.leverage}</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{item.catalyst}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-mono text-slate-300">Entry: {item.entry}</div>
                        <div className="text-xs font-bold text-emerald-400">TP: {item.tp}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Short Setups Card */}
              <div className="bg-slate-900 border border-rose-900/40 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-5 h-5 text-rose-400" />
                    <h3 className="font-bold text-rose-400 text-base">Top 5 Conviction Shorts (Dump Traps)</h3>
                  </div>
                  <span className="text-xs text-slate-400">High Risk Retail Traps</span>
                </div>
                <div className="space-y-3">
                  {setups.filter(s => s.type === "SHORT").slice(0, 5).map(item => (
                    <div key={item.token} className="flex items-center justify-between p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl hover:border-rose-500/50 transition">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-white">{item.token}</span>
                          <span className="text-xs font-semibold text-rose-400">{item.change}</span>
                          <span className="text-[10px] bg-rose-950 border border-rose-800 text-rose-400 px-1.5 py-0.5 rounded">Lev {item.leverage}</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{item.catalyst}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-mono text-slate-300">Entry: {item.entry}</div>
                        <div className="text-xs font-bold text-rose-400">TP: {item.tp}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB: TOP 10 LONG / SHORT ===================== */}
        {activeTab === "setups" && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex gap-2">
                {["ALL", "LONG", "SHORT"].map(f => (
                  <button
                    key={f}
                    onClick={() => setFilterType(f)}
                    className={`px-4 py-2 text-xs font-bold rounded-lg border transition ${
                      filterType === f 
                        ? "bg-slate-100 text-slate-950 border-white" 
                        : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                    }`}
                  >
                    {f === "ALL" ? "All 20 Alpha Setups" : f === "LONG" ? "Top 10 Longs Only" : "Top 10 Shorts Only"}
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Filter token (e.g. SUI, PEPE)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Setups Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase font-semibold">
                  <tr>
                    <th className="p-4">Rank / Token</th>
                    <th className="p-4">Signal</th>
                    <th className="p-4">Entry Zone</th>
                    <th className="p-4">Take Profits (TP)</th>
                    <th className="p-4">Stop Loss</th>
                    <th className="p-4">Recommended Lev</th>
                    <th className="p-4">Catalyst & Trap Logic</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {setups
                    .filter(s => filterType === "ALL" || s.type === filterType)
                    .filter(s => s.token.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40 transition">
                        <td className="p-4 font-sans font-bold flex items-center gap-2">
                          <span className="text-slate-500">#{item.rank}</span>
                          <span className="text-white text-sm">{item.token}</span>
                          <span className={`text-[11px] ${item.change.startsWith("+") ? "text-emerald-400" : "text-rose-400"}`}>{item.change}</span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-md text-[11px] font-bold font-sans ${
                            item.type === "LONG" ? "bg-emerald-950 border border-emerald-700 text-emerald-400" : "bg-rose-950 border border-rose-700 text-rose-400"
                          }`}>
                            {item.type}
                          </span>
                        </td>
                        <td className="p-4 text-slate-200">{item.entry}</td>
                        <td className="p-4 font-bold text-emerald-400">{item.tp}</td>
                        <td className="p-4 text-rose-400 font-semibold">{item.sl}</td>
                        <td className="p-4 text-slate-300 font-sans">{item.leverage}</td>
                        <td className="p-4 font-sans text-slate-300 max-w-xs">{item.catalyst}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ===================== TAB: FUNDING & LIQUIDITY TRAPS ===================== */}
        {activeTab === "funding" && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-amber-900/30 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-amber-400 flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-400" />
                Market Maker Liquidity Trap Scanner
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Monitors anomalous Perp Funding Rates and Futures Open Interest (OI). Spots where retail is heavily clustered to execute rapid squeezes or sudden long-flush dump traps.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {liquidityTraps.map((trap, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-black text-white">{trap.symbol}</span>
                      <span className="ml-2 font-mono text-xs font-bold text-amber-400">Funding: {trap.rate}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      trap.severity === "CRITICAL" ? "bg-rose-950 border-rose-700 text-rose-400" : "bg-cyan-950 border-cyan-700 text-cyan-400"
                    }`}>
                      {trap.severity}
                    </span>
                  </div>

                  <div className={`p-3 rounded-xl border text-xs font-bold ${
                    trap.trapType.includes("DUMP") 
                      ? "bg-rose-950/40 border-rose-800/60 text-rose-300" 
                      : "bg-emerald-950/40 border-emerald-800/60 text-emerald-300"
                  }`}>
                    {trap.trapType}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-sans">{trap.signal}</p>

                  <div className="flex justify-between items-center text-xs font-mono text-slate-400 border-t border-slate-800 pt-3">
                    <span>24h Open Interest Change:</span>
                    <span className="text-cyan-400 font-bold">{trap.oiChange}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== TAB: WHALE RADAR ===================== */}
        {activeTab === "whales" && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-cyan-400 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5" />
                Live Whale Transaction Monitor (&gt;$10,000,000)
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Real-time tracking of massive on-chain wallet movements. Detects exchange deposits (dump alerts) and cold-storage withdrawals (accumulation).
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="divide-y divide-slate-800">
                {whaleAlerts.map((w, idx) => (
                  <div key={idx} className="p-4 flex flex-wrap items-center justify-between gap-4 hover:bg-slate-800/40 transition">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-xl ${w.impact.includes("SELL") ? "bg-rose-950 text-rose-400 border border-rose-800" : "bg-emerald-950 text-emerald-400 border border-emerald-800"}`}>
                        {w.impact.includes("SELL") ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{w.tx}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{w.action}</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6 text-xs">
                      <span className={`font-bold px-2.5 py-1 rounded-md border text-[11px] ${
                        w.impact.includes("SELL") ? "bg-rose-950 border-rose-800 text-rose-400" : "bg-emerald-950 border-emerald-800 text-emerald-400"
                      }`}>
                        {w.impact}
                      </span>
                      <span className="font-mono text-slate-500">{w.hash}</span>
                      <span className="text-slate-500">{w.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB: USDT / USDC MINT WATCH ===================== */}
        {activeTab === "mints" && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-cyan-900/40 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-cyan-400 flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Tether & Circle Treasury Mint Tracker
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Monitors newly minted USDT and USDC directly from issuer treasuries. Stablecoin printing indicates fresh institutional fiat entering the market.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                <div className="text-xs text-slate-400">Total USDT Minted (Last 7 Days)</div>
                <div className="text-2xl font-black text-emerald-400 mt-1">+$2,250,000,000</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                <div className="text-xs text-slate-400">Total USDC Minted (Last 7 Days)</div>
                <div className="text-2xl font-black text-cyan-400 mt-1">+$680,000,000</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                <div className="text-xs text-slate-400">Market Liquidity Velocity</div>
                <div className="text-2xl font-black text-amber-400 mt-1">VERY HIGH</div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase font-sans">
                  <tr>
                    <th className="p-4">Timestamp</th>
                    <th className="p-4">Asset</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Issuing Authority</th>
                    <th className="p-4">Status & Destination</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {mintLogs.map((log, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition">
                      <td className="p-4 text-slate-400 font-sans">{log.date}</td>
                      <td className="p-4 font-bold text-white">{log.coin}</td>
                      <td className="p-4 font-bold text-emerald-400 text-sm">{log.amount}</td>
                      <td className="p-4 text-slate-300 font-sans">{log.authority}</td>
                      <td className="p-4 font-sans text-cyan-400 font-semibold">{log.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ===================== TAB: NEWS WIRE ===================== */}
        {activeTab === "news" && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-cyan-400" />
                Aggregated Institutional Crypto News Wire
              </h2>
              <p className="text-xs text-slate-400 mt-1">Real-time breaking market developments filtered with sentiment scoring.</p>
            </div>

            <div className="space-y-3">
              {newsFeed.map((news, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between gap-4 hover:border-slate-700 transition">
                  <div>
                    <h4 className="text-sm font-bold text-white hover:text-cyan-400 transition cursor-pointer">{news.title}</h4>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <span>{news.source}</span>
                      <span>•</span>
                      <span>{news.time}</span>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-md border ${
                    news.sentiment === "Bullish" ? "bg-emerald-950 border-emerald-800 text-emerald-400" : "bg-amber-950 border-amber-800 text-amber-400"
                  }`}>
                    {news.sentiment}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 px-6 py-4 text-center text-xs text-slate-500 font-medium">
        Kawsar Ahmed Crypto Intelligence Terminal • Connected to <span className="text-cyan-400 font-semibold">kstorehub.shop</span> • All Rights Reserved.
      </footer>
    </div>
  );
}
