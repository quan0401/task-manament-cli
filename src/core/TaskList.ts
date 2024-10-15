import chalk from 'chalk';
import moment from 'moment';
import { ITask, Task, TIMESTAMP_FORMAT } from './Task';
import { NotFutherStateError, TaskIdDuplicatedError, TaskNotFoundError, TaskStateUnknownError } from '~/errors/TaskErrors';
import { Meta } from './Storage';

////////////////////////////////////////

export const handledGroupings = ['state', 'priority', 'id'] as const;
export type GroupByType = (typeof handledGroupings)[number];

export const handleOrder = ['asc', 'desc'] as const;
export type Order = (typeof handleOrder)[number];

////////////////////////////////////////

interface RetrieveTaskCallback {
	task: Task;
	taskIndex?: number;
	parentTask: Task | undefined;
}

////////////////////////////////////////

export class TaskList extends Array<Task> {
	allIDs: number[];

	constructor(items?: ITask[]) {
		super();

		this.allIDs = [];

		items && this.push(...items.map((item) => new Task(item)));
	}

	//////////

	/** @see: https://stackoverflow.com/questions/49349195/using-splice-method-in-subclass-of-array-in-javascript -> Exact same problem
	 * only remove from allIDs[], not delete the object itself
	 */

	private remove = (task: Task) => {
		const idIndex = this.allIDs.findIndex((anId) => anId === task.id);
		this.allIDs.splice(idIndex, 1);

		let index = this.indexOf(task);

		if (index > -1) {
			const newLength = this.length - 1;
			while (index < newLength) {
				this[index] = this[index + 1];
				++index;
			}
			this.length = newLength;
			return [task];
		}
		return [];
	};

	/** @override */
	push = (...tasks: Task[]) => {
		tasks.forEach((task: Task) => {
			// get all subtasks IDs and the task it self
			const containedIDs = task.straightTask().map((within) => within.id as number);

			containedIDs.forEach((id) => {
				if (this.allIDs.includes(id)) throw new TaskIdDuplicatedError(id);
				else this.allIDs.push(id);
			});

			super.push(task);
		});
		return this.length;
	};

	addTask(task: Task, subTaskOf?: number) {
		const createUniqueId = (): number => {
			const maxInArray = Math.max(...this.allIDs);

			if (maxInArray === this.allIDs.length - 1) return this.allIDs.length;
			else {
				let id = 0;
				while (this.allIDs.includes(id)) id++;
				return id;
			}
		};

		const taskID = task.id && !this.allIDs.includes(task.id) ? task.id : createUniqueId();

		task.id = taskID;
		task.timestamp = moment().format(TIMESTAMP_FORMAT);

		// add subtask for parent task
		if (subTaskOf !== undefined) {
			this.retrieveTask(subTaskOf, ({ task: parent }) => {
				if (parent.subtasks === undefined) parent.subtasks = [task];
				else parent.subtasks = [...parent.subtasks, task];

				this.allIDs.push(taskID);
			});
		} else this.push(task);
		return taskID;
	}

	editTask(taskId: number[], newAttributres: ITask, isRecursive?: boolean) {
		taskId.forEach((id) => {
			this.retrieveTask(id, ({ task }) => {
				const impactedTasks = isRecursive ? task.straightTask() : [task];

				for (const [k, v] of Object.entries(newAttributres))
					impactedTasks.forEach((aTask) => {
						(aTask as any)[k] = v;
					});
			});
		});

		return taskId;
	}

	incrementTask(tasksID: number[], meta: Meta, isRecursive?: boolean) {
		const { states } = meta;
		const statesNames = states.map((state) => state.name);

		const handleIncrement = (task: Task) => {
			const currentStateIndex = statesNames.indexOf(task.state!);

			if (currentStateIndex === -1) throw new TaskStateUnknownError(task.id!, task.state!);

			if (currentStateIndex < statesNames.length - 1) this.editTask([task.id!], { state: statesNames[currentStateIndex + 1] }, isRecursive);
			else throw new NotFutherStateError(task.id!);
		};

		tasksID.forEach((id) => {
			this.retrieveTask(id, ({ task }) => {
				handleIncrement(task);
			});
		});
	}

	// TODO FIXME:
	deleteTask(taskId: number[]) {
		let removeTasks: Task[] = [];

		//////////

		taskId.forEach((id) => {
			let wasTaskFound = false;
			this.retrieveTask(id, ({ task, parentTask }) => {
				if (task !== undefined && task.id === id) {
					wasTaskFound = true;
					if (parentTask !== undefined) {
						const taskIndex = parentTask.subtasks!.findIndex((task_) => task_.id === id);
						const removedTask = parentTask.subtasks!.splice(taskIndex, 1);
						removeTasks.push(...removedTask);

						// remove subtasks field if there is not subtask left
						if (parentTask.subtasks!.length === 0) delete parentTask.subtasks;
					} else removeTasks.push(task);
				}
			});
			if (!wasTaskFound) throw new TaskNotFoundError(id);
		});

		//////////

		// remove the task and their subtasks if exists
		// rm from the bottom up mean remove all subtask then parentTask
		this.traverseGivenTasks(removeTasks, ({ task }) => {
			this.remove(task!);
		});
	}

	moveTask(tasksID: number[], subTaskOf: number) {
		tasksID.forEach((id) =>
			this.retrieveTask(id, ({ task }) => {
				this.deleteTask([id]);

				this.addTask(task, subTaskOf);
			})
		);
	}

	/**
	 *
	 * @throws {TaskNotFoundError}
	 */
	// Already FIXME: the second subtask, will return undefined parentTask (if the first subtask)
	retrieveTask(taskID: number, callback: (cbParams: RetrieveTaskCallback) => void) {
		let wasTaskFound = false;

		const iter = (tasks: Task[], parentTask: Task | undefined) => {
			for (let i = 0; i < tasks.length; i++) {
				const currentTask = tasks[i];

				if (currentTask.id === taskID) {
					wasTaskFound = true;
					return callback({ task: currentTask, parentTask });
				}

				if (Array.isArray(currentTask.subtasks)) {
					// Pass the current task as the parent to the next level of subtasks
					iter(currentTask.subtasks, currentTask);
				}
			}
		};

		iter(this, undefined);

		if (!wasTaskFound) throw new TaskNotFoundError(taskID);
	}

	traverseGivenTasks(tasks: Task[], callback: (cbParams: Partial<RetrieveTaskCallback>) => void) {
		const iter = (tasks: Task[]) => {
			for (let i = 0; i < tasks.length; i++) {
				const currentTask = tasks[i];

				if (Array.isArray(currentTask.subtasks)) {
					// Pass the current task as the parent to the next level of subtasks
					iter(currentTask.subtasks);
				}
				callback({ task: currentTask });
			}
		};

		iter(tasks);
	}
}
