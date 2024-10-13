export const handledGroupings = ['state', 'priority', 'id'] as const;
export type GroupByType = (typeof handledGroupings)[number];

export const handleOrder = ['asc', 'desc'] as const;
export type Order = (typeof handleOrder)[number];

////////////////////////////////////////
