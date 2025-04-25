import { JSONFilePreset } from 'lowdb/node';

export interface CommodityItem {
  id: string
  price: number
  symbol: string
  name: string
  desc: string
}

const defaultData = { commodity: [] as CommodityItem[] }
const db = await JSONFilePreset('src/db/commodity/db.json', defaultData)

export const getCommodityList = async (id?: string | null) => {
  const data = db.data.commodity;
  if (id) {
    const item = data.find(d => d.id === id);
    if (!item) return [];
    return [item];
  }
  return data;
}

export const addCommodity = async (commodity: CommodityItem) => {
  db.data.commodity.push(commodity);
  await db.write();
  return commodity;
}
export const delCommodity = async (id: string) => {
  await db.update(({commodity}) => commodity.filter(d => d.id !== id));
}
