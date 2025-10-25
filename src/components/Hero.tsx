import { MapPin, Mail, Phone } from 'lucide-react';

export function Hero() {
  return (
    <section className="resume-section min-h-screen flex items-center">
      {/* Content container with max-width */}
      <div className="w-full max-w-6xl mx-auto">
        
        {/* Name + Contact info */}
        <div className="mb-16 md:mb-20 lg:mb-24 hero-heading">
          <h1>Andrea Giaccari</h1>
          
          <div className="flex flex-wrap gap-3 md:gap-4 hero-badges">
            <span className="resume-chip px-6 md:px-8 py-3 md:py-4 rounded-2xl gap-3 md:gap-4 transition-all">
              <MapPin className="w-5 h-5 resume-chip-icon" strokeWidth={2} />
              <span>Padova, Italia</span>
            </span>
            <a 
              href="mailto:a.giaccari@icloud.com" 
              className="resume-chip px-6 md:px-8 py-3 md:py-4 rounded-2xl gap-3 md:gap-4 transition-all hover:scale-[1.02]"
            >
              <Mail className="w-5 h-5 resume-chip-icon" strokeWidth={2} />
              <span>a.giaccari@icloud.com</span>
            </a>
            <a 
              href="tel:+393423213513" 
              className="resume-chip px-6 md:px-8 py-3 md:py-4 rounded-2xl gap-3 md:gap-4 transition-all hover:scale-[1.02]"
            >
              <Phone className="w-5 h-5 resume-chip-icon" strokeWidth={2} />
              <span>+39 342 321 3513</span>
            </a>
          </div>
        </div>

        {/* Bio card */}
        <div className="resume-card px-6 md:px-8 py-6 md:py-8 rounded-3xl transition-all">
          <p>
            Creativo, preciso e orientato ai risultati. Mi occupo di <strong>web development</strong>, <strong>content creation</strong> e <strong>digital advertising</strong>. Il mio obiettivo è creare esperienze digitali chiare, funzionali e visivamente curate, bilanciando sempre resa ed efficienza.
          </p>
        </div>
      </div>
    </section>
  );
}
