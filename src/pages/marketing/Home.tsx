import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Play, Zap, BarChart3, Blocks, ShieldCheck, ChevronDown, Check, Sparkles, Clock, TrendingUp } from 'lucide-react'
import { Reveal, Counter, Badge, DemoNote } from '../../components/common/ui'
import { templates, integrations } from '../../data/mock'

const features = [
  { icon: Zap, title:'Visual Workflow Builder', text:'Drag, connect and configure automation steps on an infinite canvas — no code required.' },
  { icon: Play, title:'Simulated Execution', text:'Run workflows safely in demo mode and watch every step succeed or fail in real time.' },
  { icon: BarChart3, title:'Live Analytics', text:'Execution volume, success rates and per-workflow performance in one clear view.' },
  { icon: Blocks, title:'Integration Directory', text:'Gmail, Slack, Sheets, GitHub and more — clearly-labelled demo connections.' },
  { icon: ShieldCheck, title:'Transparent by Design', text:'Sample data is always marked as sample data. No fake claims, no hidden simulations.' },
  { icon: Clock, title:'Templates That Save Time', text:'Start from proven onboarding, finance and support automations in one click.' },
]
const faqs = [
  ['Is FlowPilot executing real automations?', 'No. This is an interactive product demonstration. Workflow runs are simulated in your browser and clearly labelled — nothing is sent to external services.'],
  ['Where is my workflow data stored?', 'Workflow definitions, settings and simulated execution history are stored only in your browser\'s local storage. Clearing site data removes them.'],
  ['Do I need an account or payment?', 'No. The demo is fully client-side. Pricing figures are illustrative and no payment processing exists.'],
  ['Can I use a template?', 'Yes — open Templates, choose one, and it loads directly into the visual builder where you can edit, save and simulate it.'],
]

function MiniFlow() {
  const steps = ['New signup','Validate info','Welcome email','Add to CRM','Notify sales']
  const [run, setRun] = useState(-1)
  const start = () => { setRun(0); steps.forEach((_,i)=> setTimeout(()=>setRun(i+1), 500*(i+1))) }
  return <div className="card relative overflow-hidden p-5 shadow-2xl">
    <div className="mb-4 flex items-center justify-between"><span className="text-sm font-semibold">Customer Onboarding — live preview</span>
      <button onClick={start} className="btn-primary !px-3 !py-1.5 !text-xs"><Play size={13}/> Run simulation</button></div>
    <div className="flex flex-col items-stretch gap-0 sm:flex-row sm:items-center">
      {steps.map((s,i)=>(<div key={s} className="flex flex-1 flex-col items-center sm:flex-row">
        <motion.div animate={run>i ? {scale:[1,1.06,1]} : {}} className={`w-full rounded-xl border px-3 py-3 text-center text-xs font-medium transition-all duration-500 ${run>i ? 'border-emerald-400/50 bg-emerald-400/10 text-emerald-600 dark:text-emerald-300' : run===i ? 'border-violet-400 bg-violet-500/10' : 'border-slate-200 dark:border-white/10'}`}>{s}{run>i && <Check size={13} className="mx-auto mt-1"/>}</motion.div>
        {i<steps.length-1 && <div className={`mx-auto h-5 w-0.5 sm:h-0.5 sm:w-5 sm:flex-1 ${run>i ? 'bg-emerald-400' : 'bg-slate-300 dark:bg-white/15'}`}/>}
      </div>))}
    </div>
    <p className="mt-4 text-xs text-slate-400">{run>=steps.length ? '✓ Simulated execution complete — no real emails were sent.' : 'Interactive preview — press Run simulation.'}</p>
  </div>
}

