import { openDB, type IDBPDatabase } from 'idb';

interface IndexedDbStoreOptions {
  keyPath?: string;
}

// Thin wrapper around a single IndexedDB object store: opens (and memoizes)
// the connection lazily on first use, so constructing a store is free until
// it's actually read from or written to.
export class IndexedDbStore<T> {
  private dbPromise: Promise<IDBPDatabase> | undefined;

  constructor(
    private readonly dbName: string,
    private readonly storeName: string,
    private readonly options: IndexedDbStoreOptions = {},
  ) {}

  private getDb() {
    this.dbPromise ??= openDB(this.dbName, 1, {
      upgrade: (db) => {
        db.createObjectStore(this.storeName, this.options);
      },
    });
    return this.dbPromise;
  }

  async get(key: string): Promise<T | undefined> {
    const db = await this.getDb();
    return db.get(this.storeName, key);
  }

  async getAll(): Promise<T[]> {
    const db = await this.getDb();
    return db.getAll(this.storeName);
  }

  // `key` is only needed for stores without an inline `keyPath`.
  async put(value: T, key?: string): Promise<void> {
    const db = await this.getDb();
    await db.put(this.storeName, value, key);
  }

  async delete(key: string): Promise<void> {
    const db = await this.getDb();
    await db.delete(this.storeName, key);
  }

  async clear(): Promise<void> {
    const db = await this.getDb();
    await db.clear(this.storeName);
  }
}
