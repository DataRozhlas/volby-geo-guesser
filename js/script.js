//import "preact/debug";
import { h, render, Component, Fragment } from "preact";
import { useEffect, useState } from "preact/compat";
import Panorama from "./Panorama.jsx";
import ControlPanel from "./ControlPanel.jsx";
import ScoreBoard from "./ScoreBoard.jsx";
import data from "./../data/data.json";
import useScript from "./useScript";
import useMapLoader from "./useMapLoader";

const getStats = async () => {
  try {
    const response = await fetch(
      "https://datarozhlas.s3.eu-central-1.amazonaws.com/volby-geo-data/mista-stats.json"
    );
    const mista = await response.json();
    return mista;
  } catch (error) {
    console.log(error);
  }
};

function App() {
  const [currPlace, setCurrPlace] = useState(
    data[Math.floor(Math.random() * data.length)]
  );
  const [guessedPlaces, setGuessedPlaces] = useState([]);
  const [guessedResults, setGuessedResults] = useState([]);
  // const [currPlace, setCurrPlace] = useState({
  //   id: 371,
  //   str: 24,
  //   hl: 29,
  //   hlclk: 72,
  //   obc: "Janov",
  //   X: 16.2518,
  //   Y: 50.3323,
  //   okr: 1,
  //   okres: 5204,
  // });
  // const [guessedPlaces, setGuessedPlaces] = useState([
  //   1, 1, 1, 1, 1, 1, 1, 1, 1, 371,
  // ]);
  // const [guessedResults, setGuessedResults] = useState([
  //   true,
  //   true,
  //   true,
  //   false,
  //   false,
  //   false,
  //   true,
  //   true,
  //   true,
  //   false,
  // ]);
  const [historieMista, setHistorieMista] = useState([]);
  const [loaded, error] = useScript("https://api.mapy.cz/loader.js");
  const [mapLoader] = useMapLoader(loaded);
  const [mistaStats, setMistaStats] = useState();

  useEffect(async () => {
    const result = await getStats();
    setMistaStats(result);
    setHistorieMista(
      result.filter((m) => {
        return m.id === currPlace.id;
      })
    );
  }, []);

  return (
    <>
      <ScoreBoard
        guessedPlaces={guessedPlaces}
        guessedResults={guessedResults}
      />

      <Panorama
        currPlace={currPlace}
        setCurrPlace={setCurrPlace}
        mapLoader={mapLoader}
        data={data}
        guessedPlaces={guessedPlaces}
        setHistorieMista={setHistorieMista}
        mistaStats={mistaStats}
      />
      <ControlPanel
        currPlace={currPlace}
        setCurrPlace={setCurrPlace}
        guessedPlaces={guessedPlaces}
        setGuessedPlaces={setGuessedPlaces}
        guessedResults={guessedResults}
        setGuessedResults={setGuessedResults}
        data={data}
        historieMista={historieMista}
        setHistorieMista={setHistorieMista}
        mistaStats={mistaStats}
      />
    </>
  );
}

render(<App />, document.getElementById("app"));
