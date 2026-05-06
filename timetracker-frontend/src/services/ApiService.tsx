const BASE_URL = 'https://timetracker-e87sw.ondigitalocean.app';

//ALL HANDLERS MOVED TO API SERVICE, ALL COMPONENTS CALL THIS INSTEAD

export const apiService = {
    // CATEGORIES 
    async getCategories() {
        const res = await fetch(`${BASE_URL}/categories`);
        if (!res.ok) throw new Error('Could not fetch categories');
        return res.json();
    },

    async createCategory(name: string) {
        const res = await fetch(`${BASE_URL}/categories/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name }),
        });
        return res.json();
    },

    async updateCategory(id: string, name: string) {
        const res = await fetch(`${BASE_URL}/categories/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name }),
        });
        return res.json();
    },

    async deleteCategory(id: string) {
        const res = await fetch(`${BASE_URL}/categories/${id}`, {
            method: 'DELETE',
        });
        if (!res.ok) throw new Error('Could not delete category');
    },

    //  SESSIONS
    async createSession(sessionData: {
        categoryId: string;
        categoryName: string;
        startTime: string;
        endTime: string;
    }) {
        const res = await fetch(`${BASE_URL}/session/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sessionData),
        });
        if (!res.ok) throw new Error('Could not save session');
        return res.json();
    }
};