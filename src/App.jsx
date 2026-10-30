import { useState } from 'react'
import {
  Check,
  FileText,
  History,
  LayoutDashboard,
  Menu,
  Mic,
  NotebookPen,
  Plus,
  RefreshCw,
  Search,
  Settings,
  X,
} from 'lucide-react'
import './App.css'

const initialRecords = [
  {
    id: 'rec-1',
    title: 'Git Repository Setup',
    category: 'Git',
    date: 'Oct 28, 2026',
    status: 'Completed',
    steps: 'Initialized repository and configured the remote SSH keys.',
  },
  {
    id: 'rec-2',
    title: 'Linux User Management',
    category: 'Linux',
    date: 'Oct 29, 2026',
    status: 'Completed',
    steps: 'Created a developers group and granted specific sudo permissions.',
  },
  {
    id: 'rec-3',
    title: 'EC2 Instance Configuration',
    category: 'AWS',
    date: 'Oct 30, 2026',
    status: 'In Progress',
    steps: 'Launched an Ubuntu instance and configured its security group.',
  },
]

const navigation = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'New Entry', icon: Mic },
  { label: 'History', icon: History },
  { label: 'Settings', icon: Settings },
]

function RecordList({ records, emptyMessage }) {
  if (records.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          <FileText size={22} />
        </div>
        <h3>No entries found</h3>
        <p>{emptyMessage}</p>
      </div>
    )
  }

  return records.map((record) => (
    <article className="record-card" key={record.id}>
      <div className="record-icon">
        <FileText size={18} />
      </div>
      <div className="record-content">
        <div className="record-heading">
          <h3>{record.title}</h3>
          <span className={`status status-${record.status === 'Completed' ? 'complete' : 'progress'}`}>
            {record.status}
          </span>
        </div>
        <p>{record.steps}</p>
        <div className="record-meta">
          <span>{record.category}</span>
          <span>{record.date}</span>
        </div>
      </div>
    </article>
  ))
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activePage, setActivePage] = useState('Dashboard')
  const [records, setRecords] = useState(initialRecords)
  const [searchQuery, setSearchQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [emptyState, setEmptyState] = useState(false)
  const [entry, setEntry] = useState({ title: '', category: '', steps: '' })

  const selectPage = (page) => {
    setActivePage(page)
    setSidebarOpen(false)
  }

  const filteredRecords = records.filter((record) => {
    const query = searchQuery.toLowerCase()
    const matchesSearch =
      record.title.toLowerCase().includes(query) ||
      record.category.toLowerCase().includes(query) ||
      record.steps.toLowerCase().includes(query)
    const matchesCategory = category === 'All' || record.category === category

    return matchesSearch && matchesCategory && !emptyState
  })

  const updateEntry = (field, value) => {
    setEntry((current) => ({ ...current, [field]: value }))
  }

  const saveEntry = (event) => {
    event.preventDefault()
    if (!entry.title.trim() || !entry.category.trim() || !entry.steps.trim()) return

    setRecords((current) => [
      {
        id: `rec-${Date.now()}`,
        title: entry.title.trim(),
        category: entry.category.trim(),
        date: 'Oct 30, 2026',
        status: 'Completed',
        steps: entry.steps.trim(),
      },
      ...current,
    ])
    setEntry({ title: '', category: '', steps: '' })
    setActivePage('History')
  }

  return (
    <div className="app-shell">
      {sidebarOpen && (
        <button
          className="sidebar-backdrop"
          type="button"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div>
          <div className="sidebar-logo">
            <div className="logo-mark">
              <NotebookPen size={20} strokeWidth={2} />
            </div>
            <span>LabLedger</span>
            <button
              className="close-sidebar"
              type="button"
              aria-label="Close navigation"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          <nav className="navigation" aria-label="Main navigation">
            {navigation.map(({ label, icon: Icon }) => (
              <button
                className={`nav-item ${activePage === label ? 'nav-item-active' : ''}`}
                type="button"
                key={label}
                onClick={() => selectPage(label)}
              >
                <Icon size={18} />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      <div className="main-container">
        <header className="top-header">
          <div className="header-title">
            <button
              className="menu-button"
              type="button"
              aria-label="Open navigation"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={21} />
            </button>
            <h1>{activePage === 'History' ? 'Journal History' : activePage}</h1>
          </div>

          <div className="header-actions">
            <label className="search-box">
              <Search size={16} />
              <input
                type="search"
                placeholder="Search entries..."
                aria-label="Search entries"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </label>
            <button className="voice-button" type="button" onClick={() => selectPage('New Entry')}>
              <Mic size={15} />
              <span>Voice Log</span>
            </button>
          </div>
        </header>

        <main className="content-area" aria-label={`${activePage} content`}>
          {activePage === 'Dashboard' && (
            <section className="page-section dashboard">
              <div className="dashboard-welcome">
                <div>
                  <h2>Good morning, welcome back.</h2>
                  <p>Keep track of what you&apos;ve learned and built.</p>
                </div>
                <button className="new-entry-button" type="button" onClick={() => selectPage('New Entry')}>
                  <Plus size={16} />
                  <span>New Entry</span>
                </button>
              </div>

              <div className="work-toolbar">
                <div className="work-heading">
                  <span>Recent Work</span>
                  <strong>{filteredRecords.length}</strong>
                </div>
                <div className="work-actions">
                  <select
                    aria-label="Filter by category"
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                  >
                    <option value="All">All Categories</option>
                    <option value="Git">Git</option>
                    <option value="Linux">Linux</option>
                    <option value="AWS">AWS</option>
                    <option value="React">React</option>
                    <option value="Python">Python</option>
                  </select>
                  <button
                    className="empty-toggle"
                    type="button"
                    onClick={() => setEmptyState((current) => !current)}
                  >
                    <RefreshCw size={13} />
                    <span>{emptyState ? 'Restore Records View' : 'Simulate Empty State'}</span>
                  </button>
                </div>
              </div>

              <div className="records-container">
                <RecordList
                  records={filteredRecords}
                  emptyMessage={
                    emptyState
                      ? 'Simulated empty view. Click “New Entry” to add a record or restore entries.'
                      : 'No practical work logs match your filter criteria or search query.'
                  }
                />
              </div>
            </section>
          )}

          {activePage === 'New Entry' && (
            <section className="page-section form-page">
              <div className="page-intro">
                <h2>Record practical work</h2>
                <p>Add a short note about what you built, configured, or learned.</p>
              </div>
              <form className="entry-form card" onSubmit={saveEntry}>
                <label>
                  Entry title
                  <input
                    type="text"
                    placeholder="e.g. Kubernetes Cluster Deployment"
                    value={entry.title}
                    onChange={(event) => updateEntry('title', event.target.value)}
                    required
                  />
                </label>
                <label>
                  Category
                  <input
                    type="text"
                    placeholder="e.g. DevOps, Git, AWS"
                    value={entry.category}
                    onChange={(event) => updateEntry('category', event.target.value)}
                    required
                  />
                </label>
                <label>
                  Steps and observations
                  <textarea
                    rows="5"
                    placeholder="Summary of practical steps performed..."
                    value={entry.steps}
                    onChange={(event) => updateEntry('steps', event.target.value)}
                    required
                  />
                </label>
                <div className="form-actions">
                  <button className="new-entry-button" type="submit">
                    <Check size={16} />
                    <span>Save Journal Entry</span>
                  </button>
                </div>
              </form>
            </section>
          )}

          {activePage === 'History' && (
            <section className="page-section history-page">
              <div className="page-intro">
                <h2>Journal History</h2>
                <p>Review your past practical entries.</p>
              </div>
              <div className="records-container">
                <RecordList
                  records={filteredRecords}
                  emptyMessage="No practical work logs match your search."
                />
              </div>
            </section>
          )}

          {activePage === 'Settings' && (
            <section className="page-section settings-page">
              <div className="page-intro">
                <h2>Settings</h2>
                <p>Manage your journal preferences.</p>
              </div>
              <div className="settings-card card">
                <div className="setting-row">
                  <div>
                    <strong>Voice recognition input</strong>
                    <p>Use voice-first logging for practical work notes.</p>
                  </div>
                  <span className="setting-status">Active</span>
                </div>
                <div className="setting-row">
                  <div>
                    <strong>Local journal data</strong>
                    <p>Your entries are currently stored in this session.</p>
                  </div>
                  <button className="secondary-button" type="button" onClick={() => setRecords(initialRecords)}>
                    Restore sample data
                  </button>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  )
}

export default App
