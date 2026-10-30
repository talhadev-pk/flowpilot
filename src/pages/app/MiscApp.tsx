import { useMemo, useState } from 'react'
import { Search, CheckCircle2, XCircle, Loader2, ExternalLink } from 'lucide-react'
import { executions as seed, integrations } from '../../data/mock'
import { KEYS, load, save } from '../../utils/store'
import type { Execution } from '../../types'
import { useToast } from '../../components/common/Toast'
import TemplateLibrary from '../../components/marketing/TemplateLibrary'
import { DemoNote } from '../../components/common/ui'

export function AppTemplates() {
  return <div><h1 className="text-2xl font-bold sm:text-3xl">Templates</h1><p className="mt-1 mb-6 text-sm text-slate-500">Choose a template to load it into the builder. Time-saved figures are illustrative.</p><TemplateLibrary /></div>
}

export function History() {
  const [q, setQ] = useState(''); const [status, setStatus] = useState('All')
  const all = useMemo(() => [...load<Execution[]>(KEYS.executions, []), ...seed], [])
  const list = all.filter(e => (status==='All' || e.status===status.toLowerCase()) && (e.workflow+e.id).toLowerCase().includes(q.toLowerCase()))
  return <div><h1 className="text-2xl font-bold sm:text-3xl">Execution History</h1><p className="mt-1 text-sm text-slate-500">Simulated runs — runs you trigger in the builder appear here and persist locally.</p>
    <div className="mt-6 flex flex-col gap-3 sm:flex-row"><label className="relative flex-1"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><input className="input !pl-9" value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by workflow or run ID…" aria-label="Search history"/></label>
    <div className="flex gap-2" role="group" aria-label="Status filter">{['All','Success','Failed'].map(s=><button key={s} onClick={()=>setStatus(s)} className={`rounded-full px-3.5 py-2 text-sm font-medium ${status===s?'bg-violet-600 text-white':'border border-slate-300 dark:border-white/15'}`}>{s}</button>)}</div></div>
    <section className="card mt-5 overflow-hidden" aria-label="Execution history table"><div className="overflow-x-auto">
      {list.length===0 ? <p className="p-10 text-center text-sm text-slate-500">No executions match. Try clearing the filters, or run a simulation in the builder.</p> :
      <table className="w-full min-w-[640px] text-left text-sm"><thead><tr className="border-b border-slate-200 text-slate-400 dark:border-white/10"><th className="px-5 py-3 font-medium">Run</th><th className="px-5 py-3 font-medium">Workflow</th><th className="px-5 py-3 font-medium">Status</th><th className="px-5 py-3 font-medium">Started</th><th className="px-5 py-3 font-medium">Duration</th><th className="px-5 py-3 font-medium">Steps</th></tr></thead>
      <tbody>{list.map(e=><tr key={e.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 dark:border-white/5 dark:hover:bg-white/[.03]"><td className="px-5 py-3.5 font-mono text-xs">{e.id}</td><td className="px-5 py-3.5 font-medium">{e.workflow}</td>
      <td className="px-5 py-3.5"><span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${e.status==='success'?'bg-emerald-500/15 text-emerald-500':'bg-rose-500/15 text-rose-500'}`}>{e.status==='success'?<CheckCircle2 size={12}/>:<XCircle size={12}/>}{e.status}</span></td>
      <td className="px-5 py-3.5 text-slate-500">{e.started}</td><td className="px-5 py-3.5">{e.duration}</td><td className="px-5 py-3.5">{e.steps}</td></tr>)}</tbody></table>}</div></section></div>
}

export function Integrations() {
  const toast = useToast()
  const [connected, setConnected] = useState<string[]>(() => load(KEYS.integrations, []))
  const [q, setQ] = useState(''); const [cat, setCat] = useState('All')
  const cats = ['All', ...Array.from(new Set(integrations.map(i=>i.category)))]
  const list = integrations.filter(i => (cat==='All'||i.category===cat) && i.name.toLowerCase().includes(q.toLowerCase()))
  const toggle = (id: string, name: string) => { const on = connected.includes(id); const next = on ? connected.filter(x=>x!==id) : [...connected, id]; setConnected(next); save(KEYS.integrations, next); toast(on ? `${name} demo disconnected` : `${name} marked as connected (demo only — no OAuth occurred)`, on?'info':'success') }
  return <div><h1 className="text-2xl font-bold sm:text-3xl">Integrations</h1><p className="mt-1 text-sm text-slate-500">A visual directory. Toggling a connection updates demo state only.</p>
    <div className="mt-5"><DemoNote>No real accounts are linked. “Connected” below means “marked connected in this local demo”.</DemoNote></div>
    <div className="mt-6 flex flex-col gap-3 sm:flex-row"><label className="relative flex-1"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><input className="input !pl-9" value={q} onChange={e=>setQ(e.target.value)} placeholder="Search integrations…" aria-label="Search integrations"/></label>
    <div className="flex flex-wrap gap-2">{cats.map(c=><button key={c} onClick={()=>setCat(c)} className={`rounded-full px-3.5 py-2 text-sm font-medium ${cat===c?'bg-violet-600 text-white':'border border-slate-300 dark:border-white/15'}`}>{c}</button>)}</div></div>
    <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{list.map(i=>{ const on = connected.includes(i.id); return <article key={i.id} className="card p-5 transition hover:shadow-lg">
      <div className="flex items-start justify-between"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-2xl dark:bg-white/5" aria-hidden>{i.icon}</span>{i.popular && <span className="rounded-full bg-violet-500/15 px-2 py-0.5 text-[11px] font-semibold text-violet-500">Popular</span>}</div>
      <h2 className="mt-4 font-semibold">{i.name}</h2><p className="mt-1 text-sm text-slate-500">{i.description}</p><p className="mt-2 text-xs text-slate-400">{i.category}</p>
      <div className="mt-5 flex items-center gap-2"><button onClick={()=>toggle(i.id,i.name)} className={on?'btn-ghost flex-1 justify-center !py-2 !text-xs':'btn-primary flex-1 justify-center !py-2 !text-xs'}>{on?'Disconnect (demo)':'Connect (demo)'}</button>
      <button className="btn-ghost !p-2" aria-label={`About ${i.name} demo`} onClick={()=>toast(`${i.name} integration is a visual demonstration — no API calls are made.`,'info')}><ExternalLink size={15}/></button></div>
      {on && <p className="mt-3 flex items-center gap-1.5 text-xs text-emerald-500"><CheckCircle2 size={13}/> Demo state: connected (local only)</p>}</article>})}</div>
    {list.length===0 && <div className="card mt-6 p-10 text-center text-sm text-slate-500">No integrations match your search.</div>}</div>
}

const defaultSettings = { name:'Alex Rivera', email:'Alex Rivera@example.com', role:'Workspace Admin', emailNotif:true, runAlerts:true, weeklyDigest:false, workflowName:'Customer Onboarding', timezone:'Asia/Karachi (GMT+5)' }
export function Settings() {
  const toast = useToast()
  const [s, setS] = useState(() => ({ ...defaultSettings, ...load(KEYS.settings, {}) }))
  const [saving, setSaving] = useState(false)
  const submit = (e: React.FormEvent) => { e.preventDefault(); if (s.name.trim().length<2) return toast('Name must be at least 2 characters','error'); if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.email)) return toast('Please enter a valid email address','error')
    setSaving(true); setTimeout(()=>{ save(KEYS.settings, s); setSaving(false); toast('Settings saved locally') }, 500) }
  const toggle = (k: 'emailNotif'|'runAlerts'|'weeklyDigest') => (e: React.ChangeEvent<HTMLInputElement>) => setS(v=>({...v,[k]:e.target.checked}))
  return <div className="max-w-3xl"><h1 className="text-2xl font-bold sm:text-3xl">Settings</h1><p className="mt-1 text-sm text-slate-500">Profile and workspace preferences, persisted in this browser.</p>
    <form onSubmit={submit} className="mt-6 space-y-5">
      <section className="card p-6" aria-label="Profile"><h2 className="font-semibold">Profile</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div><label className="label" htmlFor="s-name">Full name</label><input id="s-name" className="input" value={s.name} onChange={e=>setS({...s,name:e.target.value})}/></div>
          <div><label className="label" htmlFor="s-email">Email</label><input id="s-email" type="email" className="input" value={s.email} onChange={e=>setS({...s,email:e.target.value})}/></div>
          <div><label className="label" htmlFor="s-role">Role</label><select id="s-role" className="input" value={s.role} onChange={e=>setS({...s,role:e.target.value})}><option>Workspace Admin</option><option>Editor</option><option>Viewer</option></select></div>
          <div><label className="label" htmlFor="s-tz">Timezone</label><select id="s-tz" className="input" value={s.timezone} onChange={e=>setS({...s,timezone:e.target.value})}><option>Asia/Karachi (GMT+5)</option><option>UTC</option><option>America/New_York (GMT-5)</option><option>Europe/London (GMT)</option></select></div>
        </div></section>
      <section className="card p-6" aria-label="Notifications"><h2 className="font-semibold">Notifications (demo preferences)</h2>
        {[['emailNotif','Email notifications','Receive a summary email for completed runs (preference only).'],['runAlerts','Failure alerts','Highlight simulated failed steps in History.'],['weeklyDigest','Weekly digest','Include this workspace in the weekly sample digest.']].map(([k,t,d])=>(
          <label key={k} className="mt-4 flex cursor-pointer items-start justify-between gap-4"><span><span className="block text-sm font-medium">{t}</span><span className="block text-sm text-slate-500">{d}</span></span>
          <input type="checkbox" className="mt-1 h-5 w-5 accent-violet-600" checked={(s as any)[k]} onChange={toggle(k as any)}/></label>))}
      </section>
      <section className="card p-6" aria-label="Help and documentation"><h2 className="font-semibold">Help & documentation</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-500"><li><strong className="text-slate-700 dark:text-slate-200">Builder:</strong> add nodes from the toolbar, drag right handle → left handle to connect, Delete removes selection.</li>
        <li><strong className="text-slate-700 dark:text-slate-200">Templates:</strong> “Use template” replaces the builder canvas — save first if you need the current one.</li>
        <li><strong className="text-slate-700 dark:text-slate-200">Data:</strong> everything is stored in localStorage keys prefixed <code>flowpilot.</code> — clear site data to reset the demo.</li></ul></section>
      <button className="btn-primary !px-6 !py-3" disabled={saving}>{saving ? <><Loader2 size={15} className="animate-spin"/> Saving…</> : 'Save settings'}</button>
    </form></div>
}
