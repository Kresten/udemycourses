// Exercise 1 - How was your TypeScript Class?
class Car {
    private name;
    public acceleration = 0;

    constructor(name: string) {
        this.name = name;
    }

    public honk() {
        console.log("Toooooooooot!");
    }

    public accelerate(speed: number) {
        this.acceleration += speed;
    }
}

const car = new Car("BMW");
car.honk();
console.log(car.acceleration);
car.accelerate(10);
console.log(car.acceleration);

// Exercise 2 - Two objects, based on each other ...

class BaseObject {
    public width;
    public length;

    constructor(width: number, length: number) {
        this.width = width;
        this.length = length;
    }
}

class Rectangle extends BaseObject {
    constructor() {
        super(5, 2);
    }

    public calcSize(): number {
        return this.width * this.length;
    }
}

const rectangle = new Rectangle();
console.log(rectangle.calcSize());

// Exercise 3 - Make sure to compile to ES5 (set the target in tsconfig.json)

class Person {
    private _firstName = "";

    get firstName(): string {
        return this._firstName;
    }

    set firstName(name: string) {
        if (name.length > 3) {
            this._firstName = name;
        } else {
            this._firstName = "";
        }
    }
}

const person = new Person();
console.log(person.firstName);
person.firstName = "Ma";
console.log(person.firstName);
person.firstName = "Maximilian";
console.log(person.firstName);