import { client } from "../db/config.js";

export const createTodo = async (req, res) => {
  try {
    const { task, status , userId} = req.body;

    if (!task || status === undefined) {
      return res.status(400).send("Task and Status are required");
    }

    console.log("Successfully connected to the database");

    const response = await client.query(
      `INSERT INTO todos (task, status,user_id) VALUES ($1, $2 ,$3) RETURNING *;`,
      [task, status , userId]
    );

    console.log("Todo Created Successfully:", response.rows[0]);

    res.status(201).json({
      message: "Todo created successfully",
      todo: response.rows[0],
    });
  } catch (error) {
    console.log("Error creating Todo:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

export const getTodo = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).send("Id is required");
    }
    const response = await client.query(`SELECT * FROM todos WHERE id = $1`, [
      id,
    ]);
    console.log(response);
    if (response.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }
    return res.status(200).json({
      success: true,
      todo: response.rows[0],
    });
  } catch (error) {
    console.log("Something went wrong", error.message);
  }
};

export const getAllTodos = async (req, res) => {
  try {
    const response = await client.query(`SELECT * FROM todos`);
    console.log(response);
    if (response.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }
    return res.status(200).json({
      success: true,
      todo: response.rows,
    });
  } catch (error) {
    console.log("Something went wrong", error.message);
  }
};

export const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).send("Id is required");
    }
    const { task, status } = req.body;
    if (!task || status === undefined) {
      return res.status(400).send("Task and Status are required");
    }
    const response = await client.query(
        `UPDATE todos SET task = $1, status = $2 WHERE id = $3 RETURNING *;`,
        [task, status, id] 
      );

    console.log(response);
    if (!response) {
      return res.status(404).json({
        success: false,
        message: "Todo not Updated",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Todo Updated Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteTodo = async(req,res)=>{
    try {
        const {id} = req.params;
        if(!id){
            return res.status(400).send("Id is required");
        }   
        const response = await client.query(`DELETE FROM todos WHERE id = $1`,[id]);
        if(response.rowCount === 0){
            return res.status(404).json({
                success:false,
                message:"Todo not found"
            });
        }   
        return res.status(200).json({
            success:true,
            message:"Todo Deleted Successfully"
        }); 
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        });       
    }
}

//   try {
//     const response = await client.query(`
//       SELECT 
//         todos.id AS todo_id,
//         todos.task,
//         todos.status,
//         todos.user_id,
//         users.email
//       FROM 
//         todos
//       JOIN 
//         users
//       ON 
//         todos.user_id = users.id;
//     `);

//     if (response.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "No todos found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       todos: response.rows,
//     });
//   } catch (error) {
//     console.error("Error fetching todos with user details:", error.message);
//     res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//     });
//   }
// };

export const getTodosWithUserId =async(req,res)=>{
  try {
    const {id} = req.params;
    console.log(id)
    if(!id){
      return res.status(400).send("UserId is required");
    }
    // const response = await client.query(`SELECT * FROM todos WHERE user_id = $1 FROM users ON users.id = id`,[id]);
    const response = await client.query(
      `
      SELECT 
        todos.id AS todo_id,
        todos.task,
        todos.status,
        todos.user_id,
        users.id AS user_id,
        users.email
      FROM 
        todos
      JOIN 
        users
      ON 
        todos.user_id = users.id
      WHERE 
        users.id = $1;
      `,
      [id]
    );
    if(response.rows.length === 0){
      return res.status(404).json({
        success:false,
        message:"No todos found"
      });
    }
    return res.status(200).json({
      success:true,
      todos:response.rows
    });
  } catch (error) {
    console.log("Error fetching todos with user id:",error.message);
  }
}