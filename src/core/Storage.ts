import { TaskNotFoundError } from '~/errors/TaskErrors';
import { System } from './System';
import { ITask, Task } from './Task';
import { GroupByType, Order, TaskList } from './TaskList';
import { FileAlreadyExistError } from '~/errors/FileErrors';

export const DEFAULT_STORAGE_FILE_NAME = 'tasks.json';
export const DEFAULT_STORAGE_DATAS: StorageFile = {
	meta: {
		states: [
			{
				name: 'todo',
				hexColor: '#ff8f00',
				icon: '📋'
			},
			{
				name: 'wip',
				hexColor: '#ab47bc',
				icon: '🔄'
			},
			{
				name: 'done',
				hexColor: '#66bb6a',
				icon: '✅'
			}
		]
	},
	datas: [
		{
			name: 'Add more task',
			description: "Run 'task d 0' to delete me or 'task c 0' to check me",
			state: 'todo',
			id: 0
		}
	]
};

////////////////////////////////////////

export interface Meta {
	states: TaskState[];
}

export interface TaskState {
	name: string;
	hexColor: string;
	icon: string;
}

export interface StorageFile {
	meta: Meta;
	datas: ITask[];
}

////////////////////////////////////////

/**
 * Expose and handle tasks datas and meta_datas
 */

export class Storage {
	relativePath: string;

	tasks: TaskList;
	meta: Meta;

	//////////////////////////////////////////////////

	/**
	 *
	 * relativePath starts from cwd
	 */
	constructor(relativePath: string) {
		this.relativePath = relativePath;

		const { meta, datas } = System.readJSONFile(this.relativePath) as StorageFile;
		this.tasks = new TaskList(datas);
		this.meta = meta;
	}

	//////////////////////////////////////////////////

	addTask = (task: Task, subTaskOf?: number) => {
		const id = this.tasks.addTask(task, subTaskOf);
		this.save();
		return id;
	};

	editTask = (taskId: number[], newAttributres: ITask, isRecursive?: boolean) => {
		const id = this.tasks.editTask(taskId, newAttributres, isRecursive);
		this.save();
		return id;
	};

	incrementTask = (tasksID: number[], meta: Meta, isRecursive?: boolean) => {
		const id = this.tasks.incrementTask(tasksID, this.meta, isRecursive);
		this.save();
		return id;
	};

	deleteTask = (taskID: number[]): Task[] => {
		const id = this.tasks.deleteTask(taskID);
		this.save();
		return id;
	};

	moveTask = (tasksID: number[], subTaskOf: number) => {
		const id = this.tasks.moveTask(tasksID, subTaskOf);
		this.save();
		return id;
	};

	group = (groupBy: GroupByType = 'state') => this.tasks.group(groupBy, this.meta);

	order = (order: Order) => order === 'desc' && this.tasks.reverse();

	get = (id: number): Task => {
		let toReturn: Task | undefined = undefined;

		this.tasks.retrieveTask(id, ({ task }) => (toReturn = task));

		if (toReturn === undefined) throw new TaskNotFoundError(id);

		return toReturn;
	};

	//////////////////////////////////////////////////

	save = () => System.writeJSONFile(this.relativePath, { meta: this.meta, datas: this.tasks });
}

//////////////////////////////////////////////////

export const StorageFactory = {
	init: (relativePath: string): Storage => {
		if (System.doesFileExists(relativePath)) throw new FileAlreadyExistError(relativePath);
		System.writeJSONFile(relativePath, DEFAULT_STORAGE_DATAS);

		return new Storage(relativePath);
	},

	// extract tasks from one file to another file
	extract: (newFilePath: string, originStorage: Storage, tasks: Task[]): Storage => {
		if (System.doesFileExists(newFilePath)) throw new FileAlreadyExistError(newFilePath);
		const newFile: StorageFile = {
			meta: originStorage.meta,
			datas: tasks
		};

		System.writeJSONFile(newFilePath, newFile);

		tasks.forEach((task) => originStorage.deleteTask([task.id!]));

		return new Storage(newFilePath);
	}
};
