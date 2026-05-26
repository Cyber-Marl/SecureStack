import { useScrollReveal } from '../hooks/useAnimations';
import './Testimonials.css';

const testimonials = [
  {
    name: 'Tatenda Moyo',
    role: 'CTO, FinMark Zimbabwe',
    initials: 'TM',
    color: 'blue',
    rating: 5,
    text: 'Secure Stack transformed our banking platform\'s security posture. Their vulnerability assessment identified critical gaps we\'d missed for years. Professional, thorough, and highly recommended.',
  },
  {
    name: 'Sarah Ndlovu',
    role: 'Director, HealthConnect Africa',
    initials: 'SN',
    color: 'orange',
    rating: 5,
    text: 'The team delivered a HIPAA-compliant patient management system that exceeded our expectations. Clean code, on-time delivery, and exceptional post-launch support.',
  },
  {
    name: 'Blessing Chirwa',
    role: 'CEO, AgriLink Zambia',
    initials: 'BC',
    color: 'green',
    rating: 5,
    text: 'Their Django-based farm management platform has revolutionized how we track produce across 200+ farms. The mobile responsiveness is flawless. Outstanding work.',
  },
  {
    name: 'Rudo Chikwanda',
    role: 'IT Manager, ZimRetail Group',
    initials: 'RC',
    color: 'purple',
    rating: 5,
    text: 'We needed a full e-commerce rebuild in 6 weeks. Secure Stack delivered in 5 — complete with payment gateway integration and real-time inventory sync. Truly impressive team.',
  },
  {
    name: 'Emmanuel Osei',
    role: 'Head of Digital, BancTrust Ghana',
    initials: 'EO',
    color: 'blue',
    rating: 5,
    text: 'Their security-first approach gave our board confidence during our digital transformation. Regulatory compliance, penetration testing, and staff training all handled expertly.',
  },
  {
    name: 'Privilege Dube',
    role: 'Founder, EduTech Harare',
    initials: 'PD',
    color: 'orange',
    rating: 5,
    text: 'The LMS they built for us is intuitive, fast, and handles 5,000+ concurrent students without issues. Secure Stack is our go-to technology partner — period.',
  },
];

function Stars({ count }) {
  return (
    <div className="stars">
      {Array.from({ length: count }).map((_, i) => <span key={i}>★</span>)}
    </div>
  );
}

export default function Testimonials() {
  const [ref, isRevealed] = useScrollReveal();

  return (
    <section className={`section testimonials-section reveal-section ${isRevealed ? 'revealed' : ''}`} ref={ref} style={{ '--reveal-delay': '0s' }}>
      <div className="container">
        <div className="text-center reveal-child" style={{ marginBottom: 56 }}>
          <p className="section-label">Client Voices</p>
          <h2 className="section-title">What Our Clients Say</h2>
          <p className="section-subtitle">Trusted by businesses across Zimbabwe and Africa to deliver secure, world-class technology solutions.</p>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <div key={t.name} className="testimonial-card card reveal-child" style={{ '--reveal-delay': `${i * 0.08}s` }}>
              <Stars count={t.rating} />
              <p className="testimonial-text">"{t.text}"</p>
              <div className="testimonial-author">
                <span className={`testimonial-avatar-initials ${t.color}`}>{t.initials}</span>
                <div>
                  <strong>{t.name}</strong>
                  <span>{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
