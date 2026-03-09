import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Radio, Zap, Clock, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ContentLayerToggle } from '@/components/ContentLayerToggle'
import { Breadcrumb } from '@/components/Breadcrumb'
import { FormulaBlock, FormulaWithVariables } from '@/components/FormulaRenderer'
import { InteractiveTable } from '@/components/InteractiveTable'
import { CrossReference } from '@/components/CrossReference'
import { Badge } from '@/components/ui/badge'
import { ContentLayer } from '@/types'

const breadcrumbItems = [
  { label: 'Clause 8', href: '/clause8/' }
]

const scellActivationVariables = [
  { symbol: 'T_{HARQ}', description: 'Timing between DL data transmission and acknowledgement (ms)' },
  { symbol: 'T_{activation\\_time}', description: 'SCell activation delay in milliseconds' },
  { symbol: 'T_{CSI\\_Reporting}', description: 'Delay including uncertainty in acquiring first available downlink CSI reference resource' },
  { symbol: 'T_{FirstSSB}', description: 'Time to end of first complete SSB burst indicated by SMTC' },
  { symbol: 'T_{rs}', description: 'SMTC periodicity of SCell being activated' },
  { symbol: 'T_{\\Delta}', description: 'Additional time for fine time tracking' },
]

const activationTimeData = [
  { condition: 'FR1 Known SCell', formula: 'T_{FirstSSB} + T_{\\Delta} + 5 ms', notes: 'If measurement period ≤ 2400 ms' },
  { condition: 'FR1 Known SCell (alt)', formula: 'T_{FirstSSB\\_MAX} + T_{rs} + T_{\\Delta} + 5 ms', notes: 'If measurement period > 2400 ms' },
  { condition: 'FR2 Known SCell', formula: 'T_{FirstSSB} + 5 ms', notes: 'SSBs fulfil clause 3.6.3' },
  { condition: 'FR2 Known SCell (alt)', formula: '3 ms', notes: 'scellWithoutSSB supported, RS QCL-TypeD' },
]

const crossReferences = [
  { from: '8.3.2', to: '9.2', type: 'relates_to' as const, description: 'Cell identification conditions' },
  { from: '8.3.2', to: '9.3', type: 'relates_to' as const, description: 'Inter-frequency measurements' },
  { from: '8.3.2', to: '8.3.2A', type: 'relates_to' as const, description: 'IDLE/INACTIVE mode measurements' },
]

