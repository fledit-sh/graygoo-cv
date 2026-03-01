import type { CvTemplate } from '../../cv/types';

import { ClassicTemplate } from './ClassicTemplate';
import { CompactTemplate } from './CompactTemplate';

export const cvTemplates: CvTemplate[] = [
  {
    id: 'classic',
    label: 'Classic',
    component: ClassicTemplate,
  },
  {
    id: 'compact',
    label: 'Compact',
    component: CompactTemplate,
  },
];
