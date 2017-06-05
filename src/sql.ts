import { QueryConfig } from 'pg';

export type SqlValue = string | number;

// https://github.com/brianc/node-postgres/wiki/Parameterized-queries-and-Prepared-Statements#parameters-and-es6-template-strings
export function SQL(parts: TemplateStringsArray, ...values: any[]): QueryConfig {
	return {
		text: parts.reduce((prev, curr, i) => prev + "$" + i + curr),
		values
	};
}
