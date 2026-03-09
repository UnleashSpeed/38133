import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Clock,
  Radio,
  Activity,
  ArrowRight,
  BookOpen,
  Search,
  FileText,
  Calculator
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const features = [
  {
    icon: <BookOpen className="w-5 h-5" />,
    title: 'Three-Layer Content',
    description: 'Expert overview, detailed analysis, and verbatim specification text'
  },
  {
    icon: <Search className="w-5 h-5" />,
    title: 'Semantic Search',
    description: 'Find requirements, tables, and formulas instantly'
  },
  {
    icon: <FileText className="w-5 h-5" />,
    title: 'Interactive Tables',
    description: 'Filter, sort, and export data with ease'
  },
  {
    icon: <Calculator className="w-5 h-5" />,
    title: 'Formula Rendering',
    description: 'Beautifully rendered mathematical expressions'
  }
]

const clauses = [
  {
    id: '7',
    title: 'Clause 7: Timing',
    description: 'UE transmit timing, timer accuracy, timing advance, and synchronization requirements',
    icon: <Clock className="w-6 h-6" />,
    href: '/clause7',
    subclauses: ['7.1 UE Transmit Timing', '7.2 UE Timer Accuracy', '7.3 Timing Advance', '7.4 Cell Phase Synchronization'],
    color: 'bg-blue-500'
  },
  {
    id: '8',
    title: 'Clause 8: Signalling Characteristics',
    description: 'SCell activation/deactivation and TCI state switching requirements',
    icon: <Radio className="w-6 h-6" />,
    href: '/clause8',
    subclauses: ['8.3 SCell Activation', '8.10 TCI State Switching'],
    color: 'bg-purple-500'
  },
  {
    id: '9',
    title: 'Clause 9: Measurement Procedure',
    description: 'Intra-frequency, inter-frequency, and inter-RAT measurement requirements',
    icon: <Activity className="w-6 h-6" />,
    href: '/clause9',
    subclauses: ['9.1 General Requirements', '9.2 Intra-frequency', '9.3 Inter-frequency', '9.4 Inter-RAT'],
    color: 'bg-green-500'
  }
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <section className="relative py-20 px-4 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-nokia-light/50 via-background to-background dark:from-nokia-navy/20" />

        <div className="relative max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6"
          >
            <Badge variant="nokia" className="mb-4">
              3GPP Technical Specification
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              <span className="gradient-text">TS 38.133</span>
              <span className="block text-2xl md:text-3xl lg:text-4xl font-medium text-muted-foreground mt-2">
                NR Requirements for RRM
              </span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive reference for Clauses 7, 8, and 9 covering timing requirements,
              signalling characteristics, and measurement procedures.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link to="/clause7">
                <Button size="lg" variant="nokia">
                  Explore Clauses
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-4 lg:px-8 border-t">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full card-hover">
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
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 lg:px-8 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl font-bold mb-2">Explore by Clause</h2>
            <p className="text-muted-foreground">Navigate directly to specific sections</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {clauses.map((clause, index) => (
              <motion.div
                key={clause.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <Link to={clause.href}>
                  <Card className="h-full card-hover cursor-pointer group">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center text-white", clause.color)}>
                          {clause.icon}
                        </div>
                        <ArrowRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <CardTitle className="text-xl mt-4">{clause.title}</CardTitle>
                      <CardDescription>{clause.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {clause.subclauses.map((sub) => (
                          <Badge key={sub} variant="secondary" className="text-xs">
                            {sub.split(' ')[0]}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '3', label: 'Main Clauses' },
              { value: '20+', label: 'Subclauses' },
              { value: '50+', label: 'Requirements' },
              { value: '30+', label: 'Tables' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <div className="text-3xl md:text-4xl font-bold text-nokia-blue">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
