import { useEffect, useState } from 'react'
import {
  Check,
  Download,
  FileText,
  History,
  Info,
  LayoutDashboard,
  Menu,
  Mic,
  Moon,
  NotebookPen,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Sun,
  Trash2,
  X,
} from 'lucide-react'
import './App.css'
import { clearRecords, deleteRecord, loadRecords, saveRecords, updateRecord } from './storage'
import { downloadMarkdown, downloadRecordsJson } from './exportMarkdown'

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
  { label: 'History', icon: History },
  { label: 'Settings', icon: Settings },
]

function RecordList({ records, emptyMessage, onEdit, onDelete, onView }) {
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
          <div className="record-actions">
            <button type="button" onClick={() => onView(record)}>View</button>
            <button type="button" onClick={() => onEdit(record)}>Edit</button>
            <button type="button" onClick={() => onDelete(record.id)}>Delete</button>
          </div>
        </div>
      </div>
    </article>
  ))
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activePage, setActivePage] = useState('Dashboard')
  const [records, setRecords] = useState(() => loadRecords(initialRecords))
  const [searchQuery, setSearchQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [emptyState, setEmptyState] = useState(false)
  const [entryModalOpen, setEntryModalOpen] = useState(false)
  const [description, setDescription] = useState('')
  const [entryCategory, setEntryCategory] = useState('')
  const [generatedRecord, setGeneratedRecord] = useState(null)
  const [editingRecordId, setEditingRecordId] = useState(null)
  const [detailRecord, setDetailRecord] = useState(null)
  const [historySearch, setHistorySearch] = useState('')
  const [historyCategory, setHistoryCategory] = useState('All')
  const [theme, setTheme] = useState(() =>
    typeof window !== 'undefined' ? window.localStorage.getItem('labledger_theme') || 'light' : 'light',
  )
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false)
  const [appError, setAppError] = useState('')

  useEffect(() => {
    saveRecords(records)
  }, [records])

  useEffect(() => {
    window.localStorage.setItem('labledger_theme', theme)
  }, [theme])

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

  const historyRecords = records.filter((record) => {
    const query = historySearch.toLowerCase()
    const matchesSearch =
      record.title.toLowerCase().includes(query) ||
      record.category.toLowerCase().includes(query) ||
      record.steps.toLowerCase().includes(query)
    const matchesCategory = historyCategory === 'All' || record.category === historyCategory

    return matchesSearch && matchesCategory
  })

  const openEntryModal = () => {
    setAppError('')
    setEntryModalOpen(true)
    setGeneratedRecord(null)
    setEditingRecordId(null)
  }

  const cancelEntry = () => {
    setEntryModalOpen(false)
    setDescription('')
    setEntryCategory('')
    setGeneratedRecord(null)
    setEditingRecordId(null)
    setAppError('')
  }

  const buildStructuredRecord = (text, category) => {
    const lowerText = text.toLowerCase()
    const detectedCategory =
      category ||
      (lowerText.match(/\b(git|linux|aws|react|python|docker|kubernetes|javascript|database)\b/i)?.[1] ||
        'General')
    const lines = text.split(/[.!?\n]+/).map((line) => line.trim()).filter(Boolean)
    const findLines = (keywords, fallback) =>
      lines.filter((line) => keywords.some((keyword) => line.toLowerCase().includes(keyword))).join('. ') || fallback

    return {
      title: lines[0]?.slice(0, 60) || 'Practical Work Entry',
      category: detectedCategory.charAt(0).toUpperCase() + detectedCategory.slice(1),
      status: 'Completed',
      tasks: findLines(['built', 'created', 'configured', 'implemented', 'setup', 'set up', 'completed'], text),
      commands: findLines(['command', 'npm ', 'git ', 'docker ', 'kubectl ', 'sudo ', 'ssh '], 'No commands identified.'),
      errors: findLines(['error', 'issue', 'failed', 'bug', 'problem'], 'No errors identified.'),
      solutions: findLines(['fixed', 'solved', 'resolved', 'solution', 'changed', 'updated'], 'No solutions identified.'),
      learnings: findLines(['learned', 'learning', 'understood', 'realized', 'takeaway'], 'Add the key learning or takeaway from this work.'),
      nextSteps: findLines(['next', 'later', 'todo', 'remaining', 'will '], 'Add the next step for this work.'),
      steps: text,
    }
  }

  const generateRecord = (event) => {
    event.preventDefault()
    if (!description.trim()) {
      setAppError('Add a work description before generating a record.')
      return
    }

    setGeneratedRecord(buildStructuredRecord(description.trim(), entryCategory.trim()))
  }

  const updateGeneratedRecord = (field, value) => {
    setGeneratedRecord((current) => ({ ...current, [field]: value }))
  }

  const editRecord = (record) => {
    setDetailRecord(null)
    setGeneratedRecord({
      title: record.title,
      category: record.category,
      status: record.status,
      steps: record.steps,
      learnings: record.learnings || '',
      tasks: record.tasks || record.steps,
      commands: record.commands || '',
      errors: record.errors || '',
      solutions: record.solutions || '',
      nextSteps: record.nextSteps || '',
    })
    setEditingRecordId(record.id)
    setEntryModalOpen(true)
  }

  const removeRecord = (recordId) => {
    setRecords((current) => deleteRecord(current, recordId))
  }

  const clearAllRecords = () => {
    if (!clearRecords()) {
      setAppError('Entries could not be cleared. Check browser storage permissions and try again.')
      return
    }
    setRecords([])
    setClearConfirmOpen(false)
  }

  const saveEntry = (event) => {
    event.preventDefault()
    if (!generatedRecord?.title.trim() || !generatedRecord?.category.trim() || !generatedRecord?.steps.trim()) {
      setAppError('Title, category, and tasks are required before saving.')
      return
    }

    const record = {
      id: editingRecordId || `rec-${Date.now()}`,
      title: generatedRecord.title.trim(),
      category: generatedRecord.category.trim(),
      date: editingRecordId
        ? records.find((item) => item.id === editingRecordId)?.date || 'Oct 30, 2026'
        : 'Oct 30, 2026',
      status: generatedRecord.status,
      steps: generatedRecord.steps.trim(),
      learnings: generatedRecord.learnings?.trim() || '',
      tasks: generatedRecord.tasks?.trim() || '',
      commands: generatedRecord.commands?.trim() || '',
      errors: generatedRecord.errors?.trim() || '',
      solutions: generatedRecord.solutions?.trim() || '',
      nextSteps: generatedRecord.nextSteps?.trim() || '',
    }

    setRecords((current) =>
      editingRecordId ? updateRecord(current, record) : [record, ...current],
    )
    cancelEntry()
  }

  return (
    <div className={`app-shell theme-${theme}`}>
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
            <button className="voice-button" type="button" onClick={openEntryModal}>
              <Mic size={15} />
              <span>Voice Log</span>
            </button>
          </div>
        </header>

        <main className="content-area" aria-label={`${activePage} content`}>
          {appError && (
            <div className="app-alert" role="alert">
              <Info size={16} />
              <span>{appError}</span>
              <button type="button" aria-label="Dismiss message" onClick={() => setAppError('')}>
                <X size={15} />
              </button>
            </div>
          )}
          {activePage === 'Dashboard' && (
            <section className="page-section dashboard">
              <div className="dashboard-welcome">
                <div>
                  <h2>Good morning, welcome back.</h2>
                  <p>Keep track of what you&apos;ve learned and built.</p>
                </div>
                <button className="new-entry-button" type="button" onClick={openEntryModal}>
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
                  onEdit={editRecord}
                  onDelete={removeRecord}
                  onView={setDetailRecord}
                />
              </div>
            </section>
          )}

          {activePage === 'History' && (
            <section className="page-section history-page">
              <div className="page-intro">
                <h2>Journal History</h2>
                <p>Review your past practical entries.</p>
              </div>
              <div className="history-toolbar">
                <label className="history-search">
                  <Search size={16} />
                  <input
                    type="search"
                    placeholder="Search history..."
                    aria-label="Search history"
                    value={historySearch}
                    onChange={(event) => setHistorySearch(event.target.value)}
                  />
                </label>
                <select
                  aria-label="Filter history by category"
                  value={historyCategory}
                  onChange={(event) => setHistoryCategory(event.target.value)}
                >
                  <option value="All">All Categories</option>
                  {[...new Set(records.map((record) => record.category))].map((item) => (
                    <option value={item} key={item}>{item}</option>
                  ))}
                </select>
                <span className="history-count">{historyRecords.length} entries</span>
                <button className="secondary-button" type="button" onClick={() => downloadRecordsJson(records)}>
                  <Download size={14} />
                  Export JSON
                </button>
              </div>
              <div className="records-container">
                <RecordList
                  records={historyRecords}
                  emptyMessage="No practical work logs match your search."
                  onEdit={editRecord}
                  onDelete={removeRecord}
                  onView={setDetailRecord}
                />
              </div>
            </section>
          )}

          {activePage === 'Settings' && (
            <section className="page-section settings-page">
              <div className="page-intro">
                <h2>Settings</h2>
                <p>Manage your journal preferences and saved data.</p>
              </div>
              <div className="settings-card card">
                <div className="setting-row">
                  <div>
                    <strong>Appearance</strong>
                    <p>Choose the theme that feels comfortable for your workflow.</p>
                  </div>
                  <div className="theme-switcher" role="group" aria-label="Theme">
                    <button
                      className={theme === 'light' ? 'theme-option-active' : ''}
                      type="button"
                      onClick={() => setTheme('light')}
                    >
                      <Sun size={14} /> Light
                    </button>
                    <button
                      className={theme === 'dark' ? 'theme-option-active' : ''}
                      type="button"
                      onClick={() => setTheme('dark')}
                    >
                      <Moon size={14} /> Dark
                    </button>
                  </div>
                </div>
                <div className="setting-row">
                  <div>
                    <strong>LabLedger</strong>
                    <p>Practical work journal for capturing tasks, commands, errors, solutions, and learning outcomes.</p>
                  </div>
                  <span className="app-version">v1.0</span>
                </div>
                <div className="setting-row">
                  <div>
                    <strong>Local journal data</strong>
                    <p>{records.length} {records.length === 1 ? 'entry is' : 'entries are'} saved on this device.</p>
                  </div>
                  <div className="setting-actions">
                    <button className="secondary-button" type="button" onClick={() => setRecords(initialRecords)}>
                      Restore samples
                    </button>
                    <button className="danger-button" type="button" onClick={() => setClearConfirmOpen(true)}>
                      <Trash2 size={14} /> Clear data
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>

      {entryModalOpen && (
        <div className="modal-backdrop" role="presentation">
          <div className="entry-modal" role="dialog" aria-modal="true" aria-labelledby="entry-modal-title">
            <div className="modal-header">
              <div>
                <h2 id="entry-modal-title">Create New Entry</h2>
                <p>{generatedRecord ? 'Edit the generated record before saving.' : 'Describe the practical work you completed.'}</p>
              </div>
              <button className="modal-close" type="button" aria-label="Close" onClick={cancelEntry}>
                <X size={20} />
              </button>
            </div>

            {!generatedRecord ? (
              <form className="modal-form" onSubmit={generateRecord}>
                {appError && <p className="modal-error" role="alert">{appError}</p>}
                <label>
                  Work description
                  <span className="field-hint">Speak with your dictation tool or type what you built, the commands used, errors, fixes, and what you learned.</span>
                  <textarea
                    rows="6"
                    placeholder="Describe what you built, configured, or debugged..."
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    required
                  />
                </label>
                <div className="modal-actions">
                  <button className="secondary-button" type="button" onClick={cancelEntry}>Cancel</button>
                  <button className="new-entry-button" type="submit" disabled={!description.trim()}>
                    <SparkleIcon />
                    <span>Generate Record</span>
                  </button>
                </div>
              </form>
            ) : (
              <form className="modal-form" onSubmit={saveEntry}>
                {appError && <p className="modal-error" role="alert">{appError}</p>}
                <div className="structured-record">
                  <label>
                    Title
                    <input
                      type="text"
                      value={generatedRecord.title}
                      onChange={(event) => updateGeneratedRecord('title', event.target.value)}
                      required
                    />
                  </label>
                  <label>
                    Category
                    <input
                      type="text"
                      value={generatedRecord.category}
                      onChange={(event) => updateGeneratedRecord('category', event.target.value)}
                      required
                    />
                  </label>
                  <label>
                    Status
                    <select
                      value={generatedRecord.status}
                      onChange={(event) => updateGeneratedRecord('status', event.target.value)}
                    >
                      <option>Completed</option>
                      <option>In Progress</option>
                    </select>
                  </label>
                  <label>
                    Tasks
                    <textarea
                      rows="4"
                      value={generatedRecord.tasks}
                      onChange={(event) => updateGeneratedRecord('tasks', event.target.value)}
                      required
                    />
                  </label>
                  <label>
                    Commands
                    <textarea
                      rows="3"
                      value={generatedRecord.commands}
                      onChange={(event) => updateGeneratedRecord('commands', event.target.value)}
                    />
                  </label>
                  <label>
                    Errors
                    <textarea
                      rows="3"
                      value={generatedRecord.errors}
                      onChange={(event) => updateGeneratedRecord('errors', event.target.value)}
                    />
                  </label>
                  <label>
                    Solutions
                    <textarea
                      rows="3"
                      value={generatedRecord.solutions}
                      onChange={(event) => updateGeneratedRecord('solutions', event.target.value)}
                    />
                  </label>
                  <label>
                    Learning outcomes
                    <textarea
                      rows="3"
                      value={generatedRecord.learnings}
                      onChange={(event) => updateGeneratedRecord('learnings', event.target.value)}
                    />
                  </label>
                  <label>
                    Next steps
                    <textarea
                      rows="3"
                      value={generatedRecord.nextSteps}
                      onChange={(event) => updateGeneratedRecord('nextSteps', event.target.value)}
                    />
                  </label>
                </div>
                <div className="modal-actions">
                  <button className="secondary-button" type="button" onClick={cancelEntry}>Cancel</button>
                  <button className="new-entry-button" type="submit">
                    <Check size={16} />
                    <span>Save Entry</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {detailRecord && (
              <div className="modal-backdrop" role="presentation">
                <div className="detail-modal" role="dialog" aria-modal="true" aria-labelledby="detail-title">
                  <div className="modal-header">
                    <div>
                      <div className="detail-badges">
                        <span className="detail-category">{detailRecord.category}</span>
                        <span className={`status status-${detailRecord.status === 'Completed' ? 'complete' : 'progress'}`}>
                          {detailRecord.status}
                        </span>
                      </div>
                      <h2 id="detail-title">{detailRecord.title}</h2>
                      <p>{detailRecord.date}</p>
                    </div>
                    <button className="modal-close" type="button" aria-label="Close details" onClick={() => setDetailRecord(null)}>
                      <X size={20} />
                    </button>
                  </div>
                  <div className="detail-content">
                    <div className="detail-block">
                      <h3>Steps and observations</h3>
                      <p>{detailRecord.steps}</p>
                    </div>
                    {detailRecord.learnings && (
                      <div className="detail-block detail-learnings">
                        <h3>Key learnings</h3>
                        <p>{detailRecord.learnings}</p>
                      </div>
                    )}

                    <div className="detail-actions">
                      <button className="secondary-button" type="button" onClick={() => setDetailRecord(null)}>Close</button>
                      <button className="secondary-button" type="button" onClick={() => downloadMarkdown(detailRecord)}>
                        <Download size={14} />
                        Export Markdown
                      </button>
                      <button className="new-entry-button" type="button" onClick={() => {
                        setDetailRecord(null)
                        editRecord(detailRecord)
                      }}>
                        <Check size={16} />
                        <span>Edit Entry</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
      )}

      {clearConfirmOpen && (
        <div className="modal-backdrop" role="presentation">
          <div className="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="clear-data-title">
            <div className="confirm-icon"><Trash2 size={20} /></div>
            <h2 id="clear-data-title">Clear all journal data?</h2>
            <p>This permanently removes all saved entries from this device. This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="secondary-button" type="button" onClick={() => setClearConfirmOpen(false)}>Cancel</button>
              <button className="danger-button danger-button-filled" type="button" onClick={clearAllRecords}>Clear all data</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function SparkleIcon() {
  return <Plus size={16} />
}

export default App
