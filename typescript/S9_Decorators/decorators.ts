// Set experimental support for decorators 
function logConstructor(constructorFn: Function) {
    console.log(constructorFn);
}

@logConstructor
class EmptyClass {
    constructor() {
        console.log('Hello');
    }
}

const emptyClass = new EmptyClass();

// Method decorator
// a factory, since we return a function, that can toggle if a property of a class is editable
function editable(value: boolean) {
    return function (target: any, propName: string, descriptor: PropertyDescriptor) {
        descriptor.writable = value;
    }
}

class Project {
    projectName: string;

    constructor(name: string) {
        this.projectName = name;
    }

    //decorators are functions prepended with the @ syntax
    @editable(false)
    calcBudget() {
        console.log(1000);
    }
}

const project = new Project('A new project');
project.calcBudget();
// the following does nothing, as the object property is not editable
project.calcBudget = () => { console.log(2000) };
// so this still outputs 1000
project.calcBudget();

// Parameter decorators
// first parameter is any, as a class can be instantiated or static, it is then either the constructorFn or the prototype
function printInfo(target: any, methodName: string, parameterIndex: number) {
    console.log('Target: ' + target);
    console.log('methodName: ' + methodName);
    console.log('parameterIndex: ' + parameterIndex);
}

class Course {
    name: string;

    constructor(name: string) {
        this.name = name;
    }

    printStudentNumbers(mode: string, @printInfo printAll: boolean) {
        if (printAll) {
            console.log('All the numbers');
        } else {
            console.log('Not so many');
        }
    }
}

const course = new Course('Course');
course.printStudentNumbers('woot', true);
course.printStudentNumbers('woot', false);