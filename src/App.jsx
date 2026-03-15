import logoImg from './assets/logo-stb.png';
import { useState, useEffect } from 'react'
import './App.css'
import StudyMode from './components/StudyMode'
import PlayMode from './components/PlayMode'

function App() {
  // State to track which mode user is in. Default is 'study'.
  const [currentMode, setCurrentMode] = useState("study")

  //State to toggle theme. Default is 'light'.
  const [theme, setTheme] = useState("light")

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === "light" ? "dark" : "light");
  }

  //XP state initialized from localStorage
  const [xp, setXp] = useState(() => {
    const savedXp = localStorage.getItem("baristaXp");
    return savedXp ? parseInt(savedXp) : 0;
  });

  useEffect(() => {
    localStorage.setItem("baristaXp", xp);
  }, [xp]);

  //User's title is determined based on XP
  const getLevelInfo = (currentXp) => {
    if (currentXp >= 1000)
      return { title: "Coffee Master 🏆", nextTier: "Max Level!", progress: 100 };
    if (currentXp >= 500)
      return { title: "Shift Supervisor ⭐", nextTier: "Coffee Master (1000 XP)", progress: (currentXp / 1000) * 100 };
    if (currentXp >= 150)
      return { title: "Barista ☕", nextTier: "Shift Supervisor (500 XP)", progress: (currentXp / 500) * 100 };
    return { title: "Green Bean 🌱", nextTier: "Barista (150 XP)", progress: (currentXp / 150) * 100 };
  };

  const levelData = getLevelInfo(xp);

  return (
    <div className="app-container">
      {/*Theme Toggle Button*/}
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
          </button>
          
      <header>
        <div className="header-top">
          <img src={logoImg} alt="Starbucks Training Logo" className="header-logo" />
          <h1>Starbucks Barista Training</h1>
        </div>

        <nav className="mode-selector">
          {/*Slide toggle study/play modes*/}
          <div className={`slider ${currentMode === "play" ? "slide-right" : "slide-left"}`}></div>
          
          <button className={currentMode === "study" ? "active-text" : ""}
          onClick={() => setCurrentMode("study")}>📚 Study Mode (Flashcards)
          </button>
          
          <button className={currentMode === "play" ? "active-text" : ""}
          onClick={() => setCurrentMode("play")}>🎮 Play Mode (Wordle Game)
          </button>
        </nav>

        {/*XP Progress Bar UI*/}
        <div className="user-profile">
          <div className="level-info">
            <span className="level-title">{levelData.title}</span>
            <span className="xp-text">{xp} XP</span>
          </div>
          <div className="progress-bar-container">
            <div className ="progress-bar-fill" style={{ width: `${levelData.progress}%` }}></div>
          </div>
          <p className="next-tier-text">Next Rank: {levelData.nextTier}</p>
        </div>
      </header>

      {/*Show the components based on state*/}
      {/*Pass setXP as a prop to both components so they can award points*/}
      <main>
        {currentMode === "study" ? <StudyMode setXp={setXp} /> : <PlayMode setXp={setXp} />}
      </main>
    </div>
  )
}

export default App