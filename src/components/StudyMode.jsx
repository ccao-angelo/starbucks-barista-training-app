import { useState, useEffect } from 'react';
import drinksData from "../data/drinks.json";

function StudyMode({ setXp }) {
    // --- STATE VARIABLES ---
    const [currentIndex, setCurrentIndex] = useState(0); // Which card are we on?
    const [userGuess, setUserGuess] = useState(""); // What the user typed
    const [isFlipped, setIsFlipped] = useState(false); // Is the card flipped?
    const [feedback, setFeedback] = useState(""); // "correct" or "incorrect"
    
    //Mastery Feature State
    const [masteredIds, setMasteredIds] = useState(() => {
        const saved = localStorage.getItem("masteredDrinks");
        return saved ? JSON.parse(saved) : [];
    });
    const [studyOnlyUnmastered, setStudyOnlyUnmastered] = useState(false);

    useEffect(() => {
        localStorage.setItem("masteredDrinks", JSON.stringify(masteredIds));
    }, [masteredIds]);
    
    //Derive the active deck based on toggle filter
    const activeDeck = studyOnlyUnmastered
        ? drinksData.filter(drink => masteredIds.includes(drink.id))
        : drinksData;
    
    //Stretch Goal States
    const [currentStreak, setCurrentStreak] = useState(0);
    const [longestStreak, setLongestStreak] = useState(0);

    //The current drink user's looking at
    const currentDrink = drinksData[currentIndex];

    // --- FUNCTIONS ---

    //Handle user input changing
    const handleInputChange = (e) => {
        setUserGuess(e.target.value);
        setFeedback("");
    };

    //Check answer (Fuzzy matching logic) and award XP
    const checkAnswer = (e) => {
        e.preventDefault(); //Prevent page reload on form submit;
        if (!currentDrink) return;

        //Clean up both strings (lowercase and remove extra spaces)
        const cleanedGuess = userGuess.toLowerCase().trim();
        const cleanedAnswer = currentDrink.name.toLowerCase().trim();

        //Fuzzy match: Does the user's guess include in the real answer?
        if (cleanedAnswer.includes(cleanedGuess) && cleanedGuess !== "") {
            setFeedback("correct");
            setIsFlipped(true);
            setXp(prev => prev + 10);

            //Update streaks
            const newStreak = currentStreak + 1;
            setCurrentStreak(newStreak);
            if (newStreak > longestStreak) {
                setLongestStreak(newStreak);
            }
        } else {
            setFeedback("incorrect");
            setCurrentStreak(0); //Reset streak
        }    
    };

    //Function to handle marking a card as mastered
    const toggleMastery = () => {
        if (!currentDrink) return;

        if (masteredIds.includes(currentDrink.id)) {
            setMasteredIds(prev => prev.filter(id => id !== currentDrink.id));
        } else { 
            setMasteredIds(prev => [...prev, currentDrink.id]);
            setXp(prev => prev + 25); //Bonus XP if mastering a card
        }
    };

    //Navigate to next card
    const handleNext = () => {
        if (currentIndex < drinksData.length - 1) {
            setCurrentIndex(currentIndex + 1);
            //Reset all card states for the new card
            setUserGuess("");
            setIsFlipped(false);
            setFeedback("");
        }
    };

    //Navigate to previous card
    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            //Reset all card states for the new card
            setUserGuess("");
            setIsFlipped(false);
            setFeedback("");
        }
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            //If the user is typing in the input box, ignore shortcuts
            if (document.activeElement.tagName === "INPUT") return;

            if (e.key === "ArrowRight") {
                handleNext();
            } else if (e.key === "ArrowLeft") {
                handlePrev();
            } else if (e.key === "") {
                e.preventDefault(); //Prevent the spacebar from scrolling down the page
                setIsFlipped(prev => !prev);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [currentIndex]);

    // --- RENDER ---
    if (!currentDrink) {
        return (
            <div className="study-mode">
                <h2>Wow! You've mastered all the drinks! 🎓</h2>
                <button onClick={() => setStudyOnlyUnmastered(false)}>Study All Drinks Again</button>
            </div>
        );
    }

    return (
        <div className="study-mode">
            <h2>Study Mode</h2>

            {/*Filter Toggle*/}
            <div className="deck-controls">
                <label>
                    <input
                        type="checkbox"
                        checked={studyOnlyUnmastered}
                        onChange={(e) => {
                            setStudyOnlyUnmastered(e.target.checked);
                            setCurrentIndex(0); //Reset to first card of new deck
                            setIsFlipped(false);
                            setFeedback("");
                            setUserGuess("");
                        }} />
                        Hide Mastered Drinks ({masteredIds.length} / {drinksData.length} mastered)
                </label>
            </div>

            <div className="streak-counter">
                <p>Current Streak: {currentStreak}</p>
                <p>Longest Streak: {longestStreak}</p>
            </div>

            <div className={`flashcard ${isFlipped ? "flipped" : ""} ${feedback}`}>
                {/*FRONT OF CARD: Show Ingredients*/}
                {!isFlipped ? (
                    <div className="card-front">
                        {masteredIds.includes(currentDrink.id) && <span className="mastered-badge">🎓 Mastered</span>}
                        
                        <h3>Guess the Drink!</h3>
                        <ul>
                            <li><strong>Temp:</strong> {currentDrink.temp}</li>
                            <li><strong>Base:</strong> {currentDrink.base}</li>
                            <li><strong>Milk:</strong> {currentDrink.milk}</li>
                            <li><strong>Sweetener:</strong> {currentDrink.sweetener}</li>
                            <li><strong>Topping:</strong> {currentDrink.topping}</li>
                            <li><strong>Blendedness:</strong> {currentDrink.blendedness}</li>
                        </ul>
                    </div>    
                ) : (
                    /*BACK OF CARD: Show Answer*/
                    <div className="card-back">
                        {currentDrink.imageUrl && (
                            <img src={currentDrink.imageUrl} alt={currentDrink.name} className="drink-reveal-img" />
                        )}
                        <h3>{currentDrink.name}</h3>
                        {feedback === "correct" ? <p>🎉 You got it!</p> : <p>❌ Keep studying!</p>}

                        <button className="mastery-btn" onClick={toggleMastery}>
                            {masteredIds.includes(currentDrink.id) ? "Un-Master Drink" : "🎓 Mark as Mastered (+25 XP)"}
                        </button>
                    </div>
                )}
            </div>

            {/*Input Form*/}
            <form onSubmit={checkAnswer} className="guess-form">
                <input
                    type="text" placeholder="Enter drink name..."
                    value={userGuess} onChange={handleInputChange}
                    disabled={isFlipped} //Disable input if user already guessed
                />
                <button type="submit" disabled={isFlipped}>Submit Guess</button>
            </form>

            {/*Navigation Buttons*/}
            <div className="navigation">
                <button onClick={handlePrev} disabled={currentIndex === 0}>
                    ⬅️ Previous
                </button>
                <button onClick={handleNext} disabled={currentIndex === drinksData.length - 1}>
                    Next ➡️
                </button>
            </div>
        </div>
    );
}

export default StudyMode;