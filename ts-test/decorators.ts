@tojson(true)
class Person {
   @State name:string
   @State @State2 age:number
  constructor(  name: string,  age: number) {
    this.name=name
    this.age=age
  }
}

@tojson(true)
@tojson(true)
@test
class Student {
    sex='man'
}

function tojson(b:boolean){
    return function(constructor:Function){
        if(b){
            constructor.prototype.toString=function(){
                return JSON.stringify(this)
            }
        }
    }
}

function test(target:Function){

}

function State(target:object, propertyKey:string){

}

function State2(target:object, propertyKey:string){

}

const p = new Person('he', 32)
const p2 = new Person('he', 32)
console.log(p.toString())

const s = new Student()
console.log(s.toString())


function print(name:string, ...arg:any[]) {
 console.log('')
}

print('hhd',1,'ghh')