import React, { useState, useMemo } from 'react';
import { Info, Clock, Calendar, Layers } from 'lucide-react';

// 3GPP TS 38.133 Measurement Gap Pattern Definitions
interface GapPattern {
  id: number;
  name: string;
  mgl: number; // Measurement Gap Length in ms
  mgrp: number; // Measurement Gap Repetition Period in ms
  offsetRange: string;
  description: string;
  applicableFR: ('FR1' | 'FR2')[];
}

const GAP_PATTERNS: GapPattern[] = [
  { id: 0, name: 'Gap 0', mgl: 1.5, mgrp: 20, offsetRange: '0-19', description: 'Short gap, frequent', applicableFR: ['FR1', 'FR2'] },
  { id: 1, name: 'Gap 1', mgl: 3, mgrp: 20, offsetRange: '0-19', description: 'Medium gap, frequent', applicableFR: ['FR1', 'FR2'] },
  { id: 2, name: 'Gap 2', mgl: 3, mgrp: 40, offsetRange: '0-39', description: 'Medium gap, less frequent', applicableFR: ['FR1', 'FR2'] },
  { id: 3, name: 'Gap 3', mgl: 3, mgrp: 80, offsetRange: '0-79', description: 'Medium gap, sparse', applicableFR: ['FR1', 'FR2'] },
  { id: 4, name: 'Gap 4', mgl: 3, mgrp: 160, offsetRange: '0-159', description: 'Medium gap, very sparse', applicableFR: ['FR1', 'FR2'] },
  { id: 5, name: 'Gap 5', mgl: 6, mgrp: 20, offsetRange: '0-19', description: 'Long gap, frequent', applicableFR: ['FR1', 'FR2'] },
  { id: 6, name: 'Gap 6', mgl: 6, mgrp: 40, offsetRange: '0-39', description: 'Long gap, less frequent', applicableFR: ['FR1', 'FR2'] },
  { id: 7, name: 'Gap 7', mgl: 6, mgrp: 80, offsetRange: '0-79', description: 'Long gap, sparse', applicableFR: ['FR1', 'FR2'] },
  { id: 8, name: 'Gap 8', mgl: 6, mgrp: 160, offsetRange: '0-159', description: 'Long gap, very sparse', applicableFR: ['FR1', 'FR2'] },
  { id: 9, name: 'Gap 9', mgl: 4, mgrp: 20, offsetRange: '0-19', description: '4ms gap, frequent', applicableFR: ['FR1', 'FR2'] },
  { id: 10, name: 'Gap 10', mgl: 4, mgrp: 40, offsetRange: '0-39', description: '4ms gap, less frequent', applicableFR: ['FR1', 'FR2'] },
  { id: 11, name: 'Gap 11', mgl: 4, mgrp: 80, offsetRange: '0-79', description: '4ms gap, sparse', applicableFR: ['FR1', 'FR2'] },
  { id: 12, name: 'Gap 12', mgl: 4, mgrp: 160, offsetRange: '0-159', description: '4ms gap, very sparse', applicableFR: ['FR1', 'FR2'] },
  { id: 13, name: 'Gap 13', mgl: 5.5, mgrp: 20, offsetRange: '0-19', description: '5.5ms gap, frequent', applicableFR: ['FR1', 'FR2'] },
  { id: 14, name: 'Gap 14', mgl: 5.5, mgrp: 40, offsetRange: '0-39', description: '5.5ms gap, less frequent', applicableFR: ['FR1', 'FR2'] },
  { id: 15, name: 'Gap 15', mgl: 5.5, mgrp: 80, offsetRange: '0-79', description: '5.5ms gap, sparse', applicableFR: ['FR1', 'FR2'] },
  { id: 16, name: 'Gap 16', mgl: 5.5, mgrp: 160, offsetRange: '0-159', description: '5.5ms gap, very sparse', applicableFR: ['FR1', 'FR2'] },
  { id: 17, name: 'Gap 17', mgl: 3.5, mgrp: 20, offsetRange: '0-19', description: '3.5ms gap, frequent', applicableFR: ['FR1', 'FR2'] },
  { id: 18, name: 'Gap 18', mgl: 3.5, mgrp: 40, offsetRange: '0-39', description: '3.5ms gap, less frequent', applicableFR: ['FR1', 'FR2'] },
  { id: 19, name: 'Gap 19', mgl: 3.5, mgrp: 80, offsetRange: '0-79', description: '3.5ms gap, sparse', applicableFR: ['FR1', 'FR2'] },
  { id: 20, name: 'Gap 20', mgl: 3.5, mgrp: 160, offsetRange: '0-159', description: '3.5ms gap, very sparse', applicableFR: ['FR1', 'FR2'] },
  { id: 21, name: 'Gap 21', mgl: 1.5, mgrp: 40, offsetRange: '0-39', description: 'Short gap, less frequent', applicableFR: ['FR1', 'FR2'] },
  { id: 22, name: 'Gap 22', mgl: 1.5, mgrp: 80, offsetRange: '0-79', description: 'Short gap, sparse', applicableFR: ['FR1', 'FR2'] },
  { id: 23, name: 'Gap 23', mgl: 1.5, mgrp: 160, offsetRange: '0-159', description: 'Short gap, very sparse', applicableFR: ['FR1', 'FR2'] },
  { id: 24, name: 'Gap 24', mgl: 1, mgrp: 20, offsetRange: '0-19', description: 'Very short gap, frequent', applicableFR: ['FR1', 'FR2'] },
  { id: 25, name: 'Gap 25', mgl: 1, mgrp: 40, offsetRange: '0-39', description: 'Very short gap, less frequent', applicableFR: ['FR1', 'FR2'] },
];

