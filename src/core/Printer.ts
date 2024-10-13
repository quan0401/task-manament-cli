import { GroupByType, Order } from './TaskList';

export interface PrinterConfig {
	shouldNotPrintAfter?: boolean;
	hideDescription?: boolean;
	hideTimestamp?: boolean;
	hideSubCounter?: boolean;
	hideTree?: boolean;
	hideCompleted?: boolean;
	clearBefore?: boolean;

	depth?: number;
	group?: GroupByType;
	sort?: Order;
}

export interface ViewParams {
	view: ViewType;
	target?: ViewTargetType;
}

type ViewType = 'full' | 'specific';
type ViewTargetType = string | string[] | number | number[];

/**
 *
 */
export class Printer {
	private feedback: string[];
	private viewParams: ViewParams;

	// private storage: Storage;
	private config?: PrinterConfig;
}
