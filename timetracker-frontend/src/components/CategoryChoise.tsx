interface Props {
    items: any[];
    selectedId: string;
    onSelect: (id: string) => void;
    disabled: boolean;
}
// Simple dropdown for category selection, used in App.tsx
export function CategoryChoice({ items, selectedId, onSelect, disabled }: Props) {
    return (
        <select
            value={selectedId}
            onChange={(e) => onSelect(e.target.value)}
            disabled={disabled}
        >
            <option value="">Choose activity...</option>
            {items.map(i => (
                <option key={i.id} value={i.id}>{i.name}</option>
            ))}
        </select>
    );
}