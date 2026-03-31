import { Router } from "express";
import pool from "../db.js";

const router=Router();

//CREATE A TODO
router.post("/",async(req,res)=>{
    try{
        const {description,completed}=req.body;
        if(!description){
            return res.status(400).json({ error: "Description is required" });
        }
        const newTodo= await pool.query(
            "INSERT INTO todo (description,completed) VALUES ($1,$2) RETURNING *",
            [description, completed || false]
        );
        res.json(newTodo.rows[0]);//convert provided data into json format and sends it, here it will contain an array of rows returned by query...why 0 because we have inserted only one todo so we want the first element
    }
    catch(err){
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

//GET ALL TODOS
router.get("/",async(req,res)=>{
    try{
        const alltodos= await pool.query("SELECT * FROM todo");
        res.json(alltodos.rows);
    }catch(err){
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

//UPDATE A TODO
router.put("/:id",async(req,res)=>{//the path is a dynamic route parameter, the colon tells express that id is a variable...each todo has a unique id 
try{
        const {id}= req.params;//to get access to the id
        const {description,completed}=req.body;
         if(!description){
            return res.status(400).json({ error: "Description is required" });
        }
        const updatedTodo= await pool.query(
            "UPDATE todo SET description = $1, completed =$2 WHERE todo_id=$3 RETURNING *",
            [description,completed|| false,id]
        );
         if(updatedTodo.rows.length===0){
            return res.status(404).json({ error: "Todo not found" });
        }
        res.json({
            message: "Todo was updated",
            todo: updatedTodo.rows[0]
        });
    }catch(err){
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

//DELETE A TODO
router.delete("/:id",async(req,res)=>{
    try{
        const {id}= req.params;//to get access to the id
       const deletedTodo = await pool.query(
            "DELETE FROM todo WHERE todo_id=$1 RETURNING * ",[id]
        );
         if(deletedTodo.rows.length === 0){
            return res.status(400).json({ error: "Todo not found " });
        }
        res.json("todo was deleted!");
    }catch(err){
        console.error(err.message);
        res.status(500).send("Server Error");
    }
})

export default router;