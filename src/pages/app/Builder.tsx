import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ReactFlow, Background, Controls, MiniMap, addEdge, useNodesState, useEdgesState, Handle, Position, type Connection, type Node, type Edge } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { Play, Save, Trash2, Plus, Zap, Cog, GitBranch, Flag, RotateCcw, CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { KEYS, load, save } from '../../utils/store'
import { defaultFlow } from '../../features/workflows/templateFlow'
import type { FlowNodeData, NodeKind, Execution } from '../../types'
import { useToast } from '../../components/common/Toast'
import { DemoNote } from '../../components/common/ui'

type FlowNode = Node<FlowNodeData>
const kindStyle: Record<NodeKind, string> = {
  trigger: 'border-violet-400/70 bg-violet-500/10', action: 'border-cyan-400/50 bg-cyan-400/[.07]',
  condition: 'border-amber-400/60 bg-amber-400/10', end: 'border-emerald-400/60 bg-emerald-400/10',
}
const kindIcon = { trigger: Zap, action: Cog, condition: GitBranch, end: Flag }

function FlowNodeView({ data, selected }: { data: FlowNodeData; selected?: boolean }) {
  const Icon = kindIcon[data.kind]
  return <div className={`w-48 rounded-2xl border-2 px-3.5 py-3 shadow-lg backdrop-blur transition ${kindStyle[data.kind]} ${selected ? 'ring-2 ring-violet-400 ring-offset-2 ring-offset-transparent' : ''} bg-white dark:bg-[#0e1526]`}>
    <Handle type="target" position={Position.Left} className="!h-3 !w-3 !bg-violet-400" />
    <div className="flex items-center gap-2"><Icon size={15} className="shrink-0 text-violet-500" />
      <span className="truncate text-[13px] font-semibold text-slate-800 dark:text-slate-100">{data.label}</span>
      {data.status === 'running' && <Loader2 size={14} className="ml-auto shrink-0 animate-spin text-cyan-500" />}
      {data.status === 'success' && <CheckCircle2 size={14} className="ml-auto shrink-0 text-emerald-500" />}
      {data.status === 'failed' && <XCircle size={14} className="ml-auto shrink-0 text-rose-500" />}</div>
    <p className="mt-1 truncate text-[11px] capitalize text-slate-500">{data.status === 'running' ? 'Running (simulated)…' : data.description || data.kind}</p>
    <Handle type="source" position={Position.Right} className="!h-3 !w-3 !bg-cyan-400" />
  </div>
}
const nodeTypes = { flowNode: FlowNodeView }

export default function Builder() {
  const toast = useToast()
  const initial = useMemo(() => load(KEYS.workflow, defaultFlow()), [])
  const [nodes, setNodes, onNodesChange] = useNodesState<FlowNode>(initial.nodes as FlowNode[])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initial.edges)
  const [name, setName] = useState(() => load(KEYS.builderName, 'Customer Onboarding'))
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [running, setRunning] = useState(false); const [failStep, setFailStep] = useState(false); const [log, setLog] = useState<string[]>([])
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  useEffect(() => () => timers.current.forEach(clearTimeout), [])
  const selected = nodes.find(n => n.id === selectedId) || null

  const onConnect = useCallback((c: Connection) => { setEdges(eds => addEdge({ ...c, animated: true }, eds)); toast('Nodes connected') }, [setEdges, toast])
  const addNode = (kind: NodeKind) => {
    const id = `n${Date.now()}`
    setNodes(nds => [...nds, { id, type: 'flowNode', position: { x: 120 + Math.random()*260, y: 100 + Math.random()*220 }, data: { label: kind === 'trigger' ? 'New trigger' : kind === 'end' ? 'Complete' : kind === 'condition' ? 'Check condition' : 'New action step', kind, description: 'Simulated step', status: 'idle' } }])
    setSelectedId(id); toast(`${kind} node added — drag to position, connect with the handles`)
  }
  const updateSelected = (patch: Partial<FlowNodeData>) => setNodes(nds => nds.map(n => n.id === selectedId ? { ...n, data: { ...n.data, ...patch } } : n))
  const deleteSelected = () => { if (!selected) return; setNodes(nds => nds.filter(n => n.id !== selected.id)); setEdges(eds => eds.filter(e => e.source !== selected.id && e.target !== selected.id)); setSelectedId(null); toast('Node deleted', 'info') }
  const persist = () => { save(KEYS.workflow, { nodes, edges }); save(KEYS.builderName, name); toast('Workflow saved locally in your browser') }
  const reset = () => { const f = defaultFlow(); setNodes(f.nodes as FlowNode[]); setEdges(f.edges); setLog([]); setSelectedId(null); save(KEYS.workflow, f); toast('Builder reset to the example workflow', 'info') }

  const run = () => {
    if (running || nodes.length === 0) return
    setRunning(true); setLog(['▶ Simulation started — no external services are contacted.'])
    setNodes(nds => nds.map(n => ({ ...n, data: { ...n.data, status: 'idle' as const } })))
    // Execute in connection order starting from a trigger, falling back to canvas order.
    const order: FlowNode[] = []; const byId = new Map(nodes.map(n => [n.id, n])); const seen = new Set<string>()
    let cur: FlowNode | undefined = nodes.find(n => n.data.kind === 'trigger') || nodes[0]
    while (cur && !seen.has(cur.id)) { seen.add(cur.id); order.push(cur); const e = edges.find(x => x.source === cur!.id); cur = e ? byId.get(e.target) : undefined }
    nodes.forEach(n => { if (!seen.has(n.id)) order.push(n) })
    const failIndex = failStep ? Math.min(2, order.length - 1) : -1
    order.forEach((node, i) => {
      timers.current.push(setTimeout(() => {
        if (failIndex !== -1 && i > failIndex) { setNodes(nds => nds.map(n => n.id === node.id ? { ...n, data: { ...n.data, status: 'failed' as const } } : n)); return }
        setNodes(nds => nds.map(n => n.id === node.id ? { ...n, data: { ...n.data, status: 'running' as const } } : n))
      }, i * 750))
      timers.current.push(setTimeout(() => {
        const failed = i === failIndex
        setNodes(nds => nds.map(n => n.id === node.id ? { ...n, data: { ...n.data, status: failed ? 'failed' as const : 'success' as const } } : n))
        setLog(l => [...l, failed ? `✗ ${node.data.label} — simulated failure` : `✓ ${node.data.label} — simulated success`])
        if (i === order.length - 1) {
          setRunning(false)
          const exec: Execution = { id: `EXE-${Math.floor(8000 + Math.random()*1999)}`, workflow: name, status: failIndex === -1 ? 'success' : 'failed', started: 'Just now', duration: `${(order.length * 0.7).toFixed(1)}s`, steps: order.length }
          save(KEYS.executions, [exec, ...load<Execution[]>(KEYS.executions, [])].slice(0, 30))
          toast(failIndex === -1 ? 'Simulated run completed — see History' : 'Simulated run finished with a failed step', failIndex === -1 ? 'success' : 'error')
          setLog(l => [...l, failIndex === -1 ? '✓ Simulation complete.' : '✗ Simulation ended with failures.'])
        }
      }, i * 750 + 600))
    })
  }

  return <div>
    <div className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-2xl font-bold sm:text-3xl">Workflow Builder</h1>
      <p className="mt-1 text-sm text-slate-500">Drag nodes, connect handles, edit in the inspector, then run a simulation.</p></div>
      <div className="flex flex-wrap gap-2"><button className="btn-ghost !text-xs" onClick={reset}><RotateCcw size={14}/> Reset example</button>
      <button className="btn-ghost !text-xs" onClick={persist}><Save size={14}/> Save workflow</button>
      <button className="btn-primary !text-xs" onClick={run} disabled={running}>{running ? <Loader2 size={14} className="animate-spin"/> : <Play size={14}/>} {running ? 'Running…' : 'Run simulation'}</button></div></div>

    <label className="mt-5 block max-w-md"><span className="label">Workflow name</span><input className="input" value={name} onChange={e=>setName(e.target.value)} aria-label="Workflow name"/></label>

    <div className="mt-4 flex flex-wrap items-center gap-2" role="group" aria-label="Add node">
      <span className="text-sm font-medium">Add node:</span>
      {([['trigger','Trigger',Zap],['action','Action',Cog],['condition','Condition',GitBranch],['end','End',Flag]] as const).map(([k,l,Icon])=>(
        <button key={k} onClick={()=>addNode(k)} className="btn-ghost !py-2 !text-xs"><Icon size={13}/> {l}</button>))}
      <label className="ml-auto flex cursor-pointer items-center gap-2 text-sm"><input type="checkbox" checked={failStep} onChange={e=>setFailStep(e.target.checked)} className="h-4 w-4 accent-rose-500"/> Simulate a failure at step 3</label>
    </div>

    <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_300px]">
      <div className="card h-[62vh] min-h-[420px] overflow-hidden" aria-label="Workflow canvas">
        <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect}
          onNodeClick={(_, n) => setSelectedId(n.id)} onPaneClick={() => setSelectedId(null)} nodeTypes={nodeTypes} fitView deleteKeyCode={['Backspace','Delete']} proOptions={{ hideAttribution: true }}>
          <Background gap={20} size={1} /><Controls /><MiniMap className="!hidden sm:!block" pannable zoomable />
        </ReactFlow>
      </div>
      <aside className="space-y-4">
        <section className="card p-5" aria-label="Node inspector"><h2 className="flex items-center gap-2 font-semibold"><Plus size={16}/> Node inspector</h2>
          {selected ? <div className="mt-4 space-y-4">
            <div><label className="label" htmlFor="n-label">Label</label><input id="n-label" className="input" value={selected.data.label} onChange={e=>updateSelected({label:e.target.value})}/></div>
            <div><label className="label" htmlFor="n-desc">Description</label><input id="n-desc" className="input" value={selected.data.description || ''} onChange={e=>updateSelected({description:e.target.value})}/></div>
            <div><label className="label" htmlFor="n-kind">Type</label><select id="n-kind" className="input" value={selected.data.kind} onChange={e=>updateSelected({kind:e.target.value as NodeKind})}>
              <option value="trigger">Trigger</option><option value="action">Action</option><option value="condition">Condition</option><option value="end">End</option></select></div>
            <button className="w-full rounded-xl bg-rose-600/10 px-4 py-2.5 text-sm font-semibold text-rose-500 transition hover:bg-rose-600/20" onClick={deleteSelected}><Trash2 size={14} className="mr-1 inline"/> Delete node</button>
          </div> : <p className="mt-3 text-sm leading-relaxed text-slate-500">Select any node to edit its label, description and type. Drag from a node's right handle to another's left handle to connect them. Press Delete to remove a selected node or edge.</p>}
        </section>
        <section className="card p-5" aria-label="Execution log" aria-live="polite"><h2 className="font-semibold">Execution log</h2>
          {log.length===0 ? <p className="mt-2 text-sm text-slate-500">No runs yet. Press “Run simulation”.</p> :
          <ul className="mt-3 max-h-56 space-y-1.5 overflow-y-auto text-[13px]">{log.map((l,i)=><li key={i} className={l.startsWith('✗')?'text-rose-500':l.startsWith('✓')?'text-emerald-500':''}>{l}</li>)}</ul>}
        </section>
      </aside>
    </div>
    <div className="mt-4"><DemoNote>Execution is simulated entirely in your browser. “Send email”, “CRM” and similar steps never contact external services.</DemoNote></div>
  </div>
}
