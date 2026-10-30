import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X, Sun, Moon, ArrowRight } from 'lucide-react'
import { Logo } from '../common/ui'

const links = [['/','Home'],['/features','Features'],['/templates','Templates'],['/pricing','Pricing'],['/about','About'],['/contact','Contact']] as const

export default function MarketingLayout({ theme, toggleTheme }: { theme: string; toggleTheme: () => void }) {
  const [open, setOpen] = useState(false); const loc = useLocation()
  useEffect(() => { setOpen(false); window.scrollTo({ top: 0 }) }, [loc.pathname])
  return <div className="min-h-screen">
    <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:px-4 focus:py-2 dark:focus:bg-slate-900">Skip to content</a>
    <header className="glass sticky top-0 z-40 border-b border-slate-200/70 dark:border-white/10">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6" aria-label="Main">
        <Link to="/" aria-label="FlowPilot home"><Logo /></Link>
        <div className="hidden items-center gap-1 lg:flex">
          {links.map(([to, label]) => <NavLink key={to} to={to} className={({isActive}) => `rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-slate-100 dark:hover:bg-white/5 ${isActive ? 'text-violet-600 dark:text-violet-300' : 'text-slate-600 dark:text-slate-300'}`}>{label}</NavLink>)}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className="btn-ghost !p-2.5" aria-label="Toggle theme">{theme==='dark' ? <Sun size={17}/> : <Moon size={17}/>}</button>
          <Link to="/app" className="btn-ghost hidden !py-2 sm:inline-flex">Sign in</Link>
          <Link to="/app" className="btn-primary hidden !py-2 sm:inline-flex">Launch app <ArrowRight size={15}/></Link>
          <button className="btn-ghost !p-2.5 lg:hidden" onClick={() => setOpen(o=>!o)} aria-expanded={open} aria-label="Toggle menu">{open ? <X size={18}/> : <Menu size={18}/>}</button>
        </div>
      </nav>
      <AnimatePresence>{open && <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} className="overflow-hidden border-t border-slate-200 dark:border-white/10 lg:hidden">
        <div className="space-y-1 px-4 py-3">{links.map(([to,label]) => <NavLink key={to} to={to} className="block rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-slate-100 dark:hover:bg-white/5">{label}</NavLink>)}
        <Link to="/app" className="btn-primary mt-2 w-full justify-center">Launch app</Link></div>
      </motion.div>}</AnimatePresence>
    </header>
    <main id="main"><Outlet /></main>
    <footer className="border-t border-slate-200 dark:border-white/10">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div><Logo /><p className="mt-3 max-w-xs text-sm text-slate-500">Automate the Work. Accelerate the Future. An interactive product demonstration — all data is illustrative sample data.</p></div>
        {[['Product',['Features','Templates','Pricing','App Dashboard'],['/features','/templates','/pricing','/app']],['Company',['About','Contact'],['/about','/contact']],['Resources',['Help & Docs','Integrations','Workflow Builder'],['/app/settings','/app/integrations','/app/builder']]].map(([title, labels, hrefs]: any) => (
          <nav key={title} aria-label={title}><h3 className="mb-3 text-sm font-semibold">{title}</h3><ul className="space-y-2 text-sm text-slate-500">{(labels as string[]).map((l:string,i:number)=><li key={l}><Link className="hover:text-violet-500" to={(hrefs as string[])[i]}>{l}</Link></li>)}</ul></nav>
        ))}
      </div>
      <div className="border-t border-slate-200 py-5 text-center text-xs text-slate-500 dark:border-white/10">© 2026 FlowPilot Demo. Sample product — no real automations are executed against external services.</div>
    </footer>
  </div>
}
