import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Link2,
  ArrowRight,
  ExternalLink,
  BookOpen,
  ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'

interface CrossReferenceItem {
  from: string
  to: string
  type: 'depends_on' | 'relates_to' | 'supersedes' | 'referenced_by'
  description?: string
  preview?: string
}

interface CrossReferenceProps {
  references: CrossReferenceItem[]
  currentClause: string
  className?: string
}

const typeLabels: Record<string, { label: string; color: string }> = {
  depends_on: { label: 'Depends On', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100' },
  relates_to: { label: 'Related', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' },
  supersedes: { label: 'Supersedes', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100' },
  referenced_by: { label: 'Referenced By', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100' },
}

export function CrossReference({
  references,
  currentClause,
  className
}: CrossReferenceProps) {
  const [expandedRef, setExpandedRef] = useState<string | null>(null)

  const relatedRefs = references.filter(
    ref => ref.from === currentClause || ref.to === currentClause
  )

  if (relatedRefs.length === 0) return null

  const groupedRefs = relatedRefs.reduce((acc, ref) => {
    const type = ref.type
    if (!acc[type]) acc[type] = []
    acc[type].push(ref)
    return acc
  }, {} as Record<string, CrossReferenceItem[]>)

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-2">
        <Link2 className="w-4 h-4 text-nokia-blue" />
        <h4 className="text-sm font-semibold">Cross References</h4>
      </div>

      <div className="space-y-3">
        {Object.entries(groupedRefs).map(([type, refs]) => (
          <div key={type} className="space-y-2">
            <Badge className={typeLabels[type]?.color || ''}>
              {typeLabels[type]?.label || type}
            </Badge>

            <div className="space-y-1">
              {refs.map((crossRef, i) => {
                const isOutgoing = crossRef.from === currentClause
                const targetClause = isOutgoing ? crossRef.to : crossRef.from
                const targetHref = getClauseHref(targetClause)

                return (
                  <CrossReferenceLink
                    key={i}
                    crossRef={crossRef}
                    isOutgoing={isOutgoing}
                    targetClause={targetClause}
                    targetHref={targetHref}
                  />
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

interface CrossReferenceLinkProps {
  crossRef: CrossReferenceItem
  isOutgoing: boolean
  targetClause: string
  targetHref: string
}

function CrossReferenceLink({
  crossRef,
  isOutgoing,
  targetClause,
  targetHref
}: CrossReferenceLinkProps) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Link
          to={targetHref}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-md text-sm",
            "bg-muted/50 hover:bg-muted transition-colors group"
          )}
        >
          {isOutgoing ? (
            <ArrowRight className="w-3 h-3 text-muted-foreground" />
          ) : (
            <ArrowRight className="w-3 h-3 text-muted-foreground rotate-180" />
          )}

          <span className="font-mono text-nokia-blue">
            {targetClause}
          </span>

          {crossRef.description && (
            <span className="text-muted-foreground truncate flex-1">
              {crossRef.description}
            </span>
          )}

          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
      </HoverCardTrigger>

      {crossRef.preview && (
        <HoverCardContent className="w-80">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-nokia-blue" />
              <span className="font-medium">Clause {targetClause}</span>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-4">
              {crossRef.preview}
            </p>
          </div>
        </HoverCardContent>
      )}
    </HoverCard>
  )
}

function getClauseHref(clauseId: string): string {
  const parts = clauseId.split('.')
  const mainClause = parts[0]
  return `/clause${mainClause}/#${clauseId.replace(/\./g, '-')}`
}

interface InlineCrossRefProps {
  clauseId: string
  children?: React.ReactNode
  className?: string
}

export function InlineCrossRef({
  clauseId,
  children,
  className
}: InlineCrossRefProps) {
  const href = getClauseHref(clauseId)

  return (
    <Link
      to={href}
      className={cn(
        "inline-flex items-center gap-1 text-nokia-blue hover:underline",
        className
      )}
    >
      {children || clauseId}
      <ChevronRight className="w-3 h-3" />
    </Link>
  )
}

interface CrossRefBadgeProps {
  clauseId: string
  type?: 'fr1' | 'fr2' | 'default'
}

export function CrossRefBadge({ clauseId, type = 'default' }: CrossRefBadgeProps) {
  const href = getClauseHref(clauseId)
  const variant = type === 'fr1' ? 'fr1' : type === 'fr2' ? 'fr2' : 'default'

  return (
    <Link to={href}>
      <Badge variant={variant} className="cursor-pointer hover:opacity-80">
        {clauseId}
      </Badge>
    </Link>
  )
}
