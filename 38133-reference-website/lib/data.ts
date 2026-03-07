import { Clause7Data, Clause8Data, Clause9Data, ExplanationData, SearchResult } from '@/types'

// Data cache
let clause7Data: Clause7Data | null = null
let clause8Data: Clause8Data | null = null
let clause9Data: Clause9Data | null = null
let clause7Explanations: ExplanationData | null = null
let clause8Explanations: ExplanationData | null = null
let clause9Explanations: ExplanationData | null = null

export async function loadClause7Data(): Promise<Clause7Data> {
  if (clause7Data) return clause7Data
  try {
    const response = await fetch('/data/clause7_parsed.json')
    clause7Data = await response.json()
    return clause7Data!
  } catch (error) {
    console.error('Failed to load clause 7 data:', error)
    return {
      document_info: { standard: '3GPP TS 38.133', clause: '7', title: 'Timing' },
      subclauses: []
    }
  }
}

export async function loadClause8Data(): Promise<Clause8Data> {
  if (clause8Data) return clause8Data
  try {
    const response = await fetch('/data/clause8_parsed.json')
    clause8Data = await response.json()
    return clause8Data!
  } catch (error) {
    console.error('Failed to load clause 8 data:', error)
    return {
      document_info: { specification: '3GPP TS 38.133', clause: '8', title: 'Signalling Characteristics' },
      clauses: []
    }
  }
}

export async function loadClause9Data(): Promise<Clause9Data> {
  if (clause9Data) return clause9Data
  try {
    const response = await fetch('/data/clause9_parsed.json')
    clause9Data = await response.json()
    return clause9Data!
  } catch (error) {
    console.error('Failed to load clause 9 data:', error)
    return {
      document_info: { source: '3GPP TS 38.133', clause: '9', title: 'Measurement Procedure' },
      clause_9: { clause_id: '9', title: 'Measurement Procedure', sections: [] }
    }
  }
}

export async function loadClause7Explanations(): Promise<ExplanationData> {
  if (clause7Explanations) return clause7Explanations
  try {
    const response = await fetch('/data/clause7_explanations.json')
    clause7Explanations = await response.json()
    return clause7Explanations!
  } catch (error) {
    console.error('Failed to load clause 7 explanations:', error)
    return {
      document_info: { standard: '3GPP TS 38.133', clause: '7', title: 'Timing' },
      sections: {}
    }
  }
}

export async function loadClause8Explanations(): Promise<ExplanationData> {
  if (clause8Explanations) return clause8Explanations
  try {
    const response = await fetch('/data/clause8_explanations.json')
    clause8Explanations = await response.json()
    return clause8Explanations!
  } catch (error) {
    console.error('Failed to load clause 8 explanations:', error)
    return {
      document_info: { standard: '3GPP TS 38.133', clause: '8', title: 'Signalling Characteristics' },
      sections: {}
    }
  }
}

export async function loadClause9Explanations(): Promise<ExplanationData> {
  if (clause9Explanations) return clause9Explanations
  try {
    const response = await fetch('/data/clause9_explanations.json')
    clause9Explanations = await response.json()
    return clause9Explanations!
  } catch (error) {
    console.error('Failed to load clause 9 explanations:', error)
    return {
      document_info: { standard: '3GPP TS 38.133', clause: '9', title: 'Measurement Procedure' },
      sections: {}
    }
  }
}

// Search functionality
export async function searchAllClauses(query: string): Promise<SearchResult[]> {
  const results: SearchResult[] = []
  const lowerQuery = query.toLowerCase()

  // Search Clause 7
  const c7Data = await loadClause7Data()
  c7Data.subclauses.forEach(subclause => {
    searchSubclause(subclause, '7', results, lowerQuery)
  })

  // Search Clause 8
  const c8Data = await loadClause8Data()
  c8Data.clauses.forEach(clause => {
    searchSubclause(clause, '8', results, lowerQuery)
  })

  // Search Clause 9
  const c9Data = await loadClause9Data()
  c9Data.clause_9.sections.forEach(section => {
    searchSubclause(section, '9', results, lowerQuery)
  })

  return results.sort((a, b) => b.relevance - a.relevance)
}

function searchSubclause(
  subclause: { clause_id: string; title: string; text?: string; description?: string; requirements?: unknown[] },
  clauseNum: string,
  results: SearchResult[],
  query: string
) {
  const content = `${subclause.title} ${subclause.text || ''} ${subclause.description || ''}`.toLowerCase()
  
  if (content.includes(query)) {
    const relevance = calculateRelevance(content, query)
    results.push({
      id: `${clauseNum}-${subclause.clause_id}`,
      clauseId: subclause.clause_id,
      title: subclause.title,
      content: subclause.text || subclause.description || '',
      type: 'requirement',
      relevance
    })
  }
}

function calculateRelevance(content: string, query: string): number {
  const occurrences = (content.match(new RegExp(query, 'gi')) || []).length
  const position = content.indexOf(query)
  return occurrences * 10 + (position >= 0 ? Math.max(0, 100 - position) : 0)
}

// Get navigation structure
export function getNavigationStructure() {
  return [
    {
      id: '7',
      title: 'Clause 7: Timing',
      href: '/clause7/',
      children: [
        { id: '7.1', title: '7.1 UE Transmit Timing', href: '/clause7/#7-1' },
        { id: '7.1A', title: '7.1A RedCap Transmit Timing', href: '/clause7/#7-1A' },
        { id: '7.1C', title: '7.1C Satellite Transmit Timing', href: '/clause7/#7-1C' },
        { id: '7.1D', title: '7.1D ATG Transmit Timing', href: '/clause7/#7-1D' },
        { id: '7.2', title: '7.2 UE Timer Accuracy', href: '/clause7/#7-2' },
        { id: '7.3', title: '7.3 Timing Advance', href: '/clause7/#7-3' },
        { id: '7.4', title: '7.4 Cell Phase Synchronization', href: '/clause7/#7-4' },
        { id: '7.5', title: '7.5 Max TX Timing Difference', href: '/clause7/#7-5' },
        { id: '7.6', title: '7.6 Max RX Timing Difference', href: '/clause7/#7-6' },
        { id: '7.7', title: '7.7/7.9 deriveSSB-IndexFromCell', href: '/clause7/#7-7' },
      ]
    },
    {
      id: '8',
      title: 'Clause 8: Signalling Characteristics',
      href: '/clause8/',
      children: [
        { id: '8.3', title: '8.3 SCell Activation/Deactivation', href: '/clause8/#8-3' },
        { id: '8.10', title: '8.10/8.15-8.24 TCI State Switching', href: '/clause8/#8-10' },
      ]
    },
    {
      id: '9',
      title: 'Clause 9: Measurement Procedure',
      href: '/clause9/',
      children: [
        { id: '9.1', title: '9.1 General Requirements', href: '/clause9/#9-1' },
        { id: '9.2', title: '9.2 Intra-frequency Measurements', href: '/clause9/#9-2' },
        { id: '9.3', title: '9.3 Inter-frequency Measurements', href: '/clause9/#9-3' },
        { id: '9.4', title: '9.4 Inter-RAT Measurements', href: '/clause9/#9-4' },
      ]
    },
    {
      id: 'about',
      title: 'About This Reference',
      href: '/about/',
    }
  ]
}
