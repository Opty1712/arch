export interface RawUser {
  id: number;
  name: string;
  email: string;
  roleIds: number[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  roleIds: number[];
}
