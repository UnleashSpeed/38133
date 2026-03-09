"use client"

import React from 'react'
import Link from 'next/link'
import { ChevronRight, Chrome as Home } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav className={cn("flex items-center text-sm", className)}>
      <ol className="flex items-center flex-wrap gap-1">
        <li>
          <Link 
            href="/"
            className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <Home className="w-4 h-4" />
          </Link>
        </li>
        
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <li>
              <ChevronRight className="w-4 h-4 text-muted-foreground mx-1" />
            </li>
            <li>
              {item.href ? (
                <Link
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-foreground font-medium">
                  {item.label}
                </span>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  )
}

// Generate breadcrumb from clause path
interface ClauseBreadcrumbProps {
  clause: string
  subclause?: string
  className?: string
}

export function ClauseBreadcrumb({ clause, subclause, className }: ClauseBreadcrumbProps) {
  const items: BreadcrumbItem[] = [
    { label: `Clause ${clause}`, href: `/clause${clause}/` }
  ]
  
  if (subclause) {
    items.push({ label: subclause })
  }
  
  return <Breadcrumb items={items} className={className} />
}
