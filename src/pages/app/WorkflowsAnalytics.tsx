import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts'
import { Play, Pause, Pencil, Trash2, Search, Plus } from 'lucide-react'
import { workflows as seed, series30 } from '../../data/mock'
import { KEYS, load, save } from '../../utils/store'
import type { WorkflowItem } from '../../types'
import { useToast } from '../../components/common/Toast'

export function Workflows() {
  const toast = useToast(); const navigate = useNavigate()
  const [items, setItems] = useState<WorkflowItem[]>(() => load(KEYS.savedWorkflows, seed))
  const [q, setQ] = useState(''); const [filter, setFilter] = useState('All'); const [confirm, setConfirm] = useState<WorkflowItem|null>(null)
  const persist = (next: WorkflowItem[]) => { setItems(next); save(KEYS.savedWorkflows, next) }
  const list = items.filter(w => (filter==='All'||w.status===filter.toLowerCase()) && w.name.toLowerCase().includes(q.toLowerCase()))
  const toggle = (w: WorkflowItem) => { persist(items.map(x=>x.id===w.id?{...x,status:x.status==='active'?'paused':'active'}:x)); toast(`“${w.name}” ${w.status==='active'?'paused':'activated'} (demo state saved locally)`) }
  return <div><div className="flex flex-wrap items-end justify-between gap-4"><div><h1 className="text-2xl font-bold sm:text-3xl">Workflows</h1><p className="mt-1 text-sm text-slate-500">Manage your automations. Changes persist in this browser.</p></div>
    <button className="btn-primary" onClick={()=>navigate('/app/builder')}><Plus size={15}/> New workflow</button></div>
    <div className="mt-6 flex flex-col gap-3 sm:flex-row"><label className="relative flex-1"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><input className="input !pl-9" value={q} onChange={e=>setQ(e.target.value)} placeholder="Search workflows…" aria-label="Search workflows"/></label>
    <div className="flex gap-2" role="group" aria-label="Status filter">{['All','Active','Paused','Draft'].map(f=><button key={f} onClick={()=>setFilter(f)} className={`rounded-full px-3.5 py-2 text-sm font-medium ${filter===f?'bg-violet-600 text-white':'border border-slate-300 dark:border-white/15'}`}>{f}</button>)}</div></div>
    {list.length===0 ? <div className="card mt-6 p-12 text-center"><p className="font-semibold">No workflows found</p><p className="mt-1 text-sm text-slate-500">Adjust your search or create a new workflow.</p></div>
    : <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{list.map(w=><article key={w.id} className="card p-5 transition hover:shadow-lg">
      <div className="flex items-start justify-between gap-3"><h2 className="font-semibold">{w.name}</h2><span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${w.status==='active'?'bg-emerald-500/15 text-emerald-500':w.status==='paused'?'bg-amber-500/15 text-amber-500':'bg-slate-500/15 text-slate-400'}`}>{w.status}</span></div>
      <dl className="mt-4 space-y-1.5 text-sm text-slate-500"><div className="flex justify-between"><dt>Trigger</dt><dd className="text-slate-700 dark:text-slate-200">{w.trigger}</dd></div>
      <div className="flex justify-between"><dt>Sample runs</dt><dd className="text-slate-700 dark:text-slate-200">{w.runs.toLocaleString()}</dd></div>
      <div className="flex justify-between"><dt>Success rate</dt><dd className="text-slate-700 dark:text-slate-200">{w.success ? `${w.success}%` : '—'}</dd></div>
      <div className="flex justify-between"><dt>Updated</dt><dd className="text-slate-700 dark:text-slate-200">{w.updated}</dd></div></dl>
      <div className="mt-5 flex gap-2"><button className="btn-ghost flex-1 justify-center !py-2 !text-xs" onClick={()=>navigate('/app/builder')}><Pencil size={13}/> Edit</button>
      <button className="btn-ghost !py-2 !text-xs" onClick={()=>toggle(w)}>{w.status==='active'?<><Pause size={13}/> Pause</>:<><Play size={13}/> Activate</>}</button>
      <button className="btn-ghost !p-2 !text-rose-500" onClick={()=>setConfirm(w)} aria-label={`Delete ${w.name}`}><Trash2 size={15}/></button></div></article>)}</div>}
    <AnimatePresence>{confirm && <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[90] grid place-items-center bg-black/60 p-4" onClick={()=>setConfirm(null)}>
      <motion.div initial={{scale:.95}} animate={{scale:1}} className="card w-full max-w-sm p-6" onClick={e=>e.stopPropagation()} role="alertdialog" aria-label="Confirm delete">
      <h2 className="font-bold">Delete “{confirm.name}”?</h2><p className="mt-2 text-sm text-slate-500">This removes it from your local demo workspace. This cannot be undone.</p>
      <div className="mt-5 flex gap-2"><button className="btn-ghost flex-1 justify-center" onClick={()=>setConfirm(null)}>Cancel</button>
      <button className="flex-1 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white" onClick={()=>{persist(items.filter(x=>x.id!==confirm.id)); setConfirm(null); toast('Workflow deleted','info')}}>Delete</button></div></motion.div></motion.div>}</AnimatePresence>
  </div>
}

export function Analytics() {
  const [range, setRange] = useState<7|30>(30)
  const data = range===7 ? series30.slice(-7) : series30
  const total = data.reduce((a,d)=>a+d.total,0), ok = data.reduce((a,d)=>a+d.success,0), fail = total-ok
  const pie = useMemo(()=>[{name:'Successful', value:ok},{name:'Failed', value:fail}],[ok,fail])
  const cards = [['Execution volume', total.toLocaleString()],['Success rate', `${(ok/total*100).toFixed(1)}%`],['Failed executions', fail.toLocaleString()],['Avg. per day', Math.round(total/data.length).toLocaleString()]]
  return <div><h1 className="text-2xl font-bold sm:text-3xl">Analytics</h1><p className="mt-1 text-sm text-slate-500">All figures are calculated live from the same sample dataset used across the app.</p>
    <div className="mt-5 flex gap-1 w-fit rounded-xl border border-slate-200 p-1 dark:border-white/10" role="group" aria-label="Date range">{([7,30] as const).map(r=><button key={r} onClick={()=>setRange(r)} className={`rounded-lg px-4 py-2 text-sm font-medium ${range===r?'bg-violet-600 text-white':''}`}>Last {r} days</button>)}</div>
    <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([l,v],i)=><motion.div key={l} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*.05}} className="card p-5"><p className="text-2xl font-bold">{v}</p><p className="mt-1 text-sm text-slate-500">{l}</p></motion.div>)}</div>
    <div className="mt-5 grid gap-5 xl:grid-cols-3">
      <section className="card p-5 xl:col-span-2" aria-label="Success versus failures"><h2 className="mb-4 font-semibold">Success vs failures</h2><div className="h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" opacity={.15}/><XAxis dataKey="label" tick={{fontSize:11}} interval={range===30?4:0}/><YAxis tick={{fontSize:11}}/><Tooltip/><Legend/>
        <Bar dataKey="success" name="Successful" stackId="a" fill="#34d399" radius={[0,0,0,0]}/><Bar dataKey="failed" name="Failed" stackId="a" fill="#fb7185" radius={[4,4,0,0]}/></BarChart></ResponsiveContainer></div></section>
      <section className="card p-5" aria-label="Outcome split"><h2 className="mb-2 font-semibold">Outcome split</h2><div className="h-72"><ResponsiveContainer width="100%" height="100%"><PieChart>
        <Pie data={pie} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>{pie.map((_,i)=><Cell key={i} fill={i===0?'#34d399':'#fb7185'}/>)}</Pie><Tooltip/><Legend/></PieChart></ResponsiveContainer></div></section>
    </div>
    <section className="card mt-5 overflow-hidden" aria-label="Workflow performance"><h2 className="p-5 pb-3 font-semibold">Workflow performance (sample)</h2>
      <div className="overflow-x-auto"><table className="w-full min-w-[560px] text-left text-sm"><thead><tr className="border-y border-slate-200 text-slate-400 dark:border-white/10"><th className="px-5 py-3 font-medium">Workflow</th><th className="px-5 py-3 font-medium">Runs</th><th className="px-5 py-3 font-medium">Success</th><th className="px-5 py-3 font-medium">Performance</th></tr></thead>
      <tbody>{[...seed].sort((a,b)=>b.success-a.success).map(w=><tr key={w.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 dark:border-white/5 dark:hover:bg-white/[.03]"><td className="px-5 py-3.5 font-medium">{w.name}</td><td className="px-5 py-3.5">{w.runs.toLocaleString()}</td><td className="px-5 py-3.5">{w.success ? `${w.success}%`:'—'}</td>
      <td className="px-5 py-3.5"><span className="block h-2 w-36 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10"><span className="block h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400" style={{width:`${w.success}%`}}/></span></td></tr>)}</tbody></table></div></section>
  </div>
}
