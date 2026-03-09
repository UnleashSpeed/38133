"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronDown, Clock, Radio, Activity, Info, Menu, X, Chrome as Home } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface NavItem {
  id: string
  title: string
  href: string
  icon?: React.ReactNode
  children?: NavItem[]
}

const navigation: NavItem[] = [
  {
    id: 'home',
    title: 'Home',
    href: '/',
    icon: <Home className="w-4 h-4" />
  },
  {
    id: '7',
    title: 'Clause 7: Timing',
    href: '/clause7/',
    icon: <Clock className="w-4 h-4" />,
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
    title: 'Clause 8: Signalling',
    href: '/clause8/',
    icon: <Radio className="w-4 h-4" />,
    children: [
      { id: '8.3', title: '8.3 SCell Activation', href: '/clause8/#8-3' },
      { id: '8.10', title: '8.10 TCI State Switching', href: '/clause8/#8-10' },
    ]
  },
  {
    id: '9',
    title: 'Clause 9: Measurement',
    href: '/clause9/',
    icon: <Activity className="w-4 h-4" />,
    children: [
      { id: '9.1', title: '9.1 General Requirements', href: '/clause9/#9-1' },
      { id: '9.2', title: '9.2 Intra-frequency', href: '/clause9/#9-2' },
      { id: '9.3', title: '9.3 Inter-frequency', href: '/clause9/#9-3' },
      { id: '9.4', title: '9.4 Inter-RAT', href: '/clause9/#9-4' },
    ]
  },
  {
    id: 'about',
    title: 'About',
    href: '/about/',
    icon: <Info className="w-4 h-4" />
  }
]

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>(['7', '8', '9'])

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href.replace(/#.*$/, ''))
  }

  const isChildActive = (href: string) => {
    return pathname === href || pathname.startsWith(href.replace(/#.*$/, ''))
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={onToggle}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          width: isOpen ? 280 : 0,
          opacity: isOpen ? 1 : 0 
        }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-background border-r border-border",
          "lg:translate-x-0 lg:opacity-100 lg:w-[280px]",
          !isOpen && "lg:w-[60px]"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center h-16 px-4 border-b border-border">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-nokia-blue flex items-center justify-center">
                <span className="text-white font-bold text-sm">38</span>
              </div>
              {(isOpen || typeof window !== 'undefined' && window.innerWidth >= 1024) && (
                <span className="font-semibold text-sm truncate">TS 38.133</span>
              )}
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-2 scrollbar-thin">
            <ul className="space-y-1">
              {navigation.map((item) => (
                <li key={item.id}>
                  {item.children ? (
                    <div>
                      <button
                        onClick={() => toggleExpand(item.id)}
                        className={cn(
                          "w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                          isActive(item.href) 
                            ? "bg-nokia-blue/10 text-nokia-blue font-medium" 
                            : "text-foreground hover:bg-muted"
                        )}
                      >
                        {item.icon}
                        <span className="flex-1 text-left">{item.title}</span>
                        {expandedItems.includes(item.id) ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                      
                      <AnimatePresence>
                        {expandedItems.includes(item.id) && (
                          <motion.ul
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden ml-4 mt-1 space-y-1"
                          >
                            {item.children.map((child) => (
                              <li key={child.id}>
                                <Link
                                  href={child.href}
                                  className={cn(
                                    "block px-3 py-1.5 rounded-md text-sm transition-colors",
                                    isChildActive(child.href)
                                      ? "bg-nokia-blue/10 text-nokia-blue font-medium"
                                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                  )}
                                >
                                  {child.title}
                                </Link>
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                        isActive(item.href)
                          ? "bg-nokia-blue/10 text-nokia-blue font-medium"
                          : "text-foreground hover:bg-muted"
                      )}
                    >
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              3GPP TS 38.133 Reference
            </p>
          </div>
        </div>
      </motion.aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onToggle}
        />
      )}
    </>
  )
}
