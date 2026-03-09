"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Activity, Signal, Radio, Globe, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ContentLayerToggle } from '@/components/ContentLayerToggle'
import { Breadcrumb } from '@/components/Breadcrumb'
import { FormulaBlock } from '@/components/FormulaRenderer'
import { InteractiveTable } from '@/components/InteractiveTable'
import { CrossReference } from '@/components/CrossReference'
import { Badge } from '@/components/ui/badge'
import { ContentLayer } from '@/types'

const breadcrumbItems = [
  { label: 'Clause 9', href: '/clause9/' }
]

// Gap pattern data from parsed JSON
const gapPatternData = [
  { gapPatternId: 0, mglMs: 6, mgrpMs: 40 },
  { gapPatternId: 1, mglMs: 6, mgrpMs: 80 },
  { gapPatternId: 2, mglMs: 3, mgrpMs: 40 },
  { gapPatternId: 3, mglMs: 3, mgrpMs: 80 },
  { gapPatternId: 4, mglMs: 6, mgrpMs: 20 },
  { gapPatternId: 5, mglMs: 6, mgrpMs: 160 },
  { gapPatternId: 6, mglMs: 4, mgrpMs: 20 },
  { gapPatternId: 7, mglMs: 4, mgrpMs: 40 },
  { gapPatternId: 8, mglMs: 4, mgrpMs: 80 },
  { gapPatternId: 9, mglMs: 4, mgrpMs: 160 },
  { gapPatternId: 10, mglMs: 3, mgrpMs: 20 },
  { gapPatternId: 11, mglMs: 3, mgrpMs: 160 },
  { gapPatternId: 12, mglMs: 5.5, mgrpMs: 20 },
  { gapPatternId: 13, mglMs: 5.5, mgrpMs: 40 },
  { gapPatternId: 14, mglMs: 5.5, mgrpMs: 80 },
  { gapPatternId: 15, mglMs: 5.5, mgrpMs: 160 },
  { gapPatternId: 16, mglMs: 3.5, mgrpMs: 20 },
  { gapPatternId: 17, mglMs: 3.5, mgrpMs: 40 },
  { gapPatternId: 18, mglMs: 3.5, mgrpMs: 80 },
  { gapPatternId: 19, mglMs: 3.5, mgrpMs: 160 },
  { gapPatternId: 20, mglMs: 1.5, mgrpMs: 20 },
  { gapPatternId: 21, mglMs: 1.5, mgrpMs: 40 },
  { gapPatternId: 22, mglMs: 1.5, mgrpMs: 80 },
  { gapPatternId: 23, mglMs: 1.5, mgrpMs: 160 },
  { gapPatternId: 24, mglMs: 10, mgrpMs: 80 },
  { gapPatternId: 25, mglMs: 20, mgrpMs: 160 },
]

const crossReferences = [
  { from: '9.1', to: '9.2', type: 'relates_to' as const, description: 'Intra-frequency measurements' },
  { from: '9.1', to: '9.3', type: 'relates_to' as const, description: 'Inter-frequency measurements' },
  { from: '9.1', to: '10', type: 'relates_to' as const, description: 'Measurement accuracies' },
]

