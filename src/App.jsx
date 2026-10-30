import { useState } from 'react'
import {
  History,
  FileText,
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

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activePage, setActivePage] = useState('Dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [emptyState, setEmptyState] = useState(false)

  const selectPage = (page) => {
    setActivePage(page)
    setSidebarOpen(false)
  }

  const filteredRecords = initialRecords.filter((record) => {
    const query = searchQuery.toLowerCase()
    const matchesSearch =
      record.title.toLowerCase().includes(query) ||
      record.category.toLowerCase().includes(query) ||
      record.steps.toLowerCase().includes(query)
    const matchesCategory = category === 'All' || record.category === category

    return matchesSearch && matchesCategory && !emptyState
  })

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
            <h1>{activePage}</h1>
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
            <button className="voice-button" type="button">
              <Mic size={15} />
              <span>Voice Log</span>
            </button>
          </div>
        </header>

        <main className="content-area" aria-label={`${activePage} content`}>
          {activePage === 'Dashboard' && (
            <section className="dashboard">
              <div className="dashboard-welcome">
                <div>
                  <h2>Good morning, welcome back.</h2>
                  <p>Keep track of what you&apos;ve learned and built.</p>
                </div>
                <button className="new-entry-button" type="button">
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
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((record) => (
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
                ) : (
                  <div className="empty-state">
                    <div className="empty-icon">
                      <FileText size={22} />
                    </div>
                    <h3>No entries found</h3>
                    <p>
                      {emptyState
                        ? 'Simulated empty view. Click “New Entry” to add a record or restore entries.'
                        : 'No practical work logs match your filter criteria or search query.'}
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  )
}

export default App
