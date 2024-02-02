const colorOffset = 60;
const colors = ["blue", "green", "yellow", "orange", "purple", "cyan", "white", "brown", "red"];

class Ant {
  constructor(number, graph) {
    this.number = number;
    this.graph = graph;

    // this.color = colors[Math.floor(random(0, colors.length - 1))];
    this.color = "#" + Math.floor(Math.random() * 16777215).toString(16);

    this.nodesToVisit = [...graph.nodes];
    this.chooseStartNode();

    this.nodeDesirabilities = [];
    this.path = [];
    this.pathLength = 0;

    this.thinkProgress = 0;
    this.moveProgress = 0;
  }

  chooseStartNode() {
    let i = Math.floor(random(0, this.nodesToVisit.length));
    this.startNode = this.nodesToVisit[i];
    this.position = createVector(this.startNode.x, this.startNode.y);
    this.currentNode = this.startNode;
    this.nextNode = null;
    this.nodesToVisit.splice(i, 1);
  }

  chooseNextNode() {
    if (this.isPathComplete()) return;

    // If there are no more nodes to visit, then we just need to return to start
    if (this.nodesToVisit.length === 0) {
      console.log("No more nodes to visit - going back to start");
      this.nodesToVisit.push(this.startNode);
    }

    // Otherwise find a node that has not yet been visited
    if (this.nextNode === null) {
      console.log("Choose next node out of " + this.nodesToVisit.length + " possibilities");
      this.thinkProgress = 0;
      this.moveProgress = 0;
      this.calculateNodeDesirabilities();
      let rnd = random(1);
      let sumProbabilities = 0;
      for (let i = 0; i < this.nodeDesirabilities.length; i++) {
        sumProbabilities += this.nodeDesirabilities[i];
        if (rnd < sumProbabilities) {
          this.nextNode = this.nodesToVisit[i];
          this.nextNodeIndex = i;
          break;
        }
      }
    }
  }

  calculateNodeDesirabilities() {
    this.nodeDesirabilities = [];
    let totalDistance = this.nodesToVisit.reduce((accumulator, otherNode) => accumulator + this.graph.getDistanceBetweenNodes(this.currentNode.index, otherNode.index), 0);

    // Calculate other nodes desirability based on distance
    let totalDesirability = 0;
    for (let i = 0; i < this.nodesToVisit.length; i++) {
      let otherNode = this.nodesToVisit[i];
      let distanceToOtherNode = this.graph.getDistanceBetweenNodes(this.currentNode.index, otherNode.index);
      this.nodeDesirabilities[i] = 1 / Math.pow(distanceToOtherNode / totalDistance, preferNearestSlider.value());
      totalDesirability += this.nodeDesirabilities[i];
    }

    // Normalize desirabilities
    for (let i = 0; i < this.nodesToVisit.length; i++) {
      this.nodeDesirabilities[i] = this.nodeDesirabilities[i] / totalDesirability;
    }
  }

  isPathComplete() {
    return this.path.length === this.graph.nodes.length;
  }

  show() {
    stroke("green");
    strokeWeight(10);
    point(this.startNode.x, this.startNode.y);
    strokeWeight(1);

    // Draw path
    for (let i = 0; i < this.path.length; i++) {
      stroke(this.color);
      strokeWeight(3);
      if (i === 0) {
        line(this.startNode.x, this.startNode.y, this.path[i].x, this.path[i].y);
      } else {
        line(this.path[i - 1].x, this.path[i - 1].y, this.path[i].x, this.path[i].y);
      }
    }

    if (!this.isPathComplete()) {
      // Draw desirability lines to other nodes
      console.log("before", this.thinkProgress, animationSpeedSlider.value(), animationSpeedSlider.elt.getAttribute("max"));
      this.thinkProgress = Math.min(1, this.thinkProgress + animationSpeedSlider.value() / (animationSpeedSlider.elt.getAttribute("max") * 1));
      console.log(this.thinkProgress);
      for (let i = 0; i < this.nodesToVisit.length; i++) {
        let otherNode = this.nodesToVisit[i];
        if (this.thinkProgress < 1) {
          otherNode = createVector(
            lerp(this.currentNode.x, otherNode.x, this.thinkProgress),
            lerp(this.currentNode.y, otherNode.y, this.thinkProgress))
          ;
        }
        if (false) {
          let colorComponent = lerp(colorOffset, 255, this.nodeDesirabilities[i]);
          stroke(colorComponent, colorComponent, colorComponent);
          strokeWeight(1);
          line(this.currentNode.x, this.currentNode.y, otherNode.x, otherNode.y);
        }
      }
      // Move ant
      if (this.thinkProgress === 1) {
        this.moveProgress = Math.min(1, this.moveProgress + 1 / (animationSpeedSlider.elt.getAttribute("max") - animationSpeedSlider.value()));
        if (this.nextNode === null || this.currentNode === undefined || this.nextNode === undefined || this.currentNode.x === undefined || this.currentNode.y === undefined || this.nextNode.x === undefined || this.nextNode.y === undefined) {
          console.log(this.currentNode, this.nextNode);
        }
        this.position.x = lerp(this.currentNode.x, this.nextNode.x, this.moveProgress);
        this.position.y = lerp(this.currentNode.y, this.nextNode.y, this.moveProgress);

        // Draw path as we move
        let lastNode = this.path.length >= 1 ? this.path[this.path.length - 1] : this.startNode;
        stroke(this.color);
        strokeWeight(3);
        line(lastNode.x, lastNode.y, this.position.x, this.position.y);

        if (this.moveProgress === 1) {
          this.thinkProgress = 0;
          this.moveProgress = 0;
          this.nodesToVisit.splice(this.nextNodeIndex, 1);
          this.path.push(this.nextNode);
          this.pathLength += this.graph.getDistanceBetweenNodes(this.number, this.nextNodeIndex);
          document.querySelector("#ant-path-length-" + this.number).innerText = Math.round(this.pathLength);
          this.currentNode = this.nextNode;
          this.nextNode = null;
        }
      }
    }

    // Draw the ant
    stroke("white");
    strokeWeight(6);
    point(this.position.x, this.position.y);
  }
}