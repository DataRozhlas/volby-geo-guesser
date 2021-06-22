import { h } from "preact";

function ScoreBoard({ guessedPlaces, guessedResults }) {
  const pocetSpravne = guessedResults.reduce((acc, curr) => {
    return curr ? acc + 1 : acc;
  }, 0);
  return (
    guessedPlaces.length > 0 && (
      <div id="score-board">
        úspěšnost{" "}
        {Math.round((pocetSpravne / guessedPlaces.length) * 100 * 10) / 10} % |{" "}
        {pocetSpravne} z {guessedPlaces.length} správně | zbývá{" "}
        {10 - guessedPlaces.length}
      </div>
    )
  );
}

export default ScoreBoard;
