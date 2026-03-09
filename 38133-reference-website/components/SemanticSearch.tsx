"use client"

import React, { useState, useCallback, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Loader as Loader2, FileText, Table, Calculator, Sparkles, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { debounce } from '@/lib/utils'

interface SearchResult {
  id: string
  clauseId: string
  title: string
  content: string
  type: 'requirement' | 'table' | 'formula' | 'explanation'
  relevance: number
  clause: string
}

interface SemanticSearchProps {
  className?: string
  placeholder?: string
  onResultSelect?: (result: SearchResult) => void
}

const typeIcons: Record<string, React.ReactNode> = {
  requirement: <FileText className="w-4 h-4" />,
  table: <Table className="w-4 h-4" />,
  formula: <Calculator className="w-4 h-4" />,
  explanation: <Sparkles className="w-4 h-4" />,
}

const typeLabels: Record<string, string> = {
  requirement: 'Requirement',
  table: 'Table',
  formula: 'Formula',
  explanation: 'Explanation',
}

export function SemanticSearch({ 
  className,
  placeholder = "Search clauses, requirements, tables...",
  onResultSelect
}: SemanticSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const router = useRouter()

  // Mock search function - in production this would use Fuse.js or similar
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))

    // Mock results based on query
    const mockResults = [
      {
        id: '7.1.2-1',
        clauseId: '7.1.2',
        title: 'UE Transmit Timing Requirements',
        content: `The UE initial transmission timing error shall be less than or equal to ±Te where the timing error limit value Te is specified in table 7.1.2-1.`,
        type: 'requirement',
        relevance: 95,
        clause: '7'
      },
      {
        id: '7.1.2-table',
        clauseId: '7.1.2-1',
        title: 'Te Timing Error Limit',
        content: 'Table showing Te values for different frequency ranges and SCS configurations.',
        type: 'table',
        relevance: 90,
        clause: '7'
      },
      {
        id: '8.3.2-1',
        clauseId: '8.3.2',
        title: 'SCell Activation Delay',
        content: 'UE shall be capable to transmit valid CSI report and apply actions no later than specified slot.',
        type: 'requirement',
        relevance: 85,
        clause: '8'
      },
      {
        id: '9.1.2-table',
        clauseId: '9.1.2-1',
        title: 'Gap Pattern Configurations',
        content: 'Measurement gap length and repetition period configurations for various gap patterns.',
        type: 'table',
        relevance: 80,
        clause: '9'
      },
    ].filter(r => 
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.clauseId.includes(searchQuery)
    )

    setResults(mockResults as SearchResult[])
    setIsLoading(false)
  }, [])

  const debouncedSearch = useMemo(
    () => debounce(performSearch, 200),
    [performSearch]
  )

  useEffect(() => {
    debouncedSearch(query)
  }, [query, debouncedSearch])

  const handleSelect = (result: SearchResult) => {
    setIsOpen(false)
    setQuery('')
    if (onResultSelect) {
      onResultSelect(result)
    } else {
      router.push(getResultHref(result))
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => Math.max(prev - 1, -1))
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault()
      handleSelect(results[selectedIndex])
    } else if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  const getResultHref = (result: SearchResult): string => {
    return `/clause${result.clause}/#${result.clauseId.replace(/\./g, '-')}`
  }

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text
    const parts = text.split(new RegExp(`(${query})`, 'gi'))
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className="bg-yellow-200 dark:bg-yellow-900/50 px-0.5 rounded">
          {part}
        </mark>
      ) : part
    )
  }

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
            setSelectedIndex(-1)
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="pl-9 pr-10 w-full"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('')
              setResults([])
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (query || results.length > 0) && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Results dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-popover border rounded-lg shadow-lg z-50 max-h-[400px] overflow-auto"
            >
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                </div>
              ) : results.length === 0 ? (
                query ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No results found for &quot;{query}&quot;</p>
                    <p className="text-sm mt-1">Try searching for clause numbers or keywords</p>
                  </div>
                ) : (
                  <div className="p-4 text-sm text-muted-foreground">
                    <p className="font-medium mb-2">Popular searches:</p>
                    <div className="flex flex-wrap gap-2">
                      {['7.1.2', '8.3.2', '9.1.2', 'SCell', 'timing', 'measurement'].map(term => (
                        <button
                          key={term}
                          onClick={() => {
                            setQuery(term)
                            performSearch(term)
                          }}
                          className="px-2 py-1 bg-muted rounded text-xs hover:bg-muted/80"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              ) : (
                <div className="py-2">
                  <div className="px-3 py-1.5 text-xs font-medium text-muted-foreground uppercase">
                    {results.length} result{results.length !== 1 ? 's' : ''}
                  </div>
                  
                  {results.map((result, index) => (
                    <button
                      key={result.id}
                      onClick={() => handleSelect(result)}
                      className={cn(
                        "w-full px-3 py-2.5 text-left hover:bg-muted transition-colors",
                        selectedIndex === index && "bg-muted"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 text-muted-foreground">
                          {typeIcons[result.type]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">
                              {highlightMatch(result.title, query)}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {result.clauseId}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                            {highlightMatch(result.content, query)}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <Badge 
                              variant="secondary" 
                              className="text-[10px]"
                            >
                              {typeLabels[result.type]}
                            </Badge>
                            <span className="text-[10px] text-muted-foreground">
                              Clause {result.clause}
                            </span>
                            {result.relevance > 90 && (
                              <Badge 
                                variant="nokia" 
                                className="text-[10px]"
                              >
                                High relevance
                              </Badge>
                            )}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

// Search bar for header
interface HeaderSearchProps {
  className?: string
}

export function HeaderSearch({ className }: HeaderSearchProps) {
  return (
    <div className={cn("w-full max-w-md", className)}>
      <SemanticSearch 
        placeholder="Search TS 38.133..."
        className="w-full"
      />
    </div>
  )
}
