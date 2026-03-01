import React, { useState } from 'react';

import { cvTemplates } from './templates';
import { CvEditorPanel } from './components/editor/CvEditorPanel';
import { defaultCv } from '../cv/content/defaultCv';
import type { CvData, EducationEntry, ExperienceEntry, LanguageEntry, Profile, ProjectEntry, SkillGroup, Summary } from '../cv/types';

export default function App() {
  const [cv, setCv] = useState<CvData>(defaultCv);
  const [selectedTemplate, setSelectedTemplate] = useState<string>(cvTemplates[0]?.id ?? '');

  const updateProfile = (field: keyof Profile, value: string) => {
    setCv((prev) => ({ ...prev, profile: { ...prev.profile, [field]: value } }));
  };

  const updateSummary = (summary: Summary) => {
    setCv((prev) => ({ ...prev, summary }));
  };

  const updateSkillGroup = (index: number, patch: Partial<SkillGroup>) => {
    setCv((prev) => ({
      ...prev,
      skillGroups: prev.skillGroups.map((group, i) => (i === index ? { ...group, ...patch } : group)),
    }));
  };

  const updateSkillGroupItem = (groupIndex: number, itemIndex: number, value: string) => {
    setCv((prev) => ({
      ...prev,
      skillGroups: prev.skillGroups.map((group, index) =>
        index === groupIndex
          ? {
              ...group,
              items: group.items.map((item, i) => (i === itemIndex ? value : item)),
            }
          : group,
      ),
    }));
  };

  const addSkillGroup = () => {
    setCv((prev) => ({
      ...prev,
      skillGroups: [...prev.skillGroups, { title: 'NEW GROUP', items: ['New skill'] }],
    }));
  };

  const removeSkillGroup = (index: number) => {
    setCv((prev) => ({
      ...prev,
      skillGroups: prev.skillGroups.length <= 1 ? prev.skillGroups : prev.skillGroups.filter((_, i) => i !== index),
    }));
  };

  const addSkillGroupItem = (groupIndex: number) => {
    setCv((prev) => ({
      ...prev,
      skillGroups: prev.skillGroups.map((group, index) =>
        index === groupIndex ? { ...group, items: [...group.items, 'New skill'] } : group,
      ),
    }));
  };

  const removeSkillGroupItem = (groupIndex: number, itemIndex: number) => {
    setCv((prev) => ({
      ...prev,
      skillGroups: prev.skillGroups.map((group, index) =>
        index === groupIndex
          ? {
              ...group,
              items: group.items.length <= 1 ? group.items : group.items.filter((_, i) => i !== itemIndex),
            }
          : group,
      ),
    }));
  };

  const updateLanguageEntry = (index: number, patch: Partial<LanguageEntry>) => {
    setCv((prev) => ({
      ...prev,
      languages: prev.languages.map((entry, i) => (i === index ? { ...entry, ...patch } : entry)),
    }));
  };

  const addLanguage = () => {
    setCv((prev) => ({ ...prev, languages: [...prev.languages, { language: 'New language', proficiency: 'A1' }] }));
  };

  const removeLanguage = (index: number) => {
    setCv((prev) => ({
      ...prev,
      languages: prev.languages.length <= 1 ? prev.languages : prev.languages.filter((_, i) => i !== index),
    }));
  };

  const updateExperienceEntry = (index: number, patch: Partial<ExperienceEntry>) => {
    setCv((prev) => ({
      ...prev,
      experiences: prev.experiences.map((entry, i) => (i === index ? { ...entry, ...patch } : entry)),
    }));
  };

  const updateExperienceHighlight = (index: number, highlightIndex: number, value: string) => {
    setCv((prev) => ({
      ...prev,
      experiences: prev.experiences.map((entry, i) =>
        i === index
          ? {
              ...entry,
              highlights: entry.highlights.map((highlight, j) => (j === highlightIndex ? value : highlight)),
            }
          : entry,
      ),
    }));
  };

  const addExperience = () => {
    setCv((prev) => ({
      ...prev,
      experiences: [
        ...prev.experiences,
        { company: 'New company', period: 'YYYY - YYYY', role: 'Role', location: 'Location', highlights: ['New highlight'] },
      ],
    }));
  };

  const removeExperience = (index: number) => {
    setCv((prev) => ({
      ...prev,
      experiences: prev.experiences.length <= 1 ? prev.experiences : prev.experiences.filter((_, i) => i !== index),
    }));
  };

  const addExperienceHighlight = (index: number) => {
    setCv((prev) => ({
      ...prev,
      experiences: prev.experiences.map((entry, i) =>
        i === index ? { ...entry, highlights: [...entry.highlights, 'New highlight'] } : entry,
      ),
    }));
  };

  const removeExperienceHighlight = (index: number, highlightIndex: number) => {
    setCv((prev) => ({
      ...prev,
      experiences: prev.experiences.map((entry, i) =>
        i === index
          ? {
              ...entry,
              highlights: entry.highlights.length <= 1 ? entry.highlights : entry.highlights.filter((_, j) => j !== highlightIndex),
            }
          : entry,
      ),
    }));
  };

  const updateEducationEntry = (index: number, patch: Partial<EducationEntry>) => {
    setCv((prev) => ({
      ...prev,
      education: prev.education.map((entry, i) => (i === index ? { ...entry, ...patch } : entry)),
    }));
  };

  const updateEducationDetail = (index: number, detailIndex: number, value: string) => {
    setCv((prev) => ({
      ...prev,
      education: prev.education.map((entry, i) =>
        i === index ? { ...entry, details: (entry.details ?? []).map((detail, j) => (j === detailIndex ? value : detail)) } : entry,
      ),
    }));
  };

  const updateEducationAdvancedModule = (index: number, moduleIndex: number, value: string) => {
    setCv((prev) => ({
      ...prev,
      education: prev.education.map((entry, i) =>
        i === index
          ? { ...entry, advancedModules: (entry.advancedModules ?? []).map((module, j) => (j === moduleIndex ? value : module)) }
          : entry,
      ),
    }));
  };

  const addEducation = () => {
    setCv((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          degree: 'New degree',
          period: 'YYYY - YYYY',
          institution: 'Institution',
          details: ['New detail'],
          advancedModules: ['New module'],
        },
      ],
    }));
  };

  const removeEducation = (index: number) => {
    setCv((prev) => ({
      ...prev,
      education: prev.education.length <= 1 ? prev.education : prev.education.filter((_, i) => i !== index),
    }));
  };

  const addEducationDetail = (index: number) => {
    setCv((prev) => ({
      ...prev,
      education: prev.education.map((entry, i) =>
        i === index ? { ...entry, details: [...(entry.details ?? []), 'New detail'] } : entry,
      ),
    }));
  };

  const removeEducationDetail = (index: number, detailIndex: number) => {
    setCv((prev) => ({
      ...prev,
      education: prev.education.map((entry, i) =>
        i === index
          ? {
              ...entry,
              details:
                (entry.details ?? []).length <= 1 ? (entry.details ?? []) : (entry.details ?? []).filter((_, j) => j !== detailIndex),
            }
          : entry,
      ),
    }));
  };

  const addEducationAdvancedModule = (index: number) => {
    setCv((prev) => ({
      ...prev,
      education: prev.education.map((entry, i) =>
        i === index ? { ...entry, advancedModules: [...(entry.advancedModules ?? []), 'New module'] } : entry,
      ),
    }));
  };

  const removeEducationAdvancedModule = (index: number, moduleIndex: number) => {
    setCv((prev) => ({
      ...prev,
      education: prev.education.map((entry, i) =>
        i === index
          ? {
              ...entry,
              advancedModules:
                (entry.advancedModules ?? []).length <= 1
                  ? (entry.advancedModules ?? [])
                  : (entry.advancedModules ?? []).filter((_, j) => j !== moduleIndex),
            }
          : entry,
      ),
    }));
  };

  const updateProject = (index: number, patch: Partial<ProjectEntry>) => {
    setCv((prev) => ({
      ...prev,
      projects: prev.projects.map((project, i) => (i === index ? { ...project, ...patch } : project)),
    }));
  };

  const addProject = () => {
    setCv((prev) => ({
      ...prev,
      projects: [...prev.projects, { title: 'New project', description: 'Project description' }],
    }));
  };

  const removeProject = (index: number) => {
    setCv((prev) => ({
      ...prev,
      projects: prev.projects.length <= 1 ? prev.projects : prev.projects.filter((_, i) => i !== index),
    }));
  };

  const selectedTemplateConfig = cvTemplates.find((template) => template.id === selectedTemplate) ?? cvTemplates[0];

  if (!selectedTemplateConfig) {
    return null;
  }

  const SelectedTemplate = selectedTemplateConfig.component;

  return (
    <div className="mx-auto grid max-w-[1800px] gap-4 p-4 lg:grid-cols-[420px_1fr]">
      <CvEditorPanel
        cv={cv}
        updateProfile={updateProfile}
        updateSummary={updateSummary}
        updateSkillGroup={updateSkillGroup}
        updateSkillGroupItem={updateSkillGroupItem}
        addSkillGroup={addSkillGroup}
        removeSkillGroup={removeSkillGroup}
        addSkillGroupItem={addSkillGroupItem}
        removeSkillGroupItem={removeSkillGroupItem}
        updateLanguageEntry={updateLanguageEntry}
        addLanguage={addLanguage}
        removeLanguage={removeLanguage}
        updateExperienceEntry={updateExperienceEntry}
        updateExperienceHighlight={updateExperienceHighlight}
        addExperience={addExperience}
        removeExperience={removeExperience}
        addExperienceHighlight={addExperienceHighlight}
        removeExperienceHighlight={removeExperienceHighlight}
        updateEducationEntry={updateEducationEntry}
        updateEducationDetail={updateEducationDetail}
        updateEducationAdvancedModule={updateEducationAdvancedModule}
        addEducation={addEducation}
        removeEducation={removeEducation}
        addEducationDetail={addEducationDetail}
        removeEducationDetail={removeEducationDetail}
        addEducationAdvancedModule={addEducationAdvancedModule}
        removeEducationAdvancedModule={removeEducationAdvancedModule}
        updateProject={updateProject}
        addProject={addProject}
        removeProject={removeProject}
      />

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <label htmlFor="template-select" className="text-sm font-medium">
            Template
          </label>
          <select
            id="template-select"
            value={selectedTemplate}
            onChange={(event) => setSelectedTemplate(event.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {cvTemplates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.label}
              </option>
            ))}
          </select>
        </div>

        <SelectedTemplate cv={cv} />
      </div>
    </div>
  );
}
