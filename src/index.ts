import { Pool, PoolConfig, QueryConfig } from 'pg';

import { setupDatabase } from './setup-database'

const config = {
	user: 'hans', //env var: PGUSER
	database: 'todoapp', //env var: PGDATABASE
	password: 'dampf', //env var: PGPASSWORD
	host: 'localhost', // Server hosting the postgres database
	port: 9999, //env var: PGPORT
	max: 10, // max number of clients in the pool
	idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};

const pgPool = new Pool(config);

setupDatabase(pgPool).then(() => console.log('EVERYTHING CREATED 🎗'));
