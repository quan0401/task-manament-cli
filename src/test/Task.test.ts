import { TaskState } from '~/core/Storage';
import { Task } from '~/core/Task';

// Sample task data
const testData = {
	name: 'a new task',
	state: 'wip',
	description: 'with a description \n with another descriotion',
	id: 0,
	timestamp: '13/10/2024'
	// subtasks: [
	// 	{
	// 		name: 'edit notion',
	// 		state: 'wip',
	// 		description: 'write a note for using this',
	// 		id: 1,
	// 		timestamp: '13/10/2024',
	// 		subtasks: [
	// 			{
	// 				name: 'createToggleList',
	// 				state: 'todo',
	// 				description: 'adding sub-subtask in togglelist',
	// 				id: 4,
	// 				timestamp: '13/10/2024',
	// 				subtasks: [
	// 					{
	// 						name: 'bullet list',
	// 						state: 'todo',
	// 						description: 'create 2 bullet list',
	// 						id: 5,
	// 						timestamp: '13/10/2024'
	// 					}
	// 				]
	// 			}
	// 		]
	// 	}
	// ]
};

export default () => {
	// Create an instance of Task
	const mainTask = new Task(testData);

	// Define available states (example data)
	const availableStates: TaskState[] = [
		{ name: 'todo', hexColor: '#FFA500', icon: '📝' },
		{ name: 'wip', hexColor: '#1E90FF', icon: '🔄' },
		{ name: 'done', hexColor: '#32CD32', icon: '✅' }
	];

	// Define options for stringify method
	// const options = {
	// 	parentIndent: '',
	// 	subTaskLevel: 1,
	// 	isSubTask: true,
	// 	isLastChild: false,
	// 	hideDescription: false,
	// 	depth: undefined,
	// 	hideTimestamp: false,
	// 	hideSubCounter: false,
	// 	hideCompleted: false,
	// 	hideTree: false,
	// 	isLastParent: false
	// };

	const options = {
		parentIndent: '',
		subTaskLevel: 1,
		isSubTask: true,
		isLastChild: false,
		hideDescription: false,
		depth: undefined,
		hideTimestamp: false,
		hideSubCounter: false,
		hideCompleted: false,
		hideTree: false,
		isLastParent: false
	};

	// Use the straightTask method to flatten tasks (optional)
	const allTasks = mainTask.straightTask();
	// console.log('All tasks (flattened):', allTasks);

	// Call the stringify method with available states and options
	const formattedTasks = mainTask.stringify(availableStates, options);

	// Output the formatted tasks
	console.log('Formatted Tasks:');
	// console.log(formattedTasks.join('\n')); // Join with newline for better readability
	console.log(formattedTasks.join('\n')); // Join with newline for better readability
};
