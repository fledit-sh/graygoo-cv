import React, { useMemo } from 'react';

import type { CvData } from '../../cv/types';
import { createCvDocument } from '../../presentation/rendering/createCvDocument';
import { DocumentRenderer } from '../../presentation/rendering/DocumentRenderer';
import { compactRendererPlugin } from './design-renderers/compactRenderers';

export function CompactTemplate({ cv }: { cv: CvData }) {
  const document = useMemo(() => createCvDocument(cv), [cv]);

  return <DocumentRenderer root={document} plugin={compactRendererPlugin} />;
}
