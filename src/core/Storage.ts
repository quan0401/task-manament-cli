import { ITask } from './Task';

export const DEFAULT_STORAGE_DATAS: StorageFile = {
	meta: {
		states: [
			{
				name: 'todo',
				hexColor: '#ff8f00',
				icon: '†'
			},
			{
				name: 'in progress',
				hexColor: '#ab47bc',
				icon: '✹'
			},
			{
				name: 'done',
				hexColor: '#66bb6a',
				icon: '✔'
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
