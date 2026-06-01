import { PieChart, Pie, Cell, ResponsiveContainer, CartesianGrid, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts'

type Analytics = {
  kpis: Array<{ id: string; label: string; value: string; trend: string; direction: string }>
  buildsByDay: Array<{ day: string; builds: number; deploys: number }>
  planDistribution: Array<{ name: string; value: number }>
  activity: Array<{ id: number; project: string; owner: string; status: string; time: string }>
}

export function DashboardPage({ data, setNotice }: { data: { analytics: Analytics | null; integrations: Array<{ key: string; label: string; status: string; detail: string }> }; setNotice: (value: string) => void }) {
  const analytics = data.analytics
  if (!analytics) return <div className="panel-card">Nessun dato analytics disponibile.</div>

  const colors = ['#a3e635', '#7dd3fc', '#c084fc']

  return (
    <div className="page-grid">
      <section className="kpi-grid">
        {analytics.kpis.map((item) => (
          <article key={item.id} className="kpi-card glass-card">
            <span>{item.label}</span>
            <strong>{item.value}</strong>
            <small className="trend up">{item.trend} vs mese scorso</small>
          </article>
        ))}
      </section>

      <section className="panel-card chart-card span-2">
        <div className="card-title-row">
          <h3>Build e deploy settimanali</h3>
          <button className="button secondary" onClick={() => setNotice('Trend settimanale condiviso con il team su Slack.')}>Condividi</button>
        </div>
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={analytics.buildsByDay}>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
              <XAxis dataKey="day" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ background: '#111111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16 }} />
              <Line type="monotone" dataKey="builds" stroke="#a3e635" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="deploys" stroke="#38bdf8" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="panel-card chart-card">
        <div className="card-title-row">
          <h3>Distribuzione piani</h3>
          <button className="button secondary" onClick={() => setNotice('Distribuzione piani aggiornata nel report board.')}>Aggiorna report</button>
        </div>
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={analytics.planDistribution} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={4}>
                {analytics.planDistribution.map((entry, index) => <Cell key={entry.name} fill={colors[index % colors.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#111111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="panel-card span-2">
        <div className="card-title-row">
          <h3>Attività recenti dell’AI Agent</h3>
          <button className="button primary" onClick={() => setNotice('Coda AI Agent priorizzata per i progetti enterprise.')}>Prioritizza queue</button>
        </div>
        <table className="data-table">
          <thead>
            <tr><th>Progetto</th><th>Owner</th><th>Stato</th><th>Tempo</th></tr>
          </thead>
          <tbody>
            {analytics.activity.map((row) => (
              <tr key={row.id}>
                <td>{row.project}</td>
                <td>{row.owner}</td>
                <td><span className={`status-badge ${row.status.toLowerCase()}`}>{row.status}</span></td>
                <td>{row.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="panel-card">
        <div className="card-title-row">
          <h3>Stack integrations</h3>
        </div>
        <div className="integration-list">
          {data.integrations.map((item) => (
            <div key={item.key} className="integration-card">
              <strong>{item.label}</strong>
              <span className={`status-badge ${item.status.toLowerCase().replace(/ /g, '-')}`}>{item.status}</span>
              <p>{item.detail}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
