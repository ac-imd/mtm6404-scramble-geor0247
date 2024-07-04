/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle (src) {
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof src === 'string') {
    return copy.join('')
  }

  return copy
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/


const word = [
  'elderberry',
  'honeydew',
  'nectarine',
  'dragonfruit',
  'raspberry',
  'strawberry',
  'tangerine',
  'vanilla',
  'watermelon',
  'zucchini'
]

const App = () => {
  const [currentWord, setCurrentWord] = React.useState('');
  const [scrambledWord, setScrambledWord] = React.useState('');
  const [guess, setGuess] = React.useState('');
  const [score, setScore] = React.useState(0);
  const [strikes, setStrikes] = React.useState(0);
  const [passes, setPasses] = React.useState(3);
  const [gameOver, setGameOver] = React.useState(false);

  React.useEffect(() => {
    const storedGameState = localStorage.getItem('gameState');
    if (storedGameState) {
      const { currentWord, scrambledWord, score, strikes, passes, gameOver } = JSON.parse(storedGameState);
      setCurrentWord(currentWord);
      setScrambledWord(scrambledWord);
      setScore(score);
      setStrikes(strikes);
      setPasses(passes);
      setGameOver(gameOver);
    } else {
    localStorage.setItem('gameState', JSON.stringify({ currentWord: '', scrambledWord: '', score: 0, strikes: 0, passes: 3, gameOver: false }));
  }
  startNewGame();
}, []);

  const startNewGame = () => {
    const shuffledWords = shuffle(word);
    const newWord = shuffledWords[0];
    setCurrentWord(newWord);
    setScrambledWord(shuffle(newWord));
    setScore(0);
    setStrikes(0);
    setPasses(3);
    setGameOver(false);
  };

  const guessHandler = () => {
    if (guess === currentWord) {
      setScore(score + 1);
      const nextWord = word[(score + 1) % word.length];
      setCurrentWord(nextWord);
      setScrambledWord(shuffle(nextWord));
    } else {
      setStrikes(strikes + 1);
      if (strikes + 1 >= 3) {
        setGameOver(true);
      }
    }
    setGuess('');
  };

  const passHandler = () => {
    if (passes > 0) {
      setPasses(passes - 1);
      const nextWordPass = (score + 1) % word.length;
      const nextWord = word[nextWordPass];
      setCurrentWord(nextWord);
      setScrambledWord(shuffle(nextWord));
    }
  };

  const gameRestart = () => {
    startNewGame();
  };

  return (
    <div className="game-container">
      <h1>Scramble Game</h1>
      {gameOver ? (
        <div>
          <h2>Game Over!</h2>
          <button onClick={gameRestart}>Play Again</button>
        </div>
      ) : (
        <div>
          <h2>{scrambledWord}</h2>
          <input
            type="text"  
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && guessHandler()}
          />
          <div className="buttons">
            <button onClick={guessHandler}>Guess</button>
            <button onClick={passHandler} disabled={passes <= 0}>Pass</button>
          </div>
          <div className="score-panel">
            <p>Score: {score}</p>
            <p>Strikes: {strikes}</p>
            <p>Passes: {passes}</p>
          </div>
        </div>
      )}
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);


