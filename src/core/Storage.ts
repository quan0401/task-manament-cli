import { System } from './System';
import { ITask, Task } from './Task';
import { TaskList } from './TaskList';

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
				name: 'in progress',
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

	//////////////////////////////////////////////////

	save = () => System.writeJSONFile(this.relativePath, { meta: this.meta, datas: this.tasks });
}
