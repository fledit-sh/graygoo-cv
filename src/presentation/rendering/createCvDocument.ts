import type { CvData, ContactItem } from '../../cv/types';

import type { DocumentNode } from './types';

const leftSectionLabels = {
  skills: 'Core Competencies',
  languages: 'Languages',
} as const;

const rightSectionLabels = {
  experience: 'Professional Experience',
  education: 'Education',
  projects: 'Selected Projects',
} as const;

export function createCvDocument(cv: CvData): DocumentNode {
  const profileContactItems: ContactItem[] = [
    { type: 'email', value: cv.profile.email },
    { type: 'phone', value: cv.profile.phone },
    { type: 'location', value: cv.profile.location },
    ...(cv.profile.linkedin ? [{ type: 'linkedin' as const, value: cv.profile.linkedin }] : []),
    ...(cv.profile.github ? [{ type: 'github' as const, value: cv.profile.github }] : []),
  ];

  return {
    id: 'cv-document',
    type: 'document',
    source: cv,
    data: {
      theme: 'active',
      name: cv.profile.name,
      role: cv.profile.title,
      contacts: profileContactItems,
    },
    children: [
      {
        id: 'summary-section',
        type: 'section',
        source: cv.summary,
        data: { title: cv.summary.title, variant: 'summary' },
        children: [{ id: 'summary-text', type: 'paragraph', source: cv.summary.text, data: { text: cv.summary.text } }],
      },
      {
        id: 'columns-layout',
        type: 'section',
        source: [cv.leftSectionOrder, cv.rightSectionOrder],
        data: { variant: 'columns' },
        children: [
          {
            id: 'left-column',
            type: 'section',
            source: cv.leftSectionOrder,
            data: { variant: 'left-column' },
            children: cv.leftSectionOrder.map((sectionKey) => {
              if (sectionKey === 'skills') {
                return {
                  id: 'skills-section',
                  type: 'section',
                  source: cv.skillGroups,
                  data: { title: leftSectionLabels.skills },
                  children: cv.skillGroups.map((group, index) => ({
                    id: `skill-group-${index}`,
                    type: 'list',
                    source: group,
                    data: { title: group.title },
                    children: group.items.map((item, itemIndex) => ({
                      id: `skill-item-${index}-${itemIndex}`,
                      type: 'listItem',
                      source: item,
                      data: { text: item },
                    })),
                  })),
                };
              }

              return {
                id: 'languages-section',
                type: 'section',
                source: cv.languages,
                data: { title: leftSectionLabels.languages },
                children: cv.languages.map((entry, index) => ({
                  id: `language-${index}`,
                  type: 'meta',
                  source: entry,
                  data: { primary: entry.language, secondary: entry.proficiency },
                })),
              };
            }),
          },
          {
            id: 'right-column',
            type: 'section',
            source: cv.rightSectionOrder,
            data: { variant: 'right-column' },
            children: cv.rightSectionOrder.map((sectionKey) => {
              if (sectionKey === 'experience') {
                return {
                  id: 'experience-section',
                  type: 'section',
                  source: cv.experiences,
                  data: { title: rightSectionLabels.experience },
                  children: cv.experiences.map((entry, index) => ({
                    id: `experience-${index}`,
                    type: 'table',
                    source: entry,
                    data: {
                      primary: entry.company,
                      secondary: entry.period,
                      tertiary: entry.role,
                      quaternary: entry.location,
                    },
                    children: entry.highlights.map((highlight, highlightIndex) => ({
                      id: `experience-highlight-${index}-${highlightIndex}`,
                      type: 'listItem',
                      source: highlight,
                      data: { text: highlight },
                    })),
                  })),
                };
              }

              if (sectionKey === 'education') {
                return {
                  id: 'education-section',
                  type: 'section',
                  source: cv.education,
                  data: { title: rightSectionLabels.education },
                  children: cv.education.map((entry, index) => ({
                    id: `education-${index}`,
                    type: 'table',
                    source: entry,
                    data: { primary: entry.degree, secondary: entry.period, tertiary: entry.institution },
                    children: [
                      ...(entry.details ?? []).map((detail, detailIndex) => ({
                        id: `education-detail-${index}-${detailIndex}`,
                        type: 'paragraph',
                        source: detail,
                        data: { text: detail },
                      })),
                      ...(entry.advancedModules ?? []).map((module, moduleIndex) => ({
                        id: `education-module-${index}-${moduleIndex}`,
                        type: 'listItem',
                        source: module,
                        data: { text: module },
                      })),
                    ],
                  })),
                };
              }

              return {
                id: 'projects-section',
                type: 'section',
                source: cv.projects,
                data: { title: rightSectionLabels.projects },
                children: cv.projects.map((project, index) => ({
                  id: `project-${index}`,
                  type: 'list',
                  source: project,
                  data: { title: project.title },
                  children: [
                    {
                      id: `project-description-${index}`,
                      type: 'paragraph',
                      source: project.description,
                      data: { text: project.description },
                    },
                  ],
                })),
              };
            }),
          },
        ],
      },
      {
        id: 'hero-image-placeholder',
        type: 'image',
        source: cv.profile.name,
        data: { src: '', alt: `${cv.profile.name} portrait`, hidden: true },
      },
    ],
  };
}
