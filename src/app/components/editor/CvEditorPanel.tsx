import type {
  CvData,
  EducationEntry,
  ExperienceEntry,
  LanguageEntry,
  Profile,
  ProjectEntry,
  SkillGroup,
  Summary,
} from '../../../cv/types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Textarea } from '../ui/textarea';

interface CvEditorPanelProps {
  cv: CvData;
  updateProfile: (field: keyof Profile, value: string) => void;
  updateSummary: (summary: Summary) => void;
  updateSkillGroup: (index: number, patch: Partial<SkillGroup>) => void;
  updateSkillGroupItem: (groupIndex: number, itemIndex: number, value: string) => void;
  addSkillGroup: () => void;
  removeSkillGroup: (index: number) => void;
  addSkillGroupItem: (groupIndex: number) => void;
  removeSkillGroupItem: (groupIndex: number, itemIndex: number) => void;
  updateLanguageEntry: (index: number, patch: Partial<LanguageEntry>) => void;
  addLanguage: () => void;
  removeLanguage: (index: number) => void;
  updateExperienceEntry: (index: number, patch: Partial<ExperienceEntry>) => void;
  updateExperienceHighlight: (index: number, highlightIndex: number, value: string) => void;
  addExperience: () => void;
  removeExperience: (index: number) => void;
  addExperienceHighlight: (index: number) => void;
  removeExperienceHighlight: (index: number, highlightIndex: number) => void;
  updateEducationEntry: (index: number, patch: Partial<EducationEntry>) => void;
  updateEducationDetail: (index: number, detailIndex: number, value: string) => void;
  updateEducationAdvancedModule: (index: number, moduleIndex: number, value: string) => void;
  addEducation: () => void;
  removeEducation: (index: number) => void;
  addEducationDetail: (index: number) => void;
  removeEducationDetail: (index: number, detailIndex: number) => void;
  addEducationAdvancedModule: (index: number) => void;
  removeEducationAdvancedModule: (index: number, moduleIndex: number) => void;
  updateProject: (index: number, patch: Partial<ProjectEntry>) => void;
  addProject: () => void;
  removeProject: (index: number) => void;
}

function ValidationHint({ show, text }: { show: boolean; text: string }) {
  if (!show) {
    return null;
  }

  return <p className="text-xs text-red-500">{text}</p>;
}

