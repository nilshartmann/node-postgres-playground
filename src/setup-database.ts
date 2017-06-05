import { Pool } from 'pg';
import { SQL } from './sql';

const CREATE_SCRIPTS = [
	// ===================== USER    ========================
	`
DROP TABLE IF EXISTS todo_user CASCADE;
CREATE TABLE todo_user (
	id serial PRIMARY KEY,
	login varchar(100) UNIQUE NOT NULL,
	name varchar(100) UNIQUE NOT NULL,
	email varchar(100) UNIQUE NOT NULL
)
`,

	// ===================== PROJECT ========================
	`
DROP TABLE IF EXISTS todo_project CASCADE;
CREATE TABLE todo_project (
	id serial PRIMARY KEY,
	user_id integer REFERENCES todo_user(id) NOT NULL,
	key varchar(10) UNIQUE NOT NULL,
	title varchar(100) NOT NULL,
	description text NOT NULL
)
`,

	// ====================== ACTIVITIY =====================
	`
DROP TABLE IF EXISTS todo_activity CASCADE;

DROP TYPE IF EXISTS todo_activity_state;
CREATE TYPE todo_activity_state AS ENUM ('CREATED', 'STARTED', 'FINISHED');

CREATE TABLE todo_activity (
	id serial PRIMARY KEY,
	title varchar(100) NOT NULL,
	project_id integer REFERENCES todo_project(id) NOT NULL,
	creator_id integer REFERENCES todo_user(id) NOT NULL,
	assignee_id integer REFERENCES todo_user(id) NOT NULL,
	state todo_activity_state NOT NULL
)
`
]

async function createSchema(client: Pool) {
	for (let script of CREATE_SCRIPTS) {
		await client.query(script)
	}
}

export const setupDatabase = async (pgPool: Pool) => {
	const createUser = (login: string, name: string, email: string): Promise<number> => {
		const q = SQL`INSERT INTO todo_user (login, name, email) VALUES (${login}, ${name}, ${email}) RETURNING ID`;
		return pgPool.query(q).then(result => result.rows[0].id)
	}

	const createProject = (key: string, title: string, description: string, userId: number): Promise<number> => {
		const q = SQL`INSERT INTO todo_project (key, title, description, user_id)
		VALUES (${key}, ${title}, ${description}, ${userId}) RETURNING ID`;
		return pgPool.query(q).then(result => result.rows[0].id)
	}

	const createActivity = (title: string, projectId: number, creatorId: number, state: string): Promise<number> => {
		const q = SQL`INSERT INTO todo_activity (title,project_id, creator_id, assignee_id, state)
		VALUES (${title}, ${projectId}, ${creatorId}, ${creatorId}, ${state}) RETURNING ID`;
		return pgPool.query(q).then(result => result.rows[0].id)
	}

	console.log('💾  💾  💾 CREATE DB SCHEMA 💾  💾  💾')
	await createSchema(pgPool);

	const USERS = [
		await createUser('nils', 'Nils', 'nils@nilshartmann.net'),
		await createUser('susi', 'Susi', 'susi@susi.de'),
		await createUser('klaus', 'Klaus', 'info@klaus.de'),
		await createUser('heinz', 'Heinz', 'info@heinz.eu'),
		await createUser('gerd', 'Gerd', 'gerd@mail.com'),
		await createUser('ulla', 'Ulla', 'ulla@ulla.org'),
		await createUser('alex', 'Alex', 'info@alex.de'),
	]
	console.log('USER ID: ', USERS);

	const PROJECTS = [
		await createProject('GQLTALK', 'Create GraphQL Talk', 'Create GraphQL Talk', USERS[0]),
		await createProject('TTBCN', 'Book Trip to Barcelona', 'Organize and book a nice 4-day trip to Barcelona in April', USERS[1]),
		await createProject('CHOUSE', 'Clean the House', 'Its spring time! Time to clean up every room', USERS[2]),
		await createProject('REFAPP', 'Refactor Application', 'We have some problems in our architecture, so we need to refactor it', USERS[0]),
	]
	console.log('PROJECTS: ', PROJECTS);

	const ACTIVITIES = [
		await createActivity('Create a draft story', PROJECTS[0], USERS[0], "STARTED"),
		await createActivity('Finish Example App', PROJECTS[0], USERS[0], "CREATED"),
		await createActivity('Design Slides', PROJECTS[0], USERS[4], "CREATED"),
		await createActivity('Find a flight', PROJECTS[1], USERS[1], "CREATED"),
		await createActivity('Book a hostel', PROJECTS[1], USERS[1], "FINISHED"),
		await createActivity('Clean dining room', PROJECTS[2], USERS[2], "CREATED"),
		await createActivity('Clean kitchen', PROJECTS[2], USERS[2], "CREATED"),
		await createActivity('Empty trash bin', PROJECTS[2], USERS[2], "FINISHED"),
		await createActivity('Clean windows', PROJECTS[2], USERS[2], "STARTED"),
		await createActivity('Discuss problems with all developers', PROJECTS[3], USERS[0], "STARTED"),
		await createActivity('Evaluate GraphQL for API', PROJECTS[3], USERS[5], "STARTED"),
		await createActivity('Re-write tests in Jest', PROJECTS[3], USERS[4], "STARTED"),
		await createActivity('Upgrade NodeJS version', PROJECTS[3], USERS[6], "FINISHED")
	]

	console.log('ACTIVITIES', ACTIVITIES);
}

