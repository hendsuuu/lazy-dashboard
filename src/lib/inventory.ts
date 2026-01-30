export type Category = { id: string; name: string; createdAt: string };
export type Item = {
  id: string;
  sku: string;
  name: string;
  categoryId?: string;
  stock: number;
  minStock: number;
  unit: string;
  createdAt: string;
};

export type MovementType = "IN" | "OUT" | "ADJUST";
export type Movement = {
  id: string;
  itemId: string;
  type: MovementType;
  qty: number;
  note?: string;
  createdAt: string;
};

const CAT_KEY = "inv_categories";
const ITEM_KEY = "inv_items";
const MOV_KEY = "inv_movements";

function safeParse<T>(raw: string | null, fallback: T): T {
  try {
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function getCategories(): Category[] {
  if (typeof window === "undefined") return [];
  return safeParse<Category[]>(localStorage.getItem(CAT_KEY), []);
}
export function saveCategories(v: Category[]) {
  localStorage.setItem(CAT_KEY, JSON.stringify(v));
}

export function getItems(): Item[] {
  if (typeof window === "undefined") return [];
  return safeParse<Item[]>(localStorage.getItem(ITEM_KEY), []);
}
export function saveItems(v: Item[]) {
  localStorage.setItem(ITEM_KEY, JSON.stringify(v));
}

export function getMovements(): Movement[] {
  if (typeof window === "undefined") return [];
  return safeParse<Movement[]>(localStorage.getItem(MOV_KEY), []);
}
export function saveMovements(v: Movement[]) {
  localStorage.setItem(MOV_KEY, JSON.stringify(v));
}

export function addItem(input: Omit<Item, "id" | "createdAt">) {
  const items = getItems();
  if (items.some((x) => x.sku.toLowerCase() === input.sku.toLowerCase())) {
    throw new Error("SKU sudah ada");
  }
  const item: Item = { id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...input };
  saveItems([item, ...items]);
  return item;
}

export function updateItem(id: string, patch: Partial<Omit<Item, "id" | "createdAt">>) {
  const items = getItems();
  const next = items.map((x) => (x.id === id ? { ...x, ...patch } : x));
  saveItems(next);
}

export function deleteItem(id: string) {
  saveItems(getItems().filter((x) => x.id !== id));
  saveMovements(getMovements().filter((m) => m.itemId !== id));
}

export function addMovement(input: Omit<Movement, "id" | "createdAt">) {
  const items = getItems();
  const item = items.find((x) => x.id === input.itemId);
  if (!item) throw new Error("Item tidak ditemukan");

  let nextStock = item.stock;

  if (input.type === "IN") nextStock += input.qty;
  if (input.type === "OUT") {
    if (item.stock - input.qty < 0) throw new Error("Stok tidak cukup");
    nextStock -= input.qty;
  }
  if (input.type === "ADJUST") nextStock = input.qty; // qty dianggap absolute stock

  const nextItems = items.map((x) => (x.id === item.id ? { ...x, stock: nextStock } : x));
  saveItems(nextItems);

  const movements = getMovements();
  const mv: Movement = { id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...input };
  saveMovements([mv, ...movements]);

  return mv;
}
