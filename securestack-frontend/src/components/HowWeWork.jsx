import { useScrollReveal } from '../hooks/useAnimations';
import './HowWeWork.css';

const steps = [
  {
    number: '01',
    title: 'Discovery & Analysis',
    desc: 'We start by deeply understanding your business goals, challenges, and technical requirements through structured workshops and stakeholder interviews.',
    items: ['Requirements gathering', 'Technical assessment', 'Security audit', 'Competitive analysis'],
  },
  {
    number: '02',
    title: 'Strategy & Design',
    desc: 'Our architects design a tailored solution — from system architecture to UI/UX wireframes — ensuring alignment before a single line of code is written.',
    items: ['Architecture design', 'UI/UX prototyping', 'Security planning', 'Project roadmap'],
  },
  {
    number: '03',
    title: 'Build & Test',
    desc: 'Our engineers build your solution using agile sprints with continuous testing, code reviews, and security scans at every milestone.',
    items: ['Agile development', 'Code reviews', 'Automated testing', 'Penetration testing'],
  },
  {
    number: '04',
    title: 'Deploy & Support',
    desc: 'We handle deployment, monitoring setup, and staff training — then remain your long-term technology partner for ongoing support and evolution.',
    items: ['CI/CD deployment', 'Monitoring setup', 'Staff training', 'Ongoing maintenance'],
  },
];

export default function HowWeWork() {
  const [ref, isRevealed] = useScrollReveal();

  return (
    <section className={`section how-section reveal-section ${isRevealed ? 'revealed' : ''}`} ref={ref}>
      <div className="container">
        <div className="text-center reveal-child" style={{ marginBottom: 64 }}>
          <p className="section-label">Our Process</p>
          <h2 className="section-title">How We Work</h2>
          <p className="section-subtitle">A proven 4-step process that delivers on time, within budget, and beyond expectations — every time.</p>
        </div>

        <div className="how-grid">
          {steps.map((step, i) => (
            <div key={step.number} className="how-card card reveal-child" style={{ '--reveal-delay': `${i * 0.1}s` }}>
              <div className="how-number">{step.number}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
              <ul className="how-items">
                {step.items.map(item => (
                  <li key={item}>
                    <span className="how-check">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