export default function Clause8Page() {
  const [contentLayer, setContentLayer] = useState<ContentLayer>('overview')

  return (
    <div className="py-8 px-4 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Breadcrumb items={breadcrumbItems} className="mb-6" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-purple-500 flex items-center justify-center text-white">
              <Radio className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Clause 8: Signalling Characteristics</h1>
              <p className="text-muted-foreground">SCell activation, deactivation, and TCI state switching</p>
            </div>
          </div>

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

        {contentLayer === 'overview' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Expert Overview</CardTitle>
                <CardDescription>SCell activation and TCI state switching requirements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Clause 8 of TS 38.133 specifies the signalling characteristics requirements for
                  5G NR carrier aggregation and dual connectivity operations. The primary focus is
                  on SCell activation and deactivation delays, which are critical for efficient
                  carrier aggregation performance.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-nokia-blue" />
                      SCell Activation
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-nokia-blue mt-0.5" />
                        <span>Known vs Unknown SCell scenarios</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-nokia-blue mt-0.5" />
                        <span>FR1 and FR2 specific formulas</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-nokia-blue mt-0.5" />
                        <span>Interruption window requirements</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-nokia-blue" />
                      TCI State Switching
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-nokia-blue mt-0.5" />
                        <span>PDCCH TCI state switching</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-nokia-blue mt-0.5" />
                        <span>PDSCH TCI state switching</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-nokia-blue mt-0.5" />
                        <span>Multi-TRP operations</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Activation Formula</CardTitle>
                <CardDescription>Main SCell activation timing formula</CardDescription>
              </CardHeader>
              <CardContent>
                <FormulaWithVariables
                  formula="$n+\\frac{T_{HARQ}+T_{activation\\_time}+T_{CSI\\_Reporting}}{NR\\ slot\\ length}$"
                  variables={scellActivationVariables.slice(0, 3)}
                />
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="card-hover">
                <CardHeader>
                  <CardTitle className="text-lg">8.3 SCell Activation/Deactivation</CardTitle>
                  <CardDescription>
                    Requirements for delay within which UE shall activate/deactivate SCells
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="fr1">EN-DC</Badge>
                    <Badge variant="fr2">SA</Badge>
                    <Badge variant="secondary">NE-DC</Badge>
                    <Badge variant="secondary">NR-DC</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-hover">
                <CardHeader>
                  <CardTitle className="text-lg">8.10 TCI State Switching</CardTitle>
                  <CardDescription>
                    TCI state switching requirements for PDCCH and PDSCH
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="fr1">FR1</Badge>
                    <Badge variant="fr2">FR2</Badge>
                    <Badge variant="secondary">Multi-TRP</Badge>
                  </div>
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
                <CardTitle>8.3.2 SCell Activation Delay Analysis</CardTitle>
                <CardDescription>Detailed examination of activation timing requirements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">Known SCell Activation</h4>
                  <p className="text-muted-foreground mb-4">
                    For known SCells, the activation time is significantly reduced because the UE
                    has already performed measurements and has timing synchronization established.
                    The key condition is that the UE must have sent a valid measurement report for
                    the SCell within the specified measurement period.
                  </p>

                  <div className="bg-muted/50 rounded-lg p-4">
                    <h5 className="font-medium mb-2">FR1 Known SCell Conditions</h5>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• During period equal to max(5×measCycleSCell, 5×DRX cycles) before reception of SCell activation command</li>
                      <li>• UE has sent valid measurement report for SCell being activated</li>
                      <li>• SSB measured remains detectable according to cell identification conditions</li>
                      <li>• SSB measured during the period also remains detectable during SCell activation delay</li>
                    </ul>
                  </div>
                </div>

                <div className="section-divider" />

                <div>
                  <h4 className="font-semibold mb-2">Unknown SCell Activation</h4>
                  <p className="text-muted-foreground mb-4">
                    For unknown SCells, the activation time includes additional components for cell
                    detection and measurement. The formulas account for SMTC periodicity, RS
                    measurement periods, and various uncertainty factors.
                  </p>

                  <FormulaBlock
                    formula="$T_{activation\\_time} = T_{FirstSSB\\_MAX} + T_{SMTC\\_MAX} + T_{rs} + T_{\\Delta} + 5\\ ms$"
                    label="FR1 Unknown SCell (contiguous)"
                    description="When SCell is contiguous to an active serving cell in the same band"
                  />
                </div>

                <CrossReference
                  references={crossReferences}
                  currentClause="8.3.2"
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
                <CardTitle>8.3.2 SCell Activation Delay Requirement</CardTitle>
                <CardDescription>Original specification text</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="prose dark:prose-invert max-w-none">
                  <p>
                    UE configured with at least one downlink SCell in EN-DC, standalone NR CA,
                    NE-DC, or NR-DC shall be capable to transmit valid CSI report and apply actions
                    no later than in slot:
                  </p>
                  <p className="font-mono bg-muted p-4 rounded-lg">
                    n + (T_HARQ + T_activation_time + T_CSI_Reporting) / NR slot length
                  </p>
                  <p>
                    where n is the slot of the SCell activation command reception, and:
                  </p>
                  <ul>
                    <li>T_HARQ is the timing between DL data transmission and acknowledgement</li>
                    <li>T_activation_time is the SCell activation delay in milliseconds</li>
                    <li>T_CSI_Reporting includes uncertainty in acquiring CSI reference resources</li>
                  </ul>
                </div>

                <FormulaBlock
                  formula="$n+\\frac{T_{HARQ}+T_{activation\\_time}+T_{CSI\\_Reporting}}{NR\\ slot\\ length}$"
                  label="Activation Slot Formula"
                />

                <InteractiveTable
                  title="SCell Activation Time Formulas"
                  description="Activation time formulas for different scenarios"
                  columns={[
                    { key: 'condition', header: 'Condition', sortable: true },
                    { key: 'formula', header: 'Formula', sortable: false },
                    { key: 'notes', header: 'Notes', sortable: false },
                  ]}
                  data={activationTimeData}
                />
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}
