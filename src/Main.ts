import taskTest from './test/Task.test';
import taskListTest from './test/TaskList.test';
import storageTest from './test/Storage.test';

// taskTest();
taskListTest();
// storageTest();

// class CustomArray extends Array {
// 	constructor(array: any) {
// 		console.log('Initiating array:', array);
// 		super(...array);
// 	}

// 	// remove(element: any) {
// 	// 	let index = this.indexOf(element);
// 	// 	if (index > -1) {
// 	// 		console.log('hi');
// 	// 		const test = this.splice(index, 1);

// 	// 		console.log('test', test);
// 	// 		return test;
// 	// 	}
// 	// 	return [];
// 	// }
// 	remove(element: any) {
// 		let index = this.indexOf(element);
// 		if (index > -1) {
// 			const newLength = this.length - 1;
// 			while (index < newLength) {
// 				this[index] = this[index + 1];
// 				++index;
// 			}
// 			this.length = newLength;
// 			return [element];
// 		}
// 		return [];
// 	}
// }

// var a = ['a', 'b', 'c', 'd', 'e'];

// var list = new CustomArray(a);
// console.log('list:', list);
// console.log('remove:', list.remove('c'));
// console.log('list:', list);
