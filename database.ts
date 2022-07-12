import dotenv from "dotenv";
// import pg from "pg";
dotenv.config();

// const { Pool } = pg;
// export const connection = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });

import pg from 'pg';

const { Pool } = pg;

const databaseConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
}

const connection = new Pool(databaseConfig);

export default connection;