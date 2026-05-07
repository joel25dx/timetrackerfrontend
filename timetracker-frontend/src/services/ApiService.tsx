const BASE_URL = 'https://timetracker-e87sw.ondigitalocean.app';

//ALL HANDLERS MOVED TO API SERVICE, ALL COMPONENTS CALL THIS INSTEAD

export const apiService = {
    // CATEGORIES 
    async getCategories() {
        const res = await fetch(`${BASE_URL}/categories`);
        if (!res.ok) throw new Error('Could not fetch categories');
        return res.json();
    },
    // Create a new category with the given name
    async createCategory(name: string) {
        const res = await fetch(`${BASE_URL}/categories/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name }),
        });
        return res.json();
    },
    // Update the name of an existing category by ID
    async updateCategory(id: string, name: string) {
        const res = await fetch(`${BASE_URL}/categories/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name }),
        });
        return res.json();
    },
    // Delete a category by ID
    async deleteCategory(id: string) {
        const res = await fetch(`${BASE_URL}/categories/${id}`, {
            method: 'DELETE',
        });
        if (!res.ok) throw new Error('Could not delete category');
    },

    //  SESSIONS

    async getAllSessions() {
        const res = await fetch(`${BASE_URL}/session`);
        if (!res.ok) throw new Error('Could not fetch sessions');
        return res.json();
    },
    // Create a new session with the provided data (category, start/end time)
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
    },
    // Update the category of an existing session by session ID
    async updateSession(sessionId: string, categoryId: string, categoryName: string) {
        const res = await fetch(`${BASE_URL}/session/${sessionId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ categoryId, categoryName }),
        });
        if (!res.ok) throw new Error('Could not update session');
        return res.json();
    }
};


