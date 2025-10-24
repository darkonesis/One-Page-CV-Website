import {
  Code,
  Palette,
  Share2,
  Megaphone,
  Sparkles,
  Languages,
  Layers,
  type LucideIcon
} from 'lucide-react';

type SkillCategory = {
  icon: LucideIcon;
  title: string;
  items: string[];
};

const skills: SkillCategory[] = [
  {
    icon: Code,
    title: "Web Development",
    items: [
      "Realizzazione e gestione di siti web vetrina e aziendali",
      "Restyling front-end e ottimizzazione back-end",
      "Nozioni base di HTML, CSS e SEO",
      "Attenzione a performance, UX e coerenza visiva"
    ]
  },
  {
    icon: Palette,
    title: "Graphic & Visual Design",
    items: [
      "Ideazione e grafiche per campagne, social e materiale promozionale",
      "Fotoritocco e post-produzione immagini",
      "Branding e coerenza visiva tra piattaforme",
      "Software: Adobe Photoshop, Illustrator, InDesign, Figma"
    ]
  },
  {
    icon: Share2,
    title: "Social Media & Content Creation",
    items: [
      "Gestione di profili aziendali (Facebook, Instagram)",
      "Pianificazione editoriale e copywriting visivo",
      "Produzione di contenuti foto e video per il digital",
      "Storytelling visivo orientato al brand"
    ]
  },
  {
    icon: Megaphone,
    title: "Digital Marketing & ADV",
    items: [
      "Creazione e ottimizzazione di campagne Google Ads (Search, Shopping)",
      "Gestione di Meta Ads (Facebook & Instagram)",
      "Analisi delle performance con Google Analytics e Meta Business Suite",
      "Email marketing con Mailchimp (A/B test e reportistica)"
    ]
  },
  {
    icon: Sparkles,
    title: "AI & Automazione Creativa",
    items: [
      "Integrazione di strumenti AI per la produzione grafica e contenutistica",
      "Prompt design e generazione di concept visual e copy",
      "Sperimentazione di flussi di lavoro automatizzati per ottimizzare i tempi creativi"
    ]
  },
  {
    icon: Languages,
    title: "Lingue",
    items: [
      "Italiano: madrelingua",
      "Inglese: buono (comprensione e scrittura operativa)"
    ]
  }
];

export function Skills() {
  return (
    <section className="resume-section">
      {/* Content container */}
      <div className="w-full max-w-6xl mx-auto">
        
        {/* Section title - H2 using fluid typography */}
        <div className="flex items-center gap-5 md:gap-6 mb-16 md:mb-20">
          <Layers className="flex-shrink-0 resume-section-icon" strokeWidth={2} />
          <h2>Competenze</h2>
        </div>

        {/* Skills grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {skills.map((skill) => {
            const Icon = skill.icon;
            return (
              <div
                key={skill.title}
                className="resume-card px-6 md:px-8 py-6 md:py-8 rounded-3xl transition-all hover:scale-[1.01]"
              >
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                  <Icon className="flex-shrink-0 resume-skill-icon" strokeWidth={2} />
                  <h3 className="text-fluid-h4">{skill.title}</h3>
                </div>
                
                {/* Skills list */}
                <ul className="space-y-3">
                  {skill.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-3">
                      <span className="resume-bullet-dot mt-2 leading-none">•</span>
                      <span className="flex-1">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
