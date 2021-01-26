import p5 from 'p5';

let sketch = function(p) {
  class Circle {
    constructor(props) {
      this.fillColor = props.fillColor
      this.vertCounts = props.vertCounts;
      this.isStopped = false;
      this.noiseStartingOffset = Math.random() * 1000;
      this.rotation = 0;
      this.initialControl = 0;
      this.initialMinRadius = 0;
      this.growRange = 0;
      this.frameCount = 0;
      this.rotationDirection = Math.random() > 0.5 ? 1 : -1;
      this.speedParam = props.speedParam || 0.008;
      this.position = props.position;
      this.destroyOldestSet = props.destroyOldestSet;
  
      this.vertices = new Array(this.vertCounts).fill().map((v, i) => {
        let angle = Math.PI * 2 * (i / this.vertCounts);
        let r = this.minRadius;
        return new p5.Vector(r * Math.cos(angle), - r * Math.sin(angle))
      });
    }
  
    update(t) {
      this.frameCount += 1;
      this.growRange =  -Math.cos(this.frameCount * this.speedParam ) * 80 + 80;
      this.minRadius = this.initialMinRadius -Math.cos(this.frameCount * this.speedParam  / 2) * 400 + 400;
      this.control = this.initialControl -Math.cos(this.frameCount * 0.004) * 60 + 60;
      this.rotation = this.frameCount * 0.01 * this.rotationDirection;
  
      this.vertices = this.vertices.map((v, i) => {
        let angle = Math.PI * 2 * ( i / this.vertCounts);
        let r = p.map(p.noise(i, this.frameCount * 0.005 + this.noiseStartingOffset), 0, 1, this.minRadius, this.minRadius + this.growRange)
        
        return new p5.Vector(r * Math.cos(angle + this.rotation), - r * Math.sin(angle + this.rotation))
      })
      
      if (this.minRadius > 799) {
        this.stopAnimate();
      }
    }
  
    render() {	
      p.push();
      p.translate(this.position[0], this.position[1]);
      renderCircle(this.control, this.vertices, p.color(this.fillColor));
      p.pop();
    }
  
    animate(t) {
      if (!this.isStopped) {
        this.update(t);
        this.render();	
      }
      
    }
  
    stopAnimate() {
      this.isStopped = true;
      console.log('stop!')
      circleFactory.destroyOldestSet()
    }
  }
  
  function renderCircle(ctrl, vertices, fillColor) {
    p.stroke(fillColor)
    p.push();
    p.beginShape();
    p.vertex(vertices[0].x, vertices[0].y);
  
    for(var i = 0; i < vertices.length - 1; i ++) {
      const firstAngle =  vertices[i].heading();
      const secondAngle = vertices[i + 1].heading();
    
      p.bezierVertex(
        vertices[i].x + ctrl * Math.sin(firstAngle),
        vertices[i].y - ctrl * Math.cos(firstAngle),
        vertices[i + 1].x - ctrl * Math.sin(secondAngle),
        vertices[i + 1].y + ctrl * Math.cos(secondAngle),
        vertices[i + 1].x,
        vertices[i + 1].y
      );
    }
    
    const firstAngle =  vertices[vertices.length - 1].heading();
    const secondAngle = vertices[0].heading();
  
    p.bezierVertex(
      vertices[vertices.length - 1].x + ctrl * Math.sin(firstAngle),
      vertices[vertices.length - 1].y - ctrl * Math.cos(firstAngle),
      vertices[0].x - ctrl * Math.sin(secondAngle),
      vertices[0].y + ctrl * Math.cos(secondAngle),
      vertices[0].x,
      vertices[0].y
    );
  
    p.endShape();
    p.pop();
  };

  const colorSets = [
    // ['#DF0078', '#eaeaea', '#5C6D92', '#4158AB'],
    ['#ff577f', '#ff884b', '#ffc764', '#cdfffc'], //OK
    // ['#08d9d6', '#252a34', '#ff2e63', '#eaeaea'], //ok
    ['#3ec1d3', '#f6f7d7', '#ff9a00', '#ff165d'], //OK
    // ['#9ddcdc', '#fff4e1', '#ffebb7', '#e67a7a'],
    // ['#00b8a9', '#f8f3d4', '#f6416c', '#ffde7d'],
    ['#fcefee', '#fccde2', '#fc5c9c', '#c5e3f6'],
    ['#fafaf6', '#00fff0', '#00d1ff', '#3d6cb9'],
    ['#f0eec9', '#9ee6cf', '#50c9ba', '#4ba2ac'],
    ['#f6f6d9', '#47e4e0', '#5f81e4', '#f67ff5'],
    // ['#00ad7c' ,'#52d681', '#b5ff7d', '#fff8b5'],
    ['#c7ffff', '#fbeeff', '#ebc6ff', '#7e80ff'],
    ['#ff487e', '#ff9776', '#ffd5be', '#ffedff']
  ]
  
  class CircleFactory {
    constructor(wW, wH) {
      this.circles = [];
      this.colors = colorSets[0];
      this.windowWidth = wW;
      this.windowHeight = wH;
    }
  
    create(speedParam, position ) {
      let that = this;
      const newCircle = new Circle({
        fillColor: this.colors[this.circles.length % this.colors.length],
        vertCounts: 10,
        speedParam,
        position,
        destroyOldestSet: that.destroyOldestSet
      })
  
      this.circles.push(newCircle);
    }
    
    createSet(x, y) {
      const speedParam = 0.006 + Math.random() * 0.002;
      this.colors = colorSets[Math.floor(Math.random() * colorSets.length)];
      this.create(speedParam, [x, y]);
      this.create(speedParam, [x, y]);
      this.create(speedParam, [x, y]);
      this.create(speedParam, [x, y]);
    }
  
    destroyOldestSet() {
      this.circles.splice(0, 4);
    }
  
    init(w, h) {
      this.createSet(w / 2, h / 2);
    }
  
    render(t) {
      for (let i = 0; i < this.circles.length; i ++) {
        this.circles[i].animate(t);
      }
    }
  }
  
  let circleFactory = new CircleFactory();

  p.setup = function() {
    let canvas = p.createCanvas(p.windowWidth, p.windowHeight);
    canvas.parent('p5-wrapper');
    console.log('Initialized p5 sketch.')
    p.noFill();
    p.background(0);
    p.noiseDetail(4, 0.6);
    circleFactory.init(p.windowWidth, p.windowHeight);
  }

  p.draw = function() {
    if(p.frameCount % 240 === 0) { //Create a new set of circles every 240 frames
      circleFactory.createSet(p.width / 2, p.height / 2);	
    }
    circleFactory.render(p.frameCount);
  }
}

export default sketch