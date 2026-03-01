import type React from 'react';

import type { DocumentNode, NodeType } from './types';

export interface NodeRendererContext {
  renderChildren: () => React.ReactNode;
}

export interface NodeRenderer<TData = unknown> {
  readonly type: NodeType;
  render(node: DocumentNode<TData>, context: NodeRendererContext): React.ReactNode;
}

export interface DesignRendererPlugin {
  id: string;
  renderers: Record<NodeType, NodeRenderer>;
}
