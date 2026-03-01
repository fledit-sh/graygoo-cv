export interface Profile {
  name: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  linkedin?: string;
  github?: string;
}

export interface ContactItem {
  type: 'email' | 'phone' | 'location' | 'linkedin' | 'github';
  value: string;
}

export interface Summary {
  title: string;
  text: string;
}

export interface SkillGroup {
  title: string;
  items: string[];
}

export interface ExperienceEntry {
  company: string;
  period: string;
  role: string;
  location: string;
  highlights: string[];
}

export interface EducationEntry {
  degree: string;
  period: string;
  institution: string;
  details?: string[];
  focusAreas?: string;
  internationalExperience?: string;
  advancedModules?: string[];
}

export interface ProjectEntry {
  title: string;
  description: string;
}

export interface LanguageEntry {
  language: string;
  proficiency: string;
}

export interface CvData {
  profile: Profile;
  summary: Summary;
  skillGroups: SkillGroup[];
  languages: LanguageEntry[];
  experiences: ExperienceEntry[];
  education: EducationEntry[];
  projects: ProjectEntry[];
  leftSectionOrder: Array<'skills' | 'languages'>;
  rightSectionOrder: Array<'experience' | 'education' | 'projects'>;
}