interface GapPatternVisualizerProps {
  className?: string;
}

export const GapPatternVisualizer: React.FC<GapPatternVisualizerProps> = ({ className = '' }) => {
  const [selectedPattern, setSelectedPattern] = useState<GapPattern>(GAP_PATTERNS[1]);
  const [gapOffset, setGapOffset] = useState(0);
  const [scs, setScs] = useState<15 | 30 | 60 | 120>(30);
  const [numCycles, setNumCycles] = useState(3);
  const [hoveredSlot, setHoveredSlot] = useState<number | null>(null);

  // Calculate slot duration based on SCS
  const slotDuration = 1 / (scs / 15); // ms per slot
  const slotsPerSubframe = scs / 15;

  // Calculate interrupted slots for the selected pattern
  const interruptedSlots = useMemo(() => {
    const slotsInGap = Math.ceil(selectedPattern.mgl / slotDuration);
    const slotsInPeriod = Math.ceil(selectedPattern.mgrp / slotDuration);
    const gapStartSlot = Math.floor(gapOffset / slotDuration);
    
    const interrupted: number[] = [];
    for (let cycle = 0; cycle < numCycles; cycle++) {
      const cycleOffset = cycle * slotsInPeriod;
      for (let i = 0; i < slotsInGap; i++) {
        interrupted.push(gapStartSlot + cycleOffset + i);
      }
    }
    return interrupted;
  }, [selectedPattern, gapOffset, slotDuration, numCycles]);

  // Calculate total visualization slots
  const totalSlots = Math.ceil(selectedPattern.mgrp * numCycles / slotDuration);
  const totalDuration = selectedPattern.mgrp * numCycles;

  // SVG dimensions
  const svgWidth = 800;
  const slotHeight = 30;
  const slotWidth = 25;
  const margin = { top: 80, left: 60, right: 40, bottom: 60 };
  const slotsPerRow = Math.floor((svgWidth - margin.left - margin.right) / (slotWidth + 2));

  const getSlotColor = (slotIndex: number): string => {
    if (interruptedSlots.includes(slotIndex)) {
      return '#ef4444'; // Red for gap slots
    }
    return '#10b981'; // Green for active slots
  };

  const getSlotLabel = (slotIndex: number): string => {
    const subframe = Math.floor(slotIndex / slotsPerSubframe);
    const slotInSf = slotIndex % slotsPerSubframe;
    return `${subframe}.${slotInSf}`;
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Measurement Gap Pattern Visualizer</h2>
          <p className="text-sm text-gray-500">3GPP TS 38.133 Section 9.1.2</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-600">Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-sm text-gray-600">Gap</span>
          </div>
        </div>
      </div>

      {/* Pattern Selection */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gap Pattern
          </label>
          <select
            value={selectedPattern.id}
            onChange={(e) => setSelectedPattern(GAP_PATTERNS.find(p => p.id === Number(e.target.value)) || GAP_PATTERNS[0])}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            {GAP_PATTERNS.map(pattern => (
              <option key={pattern.id} value={pattern.id}>
                {pattern.name} - MGL:{pattern.mgl}ms, MGRP:{pattern.mgrp}ms
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">{selectedPattern.description}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            SCS (kHz)
          </label>
          <select
            value={scs}
            onChange={(e) => setScs(Number(e.target.value) as typeof scs)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value={15}>15 kHz</option>
            <option value={30}>30 kHz</option>
            <option value={60}>60 kHz</option>
            <option value={120}>120 kHz</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gap Offset (ms)
          </label>
          <input
            type="range"
            min="0"
            max={selectedPattern.mgrp - selectedPattern.mgl}
            step={slotDuration}
            value={gapOffset}
            onChange={(e) => setGapOffset(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
          <div className="text-center text-sm text-gray-600 mt-1">{gapOffset.toFixed(2)} ms</div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cycles
          </label>
          <input
            type="range"
            min="1"
            max="5"
            step="1"
            value={numCycles}
            onChange={(e) => setNumCycles(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
          <div className="text-center text-sm text-gray-600 mt-1">{numCycles}</div>
        </div>
      </div>

      {/* Pattern Info Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="flex items-center gap-2 text-blue-700 mb-1">
            <Clock size={16} />
            <span className="text-sm font-medium">MGL</span>
          </div>
          <div className="text-xl font-bold text-blue-900">{selectedPattern.mgl} ms</div>
          <div className="text-xs text-blue-600">
            {Math.ceil(selectedPattern.mgl / slotDuration)} slots @ {scs}kHz
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-3">
          <div className="flex items-center gap-2 text-green-700 mb-1">
            <Calendar size={16} />
            <span className="text-sm font-medium">MGRP</span>
          </div>
          <div className="text-xl font-bold text-green-900">{selectedPattern.mgrp} ms</div>
          <div className="text-xs text-green-600">
            {Math.ceil(selectedPattern.mgrp / slotDuration)} slots @ {scs}kHz
          </div>
        </div>
        <div className="bg-amber-50 rounded-lg p-3">
          <div className="flex items-center gap-2 text-amber-700 mb-1">
            <Layers size={16} />
            <span className="text-sm font-medium">Gap Overhead</span>
          </div>
          <div className="text-xl font-bold text-amber-900">
            {((selectedPattern.mgl / selectedPattern.mgrp) * 100).toFixed(1)}%
          </div>
          <div className="text-xs text-amber-600">
            of each period
          </div>
        </div>
        <div className="bg-purple-50 rounded-lg p-3">
          <div className="flex items-center gap-2 text-purple-700 mb-1">
            <Info size={16} />
            <span className="text-sm font-medium">Offset Range</span>
          </div>
          <div className="text-xl font-bold text-purple-900">{selectedPattern.offsetRange}</div>
          <div className="text-xs text-purple-600">
            valid offsets
          </div>
        </div>
      </div>

      {/* Slot Timeline Visualization */}
      <div className="overflow-x-auto mb-6">
        <svg 
          width={svgWidth} 
          height={margin.top + Math.ceil(totalSlots / slotsPerRow) * (slotHeight + 10) + margin.bottom}
          className="mx-auto"
        >
          {/* Background */}
          <rect 
            width={svgWidth} 
            height={margin.top + Math.ceil(totalSlots / slotsPerRow) * (slotHeight + 10) + margin.bottom} 
            fill="#fafafa" 
            rx="8" 
          />

          {/* Title */}
          <text x={svgWidth / 2} y={30} textAnchor="middle" className="text-lg font-semibold fill-gray-800">
            Slot Timeline - {selectedPattern.name} (SCS = {scs} kHz)
          </text>

          {/* Legend */}
          <g transform={`translate(${svgWidth - 150}, 50)`}>
            <rect width={12} height={12} fill="#10b981" rx="2" />
            <text x={18} y={10} className="text-xs fill-gray-600">Active Slot</text>
            <rect y={18} width={12} height={12} fill="#ef4444" rx="2" />
            <text x={18} y={28} className="text-xs fill-gray-600">Gap Slot</text>
          </g>

          {/* Slots */}
          {Array.from({ length: totalSlots }, (_, i) => {
            const row = Math.floor(i / slotsPerRow);
            const col = i % slotsPerRow;
            const x = margin.left + col * (slotWidth + 2);
            const y = margin.top + row * (slotHeight + 10);
            const isGap = interruptedSlots.includes(i);
            const isHovered = hoveredSlot === i;

            return (
              <g
                key={i}
                transform={`translate(${x}, ${y})`}
                onMouseEnter={() => setHoveredSlot(i)}
                onMouseLeave={() => setHoveredSlot(null)}
                style={{ cursor: 'pointer' }}
              >
                <rect
                  width={slotWidth}
                  height={slotHeight}
                  fill={isGap ? '#ef4444' : '#10b981'}
                  stroke={isHovered ? '#005AFF' : 'none'}
                  strokeWidth={isHovered ? 2 : 0}
                  rx="3"
                  opacity={isHovered ? 1 : 0.85}
                />
                <text
                  x={slotWidth / 2}
                  y={slotHeight / 2 + 4}
                  textAnchor="middle"
                  className="text-xs fill-white font-medium"
                >
                  {getSlotLabel(i)}
                </text>
              </g>
            );
          })}

          {/* Time axis labels */}
          {Array.from({ length: Math.min(numCycles + 1, 6) }, (_, i) => {
            const timeMs = i * selectedPattern.mgrp;
            const slotIndex = Math.floor(timeMs / slotDuration);
            const row = Math.floor(slotIndex / slotsPerRow);
            const col = slotIndex % slotsPerRow;
            const x = margin.left + col * (slotWidth + 2);
            const y = margin.top + row * (slotHeight + 10) + slotHeight + 15;

            return (
              <g key={i}>
                <line
                  x1={x}
                  y1={margin.top + row * (slotHeight + 10) + slotHeight}
                  x2={x}
                  y2={y}
                  stroke="#9ca3af"
                  strokeWidth={1}
                />
                <text x={x} y={y + 10} textAnchor="middle" className="text-xs fill-gray-500">
                  {timeMs}ms
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Hover tooltip */}
      {hoveredSlot !== null && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <Info className="text-blue-600 mt-0.5" size={18} />
            <div>
              <div className="font-medium text-gray-900">
                Slot {getSlotLabel(hoveredSlot)}
              </div>
              <div className="text-sm text-gray-600">
                Time: {(hoveredSlot * slotDuration).toFixed(2)} ms | 
                Status: {interruptedSlots.includes(hoveredSlot) ? 
                  <span className="text-red-600 font-medium">Gap (No Tx/Rx)</span> : 
                  <span className="text-green-600 font-medium">Active</span>
                }
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pattern Comparison Table */}
      <div className="overflow-x-auto">
        <h3 className="font-semibold text-gray-900 mb-3">Gap Pattern Comparison</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-3 py-2 text-left text-gray-700">Pattern</th>
              <th className="px-3 py-2 text-center text-gray-700">MGL (ms)</th>
              <th className="px-3 py-2 text-center text-gray-700">MGRP (ms)</th>
              <th className="px-3 py-2 text-center text-gray-700">Overhead</th>
              <th className="px-3 py-2 text-center text-gray-700">Gaps/sec</th>
              <th className="px-3 py-2 text-center text-gray-700">FR</th>
            </tr>
          </thead>
          <tbody>
            {GAP_PATTERNS.slice(0, 10).map((pattern) => (
              <tr 
                key={pattern.id} 
                className={`border-b border-gray-200 ${
                  selectedPattern.id === pattern.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedPattern(pattern)}
                style={{ cursor: 'pointer' }}
              >
                <td className="px-3 py-2 font-medium">{pattern.name}</td>
                <td className="px-3 py-2 text-center">{pattern.mgl}</td>
                <td className="px-3 py-2 text-center">{pattern.mgrp}</td>
                <td className="px-3 py-2 text-center">
                  {((pattern.mgl / pattern.mgrp) * 100).toFixed(1)}%
                </td>
                <td className="px-3 py-2 text-center">
                  {(1000 / pattern.mgrp).toFixed(1)}
                </td>
                <td className="px-3 py-2 text-center">
                  <span className="text-xs bg-gray-200 px-2 py-0.5 rounded">
                    {pattern.applicableFR.join(', ')}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-gray-500 mt-2">
          Showing first 10 patterns. Click any row to select.
        </p>
      </div>

      {/* Formula */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-2">Gap Configuration Formula</h3>
        <div className="font-mono text-sm bg-white p-3 rounded border">
          Gap Start = SFN × 10 + subframeOffset + gapOffset (ms)
        </div>
        <div className="text-xs text-gray-500 mt-2">
          Where SFN is System Frame Number, and gapOffset is within the valid range for the selected pattern.
        </div>
      </div>
    </div>
  );
};

export default GapPatternVisualizer;
