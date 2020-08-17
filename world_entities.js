class Person {

  #frames_infected = 100;
  constructor(location, infected=false, removed=false) {
    if (!location instanceof Point) {
      throw new TypeError("location must be of type Point")
    }
    this.location = location;
    this.infected = infected;
    this.removed = removed;
    this.color = 'green';
    // private attributes
    this.days_infected = 0;
  }

  updateLoc() {
    let new_x = this.location.x + randBetween(-3,3);
    let new_y = this.location.y + randBetween(-3,3);
    this.location.chngP(new_x, new_y);
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

  update() {
    if (this.removed) {
      return;
    } else {
      this.updateLoc();
      if (this.infected) {
        this.days_infected += 1;
        if (this.days_infected > this.#frames_infected) {
          this.remove();
        }
      }
    }
  }


};
