import React, { useMemo } from 'react';

import type { CvData } from '../../cv/types';
import { createCvDocument } from '../../presentation/rendering/createCvDocument';
import { DocumentRenderer } from '../../presentation/rendering/DocumentRenderer';
import { classicRendererPlugin } from './design-renderers/classicRenderers';

export function ClassicTemplate({ cv }: { cv: CvData }) {
  const document = useMemo(() => createCvDocument(cv), [cv]);

  return <DocumentRenderer root={document} plugin={classicRendererPlugin} />;
}
