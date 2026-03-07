import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatClauseId(clauseId: string): string {
  return clauseId.replace(/\./g, '-')
}

export function unformatClauseId(clauseId: string): string {
  return clauseId.replace(/-/g, '.')
}

export function getClauseDepth(clauseId: string): number {
  return clauseId.split('.').length
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function highlightText(text: string, query: string): string {
  if (!query) return text
  const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi')
  return text.replace(regex, '<mark class="search-highlight">$1</mark>')
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function downloadCSV(data: Record<string, unknown>[], filename: string) {
  if (data.length === 0) return

  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header]
        if (value === null || value === undefined) return ''
        const stringValue = String(value)
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`
        }
        return stringValue
      }).join(',')
    )
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
  URL.revokeObjectURL(link.href)
}

export function sortData<T>(
  data: T[],
  key: keyof T,
  direction: 'asc' | 'desc'
): T[] {
  return [...data].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]
    
    if (aVal === null || aVal === undefined) return direction === 'asc' ? -1 : 1
    if (bVal === null || bVal === undefined) return direction === 'asc' ? 1 : -1
    
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return direction === 'asc' ? aVal - bVal : bVal - aVal
    }
    
    const aStr = String(aVal).toLowerCase()
    const bStr = String(bVal).toLowerCase()
    
    if (direction === 'asc') {
      return aStr < bStr ? -1 : aStr > bStr ? 1 : 0
    }
    return aStr > bStr ? -1 : aStr < bStr ? 1 : 0
  })
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function extractFormulas(text: string): string[] {
  const formulaRegex = /\$[^$]+\$/g
  return text.match(formulaRegex) || []
}

export function cleanFormula(formula: string): string {
  return formula.replace(/^\$|\$$/g, '').trim()
}

export function getFrequencyRangeFromText(text: string): string[] {
  const ranges: string[] = []
  if (text.includes('FR1')) ranges.push('FR1')
  if (text.includes('FR2-2')) ranges.push('FR2-2')
  else if (text.includes('FR2-1')) ranges.push('FR2-1')
  else if (text.includes('FR2')) ranges.push('FR2')
  return ranges
}
