import React from 'react';
import './App.css';
import Header from './components/Header';
import Home from './components/Home';
import Skills from './components/Skills';
import Contact from './components/Contact';

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <Home />
        <Skills />
        <Contact />
      </main>
    </div>
  );
}

export default App;
