"use client"

import React, { useEffect, useRef } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import { cn } from '@/lib/utils'

interface FormulaRendererProps {
  formula: string
  displayMode?: boolean
  className?: string
}

export function FormulaRenderer({ 
  formula, 
  displayMode = false,
  className 
}: FormulaRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current && formula) {
      try {
        // Clean the formula (remove $ if present)
        const cleanFormula = formula.replace(/^\$|\$$/g, '').trim()
        
        katex.render(cleanFormula, containerRef.current, {
          displayMode,
          throwOnError: false,
          strict: false,
          trust: true,
        })
      } catch (error) {
        console.error('KaTeX rendering error:', error)
        if (containerRef.current) {
          containerRef.current.textContent = formula
        }
      }
    }
  }, [formula, displayMode])

  if (!formula) return null

  return (
    <div 
      ref={containerRef}
      className={cn(
        "katex-wrapper",
        displayMode && "katex-display my-4",
        className
      )}
    />
  )
}

interface FormulaBlockProps {
  formula: string
  label?: string
  description?: string
  className?: string
}

export function FormulaBlock({ 
  formula, 
  label,
  description,
  className 
}: FormulaBlockProps) {
  return (
    <div className={cn(
      "formula-block bg-nokia-light/50 dark:bg-nokia-navy/30 rounded-lg p-4 my-4 border border-nokia-blue/20",
      className
    )}>
      {label && (
        <div className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
          {label}
        </div>
      )}
      <FormulaRenderer formula={formula} displayMode />
      {description && (
        <p className="text-sm text-muted-foreground mt-3">{description}</p>
      )}
    </div>
  )
}

interface FormulaWithVariablesProps {
  formula: string
  variables: { symbol: string; description: string }[]
  className?: string
}

export function FormulaWithVariables({ 
  formula, 
  variables,
  className 
}: FormulaWithVariablesProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <FormulaBlock formula={formula} />
      
      {variables.length > 0 && (
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="text-sm font-medium mb-3">Variable Definitions</h4>
          <dl className="space-y-2">
            {variables.map((v, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <dt className="font-mono text-nokia-blue min-w-[80px]">
                  <FormulaRenderer formula={v.symbol} />
                </dt>
                <dd className="text-muted-foreground">{v.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  )
}

// Extract formulas from text and render them
interface TextWithFormulasProps {
  text: string
  className?: string
}

export function TextWithFormulas({ text, className }: TextWithFormulasProps) {
  // Split text by formula patterns ($...$)
  const parts = text.split(/(\$[^$]+\$)/g)

  return (
    <span className={className}>
      {parts.map((part, i) => {
        if (part.startsWith('$') && part.endsWith('$')) {
          return <FormulaRenderer key={i} formula={part} displayMode={false} />
        }
        return <span key={i}>{part}</span>
      })}
    </span>
  )
}
