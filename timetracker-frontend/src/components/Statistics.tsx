import { useMemo } from 'react';
//https://react.dev/reference/react/useMemo
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

//Learn React ChartJS in 8 Minutes | Complete Guide
//https://www.youtube.com/watch?v=6q5d3Z1-5kQ

ChartJS.register(ArcElement, Tooltip, Legend);
//https://www.chartjs.org/docs/latest/
//https://react-chartjs-2.js.org källa för användning av chart tillsammans med react.

interface StatsProps {
    sessions: any[];
    categories: any[];
}

export function Statistics({ sessions, categories }: StatsProps) {
    const chartData = useMemo(() => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Filter sessions to only include those from the last 30 days
        const recentSessions = sessions.filter(s => new Date(s.startTime) >= thirtyDaysAgo);

        // Check time spent on each category by summing durations of sessions per category
        const aggregation: Record<string, number> = {};

        recentSessions.forEach(s => {
            // Find the category name for this session, if it still exists
            const category = categories.find(c => c.id === s.categoryId);
            const name = category ? category.name : "Deleted Category";

            const start = new Date(s.startTime).getTime();
            const end = new Date(s.endTime).getTime();
            const durationSeconds = (end - start) / 1000;

            aggregation[name] = (aggregation[name] || 0) + durationSeconds;
        });
        // Display data in a pie chart, with category names as labels and total time spent as values
        //https://www.chartjs.org/docs/latest/general/data-structures.html
        return {
            labels: Object.keys(aggregation),
            datasets: [
                {
                    label: 'Tid i sekunder',
                    data: Object.values(aggregation),
                    backgroundColor: [
                        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
                    ],
                },
            ],
        };
    }, [sessions, categories]);
    // Show a message if there are no sessions in the last 30 days, otherwise show the pie chart
    return (
        <div className="statistics-section" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '20px'
        }}>
            <h2>Statistics (Last 30 Days)</h2>
            <div style={{ width: '100%', maxWidth: '400px' }}>
                {sessions.length > 0 ? (
                    <Pie data={chartData} options={{ maintainAspectRatio: true }} />
                ) : (
                    <p>No data available yet.</p>
                )}
            </div>
        </div>

    );
}