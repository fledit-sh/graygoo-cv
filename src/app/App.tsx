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
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="max-w-[210mm] mx-auto bg-white shadow-lg" style={{ minHeight: '297mm' }}>
        <header className="border-b-2 border-gray-900 px-14 pt-14 pb-8">
          <h1 className="text-5xl font-bold tracking-tight mb-3 text-gray-900" style={{ letterSpacing: '-0.01em' }}>
            {defaultCv.profile.name}
          </h1>
          <p className="text-base text-gray-600 mb-6 font-light">{defaultCv.profile.title}</p>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
            {profileContactItems.map((item) => {
              const Icon = contactIcons[item.type];
              if (!item.value) {
                return null;
              }

              return (
                <div key={item.type} className="flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.value}</span>
                </div>
              );
            })}
          </div>
        </header>

        <section className="px-14 py-8 border-b border-gray-300">
          <h2 className="text-[10px] font-semibold uppercase tracking-widest mb-4 text-gray-900">{defaultCv.summary.title}</h2>
          <p className="text-[14px] text-gray-700 leading-[1.8] max-w-[85%]">{defaultCv.summary.text}</p>
        </section>

        <div className="grid grid-cols-[320px_1fr] gap-0">
          <div className="bg-gray-50 px-10 py-10 border-r border-gray-300">
            {defaultCv.leftSectionOrder.map((sectionKey) => {
              if (sectionKey === 'skills') {
                return (
                  <section key={sectionKey} className="mb-10">
                    <h2 className="text-[10px] font-semibold uppercase tracking-widest mb-4 text-gray-900">{leftSectionLabels[sectionKey]}</h2>
                    <div className="w-12 h-[1px] bg-gray-900 mb-5"></div>
                    <div className="space-y-6">
                      {defaultCv.skillGroups.map((group) => (
                        <div key={group.title}>
                          <h3 className="text-[11px] font-semibold mb-2.5 text-gray-900 tracking-wide">{group.title}</h3>
                          <ul className="text-[12px] text-gray-700 space-y-1.5 leading-[1.6]">
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
                  <h2 className="text-[10px] font-semibold uppercase tracking-widest mb-4 text-gray-900">{leftSectionLabels[sectionKey]}</h2>
                  <div className="w-12 h-[1px] bg-gray-900 mb-5"></div>
                  <div className="space-y-2 text-[12px] text-gray-700 leading-[1.7]">
                    {defaultCv.languages.map((entry) => (
                      <div key={entry.language}>
                        <span className="font-semibold text-gray-900">{entry.language}</span> — {entry.proficiency}
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>

          <div className="px-10 py-10">
            {defaultCv.rightSectionOrder.map((sectionKey) => {
              if (sectionKey === 'experience') {
                return (
                  <section key={sectionKey} className="mb-10">
                    <h2 className="text-[10px] font-semibold uppercase tracking-widest mb-4 text-gray-900">{rightSectionLabels[sectionKey]}</h2>
                    <div className="w-12 h-[1px] bg-gray-900 mb-7"></div>

                    <div className="space-y-8">
                      {defaultCv.experiences.map((entry) => (
                        <div key={`${entry.company}-${entry.period}`}>
                          <div className="mb-4">
                            <div className="flex justify-between items-baseline mb-1">
                              <h3 className="text-[15px] font-semibold text-gray-900">{entry.company}</h3>
                              <span className="text-[11px] text-gray-500 font-light">{entry.period}</span>
                            </div>
                            <div className="flex justify-between items-baseline">
                              <p className="text-[13px] text-gray-600">{entry.role}</p>
                              <span className="text-[11px] text-gray-500 font-light">{entry.location}</span>
                            </div>
                          </div>
                          <ul className="space-y-2.5">
                            {entry.highlights.map((highlight) => (
                              <li
                                key={highlight}
                                className="text-[13px] text-gray-700 leading-[1.65] pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-gray-400"
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
                  <section key={sectionKey} className="mb-10">
                    <h2 className="text-[10px] font-semibold uppercase tracking-widest mb-4 text-gray-900">{rightSectionLabels[sectionKey]}</h2>
                    <div className="w-12 h-[1px] bg-gray-900 mb-7"></div>

                    <div className="space-y-7">
                      {defaultCv.education.map((entry) => (
                        <div key={`${entry.degree}-${entry.period}`}>
                          <div className="mb-3">
                            <div className="flex justify-between items-baseline mb-1">
                              <h3 className="text-[15px] font-semibold text-gray-900">{entry.degree}</h3>
                              <span className="text-[11px] text-gray-500 font-light">{entry.period}</span>
                            </div>
                            <p className="text-[13px] text-gray-600">{entry.institution}</p>
                          </div>

                          {entry.focusAreas || entry.internationalExperience || entry.advancedModules ? (
                            <div className="space-y-3 text-[13px] text-gray-700 leading-[1.65]">
                              {entry.focusAreas ? (
                                <div>
                                  <span className="font-semibold text-gray-900">Focus Areas:</span> {entry.focusAreas}
                                </div>
                              ) : null}
                              {entry.internationalExperience ? (
                                <div>
                                  <span className="font-semibold text-gray-900">International Experience:</span> {entry.internationalExperience}
                                </div>
                              ) : null}
                              {entry.advancedModules?.length ? (
                                <div>
                                  <div className="font-semibold text-gray-900 mb-2">Advanced Modules:</div>
                                  <ul className="space-y-1.5 pl-4">
                                    {entry.advancedModules.map((module) => (
                                      <li key={module} className="relative before:content-['–'] before:absolute before:left-[-16px] before:text-gray-400">
                                        {module}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ) : null}
                            </div>
                          ) : null}

                          {entry.details?.map((detail) => (
                            <p key={detail} className="text-[13px] text-gray-700 leading-[1.65]">
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
                  <h2 className="text-[10px] font-semibold uppercase tracking-widest mb-4 text-gray-900">{rightSectionLabels[sectionKey]}</h2>
                  <div className="w-12 h-[1px] bg-gray-900 mb-7"></div>

                  <div className="space-y-5">
                    {defaultCv.projects.map((project) => (
                      <div key={project.title}>
                        <h3 className="text-[13px] font-semibold text-gray-900 mb-1.5">{project.title}</h3>
                        <p className="text-[13px] text-gray-700 leading-[1.65]">{project.description}</p>
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
