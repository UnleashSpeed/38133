"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  Lightbulb, 
  FileText,
  Eye
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ContentLayer } from '@/types'

interface ContentLayerToggleProps {
  currentLayer: ContentLayer
  onLayerChange: (layer: ContentLayer) => void
  className?: string
}

const layers: { id: ContentLayer; label: string; icon: React.ReactNode; description: string }[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: <Eye className="w-4 h-4" />,
    description: 'Expert summary and key points'
  },
  {
    id: 'analysis',
    label: 'Analysis',
    icon: <Lightbulb className="w-4 h-4" />,
    description: 'Detailed technical analysis'
  },
  {
    id: 'verbatim',
    label: 'Verbatim',
    icon: <FileText className="w-4 h-4" />,
    description: 'Original specification text'
  }
]

export function ContentLayerToggle({ 
  currentLayer, 
  onLayerChange,
  className 
}: ContentLayerToggleProps) {
  return (
    <div className={cn(
      "inline-flex items-center gap-1 p-1 bg-muted rounded-lg",
      className
    )}>
      {layers.map((layer) => (
        <button
          key={layer.id}
          onClick={() => onLayerChange(layer.id)}
          className={cn(
            "relative flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all",
            currentLayer === layer.id
              ? "text-white"
              : "text-muted-foreground hover:text-foreground hover:bg-muted-foreground/10"
          )}
        >
          {currentLayer === layer.id && (
            <motion.div
              layoutId="activeLayer"
              className="absolute inset-0 bg-nokia-blue rounded-md"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }
            />
          )}
          <span className="relative z-10 flex items-center gap-2">
            {layer.icon}
            {layer.label}
          </span>
        </button>
      ))}
    </div>
  )
}

// Compact version for mobile
interface CompactLayerToggleProps {
  currentLayer: ContentLayer
  onLayerChange: (layer: ContentLayer) => void
  className?: string
}

export function CompactLayerToggle({ 
  currentLayer, 
  onLayerChange,
  className 
}: CompactLayerToggleProps) {
  return (
    <div className={cn(
      "flex items-center gap-1",
      className
    )}>
      {layers.map((layer) => (
        <button
          key={layer.id}
          onClick={() => onLayerChange(layer.id)}
          title={layer.description}
          className={cn(
            "p-2 rounded-md transition-all",
            currentLayer === layer.id
              ? "bg-nokia-blue text-white"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          )}
        >
          {layer.icon}
        </button>
      ))}
    </div>
  )
}

// Layer indicator badge
interface LayerBadgeProps {
  layer: ContentLayer
  className?: string
}

export function LayerBadge({ layer, className }: LayerBadgeProps) {
  const layerInfo = layers.find(l => l.id === layer)
  
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-full",
      layer === 'overview' && "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
      layer === 'analysis' && "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100",
      layer === 'verbatim' && "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100",
      className
    )}>
      {layerInfo?.icon}
      {layerInfo?.label}
    </span>
  )
}
