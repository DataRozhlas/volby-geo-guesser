import { h } from "preact";

function Panorama({ CurrPlace }) {
  return (
    <div>
      {CurrPlace.id}: {CurrPlace.obc}
    </div>
  );
}

export default Panorama;
