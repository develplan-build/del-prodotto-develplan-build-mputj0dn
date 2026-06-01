import { useMemo, useState } from 'react'

type Task = { id: string; title: string; owner: string; priority: string; due: string }
type Tasks = { backlog: Task[]; progress: Task[]; review: Task[]; done: Task[] } | null

export function KanbanPage({ tasks, setNotice }: { tasks: Tasks; setNotice: (value: string) => void }) {
  const [board, setBoard] = useState(tasks || { backlog: [], progress: [], review: [], done: [] })
  const [draft, setDraft] = useState({ title: '', owner: '', priority: 'Medium' })

  const columns = useMemo(() => [
    { key: 'backlog', label: 'Backlog' },
    { key: 'progress', label: 'In corso' },
    { key: 'review', label: 'Review' },
    { key: 'done', label: 'Done' }
  ] as const, [])

  const moveTask = (from: keyof typeof board, taskId: string) => {
    const sequence: Array<keyof typeof board> = ['backlog', 'progress', 'review', 'done']
    const index = sequence.indexOf(from)
    const next = sequence[index + 1] || 'done'
    const task = board[from].find((item) => item.id === taskId)
    if (!task) return
    setBoard({
      ...board,
      [from]: board[from].filter((item) => item.id !== taskId),
      [next]: [...board[next], task]
    })
    setNotice(`Task ${task.id} spostata in ${next}.`)
  }

  const submitTask = (event: React.FormEvent) => {
    event.preventDefault()
    if (!draft.title || !draft.owner) {
      setNotice('Inserisci titolo e owner per creare una nuova task.')
      return
    }
    const task = { id: `T-${Math.floor(Math.random() * 90 + 10)}`, title: draft.title, owner: draft.owner, priority: draft.priority, due: 'Nuova' }
    setBoard({ ...board, backlog: [task, ...board.backlog] })
    setDraft({ title: '', owner: '', priority: 'Medium' })
    setNotice(`Nuova task ${task.id} aggiunta al backlog.`)
  }

  return (
    <div className="page-grid">
      <section className="panel-card span-3">
        <div className="card-title-row"><h3>Delivery board</h3><button className="button secondary" onClick={() => setNotice('Board sincronizzata con notifiche Slack.')}>Sync Slack</button></div>
        <div className="kanban-grid">
          {columns.map((column) => (
            <div key={column.key} className="kanban-column">
              <div className="kanban-head"><strong>{column.label}</strong><span>{board[column.key].length}</span></div>
              <div className="kanban-stack">
                {board[column.key].map((task) => (
                  <article className="task-card" key={task.id}>
                    <span className="status-badge active">{task.priority}</span>
                    <h4>{task.title}</h4>
                    <p>{task.owner} · {task.due}</p>
                    {column.key !== 'done' && <button className="table-action" onClick={() => moveTask(column.key, task.id)}>Sposta avanti</button>}
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="panel-card">
        <div className="card-title-row"><h3>Crea task</h3></div>
        <form className="stack-form" onSubmit={submitTask}>
          <label>Titolo<input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></label>
          <label>Owner<input value={draft.owner} onChange={(e) => setDraft({ ...draft, owner: e.target.value })} /></label>
          <label>Priorità<select value={draft.priority} onChange={(e) => setDraft({ ...draft, priority: e.target.value })}><option>Low</option><option>Medium</option><option>High</option></select></label>
          <button className="button primary" type="submit">Aggiungi task</button>
        </form>
      </section>
    </div>
  )
}
