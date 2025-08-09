let a: any;
a = 1;
a = "hello";
a = false;

a.toUpperCase();

let b: unknown;
b = 2;
b = "world";
b = true;
b = a;

// b.includes("");

let c: string;
if (typeof b === "string") {
  c = b;
}

c = b as string;

c = <string>b;


let x = 'hello' as any as number