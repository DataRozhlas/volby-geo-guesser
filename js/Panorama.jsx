import { h } from "preact";
import { useEffect, useState } from "preact/compat";

function Panorama({ currPlace, setCurrPlace, mapLoader, data }) {
  const [panoramaScene, setPanoramaScene] = useState(null);

  useEffect(() => {
    if (mapLoader.loadedMapApi) {
      setPanoramaScene(
        new mapLoader.SMap.Pano.Scene(document.querySelector("#panorama"), {
          //nav: false, // skryjeme navigaci
          pitchRange: [0, 0], // zakazeme vertikalni rozhled
        })
      );
    }
  }, [mapLoader]);

  useEffect(() => {
    if (panoramaScene) {
      // kolem teto pozice chceme nejblizsi panorama
      var position = mapLoader.SMap.Coords.fromWGS84(currPlace.X, currPlace.Y);

      // hledame s toleranci 150m
      mapLoader.SMap.Pano.getBest(position, 150).then(
        function (place) {
          panoramaScene.show(place);
        }, // když se nevrátí panorama
        function () {
          const http = new XMLHttpRequest();
          const url =
            "https://m5u79pkxma.execute-api.eu-central-1.amazonaws.com/deploy/okrsek";
          http.open("POST", url);
          http.send({
            id: currPlace.id,
            correct: null,
            sense: null,
          }); //console.log("nenašli");
          setCurrPlace(data[Math.floor(Math.random() * data.length)]);
        }
      );
    }
  }, [currPlace, panoramaScene]);
  return <div id="panorama"></div>;
}

export default Panorama;
