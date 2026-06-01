import { useEffect, useMemo, useState } from 'react'
import { NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { API_URL } from './config'
import { DashboardPage } from './pages/DashboardPage'
import { UsersPage } from './pages/UsersPage'
import { CrmPage } from './pages/CrmPage'
import { KanbanPage } from './pages/KanbanPage'
import { BillingPage } from './pages/BillingPage'

type Analytics = {
  kpis: Array<{ id: string; label: string; value: string; trend: string; direction: string }>
  buildsByDay: Array<{ day: string; builds: number; deploys: number }>
  planDistribution: Array<{ name: string; value: number }>
  activity: Array<{ id: number; project: string; owner: string; status: string; time: string }>
}

type User = { id: number; name: string; email: string; role: string; team: string; status: string; lastLogin: string }
type Customer = { id: string; company: string; owner: string; segment: string; value: string; health: string; stage: string; email: string }
type Task = { id: string; title: string; owner: string; priority: string; due: string }
type Tasks = { backlog: Task[]; progress: Task[]; review: Task[]; done: Task[] }
type Invoice = { id: string; customer: string; amount: string; plan: string; status: string; issuedAt: string; method: string }
type Integration = { key: string; label: string; status: string; detail: string }

type AppData = {
  analytics: Analytics | null
  users: User[]
  customers: Customer[]
  tasks: Tasks | null
  invoices: Invoice[]
  integrations: Integration[]
}

const initialData: AppData = {
  analytics: null,
  users: [],
  customers: [],
  tasks: null,
  invoices: [],
  integrations: []
}

function LandingPage() {
  const navigate = useNavigate()
  const [contactForm, setContactForm] = useState({ name: '', email: '', company: '', message: '' })
  const [contactFeedback, setContactFeedback] = useState('')
  const [wizard, setWizard] = useState({ idea: '', stack: 'React + Node', goal: 'MVP B2B', integrations: ['supabase', 'github_oauth'] as string[] })
  const [wizardFeedback, setWizardFeedback] = useState('')
  const [wizardLoading, setWizardLoading] = useState(false)

  const toggleIntegration = (value: string) => {
    setWizard((current) => ({
      ...current,
      integrations: current.integrations.includes(value)
        ? current.integrations.filter((item) => item !== value)
        : [...current.integrations, value]
    }))
  }

  const submitContact = async (event: React.FormEvent) => {
    event.preventDefault()
    setContactFeedback('Invio in corso...')
    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm)
      })
      const data = await response.json()
      setContactFeedback(data.message || 'Richiesta inviata con successo.')
      if (response.ok) {
        setContactForm({ name: '', email: '', company: '', message: '' })
      }
    } catch {
      setContactFeedback('Errore di rete durante l’invio della richiesta.')
    }
  }

  const submitWizard = async (event: React.FormEvent) => {
    event.preventDefault()
    setWizardLoading(true)
    setWizardFeedback('')
    try {
      const response = await fetch(`${API_URL}/api/wizard`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(wizard)
      })
      const data = await response.json()
      setWizardFeedback(data.message || `${data.summary} Build ID ${data.buildId} in stato ${data.status}.`)
      if (response.ok) {
        navigate('/app/dashboard')
      }
    } catch {
      setWizardFeedback('Impossibile avviare il wizard in questo momento.')
    } finally {
      setWizardLoading(false)
    }
  }

  return (
    <div className="landing-shell">
      <header className="landing-header">
        <div className="brand-mark">DB</div>
        <div className="brand-copy">
          <strong>Develplan Build</strong>
          <span>AI software factory per team B2B</span>
        </div>
        <nav className="landing-nav">
          <a href="#features">Funzionalità</a>
          <a href="#workflow">Workflow</a>
          <a href="#pricing">Prezzi</a>
          <a href="#integrations">Integrazioni</a>
          <a href="#contacts">Contatti</a>
        </nav>
        <div className="header-actions">
          <button className="button secondary" onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}>Piani</button>
          <button className="button primary" onClick={() => navigate('/app/dashboard')}>Apri app</button>
        </div>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-copy">
            <div className="eyebrow">Build · Deploy · Scale</div>
            <h1>Trasforma una idea in una SaaS online con un AI Agent che costruisce tutto per te.</h1>
            <p>
              Develplan Build genera frontend, backend, dashboard operative e pubblicazione online con URL pubblico.
              Pensato per founder, software house e team operation che vogliono ridurre da settimane a minuti il time-to-market.
            </p>
            <div className="hero-actions">
              <button className="button primary" onClick={() => navigate('/app/dashboard')}>Apri dashboard</button>
              <button className="button secondary" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>Scopri funzionalità</button>
            </div>
            <div className="social-proof">
              <span>Connettori nativi:</span>
              <div className="proof-badges">
                <span>Supabase</span>
                <span>Resend</span>
                <span>Google OAuth</span>
                <span>GitHub OAuth</span>
                <span>Slack</span>
              </div>
            </div>
          </div>
          <form className="wizard-card" onSubmit={submitWizard}>
            <div className="card-title-row">
              <h2>Wizard AI Builder</h2>
              <span className="status-badge live">Realtime</span>
            </div>
            <label>
              Idea di prodotto
              <textarea value={wizard.idea} onChange={(e) => setWizard({ ...wizard, idea: e.target.value })} placeholder="Es. piattaforma B2B per ticketing, CRM e fatturazione automatica" />
            </label>
            <div className="form-grid two">
              <label>
                Stack target
                <select value={wizard.stack} onChange={(e) => setWizard({ ...wizard, stack: e.target.value })}>
                  <option>React + Node</option>
                  <option>Next.js + Supabase</option>
                  <option>Dashboard Internal Tool</option>
                </select>
              </label>
              <label>
                Obiettivo
                <select value={wizard.goal} onChange={(e) => setWizard({ ...wizard, goal: e.target.value })}>
                  <option>MVP B2B</option>
                  <option>Portale clienti</option>
                  <option>Workspace interno</option>
                </select>
              </label>
            </div>
            <div>
              <span className="field-label">Integrazioni richieste</span>
              <div className="checkbox-grid">
                {['supabase', 'resend', 'google_oauth', 'github_oauth', 'slack'].map((item) => (
                  <button type="button" key={item} className={wizard.integrations.includes(item) ? 'chip active' : 'chip'} onClick={() => toggleIntegration(item)}>
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <button className="button primary" type="submit" disabled={wizardLoading}>
              {wizardLoading ? 'Avvio build...' : 'Genera applicazione'}
            </button>
            {wizardFeedback && <p className="inline-feedback">{wizardFeedback}</p>}
          </form>
        </section>

        <section id="features" className="content-section">
          <div className="section-heading">
            <span className="eyebrow">Funzionalità</span>
            <h2>Una vera fabbrica software self-service</h2>
          </div>
          <div className="feature-grid">
            <article className="glass-card"><h3>Frontend generato</h3><p>UI moderne, routing, dashboard analytics e pagine operative pronte per il deploy.</p></article>
            <article className="glass-card"><h3>Backend API</h3><p>Servizi Node, endpoint business-ready, integrazioni email, auth e flussi webhook.</p></article>
            <article className="glass-card"><h3>Publishing pubblico</h3><p>Ogni build ottiene un URL pubblico condivisibile con stakeholder e clienti in pochi minuti.</p></article>
            <article className="glass-card"><h3>Monitoraggio live</h3><p>Log di build, metriche di deploy, qualità del codice e stato release direttamente in dashboard.</p></article>
          </div>
        </section>

        <section id="workflow" className="content-section">
          <div className="section-heading">
            <span className="eyebrow">Workflow</span>
            <h2>Dal brief al deploy senza colli di bottiglia</h2>
          </div>
          <div className="timeline-grid">
            <div className="timeline-item"><strong>01</strong><span>Descrivi l’idea nel wizard</span></div>
            <div className="timeline-item"><strong>02</strong><span>L’AI Agent pianifica stack, ruoli e integrazioni</span></div>
            <div className="timeline-item"><strong>03</strong><span>Genera frontend, backend e dashboard operative</span></div>
            <div className="timeline-item"><strong>04</strong><span>Pubblica online e distribuisce un URL pubblico</span></div>
          </div>
        </section>

        <section id="integrations" className="content-section integrations-strip">
          <div className="section-heading">
            <span className="eyebrow">Integrazioni</span>
            <h2>Connettiti al tuo stack esistente</h2>
          </div>
          <div className="integration-list landing-integrations">
            <div className="integration-card"><h3>Supabase</h3><p>Auth, database, storage e provisioning automatico.</p></div>
            <div className="integration-card"><h3>Resend</h3><p>Email transazionali per build, onboarding e notifiche.</p></div>
            <div className="integration-card"><h3>Google OAuth</h3><p>Accesso social per team e clienti enterprise.</p></div>
            <div className="integration-card"><h3>GitHub OAuth</h3><p>Import repo e pubblicazione con workflow repository-based.</p></div>
            <div className="integration-card"><h3>Slack</h3><p>Alert di deploy, review e handoff tra team in real time.</p></div>
          </div>
        </section>

        <section id="pricing" className="content-section pricing-grid">
          <div className="pricing-card featured">
            <span className="eyebrow">Starter</span>
            <h3>€49<span>/mese</span></h3>
            <p>Perfetto per founder che validano il primo MVP.</p>
            <ul><li>20 build/mese</li><li>1 workspace</li><li>Deploy pubblico</li></ul>
            <button className="button secondary" onClick={() => navigate('/app/billing')}>Vedi fatturazione</button>
          </div>
          <div className="pricing-card active-plan">
            <span className="eyebrow">Growth</span>
            <h3>€129<span>/mese</span></h3>
            <p>Per team B2B che vogliono shipping continuo e controllo operativo.</p>
            <ul><li>Build illimitate</li><li>Ruoli avanzati</li><li>CRM e Kanban inclusi</li></ul>
            <button className="button primary" onClick={() => navigate('/app/dashboard')}>Apri workspace</button>
          </div>
          <div className="pricing-card">
            <span className="eyebrow">Scale</span>
            <h3>Custom</h3>
            <p>Governance enterprise, security review e supporto dedicato.</p>
            <ul><li>SSO + audit log</li><li>SLA premium</li><li>Onboarding guidato</li></ul>
            <button className="button secondary" onClick={() => document.getElementById('contacts')?.scrollIntoView({ behavior: 'smooth' })}>Contatta sales</button>
          </div>
        </section>

        <section id="contacts" className="content-section contact-section">
          <div className="section-heading">
            <span className="eyebrow">Contatti</span>
            <h2>Parla con il team Develplan</h2>
          </div>
          <form className="contact-form glass-card" onSubmit={submitContact}>
            <div className="form-grid two">
              <label>Nome<input value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} /></label>
              <label>Email<input type="email" value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} /></label>
            </div>
            <label>Azienda<input value={contactForm.company} onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })} /></label>
            <label>Messaggio<textarea value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} /></label>
            <div className="hero-actions">
              <button className="button primary" type="submit">Invia richiesta</button>
              <button className="button secondary" type="button" onClick={() => setContactForm({ name: '', email: '', company: '', message: '' })}>Reset form</button>
            </div>
            {contactFeedback && <p className="inline-feedback">{contactFeedback}</p>}
          </form>
        </section>
      </main>
    </div>
  )
}

