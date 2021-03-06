import { h, Fragment } from "preact";
import { useState } from "preact/compat";

import okresy from "./okresy.json";

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
  guessedResults,
  setGuessedResults,
  data,
  historieMista,
  setHistorieMista,
  mistaStats,
}) {
  const [vyhodnoceni, setVyhodnoceni] = useState(false);
  const [mene, setMene] = useState(null);
  const [vice, setVice] = useState(null);
  const [uid, setUid] = useState(Date.now() + Math.random());

  const handleButtonClick = (event) => {
    const spravne = parseInt(event.target.value) === currPlace.str;
    setGuessedResults([...guessedResults, spravne]);
    setGuessedPlaces([...guessedPlaces, currPlace.id]);
    //ulož tip do databáze
    const http = new XMLHttpRequest();
    const url =
      "https://m5u79pkxma.execute-api.eu-central-1.amazonaws.com/deploy/okrsek";
    http.open("POST", url);
    http.send(
      JSON.stringify({
        id: currPlace.id,
        correct: spravne,
        uid: uid,
        tip: parseInt(event.target.value),
      })
    );
    // http.onreadystatechange = (e) => {
    //   console.log(http.responseText);
    // };
  };

  const handleDalsiClick = (event) => {
    // hrát znovu
    if (vyhodnoceni) {
      let vylosovaneMisto;
      do {
        vylosovaneMisto = data[Math.floor(Math.random() * data.length)];
      } while (guessedPlaces.includes(vylosovaneMisto.id));
      setCurrPlace(vylosovaneMisto);
      setGuessedPlaces([]);
      setGuessedResults([]);
      setMene(null);
      setVice(null);
      setVyhodnoceni(false);
      setUid(Date.now() + Math.random());
      setHistorieMista(
        mistaStats.filter((m) => {
          return m.id === vylosovaneMisto.id;
        })
      );
    } else if (guessedPlaces.length === 10) {
      // závěrečné vyhodnocení
      setVyhodnoceni(true);
      const pocetSpravne = guessedResults.reduce((acc, curr) => {
        return curr ? acc + 1 : acc;
      }, 0);
      fetch("https://ldwgwvuknh.execute-api.eu-central-1.amazonaws.com/items")
        .then((response) => response.json())
        .then((data) => {
          const vstupniData = JSON.parse(data.Item.pocty);
          const celkemLidi = vstupniData.reduce((acc, curr) => curr + acc, 0);
          const majiMin = vstupniData.reduce(
            (acc, curr, i) => (i < pocetSpravne ? curr + acc : acc),
            0
          );
          const majiVic = vstupniData.reduce(
            (acc, curr, i) => (i > pocetSpravne ? curr + acc : acc),
            0
          );
          setMene(Math.round((majiMin / celkemLidi) * 100 * 10) / 10);
          setVice(Math.round((majiVic / celkemLidi) * 100 * 10) / 10);
          let vystupniData = vstupniData;
          vystupniData[pocetSpravne]++;
          const http = new XMLHttpRequest();
          const url =
            "https://ldwgwvuknh.execute-api.eu-central-1.amazonaws.com/items";
          http.open("PUT", url);
          http.send(
            JSON.stringify({
              vysledek: 0,
              pocty: JSON.stringify(vystupniData),
            })
          );
        });
    } else {
      //aby se nemohla v jedné hře opakovat dvě stejná místa
      let vylosovaneMisto;
      do {
        vylosovaneMisto = data[Math.floor(Math.random() * data.length)];
      } while (guessedPlaces.includes(vylosovaneMisto.id));

      setCurrPlace(vylosovaneMisto);
      setHistorieMista(
        mistaStats.filter((m) => {
          return m.id === vylosovaneMisto.id;
        })
      );
    }
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
        guessedPlaces[guessedPlaces.length - 1] != currPlace.id) &&
        !vyhodnoceni &&
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
      {!vyhodnoceni &&
        guessedPlaces.length > 0 &&
        guessedPlaces[guessedPlaces.length - 1] === currPlace.id && (
          <div>
            <strong>
              {guessedResults[guessedPlaces.length - 1]
                ? "Správně!"
                : "Špatně!"}
            </strong>
            <span>
              &nbsp;V obci {currPlace.obc} (okres{" "}
              {rekniOkres(currPlace.okres, okresy)}) zvítězila ve volebním
              okrsku číslo {currPlace.okr} strana{" "}
              {strany.filter((s) => s.id === currPlace.str)[0].str}
              .&nbsp;Získala zde {currPlace.hl} hlasů z {currPlace.hlclk}.{" "}
              {historieMista.length > 0
                ? `Na tomto místě tipovalo správně ${
                    Math.round(
                      (historieMista[0].cor / historieMista[0].tot) * 100 * 10
                    ) / 10
                  } % hráčů před vámi.`
                : null}
            </span>
            <div style="display:flex; justify-content:center; margin-top:0.4rem;">
              <button onClick={handleDalsiClick}>
                {guessedPlaces.length === 10 ? "Vyhodnotit" : "Další"}
              </button>
            </div>
          </div>
        )}
      {vyhodnoceni && (
        <div>
          <div>
            Máte výsledek lepší než {mene} % lidí, kteří hru dokončili před vámi
            a horší než jakého dosáhlo {vice} % hráčů. Ostatní dopadli stejně
            jako vy. <strong>Gratulujeme!</strong>
          </div>
          <div style="display:flex; justify-content:center; margin-top:0.4rem;">
            <button onClick={handleDalsiClick}>Hrát znovu</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ControlPanel;
