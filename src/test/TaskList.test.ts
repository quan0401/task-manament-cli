import moment from 'moment';
import { TaskList } from '~/core/TaskList';

// Sample task data
const testData = [
	{
		name: 'a new task',
		state: 'done',
		description: 'with a description',
		id: 0,
		timestamp: '13/10/2024',
		subtasks: [
			{
				name: 'sub',
				state: 'todo',
				description: 'sub task',
				id: 1,
				timestamp: '14/10/2024',
				subtasks: [
					{
						name: 'subsub',
						state: 'todo',
						description: 'subsub task',
						id: 5,
						timestamp: '14/10/2024'
					}
				]
			},
			{
				name: 'sub1',
				state: 'todo',
				description: 'sub1 task',
				id: 4,
				timestamp: '14/10/2024',
				subtasks: [
					{
						name: 'subsub1',
						state: 'todo',
						description: 'subsub1 task',
						id: 6,
						timestamp: '14/10/2024'
					}
				]
			}
		]
	},
	{
		name: 'task 2',
		state: 'wip',
		description: 'with a description 1234',
		id: 2,
		timestamp: '13/10/2024'
	},
	{
		name: 'task 3',
		state: 'wip',
		description: 'with a description3',
		id: 3,
		timestamp: '13/10/2024'
	}
];
export default () => {
	const taskList = new TaskList(testData); // console.log(taskList[0].straightTask());
	taskList.deleteTask([1]);

	// taskList.deleteTask([5, 4, 6]);

	// console.log(
	// 	taskList.forEach((task) => {
	// 		console.log(task.straightTask());
	// 	})
	// );
};
