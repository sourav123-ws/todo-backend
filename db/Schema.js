import { client } from "./config.js";

export const createTodo = async () => {
  try {
    console.log("Connecting to the database...");
    await client.connect();

    console.log("Successfully connected to the database");

    const response = await client.query(`
      CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY,
        task VARCHAR(255) NOT NULL,
        status BOOLEAN NOT NULL DEFAULT false,
        user_id INTEGER REFERENCES users(id)
      );
    `);
    console.log("Todo Table Created Successfully:", response.command);
  } catch (error) {
    console.log("Error creating Todo Table:", error.message);
  } finally {
    console.log("Closing database connection...");
    await client.end();
    console.log("Database connection closed");
  }
};

createTodo().catch((err) => {
  console.error("Unexpected error in createTodo:", err.message);
});

export const createUserTable = async (req, res) => {
  try {
    const response = await client.query(`
            CREATE TABLE users(
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) NOT NULL ,
            password VARCHAR(255) NOT NULL
            )`);
    console.log("User Table Created Successfully:", response.command);
  } catch (error) {
    console.log("Error creating User Table:", error.message);
  }
};

// createUserTable().catch((err)=>{
//     console.error("Unexpected error in createUserTable:",err.message);
// })