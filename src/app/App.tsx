import React from 'react';
import { Mail, MapPin, Phone, Linkedin, Github } from 'lucide-react';

import { defaultCv, profileContactItems } from '../cv/content/defaultCv';
import type { ContactItem } from '../cv/types';

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

export default function App() {
  return (
    <div className="cv-page" data-theme="default">
      <div className="cv-sheet cv-print-sheet">
        <header className="cv-header">
          <h1 className="cv-name">{defaultCv.profile.name}</h1>
          <p className="cv-role">{defaultCv.profile.title}</p>

          <div className="cv-contact flex flex-wrap gap-x-6 gap-y-2">
            {profileContactItems.map((item) => {
              const Icon = contactIcons[item.type];
              if (!item.value) {
                return null;
              }

              return (
                <div key={item.type} className="flex items-center gap-2">
                  <Icon className="h-3.5 w-3.5" />
                  <span>{item.value}</span>
                </div>
              );
            })}
          </div>
        </header>

        <section className="cv-summary">
          <h2 className="cv-section-title">{defaultCv.summary.title}</h2>
          <p className="cv-body" style={{ maxWidth: 'var(--cv-summary-max-width)' }}>
            {defaultCv.summary.text}
          </p>
        </section>

        <div className="cv-grid">
          <div className="cv-sidebar">
            {defaultCv.leftSectionOrder.map((sectionKey) => {
              if (sectionKey === 'skills') {
                return (
                  <section key={sectionKey} style={{ marginBottom: 'var(--cv-section-gap-lg)' }}>
                    <h2 className="cv-section-title">{leftSectionLabels[sectionKey]}</h2>
                    <div className="cv-rule" style={{ marginBottom: 'var(--cv-item-gap-md)' }}></div>
                    <div className="space-y-6">
                      {defaultCv.skillGroups.map((group) => (
                        <div key={group.title}>
                          <h3 className="cv-text-primary mb-2.5 text-[11px] font-semibold tracking-wide">{group.title}</h3>
                          <ul className="cv-body space-y-1.5">
                            {group.items.map((item) => (
                              <li key={item}>{item}</li>
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
                    {defaultCv.languages.map((entry) => (
                      <div key={entry.language}>
                        <span className="cv-text-primary font-semibold">{entry.language}</span> — {entry.proficiency}
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>

          <div className="cv-main">
            {defaultCv.rightSectionOrder.map((sectionKey) => {
              if (sectionKey === 'experience') {
                return (
                  <section key={sectionKey} style={{ marginBottom: 'var(--cv-section-gap-lg)' }}>
                    <h2 className="cv-section-title">{rightSectionLabels[sectionKey]}</h2>
                    <div className="cv-rule" style={{ marginBottom: 'var(--cv-section-gap-sm)' }}></div>

                    <div className="space-y-8">
                      {defaultCv.experiences.map((entry) => (
                        <div key={`${entry.company}-${entry.period}`}>
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
                            {entry.highlights.map((highlight) => (
                              <li
                                key={highlight}
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
                      {defaultCv.education.map((entry) => (
                        <div key={`${entry.degree}-${entry.period}`}>
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
                                  <span className="cv-text-primary font-semibold">International Experience:</span> {entry.internationalExperience}
                                </div>
                              ) : null}
                              {entry.advancedModules?.length ? (
                                <div>
                                  <div className="cv-text-primary mb-2 font-semibold">Advanced Modules:</div>
                                  <ul className="space-y-1.5 pl-4">
                                    {entry.advancedModules.map((module) => (
                                      <li
                                        key={module}
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

                          {entry.details?.map((detail) => (
                            <p key={detail} className="cv-body">
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
                    {defaultCv.projects.map((project) => (
                      <div key={project.title}>
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

      <style>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          @page {
            size: A4;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
}
