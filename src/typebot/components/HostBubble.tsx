import type { RichTextNode } from '../types';
import type { VarsMap } from '../engine/variables';
import { RichText } from './RichText';

type Props = { nodes: RichTextNode[]; vars: VarsMap; time: string };

export function HostBubble({ nodes, vars, time }: Props) {
  return (
    <div className="tb-host-bubble">
      <div className="tb-bubble-text">
        <RichText nodes={nodes} vars={vars} />
        <span className="tb-hora">{time}</span>
      </div>
    </div>
  );
}

export function HostImageBubble({ url, time }: { url: string; time: string }) {
  return (
    <div className="tb-host-bubble">
      <div className="tb-bubble-media">
        <img src={url} alt="" />
        <span className="tb-hora">{time}</span>
      </div>
    </div>
  );
}
