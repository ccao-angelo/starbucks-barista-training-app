import { useState, useEffect, useRef } from 'react';
import drinksData from '../data/drinks.json';
import html2canvas from 'html2canvas';

function PlayMode() {
    // --- STATE VARIABLES ---
    const [targetDrink, setTargetDrink] = useState(null);
    const [hintUsed, setHintUsed] = useState(false);
    const [hintText, setHintText] = useState("");
    
    //Create a reference for hidden receipt
    const receiptRef = useRef(null);

    //currentGuess holds the options user is currently clicking
    const [currentGuess, setCurrentGuess] = useState({
        temp: "", base: "", milk: "", sweetener: "", topping: "", blendedness: ""
    });

    //guessHistory holds an array of completed guesses
    const [guessHistory, setGuessHistory] = useState([]);
    const [gameStatus, setGameStatus] = useState("playing"); //playing, won, lost

    //Options for buttons
    const options = {
        temp: ["Hot", "Iced"],
        base: ["Espresso", "Blonde Espresso", "Dark Roast", "Matcha", "Chai", "Black Tea", "Green Tea", "Refresher", "Frappuccino Coffee"],
        milk: ["Whole", "2%", "Oat", "No Milk", "Almond", "Coconut", "Half & Half", "Heavy Cream", "Nonfat", "Protein-boosted", "Soy", "Nondairy"],
        sweetener: ["Classic", "Vanilla", "Brown Sugar", "Cane Sugar", "Honey", "White Mocha", "Caramel", "Hazelnut", "Mocha", "No Sweetener"],
        topping: ["Whipped Cream", "Caramel Drizzle", "Mocha Drizzle", "Cold Foam", "Cinnamon Powder", "Vanilla Sweet Cream", "None"],
        blendedness: ["Blended", "Not Blended"]
    };

    //Pick a random drink when the component mounts
    useEffect(() => {
        startNewGame();
    }, []);

    const startNewGame = () => {
        const randomDrink = drinksData[Math.floor(Math.random() * drinksData.length)];
        setTargetDrink(randomDrink);
        setGuessHistory([]);
        setCurrentGuess({ temp: "", base: "", milk: "", sweetener: "", topping: "", blendedness: ""});
        setGameStatus("playing");
        setHintUsed(false);
        setHintText("");
    };

    //Update currentGuess when a button is clicked
    const handleOptionClick = (category, value) => {
        setCurrentGuess(prev => ({
            ...prev,
            [category]: prev[category] === value ? "" : value
        }));
    };

    const getHint = () => {
        //Only give hints for incorrect categories. If there's no history, all categories are eligible.
        const eligibleCategories = Object.keys(targetDrink).filter(key => {
            if (key === "id" || key === "name" || key === "imageUrl") return false;
            if (guessHistory.length > 0) {
                const lastGuessFeedback = guessHistory[guessHistory.length - 1].feedback;
                if (lastGuessFeedback[key] === "correct") return false;
            }
            return true;
        });

        //If there are eligible categories, pick one at random.
        if (eligibleCategories.length > 0) {
            const randomCategory = eligibleCategories[Math.floor(Math.random() * eligibleCategories.length)];
            const correctValue = targetDrink[randomCategory];
            
            setHintText(`Hint: The ${randomCategory} is ${correctValue}`);
            setHintUsed(true);
        } else {
            //Fallback in case something goes weird
            setHintText("You're so close. Just keep guessing!");
            setHintUsed(true);
        }
    };

    //Share a result by tacking a picture
    const shareResults = async () => {
        const receiptElement = receiptRef.current;
        if (!receiptElement) return;

        try {
            const canvas = await html2canvas(receiptElement, {
                backgroundColor: "#ffffff",
                scale: 2, //Make the image higher quality
            });

            const imageURL = canvas.toDataURL("image/png");

            //Create a fake link, click it, and delete it to force a download
            const downloadLink = document.createElement("a");
            downloadLink.href = imageURL;
            downloadLink.download = `Barista-Challenge-${targetDrink.name.replace(/\s+/g, '-')}.png`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);

        }  catch (error) {
            console.log("Failed to generate image:", error);
            alert("Oops! Something went wrong while creating your screenshot.");
        }
    };

    //Submit the guess
    const submitGuess = () => {
        //Ensure all 6 categories are selected
        if (Object.values(currentGuess).includes("")) {
            alert("Please select an option for all 6 categories!");
            return;
        }

        //Compare guess to target drink
        const feedbackRow = {
            guess: { ...currentGuess},
            feedback: {
                temp: currentGuess.temp === targetDrink.temp ? "correct" : "incorrect",
                base: currentGuess.base === targetDrink.base ? "correct" : "incorrect",
                milk: currentGuess.milk === targetDrink.milk ? "correct" : "incorrect",
                sweetener: currentGuess.sweetener === targetDrink.sweetener ? "correct" : "incorrect",
                topping: currentGuess.topping === targetDrink.topping ? "correct" : "incorrect",
                blendedness: currentGuess.blendedness === targetDrink.blendedness ? "correct" : "incorrect",
            }
        };

        //Save to history
        const newHistory = [... guessHistory, feedbackRow];
        setGuessHistory(newHistory);

        //Check if every value in the feedback object is correct.
        const isWin = Object.values(feedbackRow.feedback).every(status => status === "correct");

        if (isWin) {
            setGameStatus("won");
        } else if (newHistory.length >= 6) {
            setGameStatus("lost");
        }
    };

    if (!targetDrink) return <p>Loading...</p>

    // --- RENDER ---
    return (
        <div className="play-mode">
            <div className="play-header">
                <h2>Build The Drink: {targetDrink.name}</h2>
                <button className="randomize-btn" onClick={startNewGame} title="Get a new random drink">
                    🔄️
                </button>
            </div>

            <p style={{ color: "var(--text-muted)" }}>Guesses remaining: {6 - guessHistory.length}</p>

            {/*Hint System UI*/}
            {gameStatus === "playing" && (
                <div className="hint-container">
                    <button
                        className="hint-btn" onClick={getHint}
                        disabled={hintUsed || guessHistory.length === 0} //Force user to make at leaset 1 guess first
                        title="Ask a coworker for help!"
                    >💡 Need a Hint?</button>
                    {hintText && <p className="hint-text">{hintText}</p>}
                </div>    
            )}

            {/*Guess History Board*/}
            <div className="guess-board">
                {guessHistory.map((row, index) => (
                    <div key={index} className="guess-row">
                        {/* Map  through the feedback to render colored boxes*/}
                        {Object.keys(row.guess).map((category) => (
                            <div key={category} className={`guess-box ${row.feedback[category]}`}>
                                {row.guess[category]}
                            </div>    
                        ))}
                    </div>
                ))}
            </div>

            {/*Game Over Logic and Buttons*/}
            {gameStatus === "won" && <h3 style={{ color: "var(--sb-green)" }}>🎉 You built it correctly~</h3>}
            {gameStatus === "lost" && <h3 style={{ color: "#d9381e" }}>❌ Game Over! The recipe was...</h3>}
            {gameStatus !== "playing" && (
                <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "15px" }}>
                    <button className="submit-guess-btn" onClick={startNewGame}>Play Again</button>
                    <button className="submit-guess-btn" style={{ background: "#1da1f2" }} onClick={shareResults}>
                       Download Results 📸
                    </button>
                </div>
            )}        

            {/*Input Area only shown if playing*/}
            {gameStatus === "playing" && (
                <div className="input-area">
                    <h3>Your Current Selections:</h3>
                    <div className="current-selections guess-row">
                        {Object.keys(currentGuess).map(cat => (
                            <div key={cat} className="guess-box pending">{currentGuess[cat] || "?"}</div>
                        ))}
                    </div>

                    <div className="options-container">
                        {/*Map over options to create categories and buttons*/}
                        {Object.keys(options).map((category) => (
                            <div key={category} className={`category-section ${category}`}>
                                <h4>{category.toUpperCase()}</h4>
                                <div className="category-buttons">
                                    {options[category].map(optionValue => (
                                        <button key={optionValue}
                                        className={currentGuess[category] === optionValue ? "selected" : ""}
                                        onClick={() => handleOptionClick(category, optionValue)}
                                        >{optionValue}</button>
                                    ))}
                                </div>    
                            </div>   
                        ))}
                    </div>

                    <button className="submit-guess-btn" style={{marginTop: "20px" }} onClick={submitGuess}>
                        Check Answer
                    </button>
                </div>
            )}

            {/* --- THE HIDDEN RECEIPT --- */}
            {/* The div is positioned off-screen so othe user never sees it,
                but html2canvas can still take a picture of it*/}
            <div
                ref={receiptRef} className="share-receipt"
                style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
                
                <div className="receipt-header">
                    <h2>☕ Barista Training</h2>
                    <p>Daily Challenge</p>
                </div>

                <div className="receipt-drink">
                    {targetDrink.imageUrl && (
                    <img src={targetDrink.imageUrl} alt={targetDrink.name} className="receipt-drink-img"/>)}
                    <h3>{targetDrink.name}</h3>
                    <p>Score: {gameStatus === "won" ? guessHistory.length : "X"}/6</p>
                </div>

                <div className="receipt-grid">
                    {guessHistory.map((row, index) => (
                        <div key={index} className="receipt-row">
                            {Object.keys(row.feedback).map(cat => (
                                <div key={cat} className={`receipt-box ${row.feedback[cat]}`}></div>
                            ))}
                        </div>
                    ))}    
            </div>

                <div className="receipt-footer">
                    <p>Can you beat my score?</p>
                </div>
            </div>
        </div>    
    );

}

export default PlayMode;