import InteractiveMapHero from './InteractiveMapHero';
import About from './About';
import Journey from './Journey';
import CalculatedChaos from './CalculatedChaos';
import Projects from './Projects';
import TechnicalSkills from './TechnicalSkills';
import NoteWall from './NoteWall';
import Footer from './Footer';
import SectionNavRail from './SectionNavRail';
import useSmoothScroll from './useSmoothScroll';

export function App() {
  // Initialize Lenis inertia smooth scrolling synced with GSAP ScrollTrigger
  useSmoothScroll();

  return (
    <div style={{ margin: 0, padding: 0, width: '100vw', minHeight: '100vh', backgroundColor: '#050505', overflowX: 'hidden' }}>
      {/* Floating Side Progress Navigator */}
      <SectionNavRail />

      {/* 1. Interactive 2.5D Landscape Map Hero */}
      <InteractiveMapHero />

      {/* 2. The Introduction */}
      <About />

      {/* 3. The Journey (Timeline) */}
      <Journey />

      {/* 4. Calculated Chaos (Off The Clock Pinboard) */}
      <CalculatedChaos />

      {/* 5. Cinematic Projects (Focus Carousel) */}
      <Projects />

      {/* 6. Technical Skills — Boot Sequence */}
      <TechnicalSkills />

      {/* 7. Interactive Note Wall */}
      <NoteWall />

      {/* 8. The Footer */}
      <Footer />
    </div>
  );
}

export default App;
