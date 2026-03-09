import React, { useState, useRef } from 'react';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';

// 3GPP TS 38.133 Timing Constants
const TIMING_CONSTANTS = {
  TC_NS: 0.509, // Tc in nanoseconds (1/(480*10^3*4096))
  N_TA_OFFSET_FR1: 25600, // N_TA,offset for FR1
  N_TA_OFFSET_FR2: 13792, // N_TA,offset for FR2
  N_TA_OFFSET_FR2_2: 62392, // N_TA,offset for FR2-2
};

interface TimingPoint {
  id: string;
  label: string;
  time: number;
  description: string;
}

interface TimingDiagramProps {
  className?: string;
}

export const TimingDiagram: React.FC<TimingDiagramProps> = ({ className = '' }) => {
  const [selectedSCS, setSelectedSCS] = useState<15 | 30 | 60 | 120 | 240>(30);
  const [nTA, setNTA] = useState(0);
  const [showDetails, setShowDetails] = useState(true);
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Calculate timing values
  const tcValue = TIMING_CONSTANTS.TC_NS;
  const nTAOffset = TIMING_CONSTANTS.N_TA_OFFSET_FR1;
  const totalTimingAdvance = (nTA + nTAOffset) * tcValue * 16; // in microseconds
  const slotDuration = 1 / (selectedSCS / 15) * 1; // ms per slot

  const timingPoints: TimingPoint[] = [
    {
      id: 'dl-start',
      label: 'DL Frame Start',
      time: 0,
      description: 'Downlink frame reception begins at the UE'
    },
    {
      id: 'dl-end',
      label: 'DL Frame End',
      time: 1,
      description: `Downlink subframe duration: ${slotDuration.toFixed(3)} ms (SCS=${selectedSCS}kHz)`
    },
    {
      id: 'ta-start',
      label: 'TA Applied',
      time: 1 + totalTimingAdvance / 1000,
      description: `N_TA × 16 × Tc = ${nTA} × 16 × ${tcValue.toFixed(3)}ns = ${(nTA * 16 * tcValue / 1000).toFixed(2)}μs`
    },
    {
      id: 'ul-start',
      label: 'UL Frame Start',
      time: 1 + totalTimingAdvance / 1000,
      description: `Uplink transmission timing: N_TA,offset + N_TA = ${nTAOffset} + ${nTA} = ${nTAOffset + nTA} Tc units`
    }
  ];

  const maxTime = Math.max(...timingPoints.map(p => p.time)) * 1.2;
  const svgWidth = 800;
  const svgHeight = 400;
  const margin = { top: 60, right: 40, bottom: 80, left: 80 };
  const chartWidth = svgWidth - margin.left - margin.right;
  const chartHeight = svgHeight - margin.top - margin.bottom;

  const timeToX = (time: number) => margin.left + (time / maxTime) * chartWidth;

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">UE Transmit Timing</h2>
          <p className="text-sm text-gray-500">3GPP TS 38.133 Section 7.1</p>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
        >
          {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subcarrier Spacing (SCS)
          </label>
          <select
            value={selectedSCS}
            onChange={(e) => setSelectedSCS(Number(e.target.value) as typeof selectedSCS)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={15}>15 kHz (FR1)</option>
            <option value={30}>30 kHz (FR1)</option>
            <option value={60}>60 kHz (FR1/FR2)</option>
            <option value={120}>120 kHz (FR2)</option>
            <option value={240}>240 kHz (FR2)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            N_TA Value (Tc units)
          </label>
          <input
            type="range"
            min="0"
            max="10000"
            step="100"
            value={nTA}
            onChange={(e) => setNTA(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
          <div className="text-center text-sm text-gray-600 mt-1">{nTA}</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="text-sm font-medium text-blue-900">Total Timing Advance</div>
          <div className="text-lg font-bold text-blue-700">
            {(totalTimingAdvance).toFixed(2)} μs
          </div>
          <div className="text-xs text-blue-600">
            = ({nTAOffset} + {nTA}) × 16 × {tcValue.toFixed(3)}ns
          </div>
        </div>
      </div>

      {/* SVG Diagram */}
      <div className="overflow-x-auto">
        <svg
          ref={svgRef}
          width={svgWidth}
          height={svgHeight}
          className="mx-auto"
        >
          {/* Background */}
          <rect width={svgWidth} height={svgHeight} fill="#fafafa" rx="8" />

          {/* Grid lines */}
          {Array.from({ length: 11 }, (_, i) => {
            const x = margin.left + (i / 10) * chartWidth;
            return (
              <line
                key={`grid-${i}`}
                x1={x}
                y1={margin.top}
                x2={x}
                y2={margin.top + chartHeight}
                stroke="#e5e7eb"
                strokeWidth={1}
                strokeDasharray="4,4"
              />
            );
          })}

          {/* Time axis */}
          <line
            x1={margin.left}
            y1={margin.top + chartHeight}
            x2={margin.left + chartWidth}
            y2={margin.top + chartHeight}
            stroke="#374151"
            strokeWidth={2}
          />
          <text
            x={margin.left + chartWidth / 2}
            y={svgHeight - 20}
            textAnchor="middle"
            className="text-sm fill-gray-600"
          >
            Time (ms)
          </text>

          {/* Time labels */}
          {Array.from({ length: 6 }, (_, i) => {
            const time = (i / 5) * maxTime;
            const x = timeToX(time);
            return (
              <text
                key={`label-${i}`}
                x={x}
                y={margin.top + chartHeight + 20}
                textAnchor="middle"
                className="text-xs fill-gray-500"
              >
                {time.toFixed(2)}
              </text>
            );
          })}

          {/* Downlink signal */}
          <g>
            <rect
              x={timeToX(0)}
              y={margin.top + 20}
              width={timeToX(1) - timeToX(0)}
              height={40}
              fill="#005AFF"
              rx="4"
              opacity={0.9}
            />
            <text
              x={timeToX(0.5)}
              y={margin.top + 45}
              textAnchor="middle"
              className="text-sm fill-white font-medium"
            >
              DL Frame
            </text>
            {/* Arrow indicating reception */}
            <path
              d={`M ${timeToX(0.5)} ${margin.top + 65} L ${timeToX(0.5)} ${margin.top + 90}`}
              stroke="#005AFF"
              strokeWidth={2}
              markerEnd="url(#arrowhead)"
            />
          </g>

          {/* Timing advance arrow */}
          <g>
            <path
              d={`M ${timeToX(1)} ${margin.top + 110} L ${timeToX(1 + totalTimingAdvance / 1000)} ${margin.top + 110}`}
              stroke="#f59e0b"
              strokeWidth={3}
              strokeDasharray="8,4"
              markerEnd="url(#arrowhead-orange)"
            />
            <text
              x={timeToX(1 + totalTimingAdvance / 2000)}
              y={margin.top + 105}
              textAnchor="middle"
              className="text-xs fill-amber-600 font-medium"
            >
              TA = {totalTimingAdvance.toFixed(1)}μs
            </text>
          </g>

          {/* Uplink signal */}
          <g>
            <rect
              x={timeToX(1 + totalTimingAdvance / 1000)}
              y={margin.top + 130}
              width={timeToX(1) - timeToX(0)}
              height={40}
              fill="#10b981"
              rx="4"
              opacity={0.9}
            />
            <text
              x={timeToX(1 + totalTimingAdvance / 1000 + 0.5)}
              y={margin.top + 155}
              textAnchor="middle"
              className="text-sm fill-white font-medium"
            >
              UL Frame
            </text>
          </g>

          {/* Timing point markers */}
          {timingPoints.map((point) => {
            const x = timeToX(point.time);
            const isHovered = hoveredPoint === point.id;
            return (
              <g
                key={point.id}
                onMouseEnter={() => setHoveredPoint(point.id)}
                onMouseLeave={() => setHoveredPoint(null)}
                style={{ cursor: 'pointer' }}
              >
                <line
                  x1={x}
                  y1={margin.top}
                  x2={x}
                  y2={margin.top + chartHeight}
                  stroke={isHovered ? '#005AFF' : '#9ca3af'}
                  strokeWidth={isHovered ? 2 : 1}
                  strokeDasharray="4,4"
                />
                <circle
                  cx={x}
                  cy={margin.top + chartHeight}
                  r={isHovered ? 8 : 5}
                  fill={isHovered ? '#005AFF' : '#6b7280'}
                />
                <text
                  x={x}
                  y={margin.top + chartHeight + 35}
                  textAnchor="middle"
                  className={`text-xs ${isHovered ? 'fill-blue-600 font-medium' : 'fill-gray-500'}`}
                >
                  {point.label}
                </text>
              </g>
            );
          })}

          {/* Arrow markers */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#005AFF" />
            </marker>
            <marker
              id="arrowhead-orange"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#f59e0b" />
            </marker>
          </defs>
        </svg>
      </div>

      {/* Hover tooltip */}
      {hoveredPoint && (
        <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="text-blue-600 mt-0.5" size={18} />
            <div>
              <div className="font-medium text-gray-900">
                {timingPoints.find(p => p.id === hoveredPoint)?.label}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {timingPoints.find(p => p.id === hoveredPoint)?.description}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Details Panel */}
      {showDetails && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Formula</h3>
            <div className="text-sm text-gray-700 font-mono bg-white p-3 rounded border">
              T<sub>UL</sub> = T<sub>DL</sub> - (N<sub>TA</sub> + N<sub>TA,offset</sub>) × 16 × T<sub>c</sub>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Where T<sub>c</sub> = 1/(480×10³×4096) ≈ 0.509 ns
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">N<sub>TA,offset</sub> Values</h3>
            <table className="text-sm w-full">
              <tbody>
                <tr className="border-b">
                  <td className="py-1 text-gray-600">FR1</td>
                  <td className="py-1 text-right font-mono">{TIMING_CONSTANTS.N_TA_OFFSET_FR1}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-1 text-gray-600">FR2</td>
                  <td className="py-1 text-right font-mono">{TIMING_CONSTANTS.N_TA_OFFSET_FR2}</td>
                </tr>
                <tr>
                  <td className="py-1 text-gray-600">FR2-2</td>
                  <td className="py-1 text-right font-mono">{TIMING_CONSTANTS.N_TA_OFFSET_FR2_2}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimingDiagram;
