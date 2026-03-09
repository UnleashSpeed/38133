"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, Table, Calculator, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ContentLayerToggle } from '@/components/ContentLayerToggle'
import { Breadcrumb } from '@/components/Breadcrumb'
import { FormulaBlock } from '@/components/FormulaRenderer'
import { InteractiveTable } from '@/components/InteractiveTable'
import { CrossReference } from '@/components/CrossReference'
import { Badge } from '@/components/ui/badge'
import { ContentLayer } from '@/types'

const breadcrumbItems = [
  { label: 'Clause 7', href: '/clause7/' }
]

const subclauses = [
  {
    id: '7.1',
    title: '7.1 UE Transmit Timing',
    description: 'Requirements for UE transmit timing accuracy and adjustment',
    formulas: [
      { formula: '$(N_{TA}+N_{TA\\ offset})\\times T_{c}$', description: 'Uplink frame transmission timing advance' },
      { formula: '$T_{new}-(N_{TA}+N_{TA\\ offset})+2 (T_{old}-T_{new})$', description: 'Timing adjustment formula' }
    ]
  },
  {
    id: '7.1A',
    title: '7.1A RedCap Transmit Timing',
    description: 'Transmit timing requirements for Reduced Capability UEs'
  },
  {
    id: '7.1C',
    title: '7.1C Satellite Transmit Timing',
    description: 'Transmit timing for NTN (Non-Terrestrial Network) scenarios'
  },
  {
    id: '7.1D',
    title: '7.1D ATG Transmit Timing',
    description: 'Air-to-Ground transmit timing requirements'
  },
  {
    id: '7.2',
    title: '7.2 UE Timer Accuracy',
    description: 'Accuracy requirements for UE timers'
  },
  {
    id: '7.3',
    title: '7.3 Timing Advance',
    description: 'Timing advance command and adjustment procedures'
  },
  {
    id: '7.4',
    title: '7.4 Cell Phase Synchronization',
    description: 'Requirements for cell phase synchronization accuracy'
  },
  {
    id: '7.5',
    title: '7.5 Max TX Timing Difference',
    description: 'Maximum transmit timing difference requirements'
  },
  {
    id: '7.6',
    title: '7.6 Max RX Timing Difference',
    description: 'Maximum receive timing difference requirements'
  },
  {
    id: '7.7',
    title: '7.7/7.9 deriveSSB-IndexFromCell',
    description: 'SSB index derivation from cell requirements'
  }
]

// Sample table data for 7.1.2-1
const timingErrorData = [
  { frequencyRange: 'FR1', scsSSB: '15', scsUL: '15', te: '12×64×Tc' },
  { frequencyRange: 'FR1', scsSSB: '15', scsUL: '30', te: '10×64×Tc' },
  { frequencyRange: 'FR1', scsSSB: '15', scsUL: '60', te: '10×64×Tc' },
  { frequencyRange: 'FR1', scsSSB: '30', scsUL: '15', te: '8×64×Tc' },
  { frequencyRange: 'FR1', scsSSB: '30', scsUL: '30', te: '8×64×Tc' },
  { frequencyRange: 'FR1', scsSSB: '30', scsUL: '60', te: '7×64×Tc' },
  { frequencyRange: 'FR2-1', scsSSB: '120', scsUL: '60', te: '3.5×64×Tc' },
  { frequencyRange: 'FR2-1', scsSSB: '120', scsUL: '120', te: '3.5×64×Tc' },
  { frequencyRange: 'FR2-1', scsSSB: '240', scsUL: '60', te: '3×64×Tc' },
  { frequencyRange: 'FR2-1', scsSSB: '240', scsUL: '120', te: '3×64×Tc' },
  { frequencyRange: 'FR2-2', scsSSB: '120', scsUL: '120', te: '3.5×64×Tc' },
  { frequencyRange: 'FR2-2', scsSSB: '120', scsUL: '480', te: '1.58×64×Tc' },
  { frequencyRange: 'FR2-2', scsSSB: '480', scsUL: '120', te: '2.86×64×Tc' },
  { frequencyRange: 'FR2-2', scsSSB: '480', scsUL: '480', te: '1.35×64×Tc' },
  { frequencyRange: 'FR2-2', scsSSB: '480', scsUL: '960', te: '0.90×64×Tc' },
  { frequencyRange: 'FR2-2', scsSSB: '960', scsUL: '120', te: '2.80×64×Tc' },
  { frequencyRange: 'FR2-2', scsSSB: '960', scsUL: '480', te: '1.13×64×Tc' },
  { frequencyRange: 'FR2-2', scsSSB: '960', scsUL: '960', te: '0.86×64×Tc' },
]

// Sample cross-references
const crossReferences = [
  { from: '7.1.2', to: '7.1.2.1', type: 'depends_on' as const, description: 'Gradual timing adjustment' },
  { from: '7.1.2', to: '7.3', type: 'relates_to' as const, description: 'Timing Advance' },
  { from: '7.1.2', to: '9.2', type: 'relates_to' as const, description: 'Cell identification' },
]

