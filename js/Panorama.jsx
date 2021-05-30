import { h } from "preact";
import { useEffect } from "preact/compat";

function Panorama({ CurrPlace, mapLoader }) {
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
      var position = mapLoader.SMap.Coords.fromWGS84(CurrPlace.X, CurrPlace.Y);

      // hledame s toleranci 50m
      mapLoader.SMap.Pano.getBest(position, 350).then(
        function (place) {
          panoramaScene.show(place);
        },
        function () {
          alert("Panorama se nepodařilo zobrazit!");
        }
      );
    }
  }, [mapLoader]);
  return <div id="panorama"></div>;
}

export default Panorama;
