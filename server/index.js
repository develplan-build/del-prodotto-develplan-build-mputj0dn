const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const analytics = {
  kpis: [
    { id: 'mrr', label: 'MRR', value: '€84.200', trend: '+12.4%', direction: 'up' },
    { id: 'builds', label: 'Build completate', value: '1.284', trend: '+18.1%', direction: 'up' },
    { id: 'deploy', label: 'Deploy success rate', value: '99,2%', trend: '+1.1%', direction: 'up' },
    { id: 'team', label: 'Workspace attivi', value: '326', trend: '+7.3%', direction: 'up' }
  ],
  buildsByDay: [
    { day: 'Lun', builds: 42, deploys: 39 },
    { day: 'Mar', builds: 58, deploys: 54 },
    { day: 'Mer', builds: 64, deploys: 61 },
    { day: 'Gio', builds: 71, deploys: 67 },
    { day: 'Ven', builds: 88, deploys: 84 },
    { day: 'Sab', builds: 53, deploys: 50 },
    { day: 'Dom', builds: 39, deploys: 37 }
  ],
  planDistribution: [
    { name: 'Starter', value: 84 },
    { name: 'Growth', value: 146 },
    { name: 'Scale', value: 96 }
  ],
  activity: [
    { id: 1, project: 'Finops Copilot', owner: 'Elena Rossi', status: 'Published', time: '2 min fa' },
    { id: 2, project: 'HR Flow Studio', owner: 'Marco Serra', status: 'Building', time: '7 min fa' },
    { id: 3, project: 'CRM Delta', owner: 'Sofia Villa', status: 'Queued', time: '12 min fa' },
    { id: 4, project: 'Support Mesh', owner: 'Andrea Conti', status: 'Published', time: '19 min fa' },
    { id: 5, project: 'Retail Pulse', owner: 'Giulia Gori', status: 'Review', time: '26 min fa' }
  ]
};

const users = [
  { id: 1, name: 'Elena Rossi', email: 'elena@novaforge.io', role: 'Admin', team: 'Platform', status: 'Active', lastLogin: 'Oggi, 09:14' },
  { id: 2, name: 'Marco Serra', email: 'marco@novaforge.io', role: 'Builder', team: 'Product', status: 'Active', lastLogin: 'Oggi, 08:47' },
  { id: 3, name: 'Sofia Villa', email: 'sofia@novaforge.io', role: 'Manager', team: 'Operations', status: 'Pending', lastLogin: 'Ieri, 18:30' },
  { id: 4, name: 'Luca Neri', email: 'luca@novaforge.io', role: 'Viewer', team: 'Sales', status: 'Suspended', lastLogin: 'Ieri, 11:12' },
  { id: 5, name: 'Chiara Bassi', email: 'chiara@novaforge.io', role: 'Admin', team: 'Finance', status: 'Active', lastLogin: 'Oggi, 07:59' },
  { id: 6, name: 'Paolo Fini', email: 'paolo@novaforge.io', role: 'Builder', team: 'Engineering', status: 'Active', lastLogin: 'Oggi, 10:02' },
  { id: 7, name: 'Marta Greco', email: 'marta@novaforge.io', role: 'Manager', team: 'Customer Success', status: 'Active', lastLogin: 'Ieri, 16:41' },
  { id: 8, name: 'Davide Riva', email: 'davide@novaforge.io', role: 'Viewer', team: 'Legal', status: 'Pending', lastLogin: '3 giorni fa' },
  { id: 9, name: 'Alice Fontana', email: 'alice@novaforge.io', role: 'Builder', team: 'Design', status: 'Active', lastLogin: 'Oggi, 09:51' },
  { id: 10, name: 'Giorgio Sala', email: 'giorgio@novaforge.io', role: 'Viewer', team: 'Marketing', status: 'Active', lastLogin: 'Oggi, 06:36' }
];

const customers = [
  { id: 'C-1001', company: 'Aster Labs', owner: 'Francesca Costa', segment: 'Mid-market', value: '€24.000', health: 'Healthy', stage: 'Proposal', email: 'team@asterlabs.com' },
  { id: 'C-1002', company: 'BluePeak', owner: 'Riccardo Testa', segment: 'Enterprise', value: '€62.500', health: 'At Risk', stage: 'Negotiation', email: 'ops@bluepeak.io' },
  { id: 'C-1003', company: 'CloudFrame', owner: 'Martina Longhi', segment: 'SMB', value: '€8.400', health: 'Healthy', stage: 'Won', email: 'hello@cloudframe.app' },
  { id: 'C-1004', company: 'Delta Commerce', owner: 'Tommaso Villa', segment: 'Enterprise', value: '€48.000', health: 'Healthy', stage: 'Onboarding', email: 'it@deltacommerce.com' },
  { id: 'C-1005', company: 'Echo Health', owner: 'Laura Pini', segment: 'Mid-market', value: '€18.900', health: 'Needs Attention', stage: 'Discovery', email: 'growth@echohealth.co' },
  { id: 'C-1006', company: 'Flux Energy', owner: 'Giulio Ferretti', segment: 'SMB', value: '€6.700', health: 'Healthy', stage: 'Won', email: 'contact@fluxenergy.ai' },
  { id: 'C-1007', company: 'GridOne', owner: 'Sara Bellini', segment: 'Enterprise', value: '€71.000', health: 'Healthy', stage: 'Proposal', email: 'board@gridone.com' },
  { id: 'C-1008', company: 'Hypernest', owner: 'Daniele Sarti', segment: 'Mid-market', value: '€15.600', health: 'At Risk', stage: 'Renewal', email: 'founders@hypernest.dev' }
];

