import * as SQLite from 'expo-sqlite';

export type Item = {
  id: number;
  name: string;
  cost_price: number;
};

export type Sale = {
  id: number;
  item: string;
  selling_price: number;
  cost_price: number;
  quantity: number;
  total_sale: number;
  total_cost: number;
  profit: number;
  timestamp: string;
};

export type DailySummary = {
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  numberOfSales: number;
};

const db = SQLite.openDatabaseSync('moms-sales-app.db');

export async function initDB(): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      cost_price REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      item TEXT NOT NULL,
      selling_price REAL NOT NULL,
      cost_price REAL NOT NULL,
      quantity INTEGER NOT NULL,
      total_sale REAL NOT NULL,
      total_cost REAL NOT NULL,
      profit REAL NOT NULL,
      timestamp TEXT NOT NULL
    );
  `);
}

export async function addItem(name: string, costPrice: number): Promise<void> {
  await db.runAsync('INSERT INTO items (name, cost_price) VALUES (?, ?)', [name.trim(), costPrice]);
}

export async function getItems(): Promise<Item[]> {
  return db.getAllAsync<Item>('SELECT * FROM items ORDER BY name ASC');
}

export async function deleteItem(id: number): Promise<void> {
  await db.runAsync('DELETE FROM items WHERE id = ?', [id]);
}

export async function addSale(input: {
  item: string;
  sellingPrice: number;
  costPrice: number;
  quantity: number;
}): Promise<void> {
  const totalSale = input.sellingPrice * input.quantity;
  const totalCost = input.costPrice * input.quantity;
  const profit = totalSale - totalCost;

  await db.runAsync(
    `INSERT INTO sales
      (item, selling_price, cost_price, quantity, total_sale, total_cost, profit, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      input.item,
      input.sellingPrice,
      input.costPrice,
      input.quantity,
      totalSale,
      totalCost,
      profit,
      new Date().toISOString(),
    ]
  );
}

export async function deleteSale(id: number): Promise<void> {
  await db.runAsync('DELETE FROM sales WHERE id = ?', [id]);
}

export async function getSalesByDate(date: string): Promise<Sale[]> {
  return db.getAllAsync<Sale>('SELECT * FROM sales WHERE date(timestamp) = date(?) ORDER BY timestamp DESC', [date]);
}

export async function getDailySummary(date: string): Promise<DailySummary> {
  const row = await db.getFirstAsync<{
    totalRevenue: number | null;
    totalCost: number | null;
    totalProfit: number | null;
    numberOfSales: number | null;
  }>(
    `SELECT
      SUM(total_sale) as totalRevenue,
      SUM(total_cost) as totalCost,
      SUM(profit) as totalProfit,
      COUNT(*) as numberOfSales
    FROM sales
    WHERE date(timestamp) = date(?)`,
    [date]
  );

  return {
    totalRevenue: row?.totalRevenue ?? 0,
    totalCost: row?.totalCost ?? 0,
    totalProfit: row?.totalProfit ?? 0,
    numberOfSales: row?.numberOfSales ?? 0,
  };
}

export function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}