export default function Clause9Page() {
  const [contentLayer, setContentLayer] = useState<ContentLayer>('overview')

  return (
    <div className="py-8 px-4 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} className="mb-6" />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-green-500 flex items-center justify-center text-white">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Clause 9: Measurement Procedure</h1>
              <p className="text-muted-foreground">Intra-frequency, inter-frequency, and inter-RAT measurement requirements</p>
            </div>
          </div>

          {/* Content Layer Toggle */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <ContentLayerToggle 
              currentLayer={contentLayer} 
              onLayerChange={setContentLayer} 
            />
            <div className="flex gap-2">
              <Badge variant="fr1">FR1</Badge>
              <Badge variant="fr2">FR2</Badge>
            </div>
          </div>
        </motion.div>

        {/* Content based on layer */}
        {contentLayer === 'overview' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Expert Overview</CardTitle>
                <CardDescription>Measurement procedures and requirements summary</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Clause 9 of TS 38.133 specifies the measurement procedures that UEs must perform 
                  in RRC_CONNECTED state. These requirements cover intra-frequency, inter-frequency, 
                  and inter-RAT measurements, including measurement gaps, reporting delays, and 
                  accuracy requirements.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Signal className="w-4 h-4 text-nokia-blue" />
                      Measurement Types
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-nokia-blue mt-0.5" />
                        <span><strong>Intra-frequency:</strong> Same carrier frequency</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-nokia-blue mt-0.5" />
                        <span><strong>Inter-frequency:</strong> Different NR carrier</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-nokia-blue mt-0.5" />
                        <span><strong>Inter-RAT:</strong> E-UTRAN FDD/TDD</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Radio className="w-4 h-4 text-nokia-blue" />
                      Measurement Gaps
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-nokia-blue mt-0.5" />
                        <span>26 gap pattern configurations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-nokia-blue mt-0.5" />
                        <span>MGL: 1.5 ms to 20 ms</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-nokia-blue mt-0.5" />
                        <span>MGRP: 20 ms to 160 ms</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subclauses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="card-hover">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <Signal className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">9.2 Intra-frequency</CardTitle>
                      <CardDescription>Same carrier frequency measurements</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Cell identification requirements</li>
                    <li>• Measurement period for SSB-based measurements</li>
                    <li>• L1-RSRP measurement requirements</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="card-hover">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                      <Radio className="w-5 h-5 text-purple-600 dark:text-purple-300" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">9.3 Inter-frequency</CardTitle>
                      <CardDescription>Different NR carrier measurements</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Measurement gap requirements</li>
                    <li>• Cell identification with gaps</li>
                    <li>• Enhanced measurement requirements</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="card-hover">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                      <Globe className="w-5 h-5 text-green-600 dark:text-green-300" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">9.4 Inter-RAT</CardTitle>
                      <CardDescription>E-UTRAN FDD/TDD measurements</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• E-UTRAN FDD measurements</li>
                    <li>• E-UTRAN TDD measurements</li>
                    <li>• RSRP/RSRQ measurement requirements</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="card-hover">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                      <Activity className="w-5 h-5 text-amber-600 dark:text-amber-300" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">9.1.2 Measurement Gaps</CardTitle>
                      <CardDescription>Gap pattern configurations</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• 26 gap pattern configurations</li>
                    <li>• Per-UE and per-FR gaps</li>
                    <li>• Synchronous operation requirements</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {contentLayer === 'analysis' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>9.1.2 Measurement Gap Analysis</CardTitle>
                <CardDescription>Detailed examination of gap pattern configurations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">Gap Pattern Design</h4>
                  <p className="text-muted-foreground mb-4">
                    The 26 gap pattern configurations provide flexibility to balance measurement 
                    opportunity with service interruption. The Measurement Gap Length (MGL) ranges 
                    from 1.5 ms to 20 ms, while the Measurement Gap Repetition Period (MGRP) 
                    ranges from 20 ms to 160 ms.
                  </p>
                  
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h5 className="font-medium mb-2">Key Considerations</h5>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• <strong>Shorter MGL (1.5-3 ms):</strong> Minimizes service interruption, suitable for fast measurements</li>
                      <li>• <strong>Longer MGL (10-20 ms):</strong> Provides extended measurement opportunity for weak cells</li>
                      <li>• <strong>Shorter MGRP (20 ms):</strong> Faster measurement updates, higher interruption duty cycle</li>
                      <li>• <strong>Longer MGRP (160 ms):</strong> Lower interruption, slower measurement updates</li>
                    </ul>
                  </div>
                </div>

                <div className="section-divider" />

                <div>
                  <h4 className="font-semibold mb-2">CSSF (Cell Search and Selection Factor)</h4>
                  <p className="text-muted-foreground mb-4">
                    The Cell Search and Selection Factor accounts for the reduced measurement 
                    opportunity when gaps are configured. It scales the measurement period 
                    requirements based on the effective measurement time.
                  </p>

                  <FormulaBlock
                    formula="$CSSF = \\frac{MGRP}{MGRP - MGL}$"
                    label="CSSF Calculation"
                    description="Accounts for the duty cycle of measurement gaps"
                  />
                </div>

                <CrossReference 
                  references={crossReferences} 
                  currentClause="9.1" 
                />
              </CardContent>
            </Card>
          </motion.div>
        )}

        {contentLayer === 'verbatim' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>9.1.2 Measurement Gap</CardTitle>
                <CardDescription>Gap pattern configurations and requirements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="prose dark:prose-invert max-w-none">
                  <p>
                    UE requirements for measurement gaps to identify and measure cells. The gap 
                    pattern configurations are specified in Table 9.1.2-1.
                  </p>
                </div>

                <InteractiveTable
                  title="Table 9.1.2-1: Gap Pattern Configurations"
                  description="Measurement Gap Length (MGL) and Measurement Gap Repetition Period (MGRP) for each pattern"
                  columns={[
                    { key: 'gapPatternId', header: 'Gap Pattern ID', sortable: true },
                    { key: 'mglMs', header: 'MGL (ms)', sortable: true },
                    { key: 'mgrpMs', header: 'MGRP (ms)', sortable: true },
                  ]}
                  data={gapPatternData}
                  filterOptions={{
                    'MGRP (ms)': ['20', '40', '80', '160']
                  }}
                />

                <div className="bg-muted/50 rounded-lg p-4">
                  <h5 className="font-medium mb-2">Notes</h5>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Gap patterns 0-5 are mandatory for all UEs supporting measurement gaps</li>
                    <li>• Gap patterns 6-23 are optional and may be supported by the UE</li>
                    <li>• Gap patterns 24-25 are for specific measurement scenarios</li>
                    <li>• Per-FR measurement gaps allow independent gap configuration for FR1 and FR2</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}