function AppLayout({ data, refresh }: { data: AppData; refresh: () => void }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [notice, setNotice] = useState('Workspace sincronizzato con gli ultimi dati backend.')

  const pageTitle = useMemo(() => {
    if (location.pathname.includes('/users')) return 'Gestione utenti e ruoli'
    if (location.pathname.includes('/crm')) return 'CRM / Gestione clienti'
    if (location.pathname.includes('/kanban')) return 'Kanban / Task management'
    if (location.pathname.includes('/billing')) return 'Fatturazione automatica'
    return 'Dashboard analytics'
  }, [location.pathname])

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-mark">DB</div>
          <div>
            <strong>Develplan Build</strong>
            <span>Dark Tech Workspace</span>
          </div>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/app/dashboard">Dashboard analytics</NavLink>
          <NavLink to="/app/users">Utenti e ruoli</NavLink>
          <NavLink to="/app/crm">CRM clienti</NavLink>
          <NavLink to="/app/kanban">Kanban tasks</NavLink>
          <NavLink to="/app/billing">Fatturazione</NavLink>
          <NavLink to="/">Landing page</NavLink>
        </nav>
        <div className="sidebar-footer glass-card">
          <span className="eyebrow">Integrations live</span>
          <p>{data.integrations.filter((item) => item.status === 'Connected').length} connesse su {data.integrations.length}</p>
          <button className="button secondary" onClick={() => { refresh(); setNotice('Dati aggiornati correttamente dal backend.'); }}>Aggiorna dati</button>
        </div>
      </aside>
      <div className="app-content">
        <header className="app-header">
          <div>
            <div className="breadcrumb">Workspace / {pageTitle}</div>
            <h1>{pageTitle}</h1>
          </div>
          <div className="header-actions">
            <button className="button secondary" onClick={() => setNotice('Export CSV schedulato e pronto nel centro download.')}>Esporta</button>
            <button className="button primary" onClick={() => navigate('/app/kanban')}>Nuova azione</button>
          </div>
        </header>
        <div className="top-notice">{notice}</div>
        <Routes>
          <Route path="dashboard" element={<DashboardPage data={data} setNotice={setNotice} />} />
          <Route path="users" element={<UsersPage users={data.users} integrations={data.integrations} setNotice={setNotice} />} />
          <Route path="crm" element={<CrmPage customers={data.customers} setNotice={setNotice} />} />
          <Route path="kanban" element={<KanbanPage tasks={data.tasks} setNotice={setNotice} />} />
          <Route path="billing" element={<BillingPage invoices={data.invoices} integrations={data.integrations} setNotice={setNotice} />} />
        </Routes>
      </div>
    </div>
  )
}

export default function App() {
  const [data, setData] = useState<AppData>(initialData)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadData = async () => {
    setLoading(true)
    setError('')
    try {
      const [analytics, users, customers, tasks, invoices, integrations] = await Promise.all([
        fetch(`${API_URL}/api/analytics`).then((r) => r.json()),
        fetch(`${API_URL}/api/users`).then((r) => r.json()),
        fetch(`${API_URL}/api/customers`).then((r) => r.json()),
        fetch(`${API_URL}/api/tasks`).then((r) => r.json()),
        fetch(`${API_URL}/api/invoices`).then((r) => r.json()),
        fetch(`${API_URL}/api/integrations`).then((r) => r.json())
      ])
      setData({ analytics, users, customers, tasks, invoices, integrations })
    } catch {
      setError('Impossibile caricare i dati dal backend pubblico.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  if (loading) {
    return <div className="state-screen"><div className="loader" /><p>Caricamento workspace Develplan Build...</p></div>
  }

  if (error) {
    return <div className="state-screen"><p>{error}</p><button className="button primary" onClick={loadData}>Riprova</button></div>
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/app/*" element={<AppLayout data={data} refresh={loadData} />} />
    </Routes>
  )
}
