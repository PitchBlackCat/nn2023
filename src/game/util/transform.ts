// export class Transform {
//   public position: Vector2 = new Vector2(0,0);
//   public velocity: number = 0;
//   public torque: number = 0;
//   public rotation: number = 0;
//
//   tick() {
//     this.position.move(this.rotation, this.velocity);
//   }
// }

// export class Vector {
//   x: number;
//   y: number;
//
//   constructor(x: number, y: number) {
//     this.x = x;
//     this.y = y;
//   }
//
//   get magnitude(): number {
//     return Math.sqrt(this.x * this.x + this.y * this.y);
//   }
//
//   normalize(): Vector2 {
//     const m = this.magnitude;
//     this.x /= m;
//     this.y /= m;
//     return this;
//   }
//
//   move(angle: number, velocity: number) {
//     this.x += Math.cos(angle) * velocity
//     this.y += Math.sin(angle) * velocity
//   }
//
//   randomize(maxX: number, maxY: number) {
//     this.x = Math.floor(Math.random() * maxX);
//     this.y = Math.floor(Math.random() * maxY);
//   }
//
//   distance(v: Vector2) {
//     return Math.sqrt(Math.pow(v.x - this.x, 2) + Math.pow(v.y - this.y, 2));
//   }
//
//   add(v: Vector2) {
//     return new Vector2(this.x + v.x, this.y + v.y);
//   }
//
//   subtract(v: Vector2) {
//     return new Vector2(this.x - v.x, this.y - v.y);
//   }
// }

export interface Vector2 {
  x: number;
  y: number;
}

export class VMath {
  static sub(v1: Vector2, v2: Vector2): Vector2 {
    return {x: v1.x - v2.x, y: v1.y - v2.y};
  }

  static add(v1: Vector2, v2: Vector2): Vector2 {
    return {x: v1.x + v2.x, y: v1.y + v2.y};
  }

  static magnitude(v1: Vector2): number {
    return Math.sqrt(v1.x * v1.x + v1.y * v1.y);
  }

  static moveAtAngle(v1: Vector2, angle: number, dist: number): Vector2 {
    return {
      x: v1.x + (Math.cos(angle) * dist),
      y: v1.y + (Math.sin(angle) * dist)
    };
  }

  static angleBetween(pivot: Vector2, v1: Vector2, v2: Vector2): number {
    const v1n = VMath.sub(v1, pivot);
    const v2n = VMath.sub(v2, pivot);

    return Math.atan2(v2n.y, v2n.x) - Math.atan2(v1n.y, v1n.x);
  }
}
