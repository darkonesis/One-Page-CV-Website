import { MessageCircle, Mail } from 'lucide-react';

export function Contact() {
  return (
    <section className="resume-section">
      {/* Content container */}
      <div className="w-full max-w-6xl mx-auto">
        
        {/* Section title - H2 using fluid typography */}
        <div className="flex items-center gap-5 md:gap-6 mb-16 md:mb-20">
          <MessageCircle className="flex-shrink-0 resume-section-icon" strokeWidth={2} />
          <h2>Let's talk.</h2>
        </div>

        {/* Contact content */}
        <div className="flex flex-col gap-10 md:gap-12">
          
          {/* CTA card */}
          <div className="resume-card px-6 md:px-8 py-6 md:py-8 rounded-3xl transition-all">
            {/* Description */}
            <p className="mb-8 md:mb-10">
              Cerchi qualcuno che sappia <strong>ascoltare</strong>, <strong>progettare con metodo</strong> e portare <strong>risultati concreti</strong>? Parliamone.
            </p>
            
            {/* Email CTA button */}
            <a
              href="mailto:a.giaccari@icloud.com"
              className="resume-cta px-6 md:px-8 py-3.5 md:py-4 rounded-2xl gap-3 md:gap-4 hover:scale-[1.02]"
            >
              <Mail 
                className="w-5 h-5 md:w-6 md:h-6" 
                strokeWidth={2.5}
              />
              a.giaccari@icloud.com
            </a>
          </div>

          {/* Footer */}
          <p className="resume-footer">
            © 2025 Andrea Giaccari — Designed with Apple Dark Elegance
          </p>
        </div>
      </div>
    </section>
  );
}
