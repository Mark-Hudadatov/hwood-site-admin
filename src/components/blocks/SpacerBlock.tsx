import React from 'react';
import type { SpacerData } from '../../domain/types';

interface Props { data: SpacerData; }
export const SpacerBlock: React.FC<Props> = ({ data }) => (
  <div style={{ height: data.height_px, background: data.bg_color === 'transparent' ? 'transparent' : data.bg_color }} />
);
