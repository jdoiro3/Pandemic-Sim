
class Person extends Point {

  constructor(x, y, infected=false, removed=false) {
    // call Point constructor
    super(x, y);
    // Person specific attributes
    this.infected = infected;
    this.removed = removed;
    this.color = 'green';
    this.frames_infected = 0;
    this.inf_area = new Circle(this.x, this.y, 20);
    // private attribute
    this._MAX_FRAMES_INF = 100;
  }

  moveRand(stepSize) {
    let new_x = this.x + randBetween(-stepSize, stepSize);
    let new_y = this.y + randBetween(-stepSize, stepSize);
    this.chngP(new_x, new_y);
  }

  infect() {
    if (this.removed || this.infected) {
      return;
    } else {
    this.infected = true;
    this.color = 'red';
    }
  }

  remove() {
    if (this.removed || !this.infected) {
      return;
    } else {
    this.infected = false;
    this.removed = true;
    this.color = 'blue';
    }
  }

  walkRand(stepSize) {
    if (this.removed) {
      return;
    } else {
      this.moveRand(stepSize);
      if (this.infected) {
        this.frames_infected += 1;
        if (this.frames_infected > this._MAX_FRAMES_INF) {
          this.remove();
        }
      }
    }
  }

  draw(ctx) {
    if (this.infected) {
      super.draw(ctx, true, 'red');
    } else {
      super.draw(ctx, true, 'green');
    }
  }

}
