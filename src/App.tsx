import Hero from './Hero';
import Manifesto from './Manifesto';

export function App() {
  return (
    <div style={{ margin: 0, padding: 0, width: '100vw', minHeight: '100vh', backgroundColor: '#050505', overflowX: 'hidden' }}>
      <Hero />
      <Manifesto />
    </div>
  );
}

export default App;
