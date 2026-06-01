import { useMemo, useState } from 'react'

type Customer = { id: string; company: string; owner: string; segment: string; value: string; health: string; stage: string; email: string }

export function CrmPage({ customers, setNotice }: { customers: Customer[]; setNotice: (value: string) => void }) {
  const [stage, setStage] = useState('All')
  const [list, setList] = useState(customers)

  const filtered = useMemo(() => list.filter((item) => stage === 'All' || item.stage === stage), [list, stage])

  const advanceStage = (id: string) => {
    const flow = ['Discovery', 'Proposal', 'Negotiation', 'Won', 'Onboarding', 'Renewal']
    setList(list.map((customer) => {
      if (customer.id !== id) return customer
      const nextIndex = (flow.indexOf(customer.stage) + 1) % flow.length
      return { ...customer, stage: flow[nextIndex] }
    }))
    setNotice('Stage commerciale aggiornato nel CRM.')
  }

  return (
    <div className="page-grid">
      <section className="panel-card span-2">
        <div className="card-title-row">
          <h3>Pipeline clienti</h3>
          <div className="inline-actions">
            <select value={stage} onChange={(e) => setStage(e.target.value)}>
              <option>All</option>
              <option>Discovery</option>
              <option>Proposal</option>
              <option>Negotiation</option>
              <option>Won</option>
              <option>Onboarding</option>
              <option>Renewal</option>
            </select>
            <button className="button secondary" onClick={() => setNotice('Segmentazione CRM esportata verso il team sales.')}>Esporta segmenti</button>
          </div>
        </div>
        <table className="data-table">
          <thead>
            <tr><th>ID</th><th>Azienda</th><th>Owner</th><th>Segmento</th><th>Valore</th><th>Health</th><th>Stage</th><th>Azione</th></tr>
          </thead>
          <tbody>
            {filtered.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.id}</td>
                <td>
                  <div className="cell-stack">
                    <strong>{customer.company}</strong>
                    <span>{customer.email}</span>
                  </div>
                </td>
                <td>{customer.owner}</td>
                <td>{customer.segment}</td>
                <td>{customer.value}</td>
                <td><span className={`status-badge ${customer.health.toLowerCase().replace(/ /g, '-')}`}>{customer.health}</span></td>
                <td>{customer.stage}</td>
                <td><button className="table-action" onClick={() => advanceStage(customer.id)}>Avanza</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="panel-card">
        <div className="card-title-row"><h3>Insight commerciali</h3></div>
        <div className="metric-list">
          <div><span>Pipeline totale</span><strong>€255.100</strong></div>
          <div><span>Enterprise share</span><strong>46%</strong></div>
          <div><span>Renewal a rischio</span><strong>2 account</strong></div>
        </div>
      </section>
    </div>
  )
}
