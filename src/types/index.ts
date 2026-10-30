export type NodeKind = 'trigger' | 'action' | 'condition' | 'end'
export interface FlowNodeData { label: string; kind: NodeKind; description?: string; status?: 'idle'|'running'|'success'|'failed'; [k: string]: unknown }
export interface Template { id: string; name: string; description: string; category: string; trigger: string; steps: string[]; timeSaved: string; runs: string; accent: string }
export interface Execution { id: string; workflow: string; status: 'success'|'failed'|'running'; started: string; duration: string; steps: number }
export interface WorkflowItem { id: string; name: string; status: 'active'|'paused'|'draft'; runs: number; success: number; updated: string; trigger: string }
export interface Integration { id: string; name: string; category: string; description: string; icon: string; popular?: boolean }
