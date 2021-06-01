import { h } from "preact";
import { useEffect, useState } from "preact/compat";

function Panorama({ currPlace, setCurrPlace, mapLoader, data }) {
  useEffect(() => {
    if (mapLoader.loadedMapApi) {
      var options = {
        //nav: false, // skryjeme navigaci
        pitchRange: [0, 0], // zakazeme vertikalni rozhled
      };
      var panoramaScene = new mapLoader.SMap.Pano.Scene(
        document.querySelector("#panorama"),
        options
      );
      // kolem teto pozice chceme nejblizsi panorama
      var position = mapLoader.SMap.Coords.fromWGS84(currPlace.X, currPlace.Y);

      // hledame s toleranci 150m
      mapLoader.SMap.Pano.getBest(position, 150).then(
        function (place) {
          panoramaScene.show(place);
        }, // když se nevrátí panorama
        function () {
          console.log("nenašli");
        }
      );
    }
  }, [mapLoader, currPlace]);
  return <div id="panorama"></div>;
}

export default Panorama;
