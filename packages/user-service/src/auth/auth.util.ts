import * as bcrypt from "bcrypt";

const saltRounds = 10;

export async function hash(data: string) {
  return await bcrypt.hash(data, saltRounds);
}

export async function compare(data: string, hash: string) {
  return await bcrypt.compare(data, hash);
}
