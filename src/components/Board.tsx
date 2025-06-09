import type { FC, MouseEvent } from 'react'
import Tippy from '@tippyjs/react'
import 'tippy.js/dist/tippy.css'

export interface BoardProps {
  /** Called with the `data-lat` key when any node is clicked */
  onNodeClick: (level: string) => void
  /** Durations mapping for each level, in ms */
  durations: Record<string, number>
}

// One-line descriptions for each level
const descriptions: Record<string, string> = {
  Registers: 'On-core register file',
  CPU:       'Processor core executing instructions',
  L1:        'Per-thread, on-core cache',
  L2:        'Shared on-core cache',
  L3:        'Off-core last-level cache',
  RAM:       'Main system memory (DRAM)',
  SSD:       'Solid-state drive storage',
  HDD:       'Magnetic disk-based storage',
  Net_NYC:   'Network (SF → New York)',
  Net_UK:    'Network (SF → U.K.)',
  Net_AUS:   'Network (SF → Australia)',
  OS:        'OS context switch / reboot',
  SCSI:      'SCSI bus timeout event',
  HW:        'Hardware virtualization overhead',
  PHYS:      'Full system reboot'
}

// All of the memory nodes with their exact sizes & positions
const nodes = [
  { id: 'l3',        dataLat: 'L3',       label: 'L3',            style: { width: '340px', height: '340px', border: '2px dashed #8e24aa', top: '180px', left: '430px' } },
  { id: 'l2',        dataLat: 'L2',       label: 'L2',            style: { width: '280px', height: '280px', border: '2px dashed #5e35b1', top: '210px', left: '460px' } },
  { id: 'l1',        dataLat: 'L1',       label: 'L1',            style: { width: '220px', height: '220px', border: '2px dashed #3949ab', top: '240px', left: '490px' } },
  { id: 'cpu-socket', dataLat: 'CPU',      label: 'CPU',           style: { width: '160px', height: '160px', background: '#2196f3',      top: '280px', left: '520px' } },
  { id: 'regs',      dataLat: 'Registers',label: 'Regs',         style: { width: ' 80px', height: ' 80px', background: '#f44336',      top: '310px', left: '550px' } },
  { id: 'ram1',      dataLat: 'RAM',      label: 'RAM',           style: { width: ' 40px', height: '200px', background: '#4caf50',      top: '240px', left: '780px' } },
  { id: 'ram2',      dataLat: 'RAM',      label: 'RAM',           style: { width: ' 40px', height: '200px', background: '#4caf50',      top: '240px', left: '830px' } },
  { id: 'ram3',      dataLat: 'RAM',      label: 'RAM',           style: { width: ' 40px', height: '200px', background: '#4caf50',      top: '240px', left: '880px' } },
  { id: 'ram4',      dataLat: 'RAM',      label: 'RAM',           style: { width: ' 40px', height: '200px', background: '#4caf50',      top: '240px', left: '930px' } },
  { id: 'ssd',       dataLat: 'SSD',      label: 'SSD',           style: { width: '100px', height: ' 60px', background: '#ff9800',      top: '480px', left: '800px' } },
  { id: 'hdd',       dataLat: 'HDD',      label: 'HDD',           style: { width: '120px', height: ' 50px', background: '#795548',      top: '550px', left: '780px' } }
]

// Helper to format ms into ms, s, min, h, d, or y
function formatTime(ms: number): string {
  if (ms < 1_000) return `${ms.toFixed(1)} ms`
  const s = ms / 1_000
  if (s < 60) return `${s.toFixed(2)} s`
  const m = s / 60
  if (m < 60) return `${m.toFixed(2)} min`
  const h = m / 60
  if (h < 24) return `${h.toFixed(2)} h`
  const d = h / 24
  if (d < 365) return `${d.toFixed(2)} d`
  const y = d / 365
  return `${y.toFixed(2)} y`
}

export const Board: FC<BoardProps> = ({ onNodeClick, durations }) => {
  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const key = el.dataset.lat!
    onNodeClick(key)

    const duration = durations[key]
    if (duration === undefined) return

    // create & position packet
    const packet = document.createElement('div')
    packet.className = 'packet'
    document.body.appendChild(packet)

    const from = el.getBoundingClientRect()
    const startX = from.left + window.scrollX + from.width / 2 - 6
    const startY = from.top + window.scrollY + from.height / 2 - 6
    packet.style.left = `${startX}px`
    packet.style.top = `${startY}px`

    const cpuRect = document.getElementById('cpu-socket')!.getBoundingClientRect()
    const endX = cpuRect.left + window.scrollX + cpuRect.width / 2
    const endY = cpuRect.top + window.scrollY + cpuRect.height / 2

    packet.animate(
      [
        { transform: 'translate(0,0)' },
        { transform: `translate(${endX - startX}px, ${endY - startY}px)` }
      ],
      { duration, easing: 'linear' }
    ).onfinish = () => packet.remove()
  }

  return (
    <div id="board">
      {nodes.map(node => (
        <Tippy
          key={node.id}
          content={
            <>
              <strong>{node.label}</strong><br/>
              {descriptions[node.dataLat]}<br/>
              Anim: {formatTime(durations[node.dataLat])}
            </>
          }
          delay={[200, 0]}
        >
          <div
            id={node.id}
            className="mem"
            data-lat={node.dataLat}
            style={node.style}
            onClick={handleClick}
          >
            <span className="label">{node.label}</span>
          </div>
        </Tippy>
      ))}
    </div>
  )
}
