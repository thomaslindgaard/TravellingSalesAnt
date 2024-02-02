class Graph {
  constructor() {
    this.nodes = [];
    this.distances = {};
    this.pheromoneStrengths = {};
  }

  createRandomGraph(numNodes) {
    for (let i = 0; i < numNodes; i++) {
      this.nodes.push(new Node(i, Math.round(random(0, width)), Math.round(random(0, height))));
    }
    this.calculateDistancesBetweenNodes();
  }

  calculateDistancesBetweenNodes() {
    for (let i = 0; i < this.nodes.length - 1; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        let key = i + "," + j;
        this.distances[key] = this.nodes[i].dist(this.nodes[j]);
        this.pheromoneStrengths[key] = 0;
      }
    }
  }

  updatePheromoneStrengths(ants) {
    let totalPathLengths = ants.reduce((accumulator, currentAnt) => accumulator + currentAnt.pathLength, 0);
    console.log(ants);
    ants.sort((a, b) => {
      return a.pathLength - b.pathLength;
    });
    console.log("ants sorted", ants);
  }

  getDistanceBetweenNodes(i, j) {
    if (i === j) return 0;
    let key = i + "," + j;
    if (j < i) {
      key = j + "," + i;
    }
    return this.distances[key];
  }

  getPheromoneStrength(i, j) {
    if (i === j) return 0;
    let key = i + "," + j;
    if (j < i) {
      key = j + "," + i;
    }
    return this.pheromoneStrengths[key];
  }

  show() {
    stroke("blue");
    strokeWeight(10);
    for (let i = 0; i < this.nodes.length; i++) {
      let node = this.nodes[i];
      point(node.x, node.y);
    }
  }
}