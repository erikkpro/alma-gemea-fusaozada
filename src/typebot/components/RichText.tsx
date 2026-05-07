import type { RichTextNode } from '../types';
import { interpolate } from '../engine/variables';
import type { VarsMap } from '../engine/variables';

type Props = { nodes: RichTextNode[]; vars: VarsMap };

function renderLeaf(node: RichTextNode, vars: VarsMap, key: string): React.ReactNode {
  if (typeof node.text === 'string') {
    let el: React.ReactNode = interpolate(node.text, vars);
    if (node.bold) el = <strong key={key}>{el}</strong>;
    if (node.italic) el = <em key={key}>{el}</em>;
    if (node.underline) el = <u key={key}>{el}</u>;
    return <span key={key}>{el}</span>;
  }
  if (node.children) {
    if (node.type === 'p') {
      return (
        <p key={key} style={{ margin: 0 }}>
          {node.children.map((c, i) => renderLeaf(c, vars, `${key}-${i}`))}
        </p>
      );
    }
    return <span key={key}>{node.children.map((c, i) => renderLeaf(c, vars, `${key}-${i}`))}</span>;
  }
  return null;
}

export function RichText({ nodes, vars }: Props) {
  return <>{nodes.map((n, i) => renderLeaf(n, vars, String(i)))}</>;
}
