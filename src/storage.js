const STORAGE_KEY = 'labledger_records'

const isValidRecord = (record) =>
  record &&
  typeof record === 'object' &&
  typeof record.id === 'string' &&
  typeof record.title === 'string' &&
  typeof record.category === 'string' &&
  typeof record.date === 'string' &&
  typeof record.status === 'string' &&
  typeof record.steps === 'string'

const normalizeRecords = (value) => {
  if (!Array.isArray(value)) return null

  const validRecords = value.filter(isValidRecord)
  return validRecords.length === value.length ? validRecords : null
}

export function loadRecords(fallbackRecords = []) {
  if (typeof window === 'undefined' || !window.localStorage) return fallbackRecords

  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEY)
    if (storedValue === null) return fallbackRecords

    const parsedValue = JSON.parse(storedValue)
    return normalizeRecords(parsedValue) ?? fallbackRecords
  } catch (error) {
    console.error('Unable to load saved journal entries.', error)
    return fallbackRecords
  }
}

export function saveRecords(records) {
  const validRecords = normalizeRecords(records)
  if (!validRecords) {
    console.error('Unable to save journal entries: invalid record data.')
    return false
  }

  if (typeof window === 'undefined' || !window.localStorage) return false

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(validRecords))
    return true
  } catch (error) {
    console.error('Unable to save journal entries.', error)
    return false
  }
}

export function updateRecord(records, updatedRecord) {
  if (!isValidRecord(updatedRecord)) return records

  return records.map((record) => (record.id === updatedRecord.id ? updatedRecord : record))
}

export function deleteRecord(records, recordId) {
  return records.filter((record) => record.id !== recordId)
}

export function clearRecords() {
  if (typeof window === 'undefined' || !window.localStorage) return false

  try {
    window.localStorage.removeItem(STORAGE_KEY)
    return true
  } catch (error) {
    console.error('Unable to clear journal entries.', error)
    return false
  }
}
