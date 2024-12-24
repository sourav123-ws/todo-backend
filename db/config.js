import pkg from 'pg';
const { Client } = pkg;

export const client = new Client({
    connectionString: "postgresql://neondb_owner:zOalNRG4AD6L@ep-cold-cloud-a5191zb4.us-east-2.aws.neon.tech/neondb?sslmode=require",
  });

export const connectToDB = ()=>{
   try {
    client.connect();
    console.log("Successfully connected to the database");
   } catch (error) {
    console.log("Error connecting to the database",error.message);
   }
}