export default function Home() {
  const [faq, setFaq] = useState(0)
  return <div>
    <section className="relative overflow-hidden">
      <div className="hero-grid absolute inset-0" aria-hidden />
      <motion.div aria-hidden className="absolute -top-32 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-violet-600/20 blur-3xl" animate={{opacity:[.6,1,.6]}} transition={{duration:8, repeat:Infinity}} />
      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-20 text-center sm:px-6">
        <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}><Badge><Sparkles size={12}/> Interactive demo · Sample data clearly labelled</Badge></motion.div>
        <motion.h1 initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.08}} className="mx-auto mt-6 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl">Automate the Work.<br/><span className="text-gradient">Accelerate the Future.</span></motion.h1>
        <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.16}} className="mx-auto mt-5 max-w-2xl text-lg text-slate-500 dark:text-slate-400">FlowPilot helps teams design, run and optimise repetitive processes with a visual builder, ready-made templates and clear analytics.</motion.p>
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.24}} className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/app/builder" className="btn-primary !px-6 !py-3">Build a workflow <ArrowRight size={16}/></Link>
          <Link to="/templates" className="btn-ghost !px-6 !py-3">Browse templates</Link>
        </motion.div>
        <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:.35}} className="mx-auto mt-12 max-w-4xl text-left"><MiniFlow /></motion.div>
        <div className="mx-auto mt-12 grid max-w-3xl grid-cols-3 gap-4">
          {[['Sample executions shown', 8563, ''],['Illustrative success rate', 97, '%'],['Example templates', 6, '']].map(([l,v,s]:any)=>(
            <div key={l}><p className="text-2xl font-bold sm:text-3xl"><Counter to={v} suffix={s}/></p><p className="mt-1 text-xs text-slate-400 sm:text-sm">{l}</p></div>))}
        </div>
      </div>
    </section>

    <section className="border-y border-slate-200 py-8 dark:border-white/10"><div className="mx-auto max-w-7xl px-4 sm:px-6">
      <p className="text-center text-xs font-semibold uppercase tracking-widest text-slate-400">Illustrative placeholder — not real customers</p>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-lg font-bold text-slate-400/70">{['Northwind*','Acme Co*','Globex*','Initech*','Umbrella*'].map(n=><span key={n}>{n}</span>)}</div>
      <p className="mt-3 text-center text-xs text-slate-400">* Fictional names shown for layout demonstration only.</p></div>
    </section>

    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6"><Reveal className="text-center"><Badge>Features</Badge><h2 className="mt-4 text-3xl font-bold sm:text-4xl">Everything a busy team needs</h2></Reveal>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{features.map((f,i)=><Reveal key={f.title} delay={i*0.06}><div className="card group h-full p-6 transition duration-300 hover:-translate-y-1 hover:border-violet-400/40 hover:shadow-xl">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-violet-500/10 text-violet-500 transition group-hover:scale-110"><f.icon size={20}/></span>
        <h3 className="mt-4 font-semibold">{f.title}</h3><p className="mt-2 text-sm leading-relaxed text-slate-500">{f.text}</p></div></Reveal>)}</div>
    </section>

    <section className="border-y border-slate-200 bg-slate-100/60 py-20 dark:border-white/10 dark:bg-white/[.02]"><div className="mx-auto max-w-7xl px-4 sm:px-6">
      <Reveal className="text-center"><Badge>How it works</Badge><h2 className="mt-4 text-3xl font-bold">From trigger to done in three steps</h2></Reveal>
      <div className="mt-10 grid gap-5 md:grid-cols-3">{[['1','Pick a trigger','Choose what starts the workflow — a signup, a form, a schedule, or a webhook (simulated).'],['2','Build visually','Drag steps onto the canvas, connect them, and configure each action in the inspector.'],['3','Run & measure','Simulate execution, inspect every step, then track performance in Analytics.']].map(([n,t,d],i)=>(
        <Reveal key={n} delay={i*.08}><div className="card h-full p-6"><span className="text-gradient text-4xl font-bold">{n}</span><h3 className="mt-3 font-semibold">{t}</h3><p className="mt-2 text-sm text-slate-500">{d}</p></div></Reveal>))}</div></div>
    </section>

    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6"><Reveal><div className="flex flex-wrap items-end justify-between gap-4"><div><Badge>Templates</Badge><h2 className="mt-4 text-3xl font-bold">Start from a proven template</h2></div><Link to="/templates" className="btn-ghost">View all <ArrowRight size={15}/></Link></div></Reveal>
      <div className="mt-8 grid gap-5 md:grid-cols-3">{templates.slice(0,3).map((t,i)=><Reveal key={t.id} delay={i*.06}><div className="card h-full p-6">
        <span className={`inline-block rounded-lg bg-gradient-to-r ${t.accent} px-2.5 py-1 text-xs font-semibold text-white`}>{t.category}</span>
        <h3 className="mt-4 font-semibold">{t.name}</h3><p className="mt-2 text-sm text-slate-500">{t.description}</p>
        <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-400"><TrendingUp size={13}/> Saves {t.timeSaved}</p></div></Reveal>)}</div>
    </section>

    <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6"><Reveal className="card p-8"><h2 className="text-xl font-bold">Connects with your stack <span className="text-sm font-normal text-slate-400">(demo directory)</span></h2>
      <div className="mt-6 flex flex-wrap gap-3">{integrations.map(x=><span key={x.id} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium dark:border-white/10">{x.icon} {x.name}</span>)}</div>
      <DemoNote>Integration cards are visual demonstrations. “Connecting” an app in this demo only changes its local demo state — no OAuth or external API calls occur.</DemoNote></Reveal>
    </section>

    <section className="mx-auto max-w-4xl px-4 pb-20 sm:px-6"><Reveal className="text-center"><Badge>FAQ</Badge><h2 className="mt-4 text-3xl font-bold">Honest answers</h2></Reveal>
      <div className="mt-8 space-y-3">{faqs.map(([q,a],i)=><div key={q} className="card overflow-hidden">
        <button className="flex w-full items-center justify-between px-5 py-4 text-left font-medium" onClick={()=>setFaq(faq===i?-1:i)} aria-expanded={faq===i}>{q}<ChevronDown className={`shrink-0 transition ${faq===i?'rotate-180':''}`} size={17}/></button>
        {faq===i && <motion.p initial={{opacity:0}} animate={{opacity:1}} className="px-5 pb-5 text-sm leading-relaxed text-slate-500">{a}</motion.p>}</div>)}</div>
    </section>

    <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6"><Reveal><div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-700 via-indigo-600 to-cyan-600 px-6 py-14 text-center text-white">
      <h2 className="text-3xl font-bold">Ready to pilot your workflows?</h2><p className="mx-auto mt-3 max-w-xl text-white/85">Open the builder and run your first simulated automation in under a minute.</p>
      <Link to="/app" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-violet-700 transition hover:scale-[1.02]">Launch the app <ArrowRight size={16}/></Link></div></Reveal>
    </section>
  </div>
}