export function CvEditorPanel(props: CvEditorPanelProps) {
  const {
    cv,
    updateProfile,
    updateSummary,
    updateSkillGroup,
    updateSkillGroupItem,
    addSkillGroup,
    removeSkillGroup,
    addSkillGroupItem,
    removeSkillGroupItem,
    updateLanguageEntry,
    addLanguage,
    removeLanguage,
    updateExperienceEntry,
    updateExperienceHighlight,
    addExperience,
    removeExperience,
    addExperienceHighlight,
    removeExperienceHighlight,
    updateEducationEntry,
    updateEducationDetail,
    updateEducationAdvancedModule,
    addEducation,
    removeEducation,
    addEducationDetail,
    removeEducationDetail,
    addEducationAdvancedModule,
    removeEducationAdvancedModule,
    updateProject,
    addProject,
    removeProject,
  } = props;

  return (
    <aside className="w-full rounded-xl border bg-background p-4 md:p-6">
      <h2 className="mb-4 text-lg font-semibold">CV Editor</h2>
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-4 grid w-full grid-cols-3 md:grid-cols-7">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="languages">Languages</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-3">
          <Input value={cv.profile.name} onChange={(e) => updateProfile('name', e.target.value)} placeholder="Name" />
          <ValidationHint show={!cv.profile.name.trim()} text="Name ist ein Pflichtfeld." />

          <Input value={cv.profile.title} onChange={(e) => updateProfile('title', e.target.value)} placeholder="Title" />
          <ValidationHint show={!cv.profile.title.trim()} text="Title ist ein Pflichtfeld." />

          <Input value={cv.profile.location} onChange={(e) => updateProfile('location', e.target.value)} placeholder="Location" />
          <ValidationHint show={!cv.profile.location.trim()} text="Location ist ein Pflichtfeld." />

          <Input value={cv.profile.email} onChange={(e) => updateProfile('email', e.target.value)} placeholder="Email" />
          <ValidationHint show={!cv.profile.email.trim()} text="Email ist ein Pflichtfeld." />

          <Input value={cv.profile.phone} onChange={(e) => updateProfile('phone', e.target.value)} placeholder="Phone" />
          <ValidationHint show={!cv.profile.phone.trim()} text="Phone ist ein Pflichtfeld." />

          <Input
            value={cv.profile.linkedin ?? ''}
            onChange={(e) => updateProfile('linkedin', e.target.value)}
            placeholder="LinkedIn"
          />
          <Input value={cv.profile.github ?? ''} onChange={(e) => updateProfile('github', e.target.value)} placeholder="GitHub" />
        </TabsContent>

        <TabsContent value="summary" className="space-y-3">
          <Input
            value={cv.summary.title}
            onChange={(e) => updateSummary({ ...cv.summary, title: e.target.value })}
            placeholder="Summary title"
          />
          <ValidationHint show={!cv.summary.title.trim()} text="Summary title ist ein Pflichtfeld." />

          <Textarea
            value={cv.summary.text}
            onChange={(e) => updateSummary({ ...cv.summary, text: e.target.value })}
            placeholder="Summary text"
            rows={8}
          />
          <ValidationHint show={!cv.summary.text.trim()} text="Summary text ist ein Pflichtfeld." />
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          <ValidationHint show={cv.skillGroups.length === 0} text="Mindestens eine Skill-Gruppe ist erforderlich." />
          {cv.skillGroups.map((group, groupIndex) => (
            <div key={`skill-group-${groupIndex}`} className="space-y-3 rounded-lg border p-3">
              <div className="flex gap-2">
                <Input
                  value={group.title}
                  onChange={(e) => updateSkillGroup(groupIndex, { title: e.target.value })}
                  placeholder="Group title"
                />
                <Button
                  variant="outline"
                  type="button"
                  disabled={cv.skillGroups.length <= 1}
                  onClick={() => removeSkillGroup(groupIndex)}
                >
                  Remove group
                </Button>
              </div>
              <ValidationHint show={!group.title.trim()} text="Gruppentitel ist ein Pflichtfeld." />

              <ValidationHint show={group.items.length === 0} text="Jede Skill-Gruppe braucht mindestens einen Eintrag." />
              {group.items.map((item, itemIndex) => (
                <div key={`skill-item-${groupIndex}-${itemIndex}`} className="flex gap-2">
                  <Input
                    value={item}
                    onChange={(e) => updateSkillGroupItem(groupIndex, itemIndex, e.target.value)}
                    placeholder="Skill"
                  />
                  <Button
                    variant="outline"
                    type="button"
                    disabled={group.items.length <= 1}
                    onClick={() => removeSkillGroupItem(groupIndex, itemIndex)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button variant="secondary" type="button" onClick={() => addSkillGroupItem(groupIndex)}>
                Add skill item
              </Button>
            </div>
          ))}
          <Button type="button" onClick={addSkillGroup}>
            Add skill group
          </Button>
        </TabsContent>

        <TabsContent value="languages" className="space-y-4">
          <ValidationHint show={cv.languages.length === 0} text="Mindestens eine Sprache ist erforderlich." />
          {cv.languages.map((entry, index) => (
            <div key={`language-${index}`} className="space-y-2 rounded-lg border p-3">
              <div className="flex gap-2">
                <Input
                  value={entry.language}
                  onChange={(e) => updateLanguageEntry(index, { language: e.target.value })}
                  placeholder="Language"
                />
                <Select value={entry.proficiency} onValueChange={(value) => updateLanguageEntry(index, { proficiency: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Proficiency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Native">Native</SelectItem>
                    <SelectItem value="C2">C2</SelectItem>
                    <SelectItem value="C1">C1</SelectItem>
                    <SelectItem value="B2">B2</SelectItem>
                    <SelectItem value="B1">B1</SelectItem>
                    <SelectItem value="A2">A2</SelectItem>
                    <SelectItem value="A1">A1</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" type="button" disabled={cv.languages.length <= 1} onClick={() => removeLanguage(index)}>
                  Remove
                </Button>
              </div>
              <ValidationHint show={!entry.language.trim()} text="Sprache ist ein Pflichtfeld." />
              <ValidationHint show={!entry.proficiency.trim()} text="Level ist ein Pflichtfeld." />
            </div>
          ))}
          <Button type="button" onClick={addLanguage}>Add language</Button>
        </TabsContent>

        <TabsContent value="experience" className="space-y-4">
          <ValidationHint show={cv.experiences.length === 0} text="Mindestens ein Experience-Eintrag ist erforderlich." />
          {cv.experiences.map((entry, index) => (
            <div key={`experience-${index}`} className="space-y-2 rounded-lg border p-3">
              <div className="grid gap-2 md:grid-cols-2">
                <Input value={entry.company} onChange={(e) => updateExperienceEntry(index, { company: e.target.value })} placeholder="Company" />
                <Input value={entry.period} onChange={(e) => updateExperienceEntry(index, { period: e.target.value })} placeholder="Period" />
                <Input value={entry.role} onChange={(e) => updateExperienceEntry(index, { role: e.target.value })} placeholder="Role" />
                <Input value={entry.location} onChange={(e) => updateExperienceEntry(index, { location: e.target.value })} placeholder="Location" />
              </div>
              <ValidationHint show={!entry.company.trim() || !entry.role.trim()} text="Company und Role sind Pflichtfelder." />

              <ValidationHint show={entry.highlights.length === 0} text="Mindestens ein Highlight ist erforderlich." />
              {entry.highlights.map((highlight, highlightIndex) => (
                <div key={`experience-highlight-${index}-${highlightIndex}`} className="flex gap-2">
                  <Textarea
                    value={highlight}
                    onChange={(e) => updateExperienceHighlight(index, highlightIndex, e.target.value)}
                    rows={2}
                    placeholder="Highlight"
                  />
                  <Button
                    variant="outline"
                    type="button"
                    disabled={entry.highlights.length <= 1}
                    onClick={() => removeExperienceHighlight(index, highlightIndex)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <div className="flex gap-2">
                <Button variant="secondary" type="button" onClick={() => addExperienceHighlight(index)}>
                  Add highlight
                </Button>
                <Button variant="outline" type="button" disabled={cv.experiences.length <= 1} onClick={() => removeExperience(index)}>
                  Remove entry
                </Button>
              </div>
            </div>
          ))}
          <Button type="button" onClick={addExperience}>Add experience</Button>
        </TabsContent>

        <TabsContent value="education" className="space-y-4">
          <ValidationHint show={cv.education.length === 0} text="Mindestens ein Education-Eintrag ist erforderlich." />
          {cv.education.map((entry, index) => (
            <div key={`education-${index}`} className="space-y-2 rounded-lg border p-3">
              <div className="grid gap-2 md:grid-cols-2">
                <Input value={entry.degree} onChange={(e) => updateEducationEntry(index, { degree: e.target.value })} placeholder="Degree" />
                <Input value={entry.period} onChange={(e) => updateEducationEntry(index, { period: e.target.value })} placeholder="Period" />
                <Input
                  value={entry.institution}
                  onChange={(e) => updateEducationEntry(index, { institution: e.target.value })}
                  placeholder="Institution"
                />
                <Input
                  value={entry.focusAreas ?? ''}
                  onChange={(e) => updateEducationEntry(index, { focusAreas: e.target.value })}
                  placeholder="Focus areas"
                />
              </div>
              <Input
                value={entry.internationalExperience ?? ''}
                onChange={(e) => updateEducationEntry(index, { internationalExperience: e.target.value })}
                placeholder="International experience"
              />
              <ValidationHint show={!entry.degree.trim() || !entry.institution.trim()} text="Degree und Institution sind Pflichtfelder." />

              <p className="text-sm font-medium">Details</p>
              {(entry.details ?? []).map((detail, detailIndex) => (
                <div key={`detail-${index}-${detailIndex}`} className="flex gap-2">
                  <Input value={detail} onChange={(e) => updateEducationDetail(index, detailIndex, e.target.value)} placeholder="Detail" />
                  <Button
                    variant="outline"
                    type="button"
                    disabled={(entry.details ?? []).length <= 1}
                    onClick={() => removeEducationDetail(index, detailIndex)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button variant="secondary" type="button" onClick={() => addEducationDetail(index)}>
                Add detail
              </Button>

              <p className="text-sm font-medium">Advanced modules</p>
              {(entry.advancedModules ?? []).map((module, moduleIndex) => (
                <div key={`module-${index}-${moduleIndex}`} className="flex gap-2">
                  <Input
                    value={module}
                    onChange={(e) => updateEducationAdvancedModule(index, moduleIndex, e.target.value)}
                    placeholder="Advanced module"
                  />
                  <Button
                    variant="outline"
                    type="button"
                    disabled={(entry.advancedModules ?? []).length <= 1}
                    onClick={() => removeEducationAdvancedModule(index, moduleIndex)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <div className="flex gap-2">
                <Button variant="secondary" type="button" onClick={() => addEducationAdvancedModule(index)}>
                  Add module
                </Button>
                <Button variant="outline" type="button" disabled={cv.education.length <= 1} onClick={() => removeEducation(index)}>
                  Remove entry
                </Button>
              </div>
            </div>
          ))}
          <Button type="button" onClick={addEducation}>Add education</Button>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <ValidationHint show={cv.projects.length === 0} text="Mindestens ein Project-Eintrag ist erforderlich." />
          {cv.projects.map((project, index) => (
            <div key={`project-${index}`} className="space-y-2 rounded-lg border p-3">
              <Input value={project.title} onChange={(e) => updateProject(index, { title: e.target.value })} placeholder="Project title" />
              <Textarea
                value={project.description}
                onChange={(e) => updateProject(index, { description: e.target.value })}
                rows={3}
                placeholder="Project description"
              />
              <ValidationHint show={!project.title.trim() || !project.description.trim()} text="Titel und Beschreibung sind Pflichtfelder." />
              <Button variant="outline" type="button" disabled={cv.projects.length <= 1} onClick={() => removeProject(index)}>
                Remove project
              </Button>
            </div>
          ))}
          <Button type="button" onClick={addProject}>Add project</Button>
        </TabsContent>
      </Tabs>
    </aside>
  );
}
