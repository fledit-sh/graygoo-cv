import type { ContactItem, CvData } from '../types';

const profile = {
  name: 'NOEL ERNSTING LUZ',
  title: 'Aerospace Engineer | Systems Engineering | Embedded & Autonomous Systems',
  email: 'noel.luz@email.com',
  phone: '+47 123 456 789',
  location: 'Trondheim, Norway / Germany',
  linkedin: 'linkedin.com/in/noelluz',
  github: 'github.com/noelluz',
};

export const defaultCv: CvData = {
  profile,
  summary: {
    title: 'Professional Summary',
    text: 'Systems-oriented aerospace engineer with proven expertise in embedded systems, UAV architectures, and certification processes. Strong foundation in numerical simulation and CFD, combined with hands-on experience in real-time systems integration. International academic background spanning Germany, Norway, and Brazil. Demonstrated leadership in safety-critical software development and system-level architecture design.',
  },
  skillGroups: [
    {
      title: 'SYSTEMS ENGINEERING',
      items: ['V-Model', 'Requirements decomposition', 'Interface definition', 'Verification & Validation', 'System integration'],
    },
    {
      title: 'EMBEDDED & SOFTWARE',
      items: ['NVIDIA Jetson', 'Real-time pipelines', 'Siemens TIA Portal (FUP, SCL)', 'Robotics programming (Epson)', 'Python (advanced)', 'C/C++ (advanced)'],
    },
    {
      title: 'AEROSPACE & SIMULATION',
      items: ['CFD', 'Numerical methods', 'Multiphase flows', 'Space systems engineering', 'Propulsion fundamentals'],
    },
    {
      title: 'IT & INFRASTRUCTURE',
      items: ['Linux environments', 'Server management', 'Azure', 'Windows administration'],
    },
  ],
  languages: [
    { language: 'German', proficiency: 'Native' },
    { language: 'Portuguese', proficiency: 'Native' },
    { language: 'English', proficiency: 'C1' },
    { language: 'Spanish', proficiency: 'B1' },
  ],
  experiences: [
    {
      company: 'HIGHCAT GmbH',
      period: '2023 – Present',
      role: 'Systems Engineer – Embedded Vision',
      location: 'Munich, Germany',
      highlights: [
        'Architected real-time video processing pipeline for UAV systems, reducing latency by 40% through optimized GStreamer configuration and NVIDIA Jetson integration',
        'Led system-level integration of embedded vision modules with flight control interfaces, defining data protocols and safety requirements',
        'Developed performance benchmarking framework for Jetson-based platforms, enabling data-driven hardware selection for autonomous vehicle applications',
        'Collaborated with cross-functional teams to decompose high-level UAV mission requirements into subsystem specifications',
      ],
    },
    {
      company: 'HALI tex GmbH',
      period: '2020 – 2023',
      role: 'Software Team Lead – Automation Systems',
      location: 'Germany',
      highlights: [
        'Led software development team through FFP2 mask production line certification with RI.SE Research Institutes of Sweden, ensuring compliance with medical device standards',
        'Designed and implemented automation architecture using Siemens TIA Portal (FUP, SCL), integrating Epson robotics with machine vision systems for quality control',
        'Established IT infrastructure including Linux server management, Azure cloud integration, and development environment standardization',
        'Drove requirements engineering and V&V processes for safety-critical production automation, achieving zero-defect certification audit',
        'Mentored junior engineers on embedded systems best practices and structured software development methodologies',
      ],
    },
  ],
  education: [
    {
      degree: 'M.Sc. Aerospace Engineering',
      period: '2016 – 2020',
      institution: 'University of Stuttgart',
      focusAreas: 'Experimental & Numerical Simulation | Space Systems & Utilization',
      internationalExperience: 'Research stay at NTNU (Trondheim, Norway) | Exchange semester at UFSC (Brazil)',
      advancedModules: [
        'Multiphase flows & numerical fluid mechanics',
        'Monte Carlo methods for complex systems',
        'Software development for space systems',
        'Systems engineering for satellite missions',
      ],
    },
    {
      degree: 'B.Sc. Aerospace Engineering',
      period: '2012 – 2016',
      institution: 'University of Stuttgart',
      details: ['Foundation in aerospace fundamentals, thermodynamics, flight mechanics, and structural analysis.'],
    },
  ],
  projects: [
    {
      title: 'UAV System Integration & Latency Optimization',
      description:
        'Real-time video transmission architecture for autonomous UAV operations, achieving sub-100ms glass-to-glass latency through hardware acceleration and pipeline optimization.',
    },
    {
      title: 'FFP2 Automated Production Line Certification',
      description:
        'End-to-end software system for medical device manufacturing, certified by RI.SE Sweden. Integrated robotics, vision systems, and PLC control with full traceability.',
    },
    {
      title: 'CubeSat Software System Engineering (KSat e.V.)',
      description:
        'Contributed to software architecture design for university CubeSat mission, focusing on telemetry systems and ground station communication protocols.',
    },
    {
      title: "Master's Thesis: Icing on Airborne Wind Energy Systems",
      description:
        'CFD-based numerical analysis of ice accretion on tethered wing systems using OpenFOAM, developing simulation framework for environmental impact assessment.',
    },
  ],
  leftSectionOrder: ['skills', 'languages'],
  rightSectionOrder: ['experience', 'education', 'projects'],
};

export const profileContactItems: ContactItem[] = [
  { type: 'email', value: profile.email },
  { type: 'phone', value: profile.phone },
  { type: 'location', value: profile.location },
  ...(profile.linkedin ? [{ type: 'linkedin' as const, value: profile.linkedin }] : []),
  ...(profile.github ? [{ type: 'github' as const, value: profile.github }] : []),
];
