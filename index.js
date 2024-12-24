import express, { urlencoded } from 'express';
import { connectToDB } from './db/config.js';
import { createTodo, deleteTodo, getAllTodos, getTodo , getTodosWithUserId, updateTodo } from './controllers/todo.js';
import { createUser, loginUser, logout } from './controllers/user.js';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { isAuthenticated } from './middleware/auth.js';
dotenv.config();
const app = express();
const PORT = 4000 ;

app.use(cookieParser());
app.use(express.json());
app.use(urlencoded({extended:true}));

connectToDB();

app.post("/create", isAuthenticated ,createTodo);
app.get("/get/:id",getTodo);
app.get("/getAll",getAllTodos);
app.put("/update/:id", isAuthenticated ,updateTodo);
app.delete("/delete/:id", isAuthenticated ,deleteTodo);
app.get("/getTodosWithUserId/:id",getTodosWithUserId);



app.post("/createUser",createUser);
app.post("/loginUser",loginUser);
app.post("/logout",logout);
// app.post("/createUser",createUser);


app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
});
