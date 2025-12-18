// js/db.js
const DB_NAME = 'DesignEaseDB';
const STORE_NAME = 'designs';
const DB_VERSION = 1;

const DB = {
    async open() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);
            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME, { keyPath: 'id' });
                }
            };
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    async saveDesign(design) {
        const db = await this.open();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);
            
            // Ensure ID and timestamp
            design.updatedAt = new Date().toISOString();
            if(!design.id) design.id = 'design_' + Date.now();
            
            store.put(design);
            tx.oncomplete = () => resolve(design.id);
            tx.onerror = () => reject(tx.error);
        });
    },

    async getAllDesigns() {
        const db = await this.open();
        return new Promise((resolve) => {
            const tx = db.transaction(STORE_NAME, 'readonly');
            const store = tx.objectStore(STORE_NAME);
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result.reverse()); // Newest first
        });
    },

    async getDesign(id) {
        const db = await this.open();
        return new Promise((resolve) => {
            const tx = db.transaction(STORE_NAME, 'readonly');
            const store = tx.objectStore(STORE_NAME);
            const request = store.get(id);
            request.onsuccess = () => resolve(request.result);
        });
    },

    async deleteDesign(id) {
        const db = await this.open();
        return new Promise((resolve) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);
            store.delete(id);
            tx.oncomplete = () => resolve();
        });
    }
};