export default function Clause7Page() {
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
            <div className="w-12 h-12 rounded-lg bg-blue-500 flex items-center justify-center text-white">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Clause 7: Timing</h1>
              <p className="text-muted-foreground">UE transmit timing, timer accuracy, and synchronization requirements</p>
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
                <CardDescription>Key concepts and requirements summary</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Clause 7 of TS 38.133 establishes the fundamental timing requirements that enable 
                  reliable uplink communication in 5G NR systems. The core principle is that UEs must 
                  advance their uplink transmissions to compensate for propagation delay, ensuring 
                  signals arrive at the gNB within the cyclic prefix window.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-medium mb-2">Key Parameters</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-nokia-blue mt-0.5" />
                        <span><strong>Te:</strong> Timing error limit (varies by SCS)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-nokia-blue mt-0.5" />
                        <span><strong>N_TA_offset:</strong> Timing advance offset</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-nokia-blue mt-0.5" />
                        <span><strong>Tc:</strong> Basic timing unit (~0.509 ns)</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-medium mb-2">Coverage</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-nokia-blue mt-0.5" />
                        <span>UE transmit timing (7.1)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-nokia-blue mt-0.5" />
                        <span>Timer accuracy (7.2)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-nokia-blue mt-0.5" />
                        <span>Timing advance (7.3)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subclauses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subclauses.map((subclause, index) => (
                <motion.div
                  key={subclause.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="h-full card-hover">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">{subclause.title}</CardTitle>
                      <CardDescription>{subclause.description}</CardDescription>
                    </CardHeader>
                    {subclause.formulas && (
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary">
                            <Calculator className="w-3 h-3 mr-1" />
                            {subclause.formulas.length} formulas
                          </Badge>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                </motion.div>
              ))}
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
                <CardTitle>Detailed Technical Analysis</CardTitle>
                <CardDescription>In-depth examination of timing requirements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">7.1.2 UE Transmit Timing Requirements</h4>
                  <p className="text-muted-foreground mb-4">
                    The UE transmit timing requirements establish the fundamental timing synchronization 
                    framework that enables the gNB to correctly receive uplink transmissions from 
                    geographically distributed UEs. The timing error limit Te represents the maximum 
                    permissible deviation between actual UE transmit timing and ideal timing derived 
                    from downlink synchronization.
                  </p>
                  <p className="text-muted-foreground">
                    This parameter is critically dependent on both the SCS of the SSB signals (which 
                    determines the precision of downlink timing acquisition) and the SCS of the uplink 
                    signals (which determines the granularity of uplink timing).
                  </p>
                </div>

                <div className="section-divider" />

                <div>
                  <h4 className="font-semibold mb-2">N_TA_offset Parameter</h4>
                  <p className="text-muted-foreground mb-4">
                    The N_TA_offset parameter serves a crucial role in multi-RAT coexistence scenarios, 
                    particularly for E-UTRA-NR and NB-IoT-NR deployments where frame structure alignment 
                    between different RATs must be maintained.
                  </p>
                  
                  <div className="bg-muted/50 rounded-lg p-4 mt-4">
                    <h5 className="font-medium mb-2">N_TA_offset Values</h5>
                    <ul className="space-y-2 text-sm">
                      <li><strong>25600 Tc (0.5 ms):</strong> FR1 standalone</li>
                      <li><strong>0 Tc:</strong> FR1 FDD with E-UTRA coexistence</li>
                      <li><strong>39936 Tc (0.78 ms):</strong> FR1 TDD with E-UTRA coexistence</li>
                      <li><strong>13792 Tc (0.27 ms):</strong> FR2</li>
                    </ul>
                  </div>
                </div>

                <CrossReference 
                  references={crossReferences} 
                  currentClause="7.1.2" 
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
                <CardTitle>7.1.2 Requirements</CardTitle>
                <CardDescription>Original specification text</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="prose dark:prose-invert max-w-none">
                  <p>
                    The UE initial transmission timing error shall be less than or equal to ±Te 
                    where the timing error limit value Te is specified in table 7.1.2-1:
                  </p>
                  <ul>
                    <li>
                      when it is the first transmission in a DRX cycle for PUCCH, PUSCH and SRS, 
                      or it is the PRACH transmission, or it is the msgA transmission, or it is 
                      the first transmission sent on the PSCell for activating the deactivated 
                      SCG without RACH.
                    </li>
                    <li>
                      when it is the transmission for PUSCH on CG resources for SDT in RRC_INACTIVE.
                    </li>
                    <li>
                      when it is the first transmission on target cell after UE receives LTM 
                      cell switch command.
                    </li>
                  </ul>
                </div>

                <FormulaBlock 
                  formula="Te = f(FR, SCS_{SSB}, SCS_{UL})"
                  label="Timing Error Limit Formula"
                />

                <InteractiveTable
                  title="Table 7.1.2-1: Te Timing Error Limit"
                  description="Timing error limits for different frequency ranges and subcarrier spacing combinations"
                  columns={[
                    { key: 'frequencyRange', header: 'Frequency Range', sortable: true, filterable: true },
                    { key: 'scsSSB', header: 'SCS SSB (kHz)', sortable: true },
                    { key: 'scsUL', header: 'SCS UL (kHz)', sortable: true },
                    { key: 'te', header: 'Te', sortable: false },
                  ]}
                  data={timingErrorData}
                  filterOptions={{
                    'Frequency Range': ['FR1', 'FR2-1', 'FR2-2']
                  }}
                />
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}
