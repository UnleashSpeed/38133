// 3GPP TS 38.133 Data Types

export interface DocumentInfo {
  standard?: string;
  specification?: string;
  clause?: string;
  title?: string;
  version?: string;
  extracted_date?: string;
  parsed_date?: string;
  source?: string;
}

export interface TableData {
  table_id: string;
  title: string;
  columns: string[];
  rows: (string | number | Record<string, unknown>)[];
  notes?: string[];
  description?: string;
}

export interface Requirement {
  id: string;
  text: string;
  conditions?: string[];
  applicability?: string[];
}

export interface Subclause {
  clause_id: string;
  title: string;
  introduction?: { text: string };
  requirements?: Requirement[] | Record<string, unknown>;
  tables?: TableData[];
  formulas?: string[];
  subclauses?: Record<string, Subclause>;
  text?: string;
  description?: string;
  cross_references?: string[];
  notes?: string[];
  subsections?: Subclause[];
}

export interface Clause7Data {
  document_info: DocumentInfo;
  subclauses: Subclause[];
}

export interface Clause8Data {
  document_info: DocumentInfo;
  clauses: Subclause[];
}

export interface Clause9Data {
  document_info: DocumentInfo;
  clause_9: {
    clause_id: string;
    title: string;
    sections: Subclause[];
  };
}

export interface ExplanationSection {
  title: string;
  expert_technical_overview: string;
  detailed_analysis: string;
  key_parameters?: {
    parameter: string;
    value: string;
    significance: string;
  }[];
  relationships?: string[];
}

export interface ExplanationData {
  document_info: DocumentInfo;
  sections: Record<string, ExplanationSection>;
}

export interface NavItem {
  id: string;
  title: string;
  href: string;
  children?: NavItem[];
  isExpanded?: boolean;
}

export interface SearchResult {
  id: string;
  clauseId: string;
  title: string;
  content: string;
  type: 'requirement' | 'table' | 'formula' | 'explanation';
  relevance: number;
}

export interface CrossReference {
  from: string;
  to: string;
  type: 'depends_on' | 'relates_to' | 'supersedes';
  description?: string;
}

export type ContentLayer = 'overview' | 'analysis' | 'verbatim';

export interface FilterState {
  frequencyRange: ('FR1' | 'FR2' | 'FR2-1' | 'FR2-2')[];
  band: string[];
  scenario: string[];
  release: string[];
  searchQuery: string;
}

export interface TableColumn {
  key: string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
}
