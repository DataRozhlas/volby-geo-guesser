import "preact/debug";
import { h, render, Component, Fragment } from "preact";
import { useState } from "preact/compat";
import Panorama from "./Panorama.jsx";
import ControlPanel from "./ControlPanel.jsx";
import data from "./../data/data.json";
import useScript from "./useScript";
import useMapLoader from "./useMapLoader";

function App() {
  const [CurrPlace, setCurrPlace] = useState(
    data[Math.floor(Math.random() * data.length)]
  );
  const [loaded, error] = useScript("https://api.mapy.cz/loader.js");
  const [mapLoader] = useMapLoader(loaded);
  return (
    <>
      <Panorama CurrPlace={CurrPlace} mapLoader={mapLoader} />
      <ControlPanel CurrPlace={CurrPlace} />
    </>
  );
}

render(<App />, document.getElementById("app"));
