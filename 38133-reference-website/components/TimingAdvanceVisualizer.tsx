import React, { useState } from 'react';
import { ArrowRight, Info, CheckCircle, AlertCircle } from 'lucide-react';

// 3GPP TS 38.133 Timing Advance Accuracy Requirements
interface SCSConfig {
  scs: number;
  fr: 'FR1' | 'FR2';
  minAdjustment: number; // Tc units
  maxAdjustment: number; // Tc units
  accuracy: number; // μs
}

const SCS_CONFIGS: SCSConfig[] = [
  { scs: 15, fr: 'FR1', minAdjustment: 16, maxAdjustment: 256, accuracy: 0.52 },
  { scs: 30, fr: 'FR1', minAdjustment: 16, maxAdjustment: 512, accuracy: 0.26 },
  { scs: 60, fr: 'FR1', minAdjustment: 16, maxAdjustment: 1024, accuracy: 0.13 },
  { scs: 60, fr: 'FR2', minAdjustment: 16, maxAdjustment: 1024, accuracy: 0.13 },
  { scs: 120, fr: 'FR2', minAdjustment: 16, maxAdjustment: 2048, accuracy: 0.065 },
  { scs: 240, fr: 'FR2', minAdjustment: 16, maxAdjustment: 4096, accuracy: 0.0325 },
];

interface TimingAdvanceVisualizerProps {
  className?: string;
}

