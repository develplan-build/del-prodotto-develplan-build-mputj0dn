import { useMemo, useState } from 'react'

type User = { id: number; name: string; email: string; role: string; team: string; status: string; lastLogin: string }
type Integration = { key: string; label: string; status: string; detail: string }

export function UsersPage({ users, integrations, setNotice }: { users: User[]; integrations: Integration[]; setNotice: (value: string) => void }) {
  const [query, setQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const [invite, setInvite] = useState({ name: '', email: '', role: 'Viewer' })
  const [localUsers, setLocalUsers] = useState(users)

  const filteredUsers = useMemo(() => {
    return localUsers.filter((user) => {
      const matchesQuery = `${user.name} ${user.email} ${user.team}`.toLowerCase().includes(query.toLowerCase())
      const matchesRole = roleFilter === 'All' || user.role === roleFilter
      return matchesQuery && matchesRole
    })
  }, [localUsers, query, roleFilter])

  const submitInvite = (event: React.FormEvent) => {
    event.preventDefault()
    if (!invite.name || !invite.email) {
      setNotice('Compila nome ed email per invitare un nuovo utente.')
      return
    }
    const next = {
      id: localUsers.length + 1,
      name: invite.name,
      email: invite.email,
      role: invite.role,
      team: 'New Team',
      status: 'Pending',
      lastLogin: 'Invito inviato ora'
    }
    setLocalUsers([next, ...localUsers])
    setInvite({ name: '', email: '', role: 'Viewer' })
    setNotice(`Invito creato per ${next.name}. Email inoltrata tramite Google OAuth / access setup.`)
  }

  const suspendUser = (id: number) => {
    setLocalUsers(localUsers.map((user) => user.id === id ? { ...user, status: user.status === 'Suspended' ? 'Active' : 'Suspended' } : user))
    setNotice('Stato utente aggiornato correttamente.')
  }

  return (
    <div className="page-grid">
      <section className="panel-card span-2">
        <div className="card-title-row">
          <h3>Directory utenti e ruoli</h3>
          <div className="inline-actions">
            <input placeholder="Cerca utenti..." value={query} onChange={(e) => setQuery(e.target.value)} />
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
              <option>All</option>
              <option>Admin</option>
              <option>Builder</option>
              <option>Manager</option>
              <option>Viewer</option>
            </select>
          </div>
        </div>
        <table className="data-table">
          <thead>
            <tr><th>Nome</th><th>Email</th><th>Ruolo</th><th>Team</th><th>Stato</th><th>Ultimo accesso</th><th>Azione</th></tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.team}</td>
                <td><span className={`status-badge ${user.status.toLowerCase()}`}>{user.status}</span></td>
                <td>{user.lastLogin}</td>
                <td><button className="table-action" onClick={() => suspendUser(user.id)}>{user.status === 'Suspended' ? 'Riattiva' : 'Sospendi'}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="panel-card">
        <div className="card-title-row"><h3>Invita nuovo membro</h3></div>
        <form className="stack-form" onSubmit={submitInvite}>
          <label>Nome<input value={invite.name} onChange={(e) => setInvite({ ...invite, name: e.target.value })} /></label>
          <label>Email<input type="email" value={invite.email} onChange={(e) => setInvite({ ...invite, email: e.target.value })} /></label>
          <label>Ruolo<select value={invite.role} onChange={(e) => setInvite({ ...invite, role: e.target.value })}><option>Viewer</option><option>Builder</option><option>Manager</option><option>Admin</option></select></label>
          <button className="button primary" type="submit">Invia invito</button>
        </form>
      </section>

      <section className="panel-card">
        <div className="card-title-row"><h3>Access providers</h3></div>
        <div className="integration-list">
          {integrations.filter((item) => item.key.includes('oauth') || item.key === 'supabase').map((item) => (
            <div key={item.key} className="integration-card">
              <strong>{item.label}</strong>
              <span className={`status-badge ${item.status.toLowerCase()}`}>{item.status}</span>
              <p>{item.detail}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
