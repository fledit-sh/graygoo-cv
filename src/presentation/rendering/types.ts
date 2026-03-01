export type NodeType =
  | 'document'
  | 'section'
  | 'heading'
  | 'paragraph'
  | 'list'
  | 'listItem'
  | 'meta'
  | 'image'
  | 'table';

export interface DocumentNode<TData = unknown> {
  id: string;
  type: NodeType;
  data?: TData;
  children?: DocumentNode[];
  source?: unknown;
}

export interface RenderedNode {
  id: string;
  element: React.ReactNode;
}
