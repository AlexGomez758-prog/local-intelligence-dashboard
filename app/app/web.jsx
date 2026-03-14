import React, { useEffect, useMemo, useState } from "react";
import { Globe, Newspaper, NotebookPen, Search, Bell, MapPin, Building2, Tv, Filter, Plus, Trash2, ExternalLink, Clock3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";

const defaultGlobalNews = [
  {
    id: 1,
    title: "European leaders debate industrial policy and AI competitiveness",
    source: "Global Desk",
    region: "Europe",
    category: "Policy",
    time: "20 min ago",
    urgency: "medium",
    summary: "Industrial policy, AI regulation, and energy costs remain central to the competitiveness debate across Europe.",
  },
  {
    id: 2,
    title: "Shipping disruptions raise new supply chain concerns",
    source: "World Markets Monitor",
    region: "Middle East",
    category: "Economy",
    time: "45 min ago",
    urgency: "high",
    summary: "Trade routes and insurance costs are creating renewed pressure on logistics and local prices in multiple regions.",
  },
  {
    id: 3,
    title: "Asian technology investment expands despite regulatory questions",
    source: "Tech Policy Wire",
    region: "Asia",
    category: "AI",
    time: "1 hr ago",
    urgency: "low",
    summary: "Investment remains strong as governments balance innovation incentives with national security and labor concerns.",
  },
  {
    id: 4,
    title: "African cities push digital infrastructure upgrades",
    source: "Urban Futures",
    region: "Africa",
    category: "Development",
    time: "2 hrs ago",
    urgency: "medium",
    summary: "Municipal leaders are framing connectivity and digital services as critical economic growth tools.",
  },
];

const defaultLocalNews = [
  {
    id: 101,
    title: "County transportation proposal could shift retail traffic patterns",
    source: "Local Feed",
    region: "Montgomery County",
    category: "Local Economy",
    time: "30 min ago",
    urgency: "high",
    summary: "Transit and mobility changes may affect where customers spend time and how businesses think about location strategy.",
  },
  {
    id: 102,
    title: "Small business event calendar updated for spring",
    source: "Community Bulletin",
    region: "Local",
    category: "Business",
    time: "1 hr ago",
    urgency: "low",
    summary: "Networking, grant information sessions, and entrepreneurship events create partnership opportunities for local operators.",
  },
  {
    id: 103,
    title: "Student leaders discuss AI use, workforce preparation, and campus services",
    source: "Campus Affairs",
    region: "Montgomery College",
    category: "Education",
    time: "2 hrs ago",
    urgency: "medium",
    summary: "AI adoption and student support remain central to conversations about future-ready institutions and employment pipelines.",
  },
];

const regionPositions = {
  "North America": { x: 20, y: 33 },
  "South America": { x: 31, y: 63 },
  Europe: { x: 51, y: 28 },
  Africa: { x: 52, y: 52 },
  Asia: { x: 73, y: 35 },
  Oceania: { x: 84, y: 68 },
  "Middle East": { x: 60, y: 39 },
  Local: { x: 23, y: 31 },
  "Montgomery County": { x: 24, y: 30 },
  "Montgomery College": { x: 24, y: 30 },
};

const urgencyStyles = {
  high: "bg-red-500/15 text-red-300 border-red-400/30",
  medium: "bg-amber-500/15 text-amber-300 border-amber-400/30",
  low: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
};

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

function WorldMap({ items, selectedRegion, onRegionSelect }) {
  const regions = [
    { name: "North America", x: 20, y: 33, w: 22, h: 18 },
    { name: "South America", x: 30, y: 58, w: 12, h: 22 },
    { name: "Europe", x: 48, y: 22, w: 12, h: 12 },
    { name: "Africa", x: 48, y: 40, w: 15, h: 22 },
    { name: "Middle East", x: 58, y: 34, w: 10, h: 10 },
    { name: "Asia", x: 63, y: 24, w: 23, h: 22 },
    { name: "Oceania", x: 80, y: 63, w: 10, h: 10 },
  ];

  return (
    <div className="relative h-[430px] w-full overflow-hidden rounded-[1.75rem] border border-slate-800 bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.16),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.12),transparent_25%)]" />
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="ocean" x1="0" x2="1">
            <stop offset="0%" stopColor="rgba(15,23,42,1)" />
            <stop offset="100%" stopColor="rgba(2,6,23,1)" />
          </linearGradient>
        </defs>
        <rect width="100" height="100" fill="url(#ocean)" />
        {regions.map((region) => {
          const active = selectedRegion === region.name;
          return (
            <g key={region.name} onClick={() => onRegionSelect(active ? "All" : region.name)} className="cursor-pointer">
              <rect
                x={region.x}
                y={region.y}
                rx="5"
                ry="5"
                width={region.w}
                height={region.h}
                fill={active ? "rgba(59,130,246,0.35)" : "rgba(148,163,184,0.14)"}
                stroke={active ? "rgba(96,165,250,0.9)" : "rgba(148,163,184,0.35)"}
                strokeWidth="0.6"
              />
              <text x={region.x + region.w / 2} y={region.y + region.h / 2} textAnchor="middle" dominantBaseline="middle" fill="rgba(226,232,240,0.9)" fontSize="2.8">
                {region.name}
              </text>
            </g>
          );
        })}
        {items.map((item) => {
          const pos = regionPositions[item.region] || { x: 50, y: 50 };
          return (
            <g key={item.id}>
              <circle cx={pos.x} cy={pos.y} r="1.3" fill="rgba(34,197,94,0.95)" />
              <circle cx={pos.x} cy={pos.y} r="3.1" fill="rgba(34,197,94,0.16)" />
            </g>
          );
        })}
      </svg>
      <div className="absolute left-4 top-4 rounded-2xl border border-slate-800 bg-slate-900/90 px-4 py-3 shadow-xl backdrop-blur">
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <Globe className="h-4 w-4 text-blue-300" />
          World Intelligence Map
        </div>
        <p className="mt-1 max-w-xs text-xs leading-5 text-slate-400">
          Click a region to filter headlines. Use this like a personal free mini-terminal for local, global, economic, and AI scanning.
        </p>
      </div>
    </div>
  );
}

function NewsCard({ item, onMemoAdd }) {
  return (
    <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="rounded-[1.5rem] border-slate-800 bg-slate-900/80 text-slate-100 shadow-xl shadow-black/20">
        <CardHeader className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={`border ${urgencyStyles[item.urgency] || urgencyStyles.medium}`}>{item.urgency} priority</Badge>
            <Badge variant="outline" className="border-slate-700 text-slate-300">{item.category}</Badge>
            <Badge variant="outline" className="border-slate-700 text-slate-300">{item.region}</Badge>
          </div>
          <CardTitle className="text-lg leading-7">{item.title}</CardTitle>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
            <span className="flex items-center gap-1"><Building2 className="h-4 w-4" />{item.source}</span>
            <span className="flex items-center gap-1"><Clock3 className="h-4 w-4" />{item.time}</span>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-7 text-slate-300">{item.summary}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button size="sm" className="rounded-xl bg-blue-600 hover:bg-blue-500" onClick={() => onMemoAdd(item)}>
              <NotebookPen className="mr-2 h-4 w-4" /> Save to memo
            </Button>
            <Button size="sm" variant="outline" className="rounded-xl border-slate-700 bg-transparent text-slate-200 hover:bg-slate-800">
              <ExternalLink className="mr-2 h-4 w-4" /> Source slot
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function WorldNewsIntelligenceDashboard() {
  const [globalNews, setGlobalNews] = useLocalStorage("dashboard-global-news", defaultGlobalNews);
  const [localNews, setLocalNews] = useLocalStorage("dashboard-local-news", defaultLocalNews);
  const [memos, setMemos] = useLocalStorage("dashboard-memos", []);
  const [watchlist, setWatchlist] = useLocalStorage("dashboard-watchlist", ["Montgomery County", "small business", "AI policy", "local economy"]);
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [memoDraft, setMemoDraft] = useState("");
  const [watchInput, setWatchInput] = useState("");

  const combinedNews = useMemo(() => [...localNews, ...globalNews], [localNews, globalNews]);

  const filteredNews = useMemo(() => {
    return combinedNews.filter((item) => {
      const matchesRegion = selectedRegion === "All" || item.region === selectedRegion;
      const matchesCategory = category === "All" || item.category === category;
      const haystack = `${item.title} ${item.summary} ${item.source} ${item.region} ${item.category}`.toLowerCase();
      const matchesSearch = haystack.includes(search.toLowerCase());
      return matchesRegion && matchesCategory && matchesSearch;
    });
  }, [combinedNews, selectedRegion, category, search]);

  function addMemoFromHeadline(item) {
    const memo = {
      id: Date.now(),
      title: item.title,
      text: `${item.region} | ${item.category}\n\n${item.summary}\n\nWhy it matters: `,
      createdAt: new Date().toLocaleString(),
    };
    setMemos([memo, ...memos]);
  }

  function addManualMemo() {
    if (!memoDraft.trim()) return;
    const memo = {
      id: Date.now(),
      title: "Manual memo",
      text: memoDraft,
      createdAt: new Date().toLocaleString(),
    };
    setMemos([memo, ...memos]);
    setMemoDraft("");
  }

  function addWatchItem() {
    if (!watchInput.trim()) return;
    setWatchlist([watchInput.trim(), ...watchlist]);
    setWatchInput("");
  }

  function removeMemo(id) {
    setMemos(memos.filter((memo) => memo.id !== id));
  }

  function seedSampleHeadline(type) {
    const item = {
      id: Date.now(),
      title: type === "local" ? "Add your live local headline here" : "Add your live global headline here",
      source: type === "local" ? "Your local TV/news source" : "Your world news source",
      region: type === "local" ? "Montgomery County" : "Europe",
      category: type === "local" ? "Local Economy" : "Policy",
      time: "just now",
      urgency: "medium",
      summary: "Replace this with a headline you pull in from TV apps, RSS feeds, APIs, or your own notes.",
    };
    if (type === "local") setLocalNews([item, ...localNews]);
    else setGlobalNews([item, ...globalNews]);
  }

  const categories = ["All", ...Array.from(new Set(combinedNews.map((n) => n.category)))];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.14),transparent_25%),radial-gradient(circle_at_left,rgba(16,185,129,0.10),transparent_25%)]" />
      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8 rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-black/25 backdrop-blur">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <div className="mb-3 inline-flex items-center rounded-full border border-blue-400/30 bg-blue-400/10 px-3 py-1 text-sm text-blue-200">
                Free personal Bloomberg-style world and local dashboard
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                World Map Intelligence Terminal
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
                A private dashboard for scanning local news, global headlines, economic signals, AI policy developments, and business-relevant updates — then turning them into quick memos for consulting, campaigns, community work, and research.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Badge className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-slate-300">Local + global feeds</Badge>
                <Badge className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-slate-300">Memo system</Badge>
                <Badge className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-slate-300">World region filtering</Badge>
                <Badge className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-slate-300">Watchlist tracking</Badge>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["Total headlines", combinedNews.length, <Newspaper className="h-5 w-5 text-blue-300" key="a" />],
                ["Saved memos", memos.length, <NotebookPen className="h-5 w-5 text-emerald-300" key="b" />],
                ["Watch terms", watchlist.length, <Bell className="h-5 w-5 text-amber-300" key="c" />],
                ["Local focus", "Montgomery", <MapPin className="h-5 w-5 text-rose-300" key="d" />],
              ].map(([label, value, icon]) => (
                <Card key={label} className="rounded-[1.5rem] border-slate-800 bg-slate-950/90 shadow-xl shadow-black/20">
                  <CardContent className="flex items-center justify-between p-5">
                    <div>
                      <p className="text-sm text-slate-400">{label}</p>
                      <p className="mt-1 text-2xl font-semibold text-white">{value}</p>
                    </div>
                    <div>{icon}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </motion.div>

        <Tabs defaultValue="terminal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 rounded-2xl bg-slate-900 p-1">
            <TabsTrigger value="terminal" className="rounded-xl">Terminal</TabsTrigger>
            <TabsTrigger value="local" className="rounded-xl">Local feed</TabsTrigger>
            <TabsTrigger value="memos" className="rounded-xl">Memos</TabsTrigger>
            <TabsTrigger value="settings" className="rounded-xl">Feed setup</TabsTrigger>
          </TabsList>

          <TabsContent value="terminal" className="space-y-6">
            <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
              <WorldMap items={filteredNews} selectedRegion={selectedRegion} onRegionSelect={setSelectedRegion} />
              <Card className="rounded-[1.75rem] border-slate-800 bg-slate-900/80 shadow-xl shadow-black/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white"><Filter className="h-5 w-5 text-blue-300" /> News filters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search headlines, topics, institutions" className="rounded-xl border-slate-700 bg-slate-950 pl-10 text-slate-100 placeholder:text-slate-500" />
                  </div>
                  <div>
                    <p className="mb-2 text-sm text-slate-400">Category</p>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="rounded-xl border-slate-700 bg-slate-950 text-slate-100">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <p className="mb-2 text-sm text-slate-400">Region</p>
                    <div className="flex flex-wrap gap-2">
                      {["All", "Montgomery County", "Europe", "Middle East", "Asia", "Africa"].map((region) => (
                        <Button key={region} variant={selectedRegion === region ? "default" : "outline"} onClick={() => setSelectedRegion(region)} className={`rounded-xl ${selectedRegion === region ? "bg-blue-600 hover:bg-blue-500" : "border-slate-700 bg-transparent text-slate-200 hover:bg-slate-800"}`}>
                          {region}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Button onClick={() => seedSampleHeadline("local")} className="rounded-xl bg-emerald-600 hover:bg-emerald-500">
                      <Plus className="mr-2 h-4 w-4" /> Add local item
                    </Button>
                    <Button onClick={() => seedSampleHeadline("global")} variant="outline" className="rounded-xl border-slate-700 bg-transparent text-slate-200 hover:bg-slate-800">
                      <Plus className="mr-2 h-4 w-4" /> Add global item
                    </Button>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 text-sm leading-6 text-slate-400">
                    This prototype stores your news items, watchlist, and memos in local browser storage. To make it fully live, plug in RSS feeds, APIs, or your preferred sources later.
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
              {filteredNews.map((item) => (
                <NewsCard key={item.id} item={item} onMemoAdd={addMemoFromHeadline} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="local" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              {[
                ["Business alerts", "Track permits, retail openings, grants, zoning, transit, and neighborhood traffic shifts."],
                ["Community demand", "Monitor local events, campus activity, weather disruptions, and consumer movement."],
                ["Owner memos", "Create quick briefings that business owners can actually read and act on."],
              ].map(([title, desc]) => (
                <Card key={title} className="rounded-[1.5rem] border-slate-800 bg-slate-900/80 shadow-xl shadow-black/20">
                  <CardContent className="p-5">
                    <div className="font-medium text-white">{title}</div>
                    <div className="mt-2 text-sm leading-6 text-slate-400">{desc}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
              <Card className="rounded-[1.75rem] border-slate-800 bg-slate-900/80 shadow-xl shadow-black/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Tv className="h-5 w-5 text-emerald-300" /> Local monitoring board</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm leading-6 text-slate-300">
                  <p>Use this section for county news, campus updates, local business developments, local permits, chamber news, grants, road changes, commercial real-estate movement, and community notes you capture from TV apps or browser sources.</p>
                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                    <p className="font-medium text-white">Suggested source slots</p>
                    <ul className="mt-3 space-y-2 text-slate-400">
                      <li>• Local TV station app feed</li>
                      <li>• County government updates</li>
                      <li>• Chamber of commerce or small business news</li>
                      <li>• Permit, zoning, and planning board updates</li>
                      <li>• Transit, roadwork, and foot-traffic affecting projects</li>
                      <li>• College and student government updates</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
              <div className="grid gap-4 md:grid-cols-2">
                {localNews.map((item) => (
                  <NewsCard key={item.id} item={item} onMemoAdd={addMemoFromHeadline} />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="memos" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
              <Card className="rounded-[1.75rem] border-slate-800 bg-slate-900/80 shadow-xl shadow-black/20">
                <CardHeader>
                  <CardTitle className="text-white">Quick memo capture</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea value={memoDraft} onChange={(e) => setMemoDraft(e.target.value)} placeholder="Write a consulting memo, meeting insight, local issue note, or world news takeaway..." className="min-h-[220px] rounded-2xl border-slate-700 bg-slate-950 text-slate-100 placeholder:text-slate-500" />
                  <Button onClick={addManualMemo} className="w-full rounded-xl bg-blue-600 hover:bg-blue-500">
                    <NotebookPen className="mr-2 h-4 w-4" /> Save memo
                  </Button>
                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 text-sm leading-6 text-slate-400">
                    Tip: save memos by headline, then expand them later into consulting briefs, campaign notes, or local economic advisories.
                  </div>
                </CardContent>
              </Card>
              <div className="space-y-4">
                {memos.length === 0 ? (
                  <Card className="rounded-[1.75rem] border-slate-800 bg-slate-900/80">
                    <CardContent className="p-6 text-slate-400">No memos yet. Save one from a headline or write a manual note.</CardContent>
                  </Card>
                ) : (
                  memos.map((memo) => (
                    <Card key={memo.id} className="rounded-[1.75rem] border-slate-800 bg-slate-900/80 shadow-xl shadow-black/20">
                      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
                        <div>
                          <CardTitle className="text-lg text-white">{memo.title}</CardTitle>
                          <p className="mt-2 text-sm text-slate-400">{memo.createdAt}</p>
                        </div>
                        <Button size="icon" variant="outline" onClick={() => removeMemo(memo.id)} className="rounded-xl border-slate-700 bg-transparent text-slate-200 hover:bg-slate-800">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </CardHeader>
                      <CardContent>
                        <p className="whitespace-pre-line text-sm leading-7 text-slate-300">{memo.text}</p>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="rounded-[1.75rem] border-slate-800 bg-slate-900/80 shadow-xl shadow-black/20">
              <CardHeader>
                <CardTitle className="text-white">Business-owner version</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2 text-sm leading-7 text-slate-300">
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <p className="font-medium text-white">Public-facing dashboard</p>
                  <p className="mt-2 text-slate-400">Show local headlines, business alerts, grant notices, neighborhood trends, and a simplified memo section for owners.</p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <p className="font-medium text-white">Private analyst dashboard</p>
                  <p className="mt-2 text-slate-400">Keep deeper memos, campaign notes, AI-policy research, and your consulting watchlist restricted to you and partners.</p>
                </div>
              </CardContent>
            </Card>
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="rounded-[1.75rem] border-slate-800 bg-slate-900/80 shadow-xl shadow-black/20">
                <CardHeader>
                  <CardTitle className="text-white">Watchlist</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-3">
                    <Input value={watchInput} onChange={(e) => setWatchInput(e.target.value)} placeholder="Add a term like zoning, retail, AI labor, campus policy" className="rounded-xl border-slate-700 bg-slate-950 text-slate-100 placeholder:text-slate-500" />
                    <Button onClick={addWatchItem} className="rounded-xl bg-emerald-600 hover:bg-emerald-500">Add</Button>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {watchlist.map((item) => (
                      <Badge key={item} className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-slate-300">{item}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-[1.75rem] border-slate-800 bg-slate-900/80 shadow-xl shadow-black/20">
                <CardHeader>
                  <CardTitle className="text-white">How to make this live</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm leading-7 text-slate-300">
                  <p>Right now, this is a polished private dashboard prototype with your own memo and tracking system.</p>
                  <p>To make it fully live later, connect:</p>
                  <ul className="space-y-2 text-slate-400">
                    <li>• RSS feeds for local and global news</li>
                    <li>• News APIs for searchable headlines</li>
                    <li>• A database if you want sync across devices</li>
                    <li>• User authentication if you want it private online</li>
                  </ul>
                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 text-slate-400">
                    Best use case: your own free intelligence dashboard that feels like a Bloomberg-style command screen for local consulting and global awareness.
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
