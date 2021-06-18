import { h } from "preact";

function ScoreBoard({ guessedPlaces }) {
  const pocetSpravne = guessedPlaces.reduce((acc, curr) => {
    return curr[1] ? acc + 1 : acc;
  }, 0);
  return (
    <div>
      Správně {pocetSpravne} z {guessedPlaces.length} odpovědí
    </div>
  );
}

export default ScoreBoard;
