import React, { useState } from 'react';
import { Info, Clock, Zap, Radio, CheckCircle, AlertTriangle } from 'lucide-react';

// 3GPP TS 38.133 SCell Activation Timing Constants
interface ActivationTiming {
  fr: 'FR1' | 'FR2';
  scs: number;
  tHarq: number; // slots
  tActivationTime: number; // slots
  tCsiReporting: number; // slots
  totalKnown: number; // slots
  totalUnknown: number; // slots
}

const ACTIVATION_TIMINGS: ActivationTiming[] = [
  { fr: 'FR1', scs: 15, tHarq: 8, tActivationTime: 21, tCsiReporting: 5, totalKnown: 34, totalUnknown: 58 },
  { fr: 'FR1', scs: 30, tHarq: 10, tActivationTime: 23, tCsiReporting: 8, totalKnown: 41, totalUnknown: 73 },
  { fr: 'FR1', scs: 60, tHarq: 12, tActivationTime: 26, tCsiReporting: 10, totalKnown: 48, totalUnknown: 88 },
  { fr: 'FR2', scs: 60, tHarq: 12, tActivationTime: 26, tCsiReporting: 10, totalKnown: 48, totalUnknown: 88 },
  { fr: 'FR2', scs: 120, tHarq: 16, tActivationTime: 30, tCsiReporting: 14, totalKnown: 60, totalUnknown: 116 },
  { fr: 'FR2', scs: 240, tHarq: 20, tActivationTime: 34, tCsiReporting: 18, totalKnown: 72, totalUnknown: 144 },
];

interface TimelinePhase {
  id: string;
  name: string;
  duration: number;
  color: string;
  description: string;
  icon: React.ReactNode;
}

interface SCellActivationTimelineProps {
  className?: string;
}

