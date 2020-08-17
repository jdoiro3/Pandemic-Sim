function randBetween(min=-1, max=1) {
  return Math.random() * (max - min) + min;
}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    chngP(x, y) {
        this.x = x;
        this.y = y;
    }

    draw(ctx, fill=false) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, 2 * Math.PI);
        ctx.stroke();
        if (fill) {
            ctx.fillStyle = "green";
            ctx.fill();
        }
    }
    
    // helper func for the class
    static distance(p1, p2) {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        // get the euclidean distance
        return Math.hypot(dx, dy);
    }
}


class Rect {
    constructor(x, y, w, h) {
        this.center = new Point(x, y);
        this.w = w;
        this.h = h;
    }

    get left() {
        return this.center.x - this.w / 2;
    }

    get right() {
        return this.center.x + this.w / 2;
    }

    get top() {
        return this.center.y - this.h / 2;
    };

    get bottom() {
        return this.center.y + this.h / 2;
    };

    get topLeft() {
        return new Point(this.left, this.top);
    }

    get topRight() {
        return new Point(this.right, this.top);
    }

    get bottomLeft() {
        return new Point(this.left, this.bottom);
    }

    get bottomRight() {
        return new Point(this.right, this.bottom);
    }

    contains(p) {
        return (
        p.x >= this.left 
        &&
        p.x <= this.right
        &&
        p.y >= this.top
        &&
        p.y <= this.bottom
        )
    }

    // tester
    static testContains() {
        console.log("Should return 2 True and 1 False.")
        let r = new Rect(10, 10, 10, 10);
        let p1 = new Point(13, 12);
        let p2 = new Point(15, 15);
        let p3 = new Point(13,34);
        let points = [p1,p2,p3];
        points.forEach(p => console.log(r.contains(p)))
    }

    intersects(rng) {
        return !(rng.center.x - rng.w > this.center.x + this.w ||
                 rng.center.x + rng.w < this.center.x - this.w ||
                 rng.center.y - rng.h > this.center.y + this.h ||
                 rng.center.y + rng.h < this.center.y - this.h);
    }

    draw(ctx) {
        ctx.strokeRect(this.topLeft.x, this.topLeft.y, this.w, this.h);
    }

}




class QuadTree {
    constructor(boundary, capacity) {
        this.boundary = boundary;
        this.capacity = capacity;
        this.points = [];
        this.divided = false;
    }

    // CHANGES MAY BE NEEDED
    // - subdivide is tightly cuppled (knows that boundary has center)
    subdivide() {
        let ne = new Rect(
            this.boundary.center.x + this.boundary.w / 4, 
            this.boundary.center.y - this.boundary.h / 4,
            this.boundary.w / 2,
            this.boundary.h / 2
        );
        let nw = new Rect(
            this.boundary.center.x - this.boundary.w / 4, 
            this.boundary.center.y - this.boundary.h / 4,
            this.boundary.w / 2,
            this.boundary.h / 2
        );
        let se = new Rect(
            this.boundary.center.x + this.boundary.w / 4, 
            this.boundary.center.y + this.boundary.h / 4,
            this.boundary.w / 2,
            this.boundary.h / 2
        );
        let sw = new Rect(            
            this.boundary.center.x - this.boundary.w / 4, 
            this.boundary.center.y + this.boundary.h / 4,
            this.boundary.w / 2,
            this.boundary.h / 2
        );
        
        this.nw = new QuadTree(nw, this.capacity);
        this.ne = new QuadTree(ne, this.capacity);
        this.sw = new QuadTree(sw, this.capacity);
        this.se = new QuadTree(se, this.capacity);
        
        this.divided = true;
    }

    insert(p) {
        if (!this.boundary.contains(p)) {
            return false;
        }
        
        if (this.points.length < this.capacity) {
            this.points.push(p);
            return true;
        }
            
        if (!this.divided) {
            this.subdivide();
        }
                
        return (
        this.ne.insert(p) 
        || 
        this.nw.insert(p) 
        ||
        this.se.insert(p) 
        || 
        this.sw.insert(p)
        );
  }

  query(rng, found) {
    if (!found) {
      found = [];
    }

    if (!rng.intersects(this.boundary)) {
      return found;
    }

    for (let p of this.points) {
      if (rng.contains(p)) {
        found.push(p);
      }
    }
    if (this.divided) {
      this.nw.query(rng, found);
      this.ne.query(rng, found);
      this.sw.query(rng, found);
      this.se.query(rng, found);
    }

    return found;
  }

  show(ctx) {
    this.boundary.draw(ctx);
    if (this.divided) {
        this.nw.show(ctx);
        this.ne.show(ctx);
        this.sw.show(ctx);
        this.se.show(ctx);
    }
  }
}