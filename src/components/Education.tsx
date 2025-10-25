import { GraduationCap } from 'lucide-react';

type EducationItem = {
  institution: string;
  title: string;
  year: string;
  description?: string;
};

const educationItems: EducationItem[] = [
  {
    institution: "Synthesis srl",
    title: "Corso Tecnico Grafico con AI",
    year: "(2024)",
    description:
      "Percorso avanzato sull'uso dell'intelligenza artificiale applicata al design e alla produzione grafica. Workflow ibridi che integrano intelligenza artificiale generativa, automazione e creatività visiva, per ottimizzare tempi e qualità dei processi."
  },
  {
    institution: "Digitally",
    title: "Corso in Digital Marketing",
    year: "(2020)",
    description:
      "Strategie di marketing digitale e uso operativo delle principali piattaforme ADV (Google Ads, Meta Business Suite, Mailchimp, Analytics). Base solida per campagne integrate orientate alla performance."
  },
  {
    institution: "Scuola Italiana Design",
    title: "Diploma in Design Industriale e Comunicazione Visiva",
    year: "(2017–2020)",
    description:
      "Progettazione visiva, branding e comunicazione creativa. Approccio di design thinking e attenzione al dettaglio visivo, oggi centrali nel mio lavoro digitale."
  },
  {
    institution: "Liceo Scientifico",
    title: "Diploma di Maturità",
    year: "(2017)"
  }
];

export function Education() {
  return (
    <section className="resume-section">
      {/* Content container */}
      <div className="w-full max-w-6xl mx-auto">
        
        {/* Section title - H2 using fluid typography */}
        <div className="flex items-center gap-5 md:gap-6 mb-16 md:mb-20">
          <GraduationCap className="flex-shrink-0 resume-section-icon" strokeWidth={2} />
          <h2>Formazione</h2>
        </div>

        {/* Education cards */}
        <div className="flex flex-col gap-6 md:gap-8">
          {educationItems.map((item) => (
            <div
              key={`${item.title}-${item.year}`}
              className="resume-card px-6 md:px-8 py-6 md:py-8 rounded-3xl transition-all hover:scale-[1.01]"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
                {/* Year badge */}
                <span 
                  className="resume-badge px-5 md:px-6 py-2.5 md:py-3 rounded-xl w-fit sm:order-2 transition-all"
                >
                  {item.year}
                </span>
                
                {/* Title and institution */}
                <div className="flex-1 sm:order-1 sm:pr-4">
                  <h3>{item.title}</h3>
                  <p className="resume-meta">{item.institution}</p>
                </div>
              </div>
              
              {/* Description */}
              {item.description && <p>{item.description}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
