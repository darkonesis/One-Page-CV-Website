import { Briefcase } from 'lucide-react';

type ExperienceItem = {
  company: string;
  role: string;
  period: string;
  description?: string;
  bullets?: string[];
};

const experiences: ExperienceItem[] = [
  {
    company: "SKGroup",
    role: "Social Media Manager & Web Developer (Stage)",
    period: "(2024 — in corso)",
    description:
      "Gestisco la comunicazione digitale del ristorante di proprietà del gruppo, occupandomi della creazione dei contenuti (video, foto, grafiche e materiali per menu) e della presenza online del brand. Curando il restyling completo del sito web, sia front-end che back-end, con particolare attenzione a performance, user experience e coerenza visiva. È uno dei progetti di cui vado più orgoglioso per equilibrio tra estetica e funzionalità."
  },
  {
    company: "Sweden & Martina",
    role: "Graphic Designer & Social Content Creator",
    period: "(2022)",
    description:
      "Gestione del team grafico interno, creazione dei contenuti per i canali social aziendali (post, video e grafiche ADV per la promozione di eventi e prodotti). Collaborazione con il reparto marketing e con i reparti di sviluppo per la comunicazione B2B e il coordinamento visuale delle campagne di nuovi prodotti."
  },
  {
    company: "Berza",
    role: "Graphic Designer & Digital Marketing Specialist",
    period: "(2017)",
    bullets: [
      "Gestione dei social media (Facebook & Instagram)",
      "Campagne ADV su Meta e Google (Search & Shopping)",
      "UX/UI design in collaborazione con il team di sviluppo",
      "Newsletter e comunicazione diretta con i clienti",
      "Gestione autonoma della comunicazione con approccio organico e coerente"
    ]
  }
];

export function Experience() {
  return (
    <section className="resume-section">
      {/* Content container */}
      <div className="w-full max-w-6xl mx-auto">
        
        {/* Section title - H2 using fluid typography */}
        <div className="flex items-center gap-5 md:gap-6 mb-16 md:mb-20">
          <Briefcase className="flex-shrink-0 resume-section-icon" strokeWidth={2} />
          <h2>Esperienze Digitali</h2>
        </div>

        {/* Experience cards */}
        <div className="flex flex-col gap-6 md:gap-8">
          {experiences.map((experience) => (
            <div
              key={experience.company}
              className="resume-card glass-card px-6 md:px-8 py-6 md:py-8 rounded-3xl transition-all hover:scale-[1.01]"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
                {/* Period badge */}
                <span 
                  className="resume-badge px-5 md:px-6 py-2.5 md:py-3 rounded-xl w-fit sm:order-2 transition-all"
                >
                  {experience.period}
                </span>
                
                {/* Title and company */}
                <div className="flex-1 sm:order-1 sm:pr-4">
                  <h3>{experience.role}</h3>
                  <p className="resume-meta">{experience.company}</p>
                </div>
              </div>
              
              {/* Description or bullet points */}
              {experience.bullets ? (
                <ul className="space-y-3">
                  {experience.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="resume-bullet-dot mt-2 leading-none">•</span>
                      <span className="flex-1">{bullet}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>{experience.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
