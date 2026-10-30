import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Zap, MousePointerClick, BarChart3, LayoutTemplate, Blocks, History, Settings2, ShieldCheck, Send } from 'lucide-react'
import { Reveal, Badge, DemoNote } from '../../components/common/ui'
import TemplateLibrary from '../../components/marketing/TemplateLibrary'
import { useToast } from '../../components/common/Toast'

function Head({ badge, title, sub }: { badge: string; title: string; sub: string }) {
  return <div className="mx-auto max-w-7xl px-4 pt-16 sm:px-6"><Reveal className="max-w-2xl"><Badge>{badge}</Badge><h1 className="mt-4 text-4xl font-bold tracking-tight">{title}</h1><p className="mt-3 text-lg text-slate-500">{sub}</p></Reveal></div>
}

export function Features() {
  const items = [
    [MousePointerClick,'Visual Workflow Builder','Drag-and-drop canvas powered by React Flow with zoom, pan, connection validation and a live inspector.'],
    [Zap,'Simulated Execution Engine','Step-by-step simulated runs with per-node status, progress and honest success/failure reporting.'],
    [LayoutTemplate,'Template Library','Six production-style templates across CRM, marketing, finance, support, HR and e-commerce.'],
    [BarChart3,'Analytics','Volume, success and failure trends with range filters — every number derives from the same dataset.'],
    [History,'Execution History','Searchable, filterable audit-style log of simulated runs, persisted in your browser.'],
    [Blocks,'Integration Directory','Eight example integrations with clear demo states. No false “connected” claims.'],
    [Settings2,'Persistent Settings','Profile, notifications and workspace preferences saved to local storage.'],
    [ShieldCheck,'Accessibility & Motion','Semantic markup, focus states, keyboard support and prefers-reduced-motion respect.'],
  ] as const
  return <div className="pb-20"><Head badge="Features" title="A complete automation workspace" sub="Every capability below is implemented and interactive in this demo — open the app and try it."/>
    <div className="mx-auto mt-12 grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-2">{items.map(([Icon,t,d],i)=><Reveal key={t} delay={(i%2)*.06}><div className="card h-full p-6 transition hover:-translate-y-0.5 hover:shadow-lg"><Icon className="text-violet-500" size={24}/><h2 className="mt-4 font-semibold">{t}</h2><p className="mt-2 text-sm leading-relaxed text-slate-500">{d}</p></div></Reveal>)}</div>
    <div className="mx-auto mt-10 max-w-7xl px-4 sm:px-6"><Link to="/app" className="btn-primary">Open the live app</Link></div></div>
}

export function TemplatesPage() {
  return <div className="pb-20"><Head badge="Templates" title="Automation templates" sub="Preview any template, then load it straight into the visual builder. Time-saved figures are illustrative."/>
    <div className="mx-auto mt-10 max-w-7xl px-4 sm:px-6"><TemplateLibrary /></div></div>
}

const plans = [
  { name:'Starter', price:0, tag:'For trying things out', feats:['3 sample workflows','Visual builder','Simulated runs','Community templates'] },
  { name:'Professional', price:29, tag:'For growing teams', popular:true, feats:['Unlimited sample workflows','Advanced analytics','All templates','Priority demo support'] },
  { name:'Enterprise', price:99, tag:'For large organisations', feats:['Everything in Professional','SSO (illustrative)','Audit history','Dedicated demo manager'] },
]
export function Pricing() {
  const [yearly, setYearly] = useState(true); const toast = useToast()
  return <div className="pb-20"><Head badge="Pricing" title="Illustrative pricing" sub="These plans demonstrate the pricing experience. No payment is processed and no checkout exists."/>
    <div className="mx-auto mt-8 flex max-w-7xl items-center gap-3 px-4 sm:px-6"><span className={!yearly?'font-semibold':''}>Monthly</span>
      <button role="switch" aria-checked={yearly} onClick={()=>setYearly(y=>!y)} className={`h-6 w-11 rounded-full p-0.5 transition ${yearly?'bg-violet-600':'bg-slate-300'}`}><span className={`block h-5 w-5 rounded-full bg-white transition ${yearly?'translate-x-5':''}`}/></button>
      <span className={yearly?'font-semibold':''}>Yearly <span className="text-xs text-emerald-500">−20% illustrative</span></span></div>
    <div className="mx-auto mt-8 grid max-w-7xl gap-5 px-4 sm:px-6 lg:grid-cols-3">{plans.map((p,i)=><Reveal key={p.name} delay={i*.07}>
      <div className={`card relative h-full p-7 ${p.popular?'border-violet-500/50 shadow-xl shadow-violet-600/10':''}`}>{p.popular && <span className="absolute -top-3 left-6 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-3 py-1 text-xs font-bold text-white">Most popular</span>}
      <h2 className="font-semibold">{p.name}</h2><p className="mt-1 text-sm text-slate-500">{p.tag}</p>
      <p className="mt-5"><span className="text-4xl font-bold">${yearly ? Math.round(p.price*0.8) : p.price}</span><span className="text-slate-400"> / mo</span></p>
      <ul className="mt-6 space-y-2.5 text-sm">{p.feats.map(f=><li key={f} className="flex gap-2"><Check size={16} className="mt-0.5 shrink-0 text-emerald-500"/>{f}</li>)}</ul>
      <button className={p.popular?'btn-primary mt-7 w-full justify-center':'btn-ghost mt-7 w-full justify-center'} onClick={()=>toast(`“${p.name}” is an illustrative plan — checkout is disabled in demo mode.`,'info')}>Choose {p.name} (demo)</button></div></Reveal>)}</div>
    <div className="mx-auto mt-8 max-w-7xl px-4 sm:px-6"><DemoNote>Prices are placeholders for demonstration. Buttons explain demo mode instead of opening a fake checkout.</DemoNote></div></div>
}

