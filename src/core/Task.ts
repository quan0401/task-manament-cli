////////////////////////////////////////

export interface ITask {
	name?: string;
	description?: string;
	id?: number;
	subtasks?: ITask[];
	timestamp?: string;
	state?: string;
	priority?: number;
}

////////////////////////////////////////

export class Task implements ITask {}
