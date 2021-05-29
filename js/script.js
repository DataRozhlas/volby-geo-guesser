import "preact/debug";
import { h, render, Component, Fragment } from "preact";
import { useState } from "preact/compat";
import Panorama from "./Panorama.jsx";
import ControlPanel from "./ControlPanel.jsx";
import data from "./../data/data.json";

function App() {
  const [CurrPlace, setCurrPlace] = useState(
    data[Math.floor(Math.random() * data.length)]
  );
  return (
    <>
      <Panorama CurrPlace={CurrPlace} />
      <ControlPanel CurrPlace={CurrPlace} />
    </>
  );
}

render(<App />, document.getElementById("app"));
