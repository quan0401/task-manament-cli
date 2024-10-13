import { PrinterConfig } from './Printer';
import { GroupByType, Order } from './TaskList';

export const DEFAULT_CONFIG_FILE_NAME = 'task.config.json';

export interface ConfigFile extends PrinterConfig {
	storageFile?: string;
	configFile?: string;

	/////

	// shouldNotPrintAfter?: boolean;
	// hideDescription?: boolean;
	// hideTimestamp?: boolean;
	// hideSubCounter?: boolean;
	// hideTree?: boolean;
	// hideCompleted?: boolean;
	// clearBefore?: boolean;

	// depth?: number;
	// group?: GroupByType;
	// sort?: Order;
}
