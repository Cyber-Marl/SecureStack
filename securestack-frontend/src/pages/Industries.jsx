import ContactForm from '../components/ContactForm';
import { 
  Landmark, 
  HeartPulse, 
  Building2, 
  GraduationCap, 
  ShoppingBag, 
  Factory, 
  MapPin, 
  Scale, 
  Sprout 
} from 'lucide-react';

const industries = [
  { 
    icon: <Landmark size={28} strokeWidth={1.8} />, 
    title: 'Finance & Banking', 
    desc: 'Secure fintech platforms, digital banking, payment systems, fraud detection, and regulatory compliance solutions that meet the highest security standards.', 
    services: ['Core Banking Systems', 'Payment Gateway Integration', 'Fraud Detection Algorithms', 'Regulatory Compliance Tools'] 
  },
  { 
    icon: <HeartPulse size={28} strokeWidth={1.8} />, 
    title: 'Healthcare & Medical', 
    desc: 'HIPAA-compliant health data systems, electronic health records, telemedicine platforms, and patient management solutions.', 
    services: ['Electronic Health Records (EHR)', 'Telemedicine Platforms', 'Patient Management Systems', 'Medical Data Analytics'] 
  },
  { 
    icon: <Building2 size={28} strokeWidth={1.8} />, 
    title: 'Government & Public Sector', 
    desc: 'Mission-critical systems for government agencies with the highest security standards, citizen services, and administrative platforms.', 
    services: ['Citizen Service Portals', 'Document Management Systems', 'e-Government Solutions', 'Secure Data Repositories'] 
  },
  { 
    icon: <GraduationCap size={28} strokeWidth={1.8} />, 
    title: 'Education & EdTech', 
    desc: 'E-learning platforms, student management systems, and LMS solutions that enhance the learning experience for institutions of all sizes.', 
    services: ['Learning Management Systems', 'Student Information Systems', 'Online Assessment Platforms', 'Virtual Classrooms'] 
  },
  { 
    icon: <ShoppingBag size={28} strokeWidth={1.8} />, 
    title: 'Retail & E-Commerce', 
    desc: 'Scalable online stores, POS systems, inventory management, and customer analytics platforms that drive sales and customer loyalty.', 
    services: ['E-Commerce Platforms', 'Point-of-Sale Systems', 'Inventory Management', 'Customer Analytics'] 
  },
  { 
    icon: <Factory size={28} strokeWidth={1.8} />, 
    title: 'Manufacturing & Industry', 
    desc: 'ERP systems, IoT integrations, supply chain management, and production monitoring solutions for the modern industrial enterprise.', 
    services: ['ERP Systems', 'IoT Device Integration', 'Supply Chain Management', 'Production Monitoring'] 
  },
  { 
    icon: <MapPin size={28} strokeWidth={1.8} />, 
    title: 'Hospitality & Tourism', 
    desc: 'Reservation systems, property management, guest experience platforms, and revenue management tools for the hospitality sector.', 
    services: ['Property Management Systems', 'Online Booking Platforms', 'Revenue Management', 'Guest Experience Apps'] 
  },
  { 
    icon: <Scale size={28} strokeWidth={1.8} />, 
    title: 'Legal & Professional Services', 
    desc: 'Case management systems, document automation, client portals, and compliance tracking for law firms and professional service providers.', 
    services: ['Case Management Systems', 'Document Automation', 'Client Portals', 'Compliance Tracking'] 
  },
  { 
    icon: <Sprout size={28} strokeWidth={1.8} />, 
    title: 'Agriculture & AgriTech', 
    desc: 'Precision farming solutions, supply chain tracking, market access platforms, and data analytics for the agricultural sector in Africa.', 
    services: ['Farm Management Systems', 'Supply Chain Tracking', 'Market Access Platforms', 'Weather & Crop Analytics'] 
  },
];

export default function Industries() {
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <p className="section-label">Sectors We Serve</p>
          <h1 className="section-title">Industries We Work In</h1>
          <p className="section-subtitle">We bring deep domain expertise to every sector, delivering IT solutions that understand and address the unique challenges of each industry.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="ind-grid">
            {industries.map(ind => (
              <div key={ind.title} className="ind-card card">
                <div className="ind-header">
                  <span className="ind-icon">{ind.icon}</span>
                  <h2>{ind.title}</h2>
                </div>
                <p className="ind-desc">{ind.desc}</p>
                <div className="ind-services">
                  {ind.services.map(s => (
                    <span key={s} className="ind-service-tag">{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      <section className="section">
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '80px', alignItems: 'start' }}>
          <div>
            <p className="section-label">Work With Us</p>
            <h2 className="section-title">Don't See Your Industry?</h2>
            <p className="section-subtitle">We adapt our solutions to any sector. Contact us and let's discuss how we can help your specific industry challenges.</p>
          </div>
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
