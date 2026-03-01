import React from 'react';

import type { ContactItem } from '../../../cv/types';
import type { DesignRendererPlugin, NodeRenderer } from '../../../presentation/rendering/NodeRenderer';

class CompactDocumentRenderer implements NodeRenderer {
  readonly type = 'document' as const;

  render(node, context) {
    const data = (node.data ?? {}) as { name?: string; role?: string; contacts?: ContactItem[] };

    return (
      <div className="cv-page" data-theme="compact">
        <article className="cv-sheet cv-print-sheet compact-template">
          <header className="compact-header">
            <div>
              <h1 className="compact-name">{data.name}</h1>
              <p className="compact-role">{data.role}</p>
            </div>
            <div className="compact-contact">
              {(data.contacts ?? []).map((item) =>
                item.value ? (
                  <div key={`${item.type}-${item.value}`}>
                    <span className="compact-contact-type">{item.type}</span>
                    <span>{item.value}</span>
                  </div>
                ) : null,
              )}
            </div>
          </header>
          {context.renderChildren()}
        </article>
      </div>
    );
  }
}

class CompactSectionRenderer implements NodeRenderer {
  readonly type = 'section' as const;

  render(node, context) {
    const data = (node.data ?? {}) as { title?: string; variant?: string };

    if (node.id === 'summary-section') {
      return (
        <section className="compact-summary">
          <h2>{data.title}</h2>
          {context.renderChildren()}
        </section>
      );
    }

    if (data.variant === 'columns') {
      return <section className="compact-two-column">{context.renderChildren()}</section>;
    }

    if (data.variant === 'left-column' || data.variant === 'right-column') {
      return <div>{context.renderChildren()}</div>;
    }

    return (
      <section className="compact-block">
        <h3>{data.title}</h3>
        {context.renderChildren()}
      </section>
    );
  }
}

class CompactParagraphRenderer implements NodeRenderer {
  readonly type = 'paragraph' as const;

  render(node) {
    const data = (node.data ?? {}) as { text?: string };
    return <p>{data.text}</p>;
  }
}

class CompactListRenderer implements NodeRenderer {
  readonly type = 'list' as const;

  render(node, context) {
    const data = (node.data ?? {}) as { title?: string; variant?: string };
    return (
      <div className="compact-block">
        {data.title ? <h4>{data.title}</h4> : null}
        <ul className="compact-list">{context.renderChildren()}</ul>
      </div>
    );
  }
}

class CompactListItemRenderer implements NodeRenderer {
  readonly type = 'listItem' as const;

  render(node) {
    const data = (node.data ?? {}) as { text?: string };
    return <li>{data.text}</li>;
  }
}

class CompactMetaRenderer implements NodeRenderer {
  readonly type = 'meta' as const;

  render(node) {
    const data = (node.data ?? {}) as { primary?: string; secondary?: string };
    return (
      <p>
        <strong>{data.primary}:</strong> {data.secondary}
      </p>
    );
  }
}

class CompactTableRenderer implements NodeRenderer {
  readonly type = 'table' as const;

  render(node, context) {
    const data = (node.data ?? {}) as { primary?: string; secondary?: string; tertiary?: string; quaternary?: string };

    return (
      <div className="compact-block">
        <h4>{data.tertiary ? `${data.tertiary} · ${data.primary}` : data.primary}</h4>
        <p className="compact-meta">
          {data.secondary}
          {data.quaternary ? ` · ${data.quaternary}` : ''}
        </p>
        {context.renderChildren()}
      </div>
    );
  }
}

class CompactImageRenderer implements NodeRenderer {
  readonly type = 'image' as const;

  render(node) {
    const data = (node.data ?? {}) as { src?: string; alt?: string; hidden?: boolean };
    if (data.hidden || !data.src) {
      return null;
    }

    return <img src={data.src} alt={data.alt ?? 'image'} className="h-auto max-w-full" />;
  }
}

export const compactRendererPlugin: DesignRendererPlugin = {
  id: 'compact',
  renderers: {
    document: new CompactDocumentRenderer(),
    section: new CompactSectionRenderer(),
    heading: new CompactParagraphRenderer(),
    paragraph: new CompactParagraphRenderer(),
    list: new CompactListRenderer(),
    listItem: new CompactListItemRenderer(),
    meta: new CompactMetaRenderer(),
    image: new CompactImageRenderer(),
    table: new CompactTableRenderer(),
  },
};
