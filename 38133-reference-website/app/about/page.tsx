"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  Code, 
  Database, 
  FileText, 
  Github, 
  ExternalLink,
  CheckCircle,
  Layers,
  Search,
  Table,
  Calculator
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Breadcrumb } from '@/components/Breadcrumb'

const breadcrumbItems = [
  { label: 'About', href: '/about/' }
]

const features = [
  {
    icon: <Layers className="w-5 h-5" />,
    title: 'Three-Layer Content View',
    description: 'Switch between Expert Overview, Detailed Analysis, and Verbatim Specification text'
  },
  {
    icon: <Search className="w-5 h-5" />,
    title: 'Semantic Search',
    description: 'Full-text search across all clauses with relevance scoring and result highlighting'
  },
  {
    icon: <Table className="w-5 h-5" />,
    title: 'Interactive Tables',
    description: 'Filter, sort, search, and export tabular data with advanced controls'
  },
  {
    icon: <Calculator className="w-5 h-5" />,
    title: 'Formula Rendering',
    description: 'Beautifully rendered mathematical formulas using KaTeX'
  }
]

const techStack = [
  { name: 'Next.js 15', description: 'React framework with App Router', category: 'Framework' },
  { name: 'TypeScript', description: 'Type-safe JavaScript', category: 'Language' },
  { name: 'Tailwind CSS', description: 'Utility-first CSS framework', category: 'Styling' },
  { name: 'shadcn/ui', description: 'Accessible UI components', category: 'Components' },
  { name: 'KaTeX', description: 'Math formula rendering', category: 'Math' },
  { name: 'Framer Motion', description: 'Animation library', category: 'Animation' },
  { name: 'Fuse.js', description: 'Fuzzy search library', category: 'Search' },
]

const dataSources = [
  {
    file: 'clause7_parsed.json',
    description: 'Parsed timing requirements from Clause 7',
    size: '~68 KB'
  },
  {
    file: 'clause8_parsed.json',
    description: 'Parsed signalling characteristics from Clause 8',
    size: '~80 KB'
  },
  {
    file: 'clause9_parsed.json',
    description: 'Parsed measurement procedures from Clause 9',
    size: '~78 KB'
  },
  {
    file: 'clause7_explanations.json',
    description: 'Expert explanations for Clause 7',
    size: '~46 KB'
  },
  {
    file: 'clause8_explanations.json',
    description: 'Expert explanations for Clause 8',
    size: '~55 KB'
  },
  {
    file: 'clause9_explanations.json',
    description: 'Expert explanations for Clause 9',
    size: '~29 KB'
  },
]

export default function AboutPage() {
  return (
    <div className="py-8 px-4 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} className="mb-6" />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-3xl font-bold mb-4">About This Reference</h1>
          <p className="text-lg text-muted-foreground">
            A comprehensive, interactive reference for 3GPP TS 38.133 Clauses 7, 8, and 9
          </p>
        </motion.div>

        {/* Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-nokia-blue" />
                Document Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                This reference website provides an interactive, searchable interface to the 
                3GPP TS 38.133 specification for NR Requirements for support of radio resource 
                management. It covers:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                  <span><strong>Clause 7:</strong> Timing requirements including UE transmit timing, timer accuracy, and timing advance</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                  <span><strong>Clause 8:</strong> Signalling characteristics including SCell activation/deactivation and TCI state switching</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                  <span><strong>Clause 9:</strong> Measurement procedures including intra-frequency, inter-frequency, and inter-RAT measurements</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-xl font-semibold mb-4">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <Card key={feature.title} className="card-hover">
                <CardHeader className="pb-3">
                  <div className="w-10 h-10 rounded-lg bg-nokia-blue/10 flex items-center justify-center text-nokia-blue mb-3">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-base">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-xl font-semibold mb-4">Technology Stack</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {techStack.map((tech) => (
                  <div key={tech.name} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <div className="font-medium">{tech.name}</div>
                      <div className="text-sm text-muted-foreground">{tech.description}</div>
                    </div>
                    <Badge variant="secondary">{tech.category}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Data Sources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-xl font-semibold mb-4">Data Sources</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {dataSources.map((source) => (
                  <div key={source.file} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Database className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="font-mono text-sm">{source.file}</div>
                        <div className="text-sm text-muted-foreground">{source.description}</div>
                      </div>
                    </div>
                    <Badge variant="outline">{source.size}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-amber-200 dark:border-amber-900">
            <CardHeader>
              <CardTitle className="text-amber-800 dark:text-amber-200 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Disclaimer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This reference is provided for informational purposes only. While every effort 
                has been made to ensure accuracy, the official 3GPP specifications should always 
                be consulted for definitive requirements. This website is not affiliated with 
                3GPP or its member organizations.
              </p>
              <div className="mt-4 flex items-center gap-4">
                <a 
                  href="https://www.3gpp.org/specifications" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-nokia-blue hover:underline text-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  Official 3GPP Specifications
                </a>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