export function About() {
  return <div className="pb-20"><Head badge="About" title="Built for teams drowning in busywork" sub="FlowPilot exists to turn repetitive, error-prone processes into calm, visible, measurable systems."/>
    <div className="mx-auto mt-12 grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-3">{[['Our mission','Give every operations, marketing and support team the leverage of an automation engineer — without needing one.'],['Our approach','Visual first, honest always. Sample data is labelled, simulations are called simulations, and the interface never pretends.'],['Where we are','This experience is a fully client-side product demonstration, built to production front-end standards and ready to connect to a real API later.']].map(([t,d],i)=><Reveal key={t} delay={i*.06}><div className="card h-full p-6"><h2 className="font-semibold">{t}</h2><p className="mt-2 text-sm leading-relaxed text-slate-500">{d}</p></div></Reveal>)}</div></div>
}

export function Contact() {
  const [form, setForm] = useState({name:'', email:'', message:''}); const [errors, setErrors] = useState<Record<string,string>>({}); const [sent, setSent] = useState(false)
  const submit = (e: React.FormEvent) => { e.preventDefault(); const er: Record<string,string> = {}
    if (form.name.trim().length < 2) er.name = 'Please enter your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) er.email = 'Please enter a valid email address.'
    if (form.message.trim().length < 10) er.message = 'Please write at least 10 characters.'
    setErrors(er); if (Object.keys(er).length===0) setSent(true) }
  const field = (k: keyof typeof form) => ({ value: form[k], onChange: (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => setForm(f=>({...f,[k]:e.target.value})), 'aria-invalid': !!errors[k] })
  return <div className="pb-20"><Head badge="Contact" title="Talk to the FlowPilot team" sub="This form validates locally and confirms in demo mode — messages are not sent to a server."/>
    <div className="mx-auto mt-10 max-w-2xl px-4 sm:px-6"><Reveal><div className="card p-7">
      {sent ? <div className="py-8 text-center"><span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-500/15 text-emerald-500"><Check size={26}/></span>
        <h2 className="mt-4 text-xl font-bold">Demo submission received</h2><p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">Thanks, {form.name.split(' ')[0]}. In this demo nothing was transmitted — connect a form endpoint to make this live.</p>
        <button className="btn-ghost mt-6" onClick={()=>{setSent(false); setForm({name:'',email:'',message:''})}}>Send another</button></div>
      : <form onSubmit={submit} noValidate className="space-y-5">
        <div><label className="label" htmlFor="c-name">Name</label><input id="c-name" className="input" {...field('name')}/>{errors.name && <p className="mt-1 text-sm text-rose-500" role="alert">{errors.name}</p>}</div>
        <div><label className="label" htmlFor="c-email">Email</label><input id="c-email" type="email" className="input" {...field('email')}/>{errors.email && <p className="mt-1 text-sm text-rose-500" role="alert">{errors.email}</p>}</div>
        <div><label className="label" htmlFor="c-msg">Message</label><textarea id="c-msg" rows={5} className="input" {...field('message')}/>{errors.message && <p className="mt-1 text-sm text-rose-500" role="alert">{errors.message}</p>}</div>
        <button className="btn-primary w-full justify-center !py-3"><Send size={15}/> Submit (demo mode)</button></form>}
    </div></Reveal></div></div>
}
