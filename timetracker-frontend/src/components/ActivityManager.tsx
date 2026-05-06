import { useState } from "react";

interface ApiData {
    id: string | number;
    name: string;
}

interface Props {
    items: ApiData[];
    onAdd: (name: string) => void;
    onUpdate: (id: string | number, newName: string) => void;
    onDelete: (id: string | number) => void;
}

export function ActivityManager({ items, onAdd, onUpdate, onDelete }: Props) {
    const [newName, setNewName] = useState("");
    const [editId, setEditId] = useState<string | number | null>(null);
    const [editValue, setEditValue] = useState("");

    return (
        <div className="activity-manager">
            <h3>Manage Activities</h3>
            <div className="add-box">
                <input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="New activity..."
                />
                <button onClick={() => { onAdd(newName); setNewName(""); }}>Add</button>
            </div>

            <ul className="activity-list">
                {items.map(item => (
                    <li key={item.id}>
                        {editId === item.id ? (
                            <>
                                <input value={editValue} onChange={(e) => setEditValue(e.target.value)} />
                                <button onClick={() => { onUpdate(item.id, editValue); setEditId(null); }}>Save</button>
                            </>
                        ) : (
                            <>
                                <span>{item.name}:</span>
                                <button onClick={() => { setEditId(item.id); setEditValue(item.name); }}> 🔧</button>

                                <button
                                    onClick={() => { if (window.confirm("Are you sure?")) onDelete(item.id); }}

                                >
                                    🗑️
                                </button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}