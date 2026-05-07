import { useState } from "react";

interface ApiData {
    id: string;
    _id?: string;
    name: string;
}

interface Props {
    items: ApiData[];
    onAdd: (name: string) => void;
    onUpdate: (id: string, newName: string) => void;
    onDelete: (id: string) => void;
}
// Component for managing activity categories: add, edit, delete. Used in App.tsx
export function ActivityManager({ items, onAdd, onUpdate, onDelete }: Props) {
    const [newName, setNewName] = useState("");
    const [editId, setEditId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState("");

    const handleAdd = () => {
        if (newName.trim()) {
            onAdd(newName);
            setNewName("");
        }
    };

    return (
        <div className="activity-manager">
            <h3>Handle Categories:</h3>

            {/* Add new category box */}
            <div className="add-box">
                <input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="New category..."
                />
                <button onClick={handleAdd}>Add</button>
            </div>

            <ul className="activity-list">
                {items.map(item => {
                    // Support both 'id' and '_id' as unique identifiers
                    const itemId = item.id || item._id || "";

                    return (
                        <li key={itemId}>
                            {editId === itemId ? (
                                <div className="edit-mode">
                                    <input
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        autoFocus
                                    />
                                    <button onClick={() => { onUpdate(itemId, editValue); setEditId(null); }}>
                                        Save
                                    </button>
                                    <button onClick={() => setEditId(null)}>Cancel</button>
                                </div>
                            ) : (
                                <div className="display-mode">
                                    <span>{item.name}</span>
                                    <div className="actions">
                                        <button
                                            title="Edit"
                                            onClick={() => { setEditId(itemId); setEditValue(item.name); }}
                                        >
                                            🔧
                                        </button>
                                        <button
                                            title="Delete"
                                            onClick={() => { if (window.confirm(`Are you sure you want to delete "${item.name}"?`)) onDelete(itemId); }}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}