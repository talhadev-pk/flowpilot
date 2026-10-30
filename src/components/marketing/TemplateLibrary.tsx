import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, X, Clock, Play, ArrowRight } from 'lucide-react'
import { templates, categories } from '../../data/mock'
import type { Template } from '../../types'
import { templateToFlow } from '../../features/workflows/templateFlow'
import { KEYS, save } from '../../utils/store'
import { useToast } from '../common/Toast'
import { Reveal } from '../common/ui'

export default function TemplateLibrary() {
  const [q, setQ] = useState(''); const [cat, setCat] = useState('All'); const [selected, setSelected] = useState<Template | null>(null)
  const navigate = useNavigate(); const toast = useToast()
  const list = useMemo(() => templates.filter(t => (cat==='All' || t.category===cat) && (t.name+t.description+t.trigger).toLowerCase().includes(q.toLowerCase())), [q, cat])
  const use = (t: Template) => { const f = templateToFlow(t); save(KEYS.workflow, f); save(KEYS.builderName, t.name); toast(`Template “${t.name}” loaded into the builder`); navigate('/app/builder') }
  return <div>
    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      <label className="relative flex-1"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><input value={q} onChange={e=>setQ(e.target.value)} className="input !pl-9" placeholder="Search templates…" aria-label="Search templates"/></label>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">{categories.map(c=><button key={c} onClick={()=>setCat(c)} className={`rounded-full px-3.5 py-2 text-sm font-medium transition ${cat===c ? 'bg-violet-600 text-white' : 'border border-slate-300 hover:bg-slate-100 dark:border-white/15 dark:hover:bg-white/5'}`}>{c}</button>)}</div>
    </div>
    {list.length===0 ? <div className="card mt-8 p-12 text-center"><p className="text-lg font-semibold">No templates match your search</p><p className="mt-2 text-sm text-slate-500">Try a different keyword or category.</p><button className="btn-ghost mt-5" onClick={()=>{setQ(''); setCat('All')}}>Clear filters</button></div>
    : <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{list.map((t,i)=><Reveal key={t.id} delay={Math.min(i,5)*0.05}><article className="card flex h-full flex-col p-6 transition hover:-translate-y-1 hover:shadow-xl">
      <span className={`w-fit rounded-lg bg-gradient-to-r ${t.accent} px-2.5 py-1 text-xs font-semibold text-white`}>{t.category}</span>
      <h3 className="mt-4 font-semibold">{t.name}</h3><p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500">{t.description}</p>
      <p className="mt-4 text-xs text-slate-400">Trigger: {t.trigger} · {t.runs} sample runs</p>
      <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400"><Clock size={13}/> Saves {t.timeSaved}</p>
      <div className="mt-5 flex gap-2"><button className="btn-primary flex-1 justify-center !py-2 !text-xs" onClick={()=>use(t)}><Play size={13}/> Use template</button>
      <button className="btn-ghost !py-2 !text-xs" onClick={()=>setSelected(t)}>Preview</button></div></article></Reveal>)}</div>}
    <AnimatePresence>{selected && <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[90] grid place-items-center bg-black/60 p-4" onClick={()=>setSelected(null)}>
      <motion.div initial={{scale:.95, y:12}} animate={{scale:1, y:0}} exit={{scale:.95, y:12}} className="card max-h-[85vh] w-full max-w-lg overflow-y-auto p-6" onClick={e=>e.stopPropagation()} role="dialog" aria-modal="true" aria-label={selected.name}>
        <div className="flex items-start justify-between"><h3 className="text-lg font-bold">{selected.name}</h3><button onClick={()=>setSelected(null)} className="btn-ghost !p-2" aria-label="Close preview"><X size={16}/></button></div>
        <p className="mt-2 text-sm text-slate-500">{selected.description}</p>
        <h4 className="mt-5 text-sm font-semibold">Workflow steps</h4>
        <ol className="mt-3 space-y-2">{[selected.trigger, ...selected.steps].map((s,i)=><li key={i} className="flex items-center gap-3 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm dark:border-white/10"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-violet-500/15 text-xs font-bold text-violet-500">{i+1}</span>{s}</li>)}</ol>
        <button className="btn-primary mt-6 w-full justify-center" onClick={()=>use(selected)}>Load into builder <ArrowRight size={15}/></button>
      </motion.div></motion.div>}</AnimatePresence>
  </div>
}
