import { h } from "preact";

function Panorama({ CurrPlace }) {
  return (
    <div id="panorama">
      {CurrPlace.id}: {CurrPlace.obc}
    </div>
  );
}

export default Panorama;
