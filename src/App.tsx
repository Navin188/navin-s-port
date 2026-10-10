import Hero from './Hero';
import Manifesto from './Manifesto';
import Arsenal from './Arsenal';
import Projects from './Projects';
import Footer from './Footer';

export function App() {
  return (
    <div style={{ margin: 0, padding: 0, width: '100vw', minHeight: '100vh', backgroundColor: '#050505', overflowX: 'hidden' }}>
      {/* Main Content Stack sitting on top with solid background & z-index: 10 */}
      <div
        className="main-content-stack"
        style={{
          position: 'relative',
          zIndex: 10,
          backgroundColor: '#050505',
          marginBottom: '520px', // Matches 520px height of fixed footer for parallax reveal
          boxShadow: '0 30px 80px rgba(0,0,0,0.95)',
        }}
      >
        <Hero />
        <Manifesto />
        <Arsenal />
        <Projects />
      </div>

      {/* Parallax Reveal Footer (position: fixed; bottom: 0; z-index: -1) */}
      <Footer />
    </div>
  );
}

export default App;
