import { h } from "preact";

function ScoreBoard({ guessedPlaces }) {
  const pocetSpravne = guessedPlaces.reduce((acc, curr) => {
    return curr[1] ? acc + 1 : acc;
  }, 0);
  return (
    guessedPlaces.length > 0 && (
      <div id="score-board">
        Úspěšnost{" "}
        {Math.round((pocetSpravne / guessedPlaces.length) * 100 * 10) / 10} % |{" "}
        {pocetSpravne} z {guessedPlaces.length} správně
      </div>
    )
  );
}

export default ScoreBoard;
