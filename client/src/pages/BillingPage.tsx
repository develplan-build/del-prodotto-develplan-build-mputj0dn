import { useMemo, useState } from 'react'

type Invoice = { id: string; customer: string; amount: string; plan: string; status: string; issuedAt: string; method: string }
type Integration = { key: string; label: string; status: string; detail: string }

export function BillingPage({ invoices, integrations, setNotice }: { invoices: Invoice[]; integrations: Integration[]; setNotice: (value: string) => void }) {
  const [status, setStatus] = useState('All')
  const [rows, setRows] = useState(invoices)

  const filtered = useMemo(
    () => rows.filter((invoice) => status === 'All' || invoice.status === status),
    [rows, status]
  )

  const markPaid = (id: string) => {
    setRows(rows.map((invoice) => (invoice.id === id ? { ...invoice, status: 'Paid', method: 'Stripe Auto-pay' } : invoice)))
    setNotice(`Fattura ${id} aggiornata come saldata.`)
  }

  const createDraft = () => {
    const next = {
      id: `INV-${Math.floor(2500 + Math.random() * 300)}`,
      customer: 'Nuovo account enterprise',
      amount: '€3.200',
      plan: 'Growth',
      status: 'Draft',
      issuedAt: '2026-06-01',
      method: 'Stripe Auto-pay'
    }
    setRows([next, ...rows])
    setNotice(`Creata nuova bozza fattura ${next.id}.`)
  }

  const billingIntegrations = integrations.filter((item) => ['resend', 'slack', 'stripe'].includes(item.key))

  return (
    <div className="page-grid">
      <section className="panel-card span-2">
        <div className="card-title-row">
          <h3>Fatture automatiche</h3>
          <div className="inline-actions">
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option>All</option>
              <option>Paid</option>
              <option>Pending</option>
              <option>Overdue</option>
              <option>Draft</option>
            </select>
            <button className="button primary" onClick={createDraft}>Nuova fattura</button>
          </div>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Importo</th>
              <th>Piano</th>
              <th>Stato</th>
              <th>Emissione</th>
              <th>Metodo</th>
              <th>Azione</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((invoice) => (
              <tr key={invoice.id}>
                <td>{invoice.id}</td>
                <td>{invoice.customer}</td>
                <td>{invoice.amount}</td>
                <td>{invoice.plan}</td>
                <td><span className={`status-badge ${invoice.status.toLowerCase()}`}>{invoice.status}</span></td>
                <td>{invoice.issuedAt}</td>
                <td>{invoice.method}</td>
                <td>
                  <button className="table-action" onClick={() => markPaid(invoice.id)}>
                    Segna paid
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="panel-card">
        <div className="card-title-row">
          <h3>Automazioni pagamento</h3>
        </div>
        <div className="integration-list">
          {billingIntegrations.map((item) => (
            <div className="integration-item" key={item.key}>
              <div>
                <strong>{item.label}</strong>
                <p>{item.detail}</p>
              </div>
              <button
                className="button secondary"
                onClick={() => setNotice(`Sincronizzazione ${item.label} eseguita con stato ${item.status}.`)}
              >
                Sincronizza
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
