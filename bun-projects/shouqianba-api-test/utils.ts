export function md5(str: string) {
  const hasher = new Bun.CryptoHasher("md5");
  hasher.update(str);
  return hasher.digest("hex");
}

export function sign(payload: string, sn: string) {
  const str = md5(payload);
  return sn + " " + str;
}

export function log(...data: any[]) {
  console.log(new Date(), ...data);
}
