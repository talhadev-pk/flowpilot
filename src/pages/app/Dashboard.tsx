import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { Workflow, Play, CheckCircle2, XCircle, Plus, LayoutTemplate, BarChart3, ArrowUpRight } from 'lucide-react'
import { series30, workflows } from '../../data/mock'
import { KEYS, load } from '../../utils/store'
import type { Execution } from '../../types'

const statCard = 'card p-5'
export default function Dashboard() {
  const [range, setRange] = useState<7|30>(7); const [loading, setLoading] = useState(true); const navigate = useNavigate()
  useEffect(() => { const t = setTimeout(()=>setLoading(false), 600); return ()=>clearTimeout(t) }, [])
  const data = range===7 ? series30.slice(-7) : series30
  const total = data.reduce((a,d)=>a+d.total,0), ok = data.reduce((a,d)=>a+d.success,0), fail = total-ok
  const rate = total ? (ok/total*100).toFixed(1) : '0'
  const extra = load<Execution[]>(KEYS.executions, [])
  const activity = [...extra, ...[
    { id:'a1', workflow:'Customer Onboarding', status:'success', started:'2 min ago', duration:'2.1s', steps:5 },
    { id:'a2', workflow:'Lead Follow-Up', status:'success', started:'26 min ago', duration:'1.4s', steps:4 },
    { id:'a3', workflow:'Support Routing', status:'failed', started:'1 hr ago', duration:'0.8s', steps:5 },
    { id:'a4', workflow:'Order Processing', status:'success', started:'2 hrs ago', duration:'3.2s', steps:5 },
  ] as Execution[]].slice(0,6)
  const stats = useMemo(() => [
    { label:'Active workflows', value: String(workflows.filter(w=>w.status==='active').length), icon: Workflow, color:'text-violet-500 bg-violet-500/10' },
    { label:`Executions (${range}d)`, value: total.toLocaleString(), icon: Play, color:'text-cyan-500 bg-cyan-500/10' },
    { label:'Successful', value: `${ok.toLocaleString()} · ${rate}%`, icon: CheckCircle2, color:'text-emerald-500 bg-emerald-500/10' },
    { label:'Failed', value: fail.toLocaleString(), icon: XCircle, color:'text-rose-500 bg-rose-500/10' },
  ], [total, ok, fail, rate, range])
  if (loading) return <div className="space-y-5" aria-busy="true"><div className="h-9 w-64 animate-pulse rounded-xl bg-slate-200 dark:bg-white/10"/><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[1,2,3,4].map(i=><div key={i} className="h-28 animate-pulse rounded-2xl bg-slate-200 dark:bg-white/10"/>)}</div><div className="h-72 animate-pulse rounded-2xl bg-slate-200 dark:bg-white/10"/></div>
  return <div>
    <div className="flex flex-wrap items-end justify-between gap-4"><div><h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Welcome back, Alex Rivera 👋</h1><p className="mt-1 text-sm text-slate-500">Here's what's happening across your sample workspace.</p></div>
      <div className="flex gap-2"><Link to="/app/templates" className="btn-ghost"><LayoutTemplate size={15}/> Templates</Link><Link to="/app/builder" className="btn-primary"><Plus size={15}/> New workflow</Link></div></div>
    <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map((s,i)=><motion.div key={s.label} initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{delay:i*.06}} className={statCard}>
      <span className={`grid h-10 w-10 place-items-center rounded-xl ${s.color}`}><s.icon size={19}/></span><p className="mt-4 text-xl font-bold">{s.value}</p><p className="text-sm text-slate-500">{s.label}</p></motion.div>)}</div>
    <div className="mt-5 grid gap-5 xl:grid-cols-3">
      <section className="card p-5 xl:col-span-2" aria-label="Execution volume chart">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><h2 className="font-semibold">Execution volume</h2>
          <div className="flex gap-1 rounded-xl border border-slate-200 p-1 dark:border-white/10" role="group" aria-label="Date range">{([7,30] as const).map(r=><button key={r} onClick={()=>setRange(r)} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${range===r?'bg-violet-600 text-white':'hover:bg-slate-100 dark:hover:bg-white/5'}`}>{r} days</button>)}</div></div>
        <div className="h-64"><ResponsiveContainer width="100%" height="100%"><AreaChart data={data}>
          <defs><linearGradient id="gTotal" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7c6cff" stopOpacity={.35}/><stop offset="100%" stopColor="#7c6cff" stopOpacity={0}/></linearGradient></defs>
          <CartesianGrid strokeDasharray="3 3" opacity={.15}/><XAxis dataKey="label" tick={{fontSize:11}} interval={range===30?4:0}/><YAxis tick={{fontSize:11}}/><Tooltip/>
          <Area type="monotone" dataKey="total" name="Executions" stroke="#7c6cff" fill="url(#gTotal)" strokeWidth={2}/></AreaChart></ResponsiveContainer></div>
      </section>
      <section className="card p-5" aria-label="Recent activity"><h2 className="font-semibold">Recent activity</h2>
        <ul className="mt-4 space-y-3">{activity.map(a=><li key={a.id} className="flex items-start gap-3 text-sm">
          {a.status==='success' ? <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-emerald-500"/> : <XCircle size={17} className="mt-0.5 shrink-0 text-rose-500"/>}
          <span className="min-w-0"><span className="block truncate font-medium">{a.workflow}</span><span className="text-xs text-slate-400">{a.started} · {a.duration} · simulated</span></span></li>)}</ul>
        <Link to="/app/history" className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-violet-500 hover:underline">View history <ArrowUpRight size={14}/></Link></section>
    </div>
    <section className="card mt-5 p-5" aria-label="Workflow overview"><div className="mb-4 flex items-center justify-between"><h2 className="font-semibold">Workflow overview</h2><Link to="/app/workflows" className="text-sm font-medium text-violet-500 hover:underline">Manage all</Link></div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{workflows.slice(0,6).map(w=><button key={w.id} onClick={()=>navigate('/app/workflows')} className="rounded-xl border border-slate-200 p-4 text-left transition hover:border-violet-400/50 hover:shadow-md dark:border-white/10">
        <span className="flex items-center justify-between"><span className="font-medium">{w.name}</span><span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${w.status==='active'?'bg-emerald-500/15 text-emerald-500':w.status==='paused'?'bg-amber-500/15 text-amber-500':'bg-slate-500/15 text-slate-400'}`}>{w.status}</span></span>
        <span className="mt-2 block text-xs text-slate-400">{w.runs.toLocaleString()} sample runs · {w.success ? `${w.success}% success` : 'not run yet'} · {w.updated}</span></button>)}</div>
      <div className="mt-5 flex flex-wrap gap-2"><Link to="/app/builder" className="btn-ghost !text-xs"><Plus size={14}/> Create workflow</Link><Link to="/app/analytics" className="btn-ghost !text-xs"><BarChart3 size={14}/> Open analytics</Link><button onClick={()=>navigate('/app/builder')} className="btn-ghost !text-xs"><Play size={14}/> Run a simulation</button></div>
    </section>
  </div>
}
