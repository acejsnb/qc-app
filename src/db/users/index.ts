import { JSONFilePreset } from 'lowdb/node';

export interface User {
  id: string
  address: string
  timestamp: number
}

const defaultData = { users: [] as User[] }
const db = await JSONFilePreset('src/db/users/db.json', defaultData)

export const addUser = async (user: User) => {
  const item = db.data.users.find(d => d.address === user.address)
  if (!item) {
    db.data.users.push(user);
    await db.write();
    return user;
  }
  return item;
}
export const delUser = async (id: string) => {
  await db.update(({users}) => users.filter(d => d.id !== id));
}
