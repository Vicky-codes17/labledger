const escapeMarkdown = (value = '') => String(value).replace(/\r?\n/g, '\n')

export function recordToMarkdown(record) {
  return `# ${escapeMarkdown(record.title)}

- **Category:** ${escapeMarkdown(record.category)}
- **Status:** ${escapeMarkdown(record.status)}
- **Date:** ${escapeMarkdown(record.date)}

## Tasks

${escapeMarkdown(record.tasks || record.steps)}

## Commands

${escapeMarkdown(record.commands || 'None recorded.')}

## Errors

${escapeMarkdown(record.errors || 'None recorded.')}

## Solutions

${escapeMarkdown(record.solutions || 'None recorded.')}

## Learning outcomes

${escapeMarkdown(record.learnings || 'None recorded.')}

## Next steps

${escapeMarkdown(record.nextSteps || 'None recorded.')}
`
}

export function downloadMarkdown(record) {
  downloadFile(`${safeFilename(record.title)}.md`, recordToMarkdown(record), 'text/markdown;charset=utf-8')
}

export function downloadRecordsJson(records) {
  downloadFile('labledger-entries.json', JSON.stringify(records, null, 2), 'application/json;charset=utf-8')
}

function safeFilename(title) {
  return (title || 'labledger-entry')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80) || 'labledger-entry'
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}