export const SCellActivationTimeline: React.FC<SCellActivationTimelineProps> = ({ className = '' }) => {
  const [selectedConfig, setSelectedConfig] = useState<ActivationTiming>(ACTIVATION_TIMINGS[1]);
  const [scellKnown, setScellKnown] = useState(true);
  const [showDetails, setShowDetails] = useState(true);
  const [hoveredPhase, setHoveredPhase] = useState<string | null>(null);

  // Calculate slot duration in ms
  const slotDurationMs = 1 / (selectedConfig.scs / 15);

  // Define timeline phases
  const phases: TimelinePhase[] = [
    {
      id: 't1',
      name: 'T_HARQ',
      duration: selectedConfig.tHarq,
      color: '#3b82f6', // blue
      description: 'Time between activation command and first HARQ opportunity on SCell',
      icon: <Clock size={16} />
    },
    {
      id: 't2',
      name: 'T_activation_time',
      duration: selectedConfig.tActivationTime,
      color: '#f59e0b', // amber
      description: 'UE processing time for SCell activation including RF tuning',
      icon: <Zap size={16} />
    },
    {
      id: 't3',
      name: 'T_CSI_Reporting',
      duration: selectedConfig.tCsiReporting,
      color: '#10b981', // green
      description: 'Time until first valid CSI report on activated SCell',
      icon: <Radio size={16} />
    }
  ];

  // Add synchronization phase for unknown SCell
  const allPhases = scellKnown ? phases : [
    {
      id: 'sync',
      name: 'T_sync',
      duration: scellKnown ? 0 : Math.ceil(selectedConfig.tActivationTime * 0.7),
      color: '#ef4444', // red
      description: 'SSB detection and synchronization for unknown SCell',
      icon: <AlertTriangle size={16} />
    },
    ...phases
  ];

  const totalSlots = scellKnown ? selectedConfig.totalKnown : selectedConfig.totalUnknown;
  const totalMs = totalSlots * slotDurationMs;

  // SVG dimensions
  const svgWidth = 800;
  const svgHeight = 450;
  const margin = { top: 80, left: 60, right: 60, bottom: 100 };
  const timelineY = 200;
  const timelineHeight = 60;

  const getPhaseX = (phaseIndex: number) => {
    let offset = 0;
    for (let i = 0; i < phaseIndex; i++) {
      offset += allPhases[i].duration;
    }
    return margin.left + (offset / totalSlots) * (svgWidth - margin.left - margin.right);
  };

  const getPhaseWidth = (phase: TimelinePhase) => {
    return (phase.duration / totalSlots) * (svgWidth - margin.left - margin.right);
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">SCell Activation Timeline</h2>
          <p className="text-sm text-gray-500">3GPP TS 38.133 Section 8.3</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            scellKnown ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
          }`}>
            {scellKnown ? 'Known SCell' : 'Unknown SCell'}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Frequency Range & SCS
          </label>
          <select
            value={ACTIVATION_TIMINGS.indexOf(selectedConfig)}
            onChange={(e) => setSelectedConfig(ACTIVATION_TIMINGS[Number(e.target.value)])}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            {ACTIVATION_TIMINGS.map((config, idx) => (
              <option key={idx} value={idx}>
                {config.fr} - {config.scs} kHz
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            SCell Knowledge
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setScellKnown(true)}
              className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                scellKnown 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Known
            </button>
            <button
              onClick={() => setScellKnown(false)}
              className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                !scellKnown 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Unknown
            </button>
          </div>
        </div>
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="text-sm font-medium text-blue-900">Total Duration</div>
          <div className="text-lg font-bold text-blue-700">
            {totalSlots} slots
          </div>
          <div className="text-xs text-blue-600">
            = {totalMs.toFixed(2)} ms
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-3">
          <div className="text-sm font-medium text-green-900">Slot Duration</div>
          <div className="text-lg font-bold text-green-700">
            {slotDurationMs.toFixed(3)} ms
          </div>
          <div className="text-xs text-green-600">
            @ {selectedConfig.scs} kHz SCS
          </div>
        </div>
      </div>

      {/* Timeline Visualization */}
      <div className="overflow-x-auto mb-6">
        <svg width={svgWidth} height={svgHeight} className="mx-auto">
          {/* Background */}
          <rect width={svgWidth} height={svgHeight} fill="#fafafa" rx="8" />

          {/* Title */}
          <text x={svgWidth / 2} y={30} textAnchor="middle" className="text-lg font-semibold fill-gray-800">
            SCell Activation Timeline - {selectedConfig.fr} ({selectedConfig.scs} kHz)
          </text>

          {/* Activation command marker */}
          <g transform={`translate(${margin.left}, ${timelineY - 40})`}>
            <polygon points="0,0 -8,15 8,15" fill="#005AFF" />
            <text x={0} y={-5} textAnchor="middle" className="text-xs font-medium fill-blue-700">
              Activation CMD
            </text>
          </g>

          {/* Timeline bar */}
          <rect
            x={margin.left}
            y={timelineY}
            width={svgWidth - margin.left - margin.right}
            height={timelineHeight}
            fill="#e5e7eb"
            rx="4"
          />

          {/* Phase segments */}
          {allPhases.map((phase, idx) => {
            const x = getPhaseX(idx);
            const width = getPhaseWidth(phase);
            const isHovered = hoveredPhase === phase.id;

            return (
              <g
                key={phase.id}
                onMouseEnter={() => setHoveredPhase(phase.id)}
                onMouseLeave={() => setHoveredPhase(null)}
                style={{ cursor: 'pointer' }}
              >
                <rect
                  x={x}
                  y={timelineY}
                  width={width}
                  height={timelineHeight}
                  fill={phase.color}
                  opacity={isHovered ? 1 : 0.85}
                  rx={idx === 0 ? '4 0 0 4' : idx === allPhases.length - 1 ? '0 4 4 0' : '0'}
                />
                <text
                  x={x + width / 2}
                  y={timelineY + timelineHeight / 2 - 5}
                  textAnchor="middle"
                  className="text-xs fill-white font-medium"
                >
                  {phase.name}
                </text>
                <text
                  x={x + width / 2}
                  y={timelineY + timelineHeight / 2 + 10}
                  textAnchor="middle"
                  className="text-xs fill-white"
                >
                  {phase.duration} slots
                </text>
              </g>
            );
          })}

          {/* Phase boundaries */}
          {allPhases.slice(0, -1).map((_, idx) => {
            const x = getPhaseX(idx + 1);
            return (
              <line
                key={`boundary-${idx}`}
                x1={x}
                y1={timelineY}
                x2={x}
                y2={timelineY + timelineHeight}
                stroke="white"
                strokeWidth={2}
              />
            );
          })}

          {/* Time axis */}
          <line
            x1={margin.left}
            y1={timelineY + timelineHeight + 30}
            x2={svgWidth - margin.right}
            y2={timelineY + timelineHeight + 30}
            stroke="#374151"
            strokeWidth={2}
          />

          {/* Time markers */}
          {Array.from({ length: 6 }, (_, i) => {
            const slot = Math.round((i / 5) * totalSlots);
            const x = margin.left + (i / 5) * (svgWidth - margin.left - margin.right);
            return (
              <g key={i}>
                <line
                  x1={x}
                  y1={timelineY + timelineHeight + 30}
                  x2={x}
                  y2={timelineY + timelineHeight + 38}
                  stroke="#374151"
                  strokeWidth={2}
                />
                <text
                  x={x}
                  y={timelineY + timelineHeight + 52}
                  textAnchor="middle"
                  className="text-xs fill-gray-600"
                >
                  {slot}s
                </text>
                <text
                  x={x}
                  y={timelineY + timelineHeight + 65}
                  textAnchor="middle"
                  className="text-xs fill-gray-400"
                >
                  ({(slot * slotDurationMs).toFixed(1)}ms)
                </text>
              </g>
            );
          })}

          {/* Legend */}
          <g transform={`translate(${margin.left}, ${timelineY + timelineHeight + 85})`}>
            {allPhases.map((phase, idx) => (
              <g key={phase.id} transform={`translate(${idx * 140}, 0)`}>
                <rect width={14} height={14} fill={phase.color} rx="2" />
                <text x={20} y={11} className="text-xs fill-gray-700">
                  {phase.name}
                </text>
              </g>
            ))}
          </g>

          {/* Completion marker */}
          <g transform={`translate(${svgWidth - margin.right}, ${timelineY + timelineHeight / 2})`}>
            <circle r={15} fill="#10b981" />
            <CheckCircle x={-8} y={-8} size={16} className="text-white" />
            <text x={25} y={4} className="text-xs fill-green-700 font-medium">
              SCell Active
            </text>
          </g>
        </svg>
      </div>

      {/* Phase details */}
      {hoveredPhase && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            {allPhases.find(p => p.id === hoveredPhase)?.icon}
            <div>
              <div className="font-medium text-blue-900">
                {allPhases.find(p => p.id === hoveredPhase)?.name}
              </div>
              <div className="text-sm text-blue-700">
                Duration: {allPhases.find(p => p.id === hoveredPhase)?.duration} slots 
                ({((allPhases.find(p => p.id === hoveredPhase)?.duration || 0) * slotDurationMs).toFixed(2)} ms)
              </div>
              <div className="text-sm text-blue-600 mt-1">
                {allPhases.find(p => p.id === hoveredPhase)?.description}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Details panel */}
      {showDetails && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Timing requirements table */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Timing Requirements (slots)</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left py-2 text-gray-600">SCS</th>
                  <th className="text-center py-2 text-gray-600">T_HARQ</th>
                  <th className="text-center py-2 text-gray-600">T_act</th>
                  <th className="text-center py-2 text-gray-600">T_CSI</th>
                </tr>
              </thead>
              <tbody>
                {ACTIVATION_TIMINGS.filter(t => t.fr === selectedConfig.fr).map((config, idx) => (
                  <tr 
                    key={idx} 
                    className={`border-b border-gray-200 ${
                      selectedConfig.scs === config.scs ? 'bg-blue-100' : ''
                    }`}
                  >
                    <td className="py-2">{config.scs} kHz</td>
                    <td className="text-center py-2">{config.tHarq}</td>
                    <td className="text-center py-2">{config.tActivationTime}</td>
                    <td className="text-center py-2">{config.tCsiReporting}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Known vs Unknown comparison */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Known vs Unknown SCell</h3>
            <div className="space-y-3">
              <div className={`p-3 rounded-lg ${scellKnown ? 'bg-green-100 border border-green-300' : 'bg-white border'}`}>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className={scellKnown ? 'text-green-600' : 'text-gray-400'} />
                  <span className="font-medium text-gray-800">Known SCell</span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  UE has valid timing and frequency synchronization.
                  <br />
                  <span className="font-semibold">Total: {selectedConfig.totalKnown} slots</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${!scellKnown ? 'bg-amber-100 border border-amber-300' : 'bg-white border'}`}>
                <div className="flex items-center gap-2">
                  <AlertTriangle size={16} className={!scellKnown ? 'text-amber-600' : 'text-gray-400'} />
                  <span className="font-medium text-gray-800">Unknown SCell</span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  UE must perform SSB detection and synchronization first.
                  <br />
                  <span className="font-semibold">Total: {selectedConfig.totalUnknown} slots</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Formula reference */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-2">Timing Formula Reference</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white p-3 rounded border">
            <div className="font-medium text-gray-700 mb-1">T_HARQ</div>
            <div className="font-mono text-gray-600">
              = 8 + 2 × (SCS/15 - 1) slots (FR1)
            </div>
            <div className="font-mono text-gray-600">
              = 12 + 4 × (SCS/60 - 1) slots (FR2)
            </div>
          </div>
          <div className="bg-white p-3 rounded border">
            <div className="font-medium text-gray-700 mb-1">T_activation_time</div>
            <div className="font-mono text-gray-600">
              = 21 + 2 × (SCS/15 - 1) slots (FR1)
            </div>
            <div className="font-mono text-gray-600">
              = 26 + 4 × (SCS/60 - 1) slots (FR2)
            </div>
          </div>
          <div className="bg-white p-3 rounded border">
            <div className="font-medium text-gray-700 mb-1">T_CSI_Reporting</div>
            <div className="font-mono text-gray-600">
              = 5 + 3 × (SCS/15 - 1) slots (FR1)
            </div>
            <div className="font-mono text-gray-600">
              = 10 + 4 × (SCS/60 - 1) slots (FR2)
            </div>
          </div>
        </div>
        <div className="text-xs text-gray-500 mt-3">
          Note: For unknown SCell, additional synchronization time is required. 
          The exact value depends on SSB periodicity and search space configuration.
        </div>
      </div>
    </div>
  );
};

export default SCellActivationTimeline;
