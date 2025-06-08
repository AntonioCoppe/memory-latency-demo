import React from 'react';

export interface MemoryNodeProps {
  id: string;
  label: string;
  style: React.CSSProperties;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const MemoryNode: React.FC<MemoryNodeProps> = ({ id, label, style, onClick }) => (
  <div id={id} className="mem-node" style={style} onClick={onClick}>
    <span className="label">{label}</span>
  </div>
);
