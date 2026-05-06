import { useState } from "react";

interface ApiData {
    id: string | number;
    name: string;
}

interface Props {
    items: ApiData[];
    onAdd: (name: string) => void;
    onUpdate: (id: string | number, newName: string) => void;
}

export function ActivityManager({ items, onAdd, onUpdate }: Props) {
    const [newName, setNewName] = useState("");
    const [editId, setEditId] = useState<string | number | null>(null);
    const [editValue, setEditValue] = useState("");

    return (
        <div className="activity-manager">
            <h3>Hantera Aktiviteter</h3>
            <div className="add-box">
                <input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Ny aktivitet..."
                />
                <button onClick={() => { onAdd(newName); setNewName(""); }}>Lägg till</button>
            </div>

            <ul className="activity-list">
                {items.map(item => (
                    <li key={item.id}>
                        {editId === item.id ? (
                            <>
                                <input value={editValue} onChange={(e) => setEditValue(e.target.value)} />
                                <button onClick={() => { onUpdate(item.id, editValue); setEditId(null); }}>Spara</button>
                            </>
                        ) : (
                            <>
                                <span>{item.name}</span>
                                <button onClick={() => { setEditId(item.id); setEditValue(item.name); }}>Ändra</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}