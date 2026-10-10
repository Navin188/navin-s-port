import Hero from './Hero';
import About from './About';
import Journey from './Journey';
import CalculatedChaos from './CalculatedChaos';
import Projects from './Projects';
import NoteWall from './NoteWall';
import Footer from './Footer';

export function App() {
  return (
    <div style={{ margin: 0, padding: 0, width: '100vw', minHeight: '100vh', backgroundColor: '#050505', overflowX: 'hidden' }}>
      {/* 1. The Hero */}
      <Hero />

      {/* 2. The Introduction */}
      <About />

      {/* 3. The Journey (Timeline) */}
      <Journey />

      {/* 4. Calculated Chaos (Draggable Pinboard) */}
      <CalculatedChaos />

      {/* 5. Cinematic Projects (Focus Carousel) */}
      <Projects />

      {/* 6. Interactive Note Wall */}
      <NoteWall />

      {/* 7. The Footer */}
      <Footer />
    </div>
  );
}

export default App;
