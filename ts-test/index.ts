const str: string = "Hello world";
console.log(`hwz, ${str}`);

type User = {
  id: number;
  name: string;
  age: number;
};

type Partial<T> = {
  [P in keyof T]?: T[P];
};
type PartialUser = Partial<User>;

function printUserAge(user?: User) {
  if (user) {
    console.log(`${Date.now()}: age is ${user.age}`);
  } else {
    console.log("user is null");
  }
}

const user: User = {
  id: 12,
  name: "hwz",
  age: 18,
};

printUserAge(user);
user.age = 20;
printUserAge(user);

const user2: Partial<User> = {};
user2.age = 21;

function getUser(b: boolean): User | null {
  return b ? user : null;
}

let user3: User | null = getUser(true);
if (user3) {
  user3.age = 22;
}

type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};
type ReadonlyUser = Readonly<User>;

const user4: Readonly<User> = {
  id: 1,
  name: "xm",
  age: 8,
};

type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

const user5: Pick<User, "name" | "age"> = {
  name: "wp",
  age: 25,
};

type Role = "admin" | "user" | "guest";

type Record<K extends keyof any, T> = {
  [P in K]: T;
};

type Permissions = Record<Role, string[]>;

type NonNullable<T> = T extends null | undefined ? never : T;