export const TimingAdvanceVisualizer: React.FC<TimingAdvanceVisualizerProps> = ({ className = '' }) => {
  const [currentTA, setCurrentTA] = useState(1000); // Current TA in Tc units
  const [targetTA, setTargetTA] = useState(3000); // Target TA in Tc units
  const [selectedSCS, setSelectedSCS] = useState<SCSConfig>(SCS_CONFIGS[1]);
  const [animationStep, setAnimationStep] = useState(0);
  const [showFormula, setShowFormula] = useState(true);

  const taDifference = targetTA - currentTA;
  const adjustmentSteps = Math.ceil(Math.abs(taDifference) / selectedSCS.maxAdjustment);
  const gradualAdjustment = adjustmentSteps > 1;
  
  // Calculate adjustment timeline
  const adjustmentTimeline = Array.from({ length: adjustmentSteps }, (_, i) => {
    const stepAdjustment = i === adjustmentSteps - 1
      ? Math.abs(taDifference) - (adjustmentSteps - 1) * selectedSCS.maxAdjustment
      : selectedSCS.maxAdjustment;
    const direction = taDifference > 0 ? 1 : -1;
    return {
      step: i + 1,
      adjustment: stepAdjustment * direction,
      cumulative: (i + 1) * selectedSCS.maxAdjustment * direction,
      taValue: currentTA + (i + 1) * selectedSCS.maxAdjustment * direction
    };
  });

  const tcValue = 0.509; // ns
  const currentTA_us = currentTA * 16 * tcValue / 1000;
  const targetTA_us = targetTA * 16 * tcValue / 1000;

  const svgWidth = 700;
  const svgHeight = 350;

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Timing Advance Adjustment</h2>
          <p className="text-sm text-gray-500">3GPP TS 38.133 Section 7.3</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            gradualAdjustment ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
          }`}>
            {gradualAdjustment ? 'Gradual Adjustment' : 'Single Adjustment'}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            SCS & Frequency Range
          </label>
          <select
            value={SCS_CONFIGS.indexOf(selectedSCS)}
            onChange={(e) => setSelectedSCS(SCS_CONFIGS[Number(e.target.value)])}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            {SCS_CONFIGS.map((config, idx) => (
              <option key={idx} value={idx}>
                {config.scs} kHz ({config.fr})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current N<sub>TA</sub> (Tc)
          </label>
          <input
            type="range"
            min="0"
            max="5000"
            step="100"
            value={currentTA}
            onChange={(e) => setCurrentTA(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
          <div className="text-center text-sm text-gray-600 mt-1">{currentTA}</div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target N<sub>TA</sub> (Tc)
          </label>
          <input
            type="range"
            min="0"
            max="5000"
            step="100"
            value={targetTA}
            onChange={(e) => setTargetTA(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
          <div className="text-center text-sm text-gray-600 mt-1">{targetTA}</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="text-sm font-medium text-blue-900">Required Adjustment</div>
          <div className="text-lg font-bold text-blue-700">
            {(Math.abs(taDifference) * 16 * tcValue / 1000).toFixed(2)} μs
          </div>
          <div className="text-xs text-blue-600">
            {adjustmentSteps} step{adjustmentSteps > 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Visualization */}
      <div className="mb-6">
        <svg width={svgWidth} height={svgHeight} className="mx-auto">
          {/* Background */}
          <rect width={svgWidth} height={svgHeight} fill="#fafafa" rx="8" />

          {/* Title */}
          <text x={svgWidth / 2} y={30} textAnchor="middle" className="text-lg font-semibold fill-gray-800">
            Timing Advance Adjustment Visualization
          </text>

          {/* Before state */}
          <g transform="translate(50, 70)">
            <rect width={180} height={80} fill="#fee2e2" stroke="#ef4444" strokeWidth={2} rx="8" />
            <text x={90} y={30} textAnchor="middle" className="text-sm font-semibold fill-red-700">
              BEFORE
            </text>
            <text x={90} y={55} textAnchor="middle" className="text-lg font-bold fill-red-800">
              N<sub>TA</sub> = {currentTA}
            </text>
            <text x={90} y={72} textAnchor="middle" className="text-xs fill-red-600">
              {currentTA_us.toFixed(2)} μs
            </text>
          </g>

          {/* Arrow */}
          <g transform="translate(250, 100)">
            <path d="M 0 10 L 150 10" stroke="#005AFF" strokeWidth={3} markerEnd="url(#arrow-blue)" />
            <text x={75} y={-5} textAnchor="middle" className="text-sm font-medium fill-blue-700">
              TA CMD
            </text>
            <text x={75} y={35} textAnchor="middle" className="text-xs fill-gray-500">
              {taDifference > 0 ? '+' : ''}{taDifference} Tc
            </text>
          </g>

          {/* After state */}
          <g transform="translate(420, 70)">
            <rect width={180} height={80} fill="#d1fae5" stroke="#10b981" strokeWidth={2} rx="8" />
            <text x={90} y={30} textAnchor="middle" className="text-sm font-semibold fill-green-700">
              AFTER
            </text>
            <text x={90} y={55} textAnchor="middle" className="text-lg font-bold fill-green-800">
              N<sub>TA</sub> = {targetTA}
            </text>
            <text x={90} y={72} textAnchor="middle" className="text-xs fill-green-600">
              {targetTA_us.toFixed(2)} μs
            </text>
          </g>

          {/* Adjustment steps timeline */}
          <g transform="translate(50, 180)">
            <text x={0} y={0} className="text-sm font-semibold fill-gray-700">
              Adjustment Timeline:
            </text>
            
            {adjustmentTimeline.map((step, idx) => (
              <g key={idx} transform={`translate(${idx * 120}, 20)`}>
                <rect
                  width={100}
                  height={60}
                  fill={idx === animationStep ? '#dbeafe' : '#f3f4f6'}
                  stroke={idx === animationStep ? '#005AFF' : '#d1d5db'}
                  strokeWidth={idx === animationStep ? 2 : 1}
                  rx="6"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setAnimationStep(idx)}
                />
                <text x={50} y={20} textAnchor="middle" className="text-xs font-medium fill-gray-600">
                  Step {step.step}
                </text>
                <text x={50} y={38} textAnchor="middle" className="text-sm font-bold fill-gray-800">
                  {step.adjustment > 0 ? '+' : ''}{step.adjustment}
                </text>
                <text x={50} y={52} textAnchor="middle" className="text-xs fill-gray-500">
                  Tc units
                </text>
                {idx < adjustmentTimeline.length - 1 && (
                  <path
                    d="M 100 30 L 115 30"
                    stroke="#9ca3af"
                    strokeWidth={2}
                    markerEnd="url(#arrow-small)"
                  />
                )}
              </g>
            ))}
          </g>

          {/* Accuracy requirements */}
          <g transform="translate(50, 280)">
            <rect width={600} height={50} fill="#f0f9ff" stroke="#0ea5e9" strokeWidth={1} rx="6" />
            <text x={10} y={20} className="text-xs font-medium fill-sky-700">
              Accuracy Requirement ({selectedSCS.scs} kHz):
            </text>
            <text x={10} y={38} className="text-sm fill-sky-800">
              ±{selectedSCS.accuracy} μs | Min Step: {selectedSCS.minAdjustment} Tc | Max Step: {selectedSCS.maxAdjustment} Tc
            </text>
            <CheckCircle x={570} y={15} size={20} className="text-sky-600" />
          </g>

          {/* Arrow markers */}
          <defs>
            <marker id="arrow-blue" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#005AFF" />
            </marker>
            <marker id="arrow-small" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#9ca3af" />
            </marker>
          </defs>
        </svg>
      </div>

      {/* Step animation controls */}
      {gradualAdjustment && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="text-amber-600" size={20} />
            <div>
              <div className="font-medium text-amber-800">Gradual Adjustment Required</div>
              <div className="text-sm text-amber-700">
                Adjustment exceeds maximum step size ({selectedSCS.maxAdjustment} Tc). 
                UE must apply timing change gradually over {adjustmentSteps} steps.
              </div>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            {adjustmentTimeline.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setAnimationStep(idx)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  animationStep === idx
                    ? 'bg-amber-500 text-white'
                    : 'bg-white text-amber-700 hover:bg-amber-100'
                }`}
              >
                Step {idx + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Formula and requirements */}
      {showFormula && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Info size={16} />
              Adjustment Rules
            </h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="flex items-start gap-2">
                <ArrowRight size={14} className="mt-1 text-blue-600" />
                <span>Single adjustment if |ΔN<sub>TA</sub>| ≤ {selectedSCS.maxAdjustment} Tc</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight size={14} className="mt-1 text-blue-600" />
                <span>Gradual adjustment if |ΔN<sub>TA</sub>| &gt; {selectedSCS.maxAdjustment} Tc</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight size={14} className="mt-1 text-blue-600" />
                <span>Each step ≤ {selectedSCS.maxAdjustment} Tc</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight size={14} className="mt-1 text-blue-600" />
                <span>Accuracy: ±{selectedSCS.accuracy} μs</span>
              </li>
            </ul>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">SCS Configuration Table</h3>
            <table className="text-sm w-full">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left py-1 text-gray-600">SCS</th>
                  <th className="text-right py-1 text-gray-600">Max Step</th>
                  <th className="text-right py-1 text-gray-600">Accuracy</th>
                </tr>
              </thead>
              <tbody>
                {SCS_CONFIGS.map((config, idx) => (
                  <tr 
                    key={idx} 
                    className={`border-b border-gray-200 ${
                      selectedSCS === config ? 'bg-blue-100' : ''
                    }`}
                  >
                    <td className="py-1">{config.scs} kHz</td>
                    <td className="text-right font-mono">{config.maxAdjustment}</td>
                    <td className="text-right font-mono">±{config.accuracy}μs</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimingAdvanceVisualizer;
