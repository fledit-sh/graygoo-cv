import React, { useMemo, useRef } from 'react';

import type { DesignRendererPlugin } from './NodeRenderer';
import type { DocumentNode } from './types';

interface RenderCacheEntry {
  source: unknown;
  childIds: string[];
  pluginId: string;
  element: React.ReactNode;
}

function areIdsEqual(a: string[], b: string[]) {
  if (a.length !== b.length) {
    return false;
  }

  return a.every((id, index) => id === b[index]);
}

interface DocumentRendererProps {
  root: DocumentNode;
  plugin: DesignRendererPlugin;
}

export function DocumentRenderer({ root, plugin }: DocumentRendererProps) {
  const cacheRef = useRef<Map<string, RenderCacheEntry>>(new Map());

  const tree = useMemo(() => {
    const renderNode = (node: DocumentNode): React.ReactNode => {
      const renderer = plugin.renderers[node.type];
      if (!renderer) {
        return null;
      }

      const childIds = (node.children ?? []).map((child) => child.id);
      const previous = cacheRef.current.get(node.id);

      if (previous && previous.source === node.source && previous.pluginId === plugin.id && areIdsEqual(previous.childIds, childIds)) {
        return previous.element;
      }

      const element = renderer.render(node, {
        renderChildren: () => (node.children ?? []).map((child) => <React.Fragment key={child.id}>{renderNode(child)}</React.Fragment>),
      });

      cacheRef.current.set(node.id, {
        source: node.source,
        childIds,
        pluginId: plugin.id,
        element,
      });

      return element;
    };

    return renderNode(root);
  }, [plugin, root]);

  return <>{tree}</>;
}
