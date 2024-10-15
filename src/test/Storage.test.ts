import { TaskList } from '~/core/TaskList';
import { Storage } from '~/core/Storage';
import { Task } from '~/core/Task';

const task = {
	name: 'test storage add task',
	state: 'wip',
	description: 'test storage add task',
	timestamp: '13/10/2024'
};

export default () => {
	const storage = new Storage('my-test/tasks.json');
	// storage.addTask(new Task(task));
};