const tasks = {
  backlog: [
    { id: 'T-14', title: 'Provisioning template Supabase', owner: 'Paolo', priority: 'High', due: 'Oggi' },
    { id: 'T-15', title: 'Mappare webhook Resend', owner: 'Marta', priority: 'Medium', due: 'Domani' }
  ],
  progress: [
    { id: 'T-09', title: 'Wizard multi-step per brief AI', owner: 'Elena', priority: 'High', due: 'Oggi' },
    { id: 'T-11', title: 'OAuth GitHub con callback pubblico', owner: 'Marco', priority: 'High', due: 'Oggi' }
  ],
  review: [
    { id: 'T-05', title: 'Realtime build logs dashboard', owner: 'Alice', priority: 'Medium', due: 'Domani' },
    { id: 'T-08', title: 'Template fatturazione Stripe export', owner: 'Chiara', priority: 'Low', due: '3 giorni' }
  ],
  done: [
    { id: 'T-01', title: 'Landing page conversion-focused', owner: 'Sofia', priority: 'High', due: 'Completato' },
    { id: 'T-03', title: 'Sidebar multi-sezione con routing', owner: 'Luca', priority: 'Medium', due: 'Completato' }
  ]
};

const invoices = [
  { id: 'INV-2401', customer: 'Aster Labs', amount: '€2.400', plan: 'Growth', status: 'Paid', issuedAt: '2026-05-03', method: 'Stripe Auto-pay' },
  { id: 'INV-2402', customer: 'BluePeak', amount: '€6.250', plan: 'Scale', status: 'Pending', issuedAt: '2026-05-05', method: 'Bank Transfer' },
  { id: 'INV-2403', customer: 'CloudFrame', amount: '€840', plan: 'Starter', status: 'Paid', issuedAt: '2026-05-07', method: 'Stripe Auto-pay' },
  { id: 'INV-2404', customer: 'Delta Commerce', amount: '€4.800', plan: 'Scale', status: 'Overdue', issuedAt: '2026-05-09', method: 'Card' },
  { id: 'INV-2405', customer: 'Echo Health', amount: '€1.890', plan: 'Growth', status: 'Pending', issuedAt: '2026-05-11', method: 'Stripe Auto-pay' },
  { id: 'INV-2406', customer: 'Flux Energy', amount: '€670', plan: 'Starter', status: 'Paid', issuedAt: '2026-05-14', method: 'Card' },
  { id: 'INV-2407', customer: 'GridOne', amount: '€7.100', plan: 'Scale', status: 'Paid', issuedAt: '2026-05-16', method: 'Bank Transfer' },
  { id: 'INV-2408', customer: 'Hypernest', amount: '€1.560', plan: 'Growth', status: 'Draft', issuedAt: '2026-05-20', method: 'Stripe Auto-pay' }
];

const integrations = [
  { key: 'supabase', label: 'Supabase', status: 'Connected', detail: 'Database provisioning e auth magic link' },
  { key: 'resend', label: 'Resend', status: 'Connected', detail: 'Email transazionali e notifiche build' },
  { key: 'google_oauth', label: 'Google OAuth', status: 'Connected', detail: 'Accesso social per workspace B2B' },
  { key: 'github_oauth', label: 'GitHub OAuth', status: 'Connected', detail: 'Import repo e publish CI' },
  { key: 'slack', label: 'Slack', status: 'Pending', detail: 'Alert deploy e review team' }
];

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', product: 'Develplan Build', timestamp: now.toISOString() });
});

app.get('/api/analytics', (req, res) => {
  res.json(analytics);
});

app.get('/api/users', (req, res) => {
  res.json(users);
});

app.get('/api/customers', (req, res) => {
  res.json(customers);
});

app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

app.get('/api/invoices', (req, res) => {
  res.json(invoices);
});

app.get('/api/integrations', (req, res) => {
  res.json(integrations);
});

app.post('/api/contact', (req, res) => {
  const { name, email, company, message } = req.body || {};
  if (!name || !email || !company || !message) {
    return res.status(400).json({ success: false, message: 'Tutti i campi sono obbligatori.' });
  }
  return res.json({
    success: true,
    message: `Richiesta ricevuta per ${company}. Ti contatteremo a ${email} entro 24 ore.`
  });
});

app.post('/api/wizard', (req, res) => {
  const { idea, stack, goal, integrations: selectedIntegrations } = req.body || {};
  if (!idea || !stack || !goal) {
    return res.status(400).json({ success: false, message: 'Compila tutti gli step del wizard.' });
  }
  res.json({
    success: true,
    buildId: 'BLD-' + Math.floor(1000 + Math.random() * 9000),
    status: 'Queued',
    summary: `Brief ricevuto: ${idea}. Stack target ${stack}, obiettivo ${goal}.`,
    integrations: selectedIntegrations || []
  });
});

app.listen(4000, '0.0.0.0', () => {
  console.log('Backend Develplan Build in esecuzione su porta 4000');
});
