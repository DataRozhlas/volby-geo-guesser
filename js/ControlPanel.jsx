import { h, Fragment } from "preact";
import okresy from "./okresy";

const strany = [
  { id: 1, str: "ODS" },
  { id: 4, str: "ČSSD" },
  { id: 7, str: "STAN" },
  { id: 8, str: "KSČM" },
  { id: 15, str: "Piráti" },
  { id: 20, str: "TOP 09" },
  { id: 21, str: "ANO" },
  { id: 24, str: "KDU-ČSL" },
  { id: 29, str: "SPD" },
];

const rekniOkres = (numnuts, okresy) => {
  const okres = okresy.filter((o) => o.id === numnuts);
  return okres[0].n;
};

function ControlPanel({
  currPlace,
  setCurrPlace,
  guessedPlaces,
  setGuessedPlaces,
  data,
}) {
  const handleButtonClick = (event) => {
    const spravne = parseInt(event.target.value) === currPlace.str;
    setGuessedPlaces([...guessedPlaces, [currPlace.id, spravne]]);
  };

  const handleDalsiClick = (event) => {
    const http = new XMLHttpRequest();
    const url =
      "https://m5u79pkxma.execute-api.eu-central-1.amazonaws.com/deploy/okrsek";
    http.open("POST", url);
    http.send(
      JSON.stringify({
        id: currPlace.id,
        correct: guessedPlaces[guessedPlaces.length - 1][1],
        sense: event.target.id === "nahlasit" ? false : true,
      })
    );
    http.onreadystatechange = (e) => {
      //  console.log(http.responseText);
    };
    setCurrPlace(data[Math.floor(Math.random() * data.length)]);
  };

  const vylosujStranu = (pocetStran) => {
    return Math.floor(Math.random() * pocetStran);
  };

  let vybraneStrany = strany.filter((s) => s.id === currPlace.str);

  while (vybraneStrany.length < 3) {
    let vylosovana = strany[vylosujStranu(strany.length)];
    if (!vybraneStrany.includes(vylosovana)) {
      vybraneStrany.push(vylosovana);
    }
  }

  return (
    <div id="control-panel">
      {/* pokud je to první pokus, nebo pokud ještě neproběhl tip, ukaž možnosti */}
      {(guessedPlaces.length === 0 ||
        guessedPlaces[guessedPlaces.length - 1][0] != currPlace.id) &&
        vybraneStrany
          .sort(() => Math.random() - 0.5)
          .map((s) => {
            return (
              <button key={s.id} value={s.id} onClick={handleButtonClick}>
                {s.str}
              </button>
            );
          })}
      {/* jinak ukaž výsledek tipu a tlačítko Další */}
      {guessedPlaces.length > 0 &&
        guessedPlaces[guessedPlaces.length - 1][0] === currPlace.id && (
          <div>
            <strong>
              {guessedPlaces[guessedPlaces.length - 1][1]
                ? "Správně!"
                : "Špatně!"}
            </strong>
            <span>
              &nbsp;V obci {currPlace.obc} (okres{" "}
              {rekniOkres(currPlace.okres, okresy)}) zvítězila ve volebním
              okrsku číslo {currPlace.okr} strana{" "}
              {strany.filter((s) => s.id === currPlace.str)[0].str}
              .&nbsp;Získala zde {currPlace.hl} hlasů z {currPlace.hlclk}.
            </span>
            <div style="display:flex; justify-content:center; margin-top:0.4rem">
              <button onClick={handleDalsiClick}>Další 👍</button>
              <button id="nahlasit" onClick={handleDalsiClick}>
                Nahlásit 👎 (+ další)
              </button>
            </div>{" "}
          </div>
        )}
    </div>
  );
}

export default ControlPanel;
