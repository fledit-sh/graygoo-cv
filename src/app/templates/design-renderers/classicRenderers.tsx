import React from 'react';
import { Github, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

import type { ContactItem } from '../../../cv/types';
import type { DesignRendererPlugin, NodeRenderer } from '../../../presentation/rendering/NodeRenderer';

const contactIcons: Record<ContactItem['type'], React.ComponentType<{ className?: string }>> = {
  email: Mail,
  phone: Phone,
  location: MapPin,
  linkedin: Linkedin,
  github: Github,
};

class ClassicDocumentRenderer implements NodeRenderer {
  readonly type = 'document' as const;

  render(node, context) {
    const data = (node.data ?? {}) as { name?: string; role?: string; contacts?: ContactItem[] };
    return (
      <div className="cv-page" data-theme="classic">
        <div className="cv-sheet cv-print-sheet classic-template">
          <header className="cv-header">
            <h1 className="cv-name">{data.name}</h1>
            <p className="cv-role">{data.role}</p>
            <div className="cv-contact flex flex-wrap gap-x-6 gap-y-2">
              {(data.contacts ?? []).map((item) => {
                if (!item.value) {
                  return null;
                }

                const Icon = contactIcons[item.type];
                return (
                  <div key={`${item.type}-${item.value}`} className="flex items-center gap-2">
                    <Icon className="h-3.5 w-3.5" />
                    <span>{item.value}</span>
                  </div>
                );
              })}
            </div>
          </header>
          {context.renderChildren()}
        </div>
      </div>
    );
  }
}

class ClassicSectionRenderer implements NodeRenderer {
  readonly type = 'section' as const;

  render(node, context) {
    const data = (node.data ?? {}) as { title?: string; variant?: string };

    if (data.variant === 'columns') {
      return <div className="cv-grid">{context.renderChildren()}</div>;
    }

    if (data.variant === 'left-column') {
      return <div className="cv-sidebar">{context.renderChildren()}</div>;
    }

    if (data.variant === 'right-column') {
      return <div className="cv-main">{context.renderChildren()}</div>;
    }

    if (node.id === 'summary-section') {
      return (
        <section className="cv-summary">
          <h2 className="cv-section-title">{data.title}</h2>
          {context.renderChildren()}
        </section>
      );
    }

    return (
      <section style={{ marginBottom: 'var(--cv-section-gap-lg)' }}>
        <h2 className="cv-section-title">{data.title}</h2>
        <div className="cv-rule" style={{ marginBottom: 'var(--cv-section-gap-sm)' }}></div>
        {context.renderChildren()}
      </section>
    );
  }
}

class ClassicParagraphRenderer implements NodeRenderer {
  readonly type = 'paragraph' as const;

  render(node) {
    const data = (node.data ?? {}) as { text?: string };
    return <p className="cv-body">{data.text}</p>;
  }
}

class ClassicListRenderer implements NodeRenderer {
  readonly type = 'list' as const;

  render(node, context) {
    const data = (node.data ?? {}) as { title?: string; variant?: string };

    return (
      <div className="space-y-2">
        {data.title ? <h3 className="cv-text-primary text-[13px] font-semibold">{data.title}</h3> : null}
        <ul className="cv-body space-y-1.5">{context.renderChildren()}</ul>
      </div>
    );
  }
}

class ClassicListItemRenderer implements NodeRenderer {
  readonly type = 'listItem' as const;

  render(node) {
    const data = (node.data ?? {}) as { text?: string };
    return <li className="cv-body">{data.text}</li>;
  }
}

class ClassicMetaRenderer implements NodeRenderer {
  readonly type = 'meta' as const;

  render(node) {
    const data = (node.data ?? {}) as { primary?: string; secondary?: string };
    return (
      <p className="cv-body">
        <span className="cv-text-primary font-semibold">{data.primary}</span> — {data.secondary}
      </p>
    );
  }
}

class ClassicTableRenderer implements NodeRenderer {
  readonly type = 'table' as const;

  render(node, context) {
    const data = (node.data ?? {}) as { primary?: string; secondary?: string; tertiary?: string; quaternary?: string };

    return (
      <article className="space-y-2">
        <div className="flex items-baseline justify-between">
          <h3 className="cv-text-primary text-[15px] font-semibold">{data.primary}</h3>
          <span className="cv-meta">{data.secondary}</span>
        </div>
        {data.tertiary ? (
          <div className="flex items-baseline justify-between">
            <p className="cv-body">{data.tertiary}</p>
            <span className="cv-meta">{data.quaternary}</span>
          </div>
        ) : null}
        {context.renderChildren()}
      </article>
    );
  }
}

class ClassicImageRenderer implements NodeRenderer {
  readonly type = 'image' as const;

  render(node) {
    const data = (node.data ?? {}) as { src?: string; alt?: string; hidden?: boolean };
    if (data.hidden || !data.src) {
      return null;
    }

    return <img src={data.src} alt={data.alt ?? 'image'} className="h-auto max-w-full" />;
  }
}

export const classicRendererPlugin: DesignRendererPlugin = {
  id: 'classic',
  renderers: {
    document: new ClassicDocumentRenderer(),
    section: new ClassicSectionRenderer(),
    heading: new ClassicParagraphRenderer(),
    paragraph: new ClassicParagraphRenderer(),
    list: new ClassicListRenderer(),
    listItem: new ClassicListItemRenderer(),
    meta: new ClassicMetaRenderer(),
    image: new ClassicImageRenderer(),
    table: new ClassicTableRenderer(),
  },
};
