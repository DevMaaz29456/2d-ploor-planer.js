const jsonData = {
  Regions: [
    [
      { X: 0, Y: 0, Z: 52.49343832020996 },
      { X: 38.27436931869327, Y: 34.868392433523155, Z: 52.49343832020996 },
    ],
    [
      { X: 0, Y: 100, Z: 52.49343832020996 },
      { X: 55.65625908245986, Y: 34.86839243352309, Z: 52.49343832020996 },
    ],
    [
      { X: 100, Y: 100, Z: 52.49343832020996 },
      { X: 55.656259082459876, Y: 44.38282812906108, Z: 52.49343832020996 },
    ],
    [
      { X: 100, Y: 0, Z: 52.49343832020996 },
      { X: 38.27436931869315, Y: 44.38282812906114, Z: 52.49343832020996 },
    ],
  ],
  Doors: [
    {
      Location: {
        X: 38.11032732394258,
        Y: 37.32902235448528,
        Z: 52.49343832020996,
      },
      Rotation: 4.712388980384696,
      Width: 4.284776902887138,
    },
  ],
  Furnitures: [
    {
      MinBound: { X: -10, Y: -20, Z: -2.4868995751603507e-14 },
      MaxBound: { X: 10, Y: 20, Z: 2.7887139107611625 },
      equipName: "Equipment 1",
      xPlacement: 0,
      yPlacement: 0,
      rotation: 1.5707963267948966,
    },
    {
      MinBound: {
        X: -1.416666666666667,
        Y: -1.8501516343696665,
        Z: -2.6645352591003757e-15,
      },
      MaxBound: {
        X: 1.4166666666666665,
        Y: 1.2500000000000004,
        Z: 7.083333333333304,
      },
      equipName: "Equipment 2",
      xPlacement: 39.69103598405127,
      yPlacement: 42.96309243717516,
      rotation: 3.141592653589793,
    },
    {
      MinBound: {
        X: -0.6118766404199494,
        Y: -1.2729658792650858,
        Z: -4.440892098500626e-16,
      },
      MaxBound: {
        X: 0.6118766404199577,
        Y: 0.6364829396325504,
        Z: 3.2972440944882178,
      },
      equipName: "Equipment 3",
      xPlacement: 42.64820625787592,
      yPlacement: 43.86914569417966,
      rotation: 3.141592653589793,
    },
  ],
};

const floorplan = document.getElementById("floorplan");
const hoverInfo = document.getElementById("hover-info");
const zoomLevel = document.getElementById("zoom-level");
const resetZoomButton = document.getElementById("reset-zoom");
const zoomInButton = document.getElementById("zoom-in");
const zoomOutButton = document.getElementById("zoom-out");

let scale = 1;
const scaleStep = 1.2;
const zoomMin = 0.5;
const zoomMax = 5;
let offsetX = 0;
let offsetY = 0;

function createLine(x1, y1, x2, y2) {
  const line = document.createElement("div");
  line.className = "wall";
  const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
  line.style.width = `${length}px`;
  line.style.transform = `rotate(${angle}deg)`;
  line.style.top = `${y1}px`;
  line.style.left = `${x1}px`;
  floorplan.appendChild(line);
}

function createDoor(x, y, width, rotation) {
  const door = document.createElement("div");
  door.className = "door";
  door.style.width = `${width}px`;
  door.style.transform = `rotate(${rotation}rad)`;
  door.style.top = `${y}px`;
  door.style.left = `${x}px`;
  floorplan.appendChild(door);
}

function createFurniture(x, y, minBound, maxBound, rotation, equipName) {
  const furniture = document.createElement("div");
  furniture.className = "furniture";
  const width = maxBound.X - minBound.X;
  const height = maxBound.Y - minBound.Y;
  furniture.style.width = `${width}px`;
  furniture.style.height = `${height}px`;
  furniture.style.transform = `rotate(${rotation}rad)`;
  furniture.style.top = `${y - minBound.Y}px`;
  furniture.style.left = `${x - minBound.X}px`;
  furniture.setAttribute("title", equipName);
  floorplan.appendChild(furniture);
}

function renderFloorplan() {
  jsonData.Regions.forEach((region) => {
    for (let i = 0; i < region.length - 1; i++) {
      const [start, end] = [region[i], region[i + 1]];
      createLine(start.X, start.Y, end.X, end.Y);
    }
  });

  jsonData.Doors.forEach((door) => {
    createDoor(door.Location.X, door.Location.Y, door.Width, door.Rotation);
  });

  jsonData.Furnitures.forEach((furniture) => {
    createFurniture(
      furniture.xPlacement,
      furniture.yPlacement,
      furniture.MinBound,
      furniture.MaxBound,
      furniture.rotation,
      furniture.equipName
    );
  });
}

function applyZoom() {
  scale = Math.max(zoomMin, Math.min(zoomMax, scale));
  zoomLevel.textContent = `Zoom: ${Math.round(scale * 100)}%`;
  floorplan.style.transform = `scale(${scale})`;
  floorplan.style.transformOrigin = "top left";
}

function resetZoom() {
  scale = 1;
  offsetX = 0;
  offsetY = 0;
  applyZoom();
}

function zoomIn() {
  scale *= scaleStep;
  applyZoom();
}

function zoomOut() {
  scale /= scaleStep;
  applyZoom();
}

resetZoomButton.addEventListener("click", resetZoom);
zoomInButton.addEventListener("click", zoomIn);
zoomOutButton.addEventListener("click", zoomOut);

floorplan.addEventListener("mousemove", (event) => {
  const { offsetX, offsetY } = event;
  hoverInfo.textContent = `Mouse Position: X=${Math.round(
    offsetX / scale
  )}, Y=${Math.round(offsetY / scale)}`;
});

renderFloorplan();
applyZoom();
