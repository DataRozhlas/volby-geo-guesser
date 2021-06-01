import { h, render, Component, Fragment } from "preact";
import { useState } from "preact/compat";
import Panorama from "./Panorama.jsx";
import ControlPanel from "./ControlPanel.jsx";
import data from "./../data/data.json";
import useScript from "./useScript";
import useMapLoader from "./useMapLoader";

function App() {
  const [currPlace, setCurrPlace] = useState(
    data[Math.floor(Math.random() * data.length)]
  );
  const [guessedPlaces, setGuessedPlaces] = useState([]);
  const [loaded, error] = useScript("https://api.mapy.cz/loader.js");
  const [mapLoader] = useMapLoader(loaded);
  return (
    <>
      <Panorama
        currPlace={currPlace}
        setCurrPlace={setCurrPlace}
        mapLoader={mapLoader}
        data={data}
      />
      <ControlPanel
        currPlace={currPlace}
        setCurrPlace={setCurrPlace}
        guessedPlaces={guessedPlaces}
        setGuessedPlaces={setGuessedPlaces}
        data={data}
      />
    </>
  );
}

render(<App />, document.getElementById("app"));
