import React from 'react';
import { Mail, MapPin, Phone, Linkedin, Github } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* A4 Container */}
      <div className="max-w-[210mm] mx-auto bg-white shadow-lg" style={{ minHeight: '297mm' }}>
        
        {/* Header */}
        <header className="border-b-2 border-gray-900 px-14 pt-14 pb-8">
          <h1 className="text-5xl font-bold tracking-tight mb-3 text-gray-900" style={{ letterSpacing: '-0.01em' }}>
            NOEL ERNSTING LUZ
          </h1>
          <p className="text-base text-gray-600 mb-6 font-light">
            Aerospace Engineer | Systems Engineering | Embedded & Autonomous Systems
          </p>
          
          {/* Contact Info */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5" />
              <span>noel.luz@email.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5" />
              <span>+47 123 456 789</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5" />
              <span>Trondheim, Norway / Germany</span>
            </div>
            <div className="flex items-center gap-2">
              <Linkedin className="w-3.5 h-3.5" />
              <span>linkedin.com/in/noelluz</span>
            </div>
            <div className="flex items-center gap-2">
              <Github className="w-3.5 h-3.5" />
              <span>github.com/noelluz</span>
            </div>
          </div>
        </header>

        {/* Professional Summary - Full Width */}
        <section className="px-14 py-8 border-b border-gray-300">
          <h2 className="text-[10px] font-semibold uppercase tracking-widest mb-4 text-gray-900">
            Professional Summary
          </h2>
          <p className="text-[14px] text-gray-700 leading-[1.8] max-w-[85%]">
            Systems-oriented aerospace engineer with proven expertise in embedded systems, UAV architectures, and certification processes. 
            Strong foundation in numerical simulation and CFD, combined with hands-on experience in real-time systems integration. 
            International academic background spanning Germany, Norway, and Brazil. Demonstrated leadership in 
            safety-critical software development and system-level architecture design.
          </p>
        </section>

        {/* Two Column Layout */}
        <div className="grid grid-cols-[320px_1fr] gap-0">
          
          {/* Left Column */}
          <div className="bg-gray-50 px-10 py-10 border-r border-gray-300">
            
            {/* Core Competencies */}
            <section className="mb-10">
              <h2 className="text-[10px] font-semibold uppercase tracking-widest mb-4 text-gray-900">
                Core Competencies
              </h2>
              <div className="w-12 h-[1px] bg-gray-900 mb-5"></div>
              
              <div className="space-y-6">
                {/* Systems Engineering */}
                <div>
                  <h3 className="text-[11px] font-semibold mb-2.5 text-gray-900 tracking-wide">SYSTEMS ENGINEERING</h3>
                  <ul className="text-[12px] text-gray-700 space-y-1.5 leading-[1.6]">
                    <li>V-Model</li>
                    <li>Requirements decomposition</li>
                    <li>Interface definition</li>
                    <li>Verification & Validation</li>
                    <li>System integration</li>
                  </ul>
                </div>

                {/* Embedded & Software */}
                <div>
                  <h3 className="text-[11px] font-semibold mb-2.5 text-gray-900 tracking-wide">EMBEDDED & SOFTWARE</h3>
                  <ul className="text-[12px] text-gray-700 space-y-1.5 leading-[1.6]">
                    <li>NVIDIA Jetson</li>
                    <li>Real-time pipelines</li>
                    <li>Siemens TIA Portal (FUP, SCL)</li>
                    <li>Robotics programming (Epson)</li>
                    <li>Python (advanced)</li>
                    <li>C/C++ (advanced)</li>
                  </ul>
                </div>

                {/* Aerospace & Simulation */}
                <div>
                  <h3 className="text-[11px] font-semibold mb-2.5 text-gray-900 tracking-wide">AEROSPACE & SIMULATION</h3>
                  <ul className="text-[12px] text-gray-700 space-y-1.5 leading-[1.6]">
                    <li>CFD</li>
                    <li>Numerical methods</li>
                    <li>Multiphase flows</li>
                    <li>Space systems engineering</li>
                    <li>Propulsion fundamentals</li>
                  </ul>
                </div>

                {/* IT & Infrastructure */}
                <div>
                  <h3 className="text-[11px] font-semibold mb-2.5 text-gray-900 tracking-wide">IT & INFRASTRUCTURE</h3>
                  <ul className="text-[12px] text-gray-700 space-y-1.5 leading-[1.6]">
                    <li>Linux environments</li>
                    <li>Server management</li>
                    <li>Azure</li>
                    <li>Windows administration</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Languages */}
            <section>
              <h2 className="text-[10px] font-semibold uppercase tracking-widest mb-4 text-gray-900">
                Languages
              </h2>
              <div className="w-12 h-[1px] bg-gray-900 mb-5"></div>
              <div className="space-y-2 text-[12px] text-gray-700 leading-[1.7]">
                <div><span className="font-semibold text-gray-900">German</span> — Native</div>
                <div><span className="font-semibold text-gray-900">Portuguese</span> — Native</div>
                <div><span className="font-semibold text-gray-900">English</span> — C1</div>
                <div><span className="font-semibold text-gray-900">Spanish</span> — B1</div>
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="px-10 py-10">
            
            {/* Professional Experience */}
            <section className="mb-10">
              <h2 className="text-[10px] font-semibold uppercase tracking-widest mb-4 text-gray-900">
                Professional Experience
              </h2>
              <div className="w-12 h-[1px] bg-gray-900 mb-7"></div>
              
              <div className="space-y-8">
                {/* HIGHCAT GmbH */}
                <div>
                  <div className="mb-4">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="text-[15px] font-semibold text-gray-900">HIGHCAT GmbH</h3>
                      <span className="text-[11px] text-gray-500 font-light">2023 – Present</span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <p className="text-[13px] text-gray-600">Systems Engineer – Embedded Vision</p>
                      <span className="text-[11px] text-gray-500 font-light">Munich, Germany</span>
                    </div>
                  </div>
                  <ul className="space-y-2.5">
                    <li className="text-[13px] text-gray-700 leading-[1.65] pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-gray-400">
                      Architected real-time video processing pipeline for UAV systems, reducing latency by 40% through optimized GStreamer configuration and NVIDIA Jetson integration
                    </li>
                    <li className="text-[13px] text-gray-700 leading-[1.65] pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-gray-400">
                      Led system-level integration of embedded vision modules with flight control interfaces, defining data protocols and safety requirements
                    </li>
                    <li className="text-[13px] text-gray-700 leading-[1.65] pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-gray-400">
                      Developed performance benchmarking framework for Jetson-based platforms, enabling data-driven hardware selection for autonomous vehicle applications
                    </li>
                    <li className="text-[13px] text-gray-700 leading-[1.65] pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-gray-400">
                      Collaborated with cross-functional teams to decompose high-level UAV mission requirements into subsystem specifications
                    </li>
                  </ul>
                </div>

                {/* HALI tex GmbH */}
                <div>
                  <div className="mb-4">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="text-[15px] font-semibold text-gray-900">HALI tex GmbH</h3>
                      <span className="text-[11px] text-gray-500 font-light">2020 – 2023</span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <p className="text-[13px] text-gray-600">Software Team Lead – Automation Systems</p>
                      <span className="text-[11px] text-gray-500 font-light">Germany</span>
                    </div>
                  </div>
                  <ul className="space-y-2.5">
                    <li className="text-[13px] text-gray-700 leading-[1.65] pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-gray-400">
                      Led software development team through FFP2 mask production line certification with RI.SE Research Institutes of Sweden, ensuring compliance with medical device standards
                    </li>
                    <li className="text-[13px] text-gray-700 leading-[1.65] pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-gray-400">
                      Designed and implemented automation architecture using Siemens TIA Portal (FUP, SCL), integrating Epson robotics with machine vision systems for quality control
                    </li>
                    <li className="text-[13px] text-gray-700 leading-[1.65] pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-gray-400">
                      Established IT infrastructure including Linux server management, Azure cloud integration, and development environment standardization
                    </li>
                    <li className="text-[13px] text-gray-700 leading-[1.65] pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-gray-400">
                      Drove requirements engineering and V&V processes for safety-critical production automation, achieving zero-defect certification audit
                    </li>
                    <li className="text-[13px] text-gray-700 leading-[1.65] pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-gray-400">
                      Mentored junior engineers on embedded systems best practices and structured software development methodologies
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Education */}
            <section className="mb-10">
              <h2 className="text-[10px] font-semibold uppercase tracking-widest mb-4 text-gray-900">
                Education
              </h2>
              <div className="w-12 h-[1px] bg-gray-900 mb-7"></div>
              
              <div className="space-y-7">
                {/* Master's */}
                <div>
                  <div className="mb-3">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="text-[15px] font-semibold text-gray-900">M.Sc. Aerospace Engineering</h3>
                      <span className="text-[11px] text-gray-500 font-light">2016 – 2020</span>
                    </div>
                    <p className="text-[13px] text-gray-600">University of Stuttgart</p>
                  </div>
                  <div className="space-y-3 text-[13px] text-gray-700 leading-[1.65]">
                    <div>
                      <span className="font-semibold text-gray-900">Focus Areas:</span> Experimental & Numerical Simulation | Space Systems & Utilization
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">International Experience:</span> Research stay at NTNU (Trondheim, Norway) | Exchange semester at UFSC (Brazil)
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 mb-2">Advanced Modules:</div>
                      <ul className="space-y-1.5 pl-4">
                        <li className="relative before:content-['–'] before:absolute before:left-[-16px] before:text-gray-400">
                          Multiphase flows & numerical fluid mechanics
                        </li>
                        <li className="relative before:content-['–'] before:absolute before:left-[-16px] before:text-gray-400">
                          Monte Carlo methods for complex systems
                        </li>
                        <li className="relative before:content-['–'] before:absolute before:left-[-16px] before:text-gray-400">
                          Software development for space systems
                        </li>
                        <li className="relative before:content-['–'] before:absolute before:left-[-16px] before:text-gray-400">
                          Systems engineering for satellite missions
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Bachelor's */}
                <div>
                  <div className="mb-2">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="text-[15px] font-semibold text-gray-900">B.Sc. Aerospace Engineering</h3>
                      <span className="text-[11px] text-gray-500 font-light">2012 – 2016</span>
                    </div>
                    <p className="text-[13px] text-gray-600">University of Stuttgart</p>
                  </div>
                  <p className="text-[13px] text-gray-700 leading-[1.65]">
                    Foundation in aerospace fundamentals, thermodynamics, flight mechanics, and structural analysis.
                  </p>
                </div>
              </div>
            </section>

            {/* Selected Projects */}
            <section>
              <h2 className="text-[10px] font-semibold uppercase tracking-widest mb-4 text-gray-900">
                Selected Projects
              </h2>
              <div className="w-12 h-[1px] bg-gray-900 mb-7"></div>
              
              <div className="space-y-5">
                <div>
                  <h3 className="text-[13px] font-semibold text-gray-900 mb-1.5">UAV System Integration & Latency Optimization</h3>
                  <p className="text-[13px] text-gray-700 leading-[1.65]">
                    Real-time video transmission architecture for autonomous UAV operations, achieving sub-100ms glass-to-glass latency through hardware acceleration and pipeline optimization.
                  </p>
                </div>

                <div>
                  <h3 className="text-[13px] font-semibold text-gray-900 mb-1.5">FFP2 Automated Production Line Certification</h3>
                  <p className="text-[13px] text-gray-700 leading-[1.65]">
                    End-to-end software system for medical device manufacturing, certified by RI.SE Sweden. Integrated robotics, vision systems, and PLC control with full traceability.
                  </p>
                </div>

                <div>
                  <h3 className="text-[13px] font-semibold text-gray-900 mb-1.5">CubeSat Software System Engineering (KSat e.V.)</h3>
                  <p className="text-[13px] text-gray-700 leading-[1.65]">
                    Contributed to software architecture design for university CubeSat mission, focusing on telemetry systems and ground station communication protocols.
                  </p>
                </div>

                <div>
                  <h3 className="text-[13px] font-semibold text-gray-900 mb-1.5">Master's Thesis: Icing on Airborne Wind Energy Systems</h3>
                  <p className="text-[13px] text-gray-700 leading-[1.65]">
                    CFD-based numerical analysis of ice accretion on tethered wing systems using OpenFOAM, developing simulation framework for environmental impact assessment.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Print Styles */}
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