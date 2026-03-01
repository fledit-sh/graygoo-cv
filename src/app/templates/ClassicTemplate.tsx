import React from 'react';
import { Github, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

import type { ContactItem, CvData } from '../../cv/types';

const contactIcons: Record<ContactItem['type'], React.ComponentType<{ className?: string }>> = {
  email: Mail,
  phone: Phone,
  location: MapPin,
  linkedin: Linkedin,
  github: Github,
};

const leftSectionLabels = {
  skills: 'Core Competencies',
  languages: 'Languages',
} as const;

const rightSectionLabels = {
  experience: 'Professional Experience',
  education: 'Education',
  projects: 'Selected Projects',
} as const;

export function ClassicTemplate({ cv }: { cv: CvData }) {
  const profileContactItems: ContactItem[] = [
    { type: 'email', value: cv.profile.email },
    { type: 'phone', value: cv.profile.phone },
    { type: 'location', value: cv.profile.location },
    ...(cv.profile.linkedin ? [{ type: 'linkedin' as const, value: cv.profile.linkedin }] : []),
    ...(cv.profile.github ? [{ type: 'github' as const, value: cv.profile.github }] : []),
  ];

  return (
    <div className="cv-page" data-theme="classic">
      <div className="cv-sheet cv-print-sheet classic-template">
        <header className="cv-header">
          <h1 className="cv-name">{cv.profile.name}</h1>
          <p className="cv-role">{cv.profile.title}</p>

          <div className="cv-contact flex flex-wrap gap-x-6 gap-y-2">
            {profileContactItems.map((item) => {
              const Icon = contactIcons[item.type];
              if (!item.value) {
                return null;
              }

              return (
                <div key={`${item.type}-${item.value}`} className="flex items-center gap-2">
                  <Icon className="h-3.5 w-3.5" />
                  <span>{item.value}</span>
                </div>
              );
            })}
          </div>
        </header>

        <section className="cv-summary">
          <h2 className="cv-section-title">{cv.summary.title}</h2>
          <p className="cv-body" style={{ maxWidth: 'var(--cv-summary-max-width)' }}>
            {cv.summary.text}
          </p>
        </section>

        <div className="cv-grid">
          <div className="cv-sidebar">
            {cv.leftSectionOrder.map((sectionKey) => {
              if (sectionKey === 'skills') {
                return (
                  <section key={sectionKey} style={{ marginBottom: 'var(--cv-section-gap-lg)' }}>
                    <h2 className="cv-section-title">{leftSectionLabels[sectionKey]}</h2>
                    <div className="cv-rule" style={{ marginBottom: 'var(--cv-item-gap-md)' }}></div>
                    <div className="space-y-6">
                      {cv.skillGroups.map((group, index) => (
                        <div key={`${group.title}-${index}`}>
                          <h3 className="cv-text-primary mb-2.5 text-[11px] font-semibold tracking-wide">{group.title}</h3>
                          <ul className="cv-body space-y-1.5">
                            {group.items.map((item, itemIndex) => (
                              <li key={`${item}-${itemIndex}`}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </section>
                );
              }

              return (
                <section key={sectionKey}>
                  <h2 className="cv-section-title">{leftSectionLabels[sectionKey]}</h2>
                  <div className="cv-rule" style={{ marginBottom: 'var(--cv-item-gap-md)' }}></div>
                  <div className="cv-body space-y-2">
                    {cv.languages.map((entry, index) => (
                      <div key={`${entry.language}-${index}`}>
                        <span className="cv-text-primary font-semibold">{entry.language}</span> — {entry.proficiency}
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>

          <div className="cv-main">
            {cv.rightSectionOrder.map((sectionKey) => {
              if (sectionKey === 'experience') {
                return (
                  <section key={sectionKey} style={{ marginBottom: 'var(--cv-section-gap-lg)' }}>
                    <h2 className="cv-section-title">{rightSectionLabels[sectionKey]}</h2>
                    <div className="cv-rule" style={{ marginBottom: 'var(--cv-section-gap-sm)' }}></div>

                    <div className="space-y-8">
                      {cv.experiences.map((entry, index) => (
                        <div key={`${entry.company}-${entry.period}-${index}`}>
                          <div className="mb-4">
                            <div className="mb-1 flex items-baseline justify-between">
                              <h3 className="cv-text-primary text-[15px] font-semibold">{entry.company}</h3>
                              <span className="cv-meta">{entry.period}</span>
                            </div>
                            <div className="flex items-baseline justify-between">
                              <p className="cv-body">{entry.role}</p>
                              <span className="cv-meta">{entry.location}</span>
                            </div>
                          </div>
                          <ul className="space-y-2.5">
                            {entry.highlights.map((highlight, highlightIndex) => (
                              <li
                                key={`${highlight}-${highlightIndex}`}
                                className="cv-body relative pl-4 before:absolute before:left-0 before:text-[var(--cv-color-text-subtle)] before:content-['•']"
                              >
                                {highlight}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </section>
                );
              }

              if (sectionKey === 'education') {
                return (
                  <section key={sectionKey} style={{ marginBottom: 'var(--cv-section-gap-lg)' }}>
                    <h2 className="cv-section-title">{rightSectionLabels[sectionKey]}</h2>
                    <div className="cv-rule" style={{ marginBottom: 'var(--cv-section-gap-sm)' }}></div>

                    <div className="space-y-7">
                      {cv.education.map((entry, index) => (
                        <div key={`${entry.degree}-${entry.period}-${index}`}>
                          <div className="mb-3">
                            <div className="mb-1 flex items-baseline justify-between">
                              <h3 className="cv-text-primary text-[15px] font-semibold">{entry.degree}</h3>
                              <span className="cv-meta">{entry.period}</span>
                            </div>
                            <p className="cv-body">{entry.institution}</p>
                          </div>

                          {entry.focusAreas || entry.internationalExperience || entry.advancedModules ? (
                            <div className="cv-body space-y-3">
                              {entry.focusAreas ? (
                                <div>
                                  <span className="cv-text-primary font-semibold">Focus Areas:</span> {entry.focusAreas}
                                </div>
                              ) : null}
                              {entry.internationalExperience ? (
                                <div>
                                  <span className="cv-text-primary font-semibold">International Experience:</span>{' '}
                                  {entry.internationalExperience}
                                </div>
                              ) : null}
                              {entry.advancedModules?.length ? (
                                <div>
                                  <div className="cv-text-primary mb-2 font-semibold">Advanced Modules:</div>
                                  <ul className="space-y-1.5 pl-4">
                                    {entry.advancedModules.map((module, moduleIndex) => (
                                      <li
                                        key={`${module}-${moduleIndex}`}
                                        className="relative before:absolute before:left-[-16px] before:text-[var(--cv-color-text-subtle)] before:content-['–']"
                                      >
                                        {module}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ) : null}
                            </div>
                          ) : null}

                          {entry.details?.map((detail, detailIndex) => (
                            <p key={`${detail}-${detailIndex}`} className="cv-body">
                              {detail}
                            </p>
                          ))}
                        </div>
                      ))}
                    </div>
                  </section>
                );
              }

              return (
                <section key={sectionKey}>
                  <h2 className="cv-section-title">{rightSectionLabels[sectionKey]}</h2>
                  <div className="cv-rule" style={{ marginBottom: 'var(--cv-section-gap-sm)' }}></div>

                  <div className="space-y-5">
                    {cv.projects.map((project, index) => (
                      <div key={`${project.title}-${index}`}>
                        <h3 className="cv-text-primary mb-1.5 text-[13px] font-semibold">{project.title}</h3>
                        <p className="cv-body">{project.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
