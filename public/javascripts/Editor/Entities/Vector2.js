class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(vector) {
        return new Vector2(this.x + vector.x, this.y + vector.y);
    }

    subtract(vector) {
        return new Vector2(this.x - vector.x, this.y - vector.y);
    }

    multiply(scalar) {
        return new Vector2(this.x * scalar, this.y * scalar);
    }

    divide(scalar) {
        if (scalar === 0) {
            throw new Error("Cannot divide by zero.");
        }
        return new Vector2(this.x / scalar, this.y / scalar);
    }

    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize() {
        const mag = this.magnitude();
        if (mag === 0) {
            throw new Error("Cannot normalize a zero vector.");
        }
        return this.divide(mag);
    }

    dot(vector) {
        return this.x * vector.x + this.y * vector.y;
    }

    toJSON() {
        return {
            x: this.x,
            y: this.y
        };
    }
}