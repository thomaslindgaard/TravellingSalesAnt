const width = 600;
const height = 500;
const numNodes = 50;
const numAnts = 10;

const graph = new Graph();
const ants = [];

let animationSpeedSlider, preferNearestSlider;
let running = true;

function setup() {

  createCanvas(width, height);
  document.querySelector("main").appendChild(document.querySelector("#ants-table"));
  document.querySelector("#ants-table").style.width = width;
  graph.createRandomGraph(numNodes);
  for (let i = 0; i < numAnts; i++) {
    let ant = new Ant(i, graph);
    ants.push(ant);
    addAntRow(ant);
  }

  animationSpeedSlider = myCreateSlider("animation-speed", 1, 100, 9, 1);
  preferNearestSlider = myCreateSlider("prefer-nearest", 0, 10, 2, 1);
}

function addAntRow(ant) {
  const table = document.querySelector("#ants-table tbody");
  let row = document.createElement("tr");
  row.setAttribute("id", "ant-row-" + ant.number);
  table.appendChild(row);
  let cell = document.createElement("td");
  cell.innerText = "Ant " + ant.number;
  row.appendChild(cell);
  cell = document.createElement("td");
  cell.setAttribute("id", "ant-path-length-" + ant.number);
  cell.className = "ant-path-length";
  cell.innerText = "0";
  row.appendChild(cell);
  cell = document.createElement("td");
  cell.setAttribute("id", "ant-color-" + ant.number);
  cell.style.backgroundColor = ant.color;
  row.appendChild(cell);
}

function myCreateSlider(id, min, max, defaultValue, step) {
  let slider = createSlider(min, max, defaultValue, step);
  slider.elt.setAttribute("id", id + "-slider");
  document.querySelector("#" + id).appendChild(slider.elt);
  return slider;
}

function draw() {
  background(51);

  graph.show();
  for (let ant of ants) {
    ant.chooseNextNode();
    ant.show();
  }
  // graph.updatePheromoneStrengths(ants);

  let shortestPath = Number.MAX_SAFE_INTEGER;
  let bestAnt = null;
  for (let ant of ants) {
    document.querySelector("#ant-row-" + ant.number).style.backgroundColor = "black";
    if (ant.pathLength < shortestPath) {
      shortestPath = ant.pathLength;
      bestAnt = ant;
    }
  }
  document.querySelector("#ant-row-" + bestAnt.number).style.backgroundColor = "goldenrod";

  if (ants[0].isPathComplete() && running) {
    running = false;

    let element = document.createElement("div");
    element.innerText = "Så er myrerne sgu færdige - og myre " + bestAnt.number + " vandt!";
    document.body.appendChild(element);
  }
}