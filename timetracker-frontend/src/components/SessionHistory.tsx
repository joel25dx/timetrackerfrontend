//Match the Session and Category interfaces with the backend API structure
interface Session {
    _id?: string;
    id?: string;
    categoryId: string;
    categoryName: string;
    startTime: string;
    endTime: string;
}

interface Category {
    _id?: string;
    id?: string;
    name: string;
}

interface Props {
    sessions: Session[];
    categories: Category[];
    onUpdateSession: (sessionId: string, newCategoryId: string) => void;
}

export function SessionHistory({ sessions, categories, onUpdateSession }: Props) {

    // Calculates the difference between end and start time.
    const formatDuration = (start: string, end: string) => {
        const diffMs = new Date(end).getTime() - new Date(start).getTime();
        const totalSeconds = Math.floor(diffMs / 1000);

        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;

        if (h > 0) return `${h}h ${m}m ${s}s`;
        if (m > 0) return `${m}m ${s}s`;
        return `${s}s`;
    };

    // Converts ISO string to YYYY-MM-DD HH:mm
    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toISOString().replace('T', ' ').substring(0, 16);
    };

    return (
        <div className="history-container">
            <h2>Session History</h2>
            <table className="history-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Category (Edit)</th>
                        <th>Duration</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Show latest sessions first by reversing the array list */}
                    {[...sessions].reverse().map((session) => {
                        const sessionId = session._id || session.id || "";

                        // Check if the sessions category still exists
                        const currentCategoryExists = categories.find(
                            c => (c.id === session.categoryId || c._id === session.categoryId)
                        );

                        return (
                            <tr key={sessionId}>
                                <td className="date-cell">{formatDate(session.startTime)}</td>
                                <td>
                                    {/* Dropdown to change the category of a past session. */}
                                    <select
                                        className="category-edit-select"
                                        value={session.categoryId}
                                        onChange={(e) => onUpdateSession(sessionId, e.target.value)}
                                    >
                                        {/* If the category was deleted, show a placeholder option */}
                                        {!currentCategoryExists && (
                                            <option value={session.categoryId}>Unknown Category</option>
                                        )}

                                        {/* All available categories */}
                                        {categories.map((cat) => (
                                            <option key={cat._id || cat.id} value={cat._id || cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td className="duration-cell">
                                    {formatDuration(session.startTime, session.endTime)}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

//https://react.dev/learn/sharing-state-between-components