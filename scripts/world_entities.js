
class Person extends Point {

  static maxFramesInf = 500;

  constructor(x, y, status, infRadius=20, probInf=.05) {
    // call Point constructor
    super(x, y);
    // Person specific attributes
    if (!(['s','i','r'].includes(status))) {
      throw "status can only be s, i or r";
    } else {
      this.status = status;
    }

    switch (this.status) {
      case 's':
        this.color = 'green';
        this.hadInfection = false;
        break;
      case 'i':
        this.color = 'red';
        this.hadInfection = true;
        break;
      case 'r':
        this.color = 'grey';
        this.hadInfection = true;
        break;
    }

    this.framesInfected = 0;
    this.infArea = new Circle(this.x, this.y, infRadius);
    this.moveStatus = 'random'; 
    this.dest = undefined;
    this.probInf = probInf;
  }

  moveRand(stepSize) {
    let newX = this.x + randBetween(-stepSize, stepSize);
    let newY = this.y + randBetween(-stepSize, stepSize);
    this.chngP(newX, newY);
  }

  toPoint(point) {
    this.dest = point;
    this.moveStatus = 'point';
    let dis = Point.distance(this, point);
    this.dx_u = (this.x - point.x) / dis;
    this.dy_u = (this.y - point.y) / dis; 
  }

  moveToPoint(stepSize) {
    if (this.moveStatus !== 'point') {
      return;
    } else {
      let newX = this.x - this.dx_u * stepSize;
      let newY = this.y - this.dy_u * stepSize;
      this.chngP(newX, newY);
      let dis = Point.distance(this, this.dest);
      if (Math.abs(dis) <= 10) {
        this.chngP(this.dest.x, this.dest.y);
        this.moveStatus = 'random';
        this.dest = undefined;
      } 
    }
  }

  infect() {
    if (this.hadInfection) {
      return;
    } else {
      this.color = 'red';
      this.hadInfection = true;
      this.status = 'i';
    }
  }

  expose() {
    if (Math.random() < this.probInf) {
      this.infect();
    } else {
      return;
    }
  }

  remove() {
    if (this.status === 'i') {
      this.status = 'r';
      this.color = 'grey';
    }
  }

  incrementInf() {
    this.framesInfected += 1;
    if (this.framesInfected > Person.maxFramesInf) {
      this.remove();
    }
  }

  update(stepSize) {
    if (this.status === 'r') {
      return;
    } else {
      if (this.status === 'i') {
        this.incrementInf();
      }
      switch (this.moveStatus) {
        case 'random':
          this.moveRand(stepSize);
          break;
        case 'point':
          this.moveToPoint(stepSize);
          break;
      }
    }
  }

  draw(ctx) {
    super.draw(ctx, true, this.color);
  }

  getExposed(qt) {
    let rect = new Rect(this.x, this.y, this.infArea.r, this.infArea.r);
    return qt.query(rect);
  }

  movingRand() {
    if (this.moveStatus === 'rand') {
      return true;
    } else {
      return false;
    }
  }

  movingToPoint() {
    if (this.moveStatus === 'point') {
      return true;
    } else {
      return false;
    }
  }

  chngProbInf(v) {
    this.probInf = v;
  }

}
