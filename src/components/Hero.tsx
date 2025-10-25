import { MapPin, Mail, Phone } from 'lucide-react';

export function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">
          <span className="hero-title-line">Andrea</span>
          <span className="hero-title-line">Giaccari</span>
        </h1>

        <p className="hero-text">
          Creativo, preciso e orientato ai risultati. Mi occupo di <strong>web development</strong>, <strong>content creation</strong> e <strong>digital advertising</strong>.
        </p>

        <div className="info-group">
          <span className="info-button">
            <MapPin className="w-5 h-5" strokeWidth={2} />
            <span>Padova, Italia</span>
          </span>
          <a href="mailto:a.giaccari@icloud.com" className="info-button">
            <Mail className="w-5 h-5" strokeWidth={2} />
            <span>a.giaccari@icloud.com</span>
          </a>
          <a href="tel:+393423213513" className="info-button">
            <Phone className="w-5 h-5" strokeWidth={2} />
            <span>+39 342 321 3513</span>
          </a>
        </div>
      </div>
    </section>
  );
}
