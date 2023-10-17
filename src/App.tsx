import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [poop, setPoop] = useState('fart');
  useEffect(() => {
    setPoop('poop');
  }, []);
  return <div>{poop}</div>;
}

export default App;
