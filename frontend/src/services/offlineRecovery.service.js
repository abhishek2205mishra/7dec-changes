class OfflineRecoveryService {
    constructor() {
        this.dbName = 'VirtualMeetDB';
        this.dbVersion = 1;
        this.db = null;
        this.init();
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                if (!db.objectStoreNames.contains('meetingStates')) {
                    const meetingStore = db.createObjectStore('meetingStates', { keyPath: 'meetingCode' });
                    meetingStore.createIndex('timestamp', 'timestamp', { unique: false });
                }

                if (!db.objectStoreNames.contains('chatMessages')) {
                    const chatStore = db.createObjectStore('chatMessages', { keyPath: 'id', autoIncrement: true });
                    chatStore.createIndex('meetingCode', 'meetingCode', { unique: false });
                    chatStore.createIndex('timestamp', 'timestamp', { unique: false });
                }

                if (!db.objectStoreNames.contains('connectionLogs')) {
                    const logStore = db.createObjectStore('connectionLogs', { keyPath: 'id', autoIncrement: true });
                    logStore.createIndex('meetingCode', 'meetingCode', { unique: false });
                    logStore.createIndex('timestamp', 'timestamp', { unique: false });
                }
            };
        });
    }

    async saveMeetingState(meetingCode, state) {
        const transaction = this.db.transaction(['meetingStates'], 'readwrite');
        const store = transaction.objectStore('meetingStates');
        
        const meetingState = {
            meetingCode,
            ...state,
            timestamp: new Date().toISOString()
        };

        return new Promise((resolve, reject) => {
            const request = store.put(meetingState);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getMeetingState(meetingCode) {
        const transaction = this.db.transaction(['meetingStates'], 'readonly');
        const store = transaction.objectStore('meetingStates');

        return new Promise((resolve, reject) => {
            const request = store.get(meetingCode);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async saveChatMessage(meetingCode, message) {
        const transaction = this.db.transaction(['chatMessages'], 'readwrite');
        const store = transaction.objectStore('chatMessages');

        const chatMessage = {
            meetingCode,
            ...message,
            timestamp: new Date().toISOString(),
            synced: false
        };

        return new Promise((resolve, reject) => {
            const request = store.add(chatMessage);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getChatMessages(meetingCode) {
        const transaction = this.db.transaction(['chatMessages'], 'readonly');
        const store = transaction.objectStore('chatMessages');
        const index = store.index('meetingCode');

        return new Promise((resolve, reject) => {
            const request = index.getAll(meetingCode);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async markMessagesSynced(meetingCode) {
        const transaction = this.db.transaction(['chatMessages'], 'readwrite');
        const store = transaction.objectStore('chatMessages');
        const index = store.index('meetingCode');

        return new Promise((resolve, reject) => {
            const request = index.openCursor(meetingCode);
            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    const message = cursor.value;
                    message.synced = true;
                    cursor.update(message);
                    cursor.continue();
                } else {
                    resolve();
                }
            };
            request.onerror = () => reject(request.error);
        });
    }

    async logConnection(meetingCode, event, details = {}) {
        const transaction = this.db.transaction(['connectionLogs'], 'readwrite');
        const store = transaction.objectStore('connectionLogs');

        const log = {
            meetingCode,
            event,
            details,
            timestamp: new Date().toISOString()
        };

        return new Promise((resolve, reject) => {
            const request = store.add(log);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getConnectionLogs(meetingCode) {
        const transaction = this.db.transaction(['connectionLogs'], 'readonly');
        const store = transaction.objectStore('connectionLogs');
        const index = store.index('meetingCode');

        return new Promise((resolve, reject) => {
            const request = index.getAll(meetingCode);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async clearMeetingData(meetingCode) {
        const stateTransaction = this.db.transaction(['meetingStates'], 'readwrite');
        const stateStore = stateTransaction.objectStore('meetingStates');
        await new Promise((resolve, reject) => {
            const request = stateStore.delete(meetingCode);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });

        const chatTransaction = this.db.transaction(['chatMessages'], 'readwrite');
        const chatStore = chatTransaction.objectStore('chatMessages');
        const chatIndex = chatStore.index('meetingCode');
        await new Promise((resolve, reject) => {
            const request = chatIndex.openCursor(meetingCode);
            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    cursor.delete();
                    cursor.continue();
                } else {
                    resolve();
                }
            };
            request.onerror = () => reject(request.error);
        });
    }

    async getUnsyncedMessages(meetingCode) {
        const messages = await this.getChatMessages(meetingCode);
        return messages.filter(msg => !msg.synced);
    }
}

export default new OfflineRecoveryService();
