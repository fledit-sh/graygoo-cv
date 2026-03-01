import React from 'react';

import type { ContactItem, CvData } from '../../cv/types';

export function CompactTemplate({ cv }: { cv: CvData }) {
  const profileContactItems: ContactItem[] = [
    { type: 'email', value: cv.profile.email },
    { type: 'phone', value: cv.profile.phone },
    { type: 'location', value: cv.profile.location },
    ...(cv.profile.linkedin ? [{ type: 'linkedin' as const, value: cv.profile.linkedin }] : []),
    ...(cv.profile.github ? [{ type: 'github' as const, value: cv.profile.github }] : []),
  ];

  return (
    <div className="cv-page" data-theme="compact">
      <article className="cv-sheet cv-print-sheet compact-template">
        <header className="compact-header">
          <div>
            <h1 className="compact-name">{cv.profile.name}</h1>
            <p className="compact-role">{cv.profile.title}</p>
          </div>
          <div className="compact-contact">
            {profileContactItems.map((item) =>
              item.value ? (
                <div key={`${item.type}-${item.value}`}>
                  <span className="compact-contact-type">{item.type}</span>
                  <span>{item.value}</span>
                </div>
              ) : null,
            )}
          </div>
        </header>

        <section className="compact-summary">
          <h2>{cv.summary.title}</h2>
          <p>{cv.summary.text}</p>
        </section>

        <section className="compact-two-column">
          <div>
            <h3>Skills</h3>
            {cv.skillGroups.map((group, index) => (
              <div key={`${group.title}-${index}`} className="compact-block">
                <h4>{group.title}</h4>
                <p>{group.items.join(' • ')}</p>
              </div>
            ))}

            <h3>Languages</h3>
            <ul className="compact-list">
              {cv.languages.map((entry, index) => (
                <li key={`${entry.language}-${index}`}>
                  <strong>{entry.language}:</strong> {entry.proficiency}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3>Experience</h3>
            {cv.experiences.map((entry, index) => (
              <div key={`${entry.company}-${entry.period}-${index}`} className="compact-block">
                <h4>
                  {entry.role} · {entry.company}
                </h4>
                <p className="compact-meta">
                  {entry.period} · {entry.location}
                </p>
                <ul className="compact-list">
                  {entry.highlights.map((highlight, highlightIndex) => (
                    <li key={`${highlight}-${highlightIndex}`}>{highlight}</li>
                  ))}
                </ul>
              </div>
            ))}

            <h3>Education</h3>
            {cv.education.map((entry, index) => (
              <div key={`${entry.degree}-${entry.period}-${index}`} className="compact-block">
                <h4>{entry.degree}</h4>
                <p className="compact-meta">
                  {entry.institution} · {entry.period}
                </p>
                {entry.details?.map((detail, detailIndex) => (
                  <p key={`${detail}-${detailIndex}`}>{detail}</p>
                ))}
              </div>
            ))}

            <h3>Projects</h3>
            {cv.projects.map((project, index) => (
              <div key={`${project.title}-${index}`} className="compact-block">
                <h4>{project.title}</h4>
                <p>{project.description}</p>
              </div>
            ))}
          </div>
        </section>
      </article>
    </div>
  );
}
