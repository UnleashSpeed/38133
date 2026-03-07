# 3GPP TS 38.133 Timing Requirements Visualizations

Interactive React visualization components for 3GPP timing specifications. Built with TypeScript, React, and SVG.

## Components

### 1. TimingDiagram
Interactive UE transmit timing diagram showing downlink frame reception, N_TA + N_TA_offset timing adjustment, and uplink frame transmission timing.

**Features:**
- Interactive SCS selection (15, 30, 60, 120, 240 kHz)
- Adjustable N_TA value slider
- Real-time timing calculation display
- Hover tooltips with parameter details
- Visual representation of DL/UL frame timing relationship

**3GPP Reference:** Section 7.1 - UE Transmit Timing

**Formula:**
```
T_UL = T_DL - (N_TA + N_TA,offset) × 16 × T_c
```

Where:
- T_c = 1/(480×10³×4096) ≈ 0.509 ns
- N_TA,offset = 25600 (FR1), 13792 (FR2), 62392 (FR2-2)

---

### 2. TimingAdvanceVisualizer
Timing advance adjustment visualizer showing before/after timing adjustment, adjustment step visualization, and accuracy requirements per SCS.

**Features:**
- Current and target N_TA value controls
- SCS-specific accuracy requirements
- Gradual adjustment visualization for large TA changes
- Step-by-step adjustment timeline
- Compliance indicators for 3GPP requirements

**3GPP Reference:** Section 7.3 - Timing Advance

**Adjustment Rules:**
- Single adjustment if |ΔN_TA| ≤ max_step
- Gradual adjustment if |ΔN_TA| > max_step
- Each step ≤ max_step Tc units

**SCS Configuration Table:**
| SCS | FR | Max Step (Tc) | Accuracy (μs) |
|-----|-----|---------------|---------------|
| 15 kHz | FR1 | 256 | ±0.52 |
| 30 kHz | FR1 | 512 | ±0.26 |
| 60 kHz | FR1/FR2 | 1024 | ±0.13 |
| 120 kHz | FR2 | 2048 | ±0.065 |
| 240 kHz | FR2 | 4096 | ±0.0325 |

---

### 3. GapPatternVisualizer
Measurement gap pattern visualizer showing MGL (Measurement Gap Length), MGRP (Measurement Gap Repetition Period) cycles, and gap patterns #0-25.

**Features:**
- All 26 gap patterns (#0-25) with interactive selection
- MGL and MGRP visualization
- Slot-level timeline with gap/active indicators
- Gap overhead calculation
- SCS-aware slot duration
- Interrupted slots calculation

**3GPP Reference:** Section 9.1.2 - Measurement Gap Patterns

**Gap Pattern Examples:**
| Pattern | MGL (ms) | MGRP (ms) | Overhead | Description |
|---------|----------|-----------|----------|-------------|
| Gap 0 | 1.5 | 20 | 7.5% | Short gap, frequent |
| Gap 1 | 3 | 20 | 15% | Medium gap, frequent |
| Gap 5 | 6 | 20 | 30% | Long gap, frequent |
| Gap 8 | 6 | 160 | 3.75% | Long gap, very sparse |

---

### 4. SCellActivationTimeline
SCell activation delay timeline showing T_HARQ, T_activation_time, T_CSI_Reporting phases for known vs unknown SCell paths.

**Features:**
- FR1/FR2 timing requirements
- Known vs Unknown SCell comparison
- Phase-by-phase timeline visualization
- SCS-specific timing calculations
- Total activation time display

**3GPP Reference:** Section 8.3 - SCell Activation

**Timing Formulas:**

**FR1:**
```
T_HARQ = 8 + 2 × (SCS/15 - 1) slots
T_activation_time = 21 + 2 × (SCS/15 - 1) slots
T_CSI_Reporting = 5 + 3 × (SCS/15 - 1) slots
```

**FR2:**
```
T_HARQ = 12 + 4 × (SCS/60 - 1) slots
T_activation_time = 26 + 4 × (SCS/60 - 1) slots
T_CSI_Reporting = 10 + 4 × (SCS/60 - 1) slots
```

**Timing Requirements Table:**
| FR | SCS | T_HARQ | T_act | T_CSI | Total (Known) | Total (Unknown) |
|-----|-----|--------|-------|-------|---------------|-----------------|
| FR1 | 15 | 8 | 21 | 5 | 34 | 58 |
| FR1 | 30 | 10 | 23 | 8 | 41 | 73 |
| FR1 | 60 | 12 | 26 | 10 | 48 | 88 |
| FR2 | 60 | 12 | 26 | 10 | 48 | 88 |
| FR2 | 120 | 16 | 30 | 14 | 60 | 116 |
| FR2 | 240 | 20 | 34 | 18 | 72 | 144 |

---

## Installation

```bash
# Copy components to your project
cp -r visualizations/* your-project/src/components/3gpp/

# Install required dependencies
npm install lucide-react
```

## Usage

```tsx
import { 
  TimingDiagram, 
  TimingAdvanceVisualizer, 
  GapPatternVisualizer, 
  SCellActivationTimeline 
} from './components/3gpp';

function App() {
  return (
    <div className="space-y-8 p-6">
      <TimingDiagram />
      <TimingAdvanceVisualizer />
      <GapPatternVisualizer />
      <SCellActivationTimeline />
    </div>
  );
}
```

## Styling

Components use Tailwind CSS classes with Nokia Blue (#005AFF) as the primary color. Ensure your project has Tailwind CSS configured.

**Color Scheme:**
- Primary: `#005AFF` (Nokia Blue)
- Success: `#10b981`
- Warning: `#f59e0b`
- Error: `#ef4444`
- Background: `#fafafa`, `#f3f4f6`

## Dependencies

- React 18+
- TypeScript 4.5+
- lucide-react (icons)
- Tailwind CSS (styling)

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

These components are provided as-is for educational and development purposes related to 3GPP specification visualization.

## References

- 3GPP TS 38.133: NR; Requirements for support of radio resource management
- 3GPP TS 38.211: NR; Physical channels and modulation
- 3GPP TS 38.213: NR; Physical layer procedures for control
- 3GPP TS 38.214: NR; Physical layer procedures for data
