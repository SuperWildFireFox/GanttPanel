import 'frappe-gantt/dist/frappe-gantt.css';
import Gantt from 'frappe-gantt';

const tasks = [
    {
        id: 'Task 1',
        name: 'Redesign website',
        start: '2023-09-01',
        end: '2023-09-05',
        progress: 20,
        dependencies: ''
    },
    {
        id: 'Task 2',
        name: 'Develop Backend',
        start: '2023-09-06',
        end: '2023-09-10',
        progress: 50,
        dependencies: 'Task 1'
    }
];

new Gantt("#gantt", tasks);
