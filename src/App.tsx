import { Hero } from './components/Hero';
import { Experience } from './components/Experience';
import { Education } from './components/Education';
import { Skills } from './components/Skills';
import { Contact } from './components/Contact';
import { AppleBlurryBackground } from './components/AppleBlurryBackground';

export default function App() {
  return (
    <div className="relative min-h-screen">
      {/* Apple Blurry Background - Absolute layer covering full document height */}
      <AppleBlurryBackground />
      
      {/* Main content */}
      <main className="resume-content">
        <Hero />
        <Experience />
        <Education />
        <Skills />
        <Contact />
      </main>
    </div>
  );
}
