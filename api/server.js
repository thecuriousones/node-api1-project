// BUILD YOUR SERVER HERE
const express = require("express")
const User = require("./users/model.js")

const server = express()
server.use(express.json())

// ENDPOINTS
// [GET] /api/users (R of CRUD, fetch all user)
server.get("/api/users", (req,res)=>{
    User.find()
        .then(users =>{
            console.log(users)
            res.status(200).json(users)
        })
        .catch(err=>{
            res.status(500).json({message: "The users information could not be retrieved"})
        })
})

// [GET] /api/users/:id (R of CRUD, fetch user by :id)
server.get("/api/users/:id", (req,res)=>{
    const idVar = req.params.id
    User.findById(idVar)
        .then(user =>{
            if(!user){
                res.status(404).json({message: "The user with the specified ID does not exist"})
            }else{
                res.json(user)
            }
        })
        .catch(err=>{
            res.status(500).json({ message: "The user information could not be retrieved" })
        })
})

// [POST] /api/users (C of CRUD, create new user from JSON payload)
server.post("/api/users", (req,res)=>{
    const newUser = req.body
    if(!newUser.name || !newUser.bio){
        res.status(400).json({ message: "Please provide name and bio for the user" })
    }else{
        User.insert(newUser)
            .then(user =>{
                res.status(201).json(user)
            })
            .catch(err=>{
                res.status(500).json({message:"There was an error while saving the user to the database"})
            })
    }
})

// [PUT] /api/users/:id (U of CRUD, update user with :id using JSON payload)
server.put("/api/users/:id", async (req,res)=>{
    const {id} = req.params
    const changes = req.body
    try{
        if(!changes.name || !changes.bio){
            res.status(400).json({ message: "Please provide name and bio for the user" })
        }else{
            const updatedUser = User.update(id, changes)
            if(!updatedUser){
                res.status(404).json({ message: "The user with the specified ID does not exist" })
            }else{
                res.status(200).json(updatedUser)
            }
        }
    }catch(err){
        res.status(500).json({ message: "The user information could not be modified" })
    }
})

// [DELETE] /api/users/:id (D of CRUD, remove user with :id)
server.delete("/api/users/:id", async (req,res)=>{
    try{
        const {id} = req.params
        const deleltedUser = await User.remove(id)
        if(!deleltedUser){
            res.status(404).json({message: "The user with the specified ID does not exist"})
        }else{
            res.status(200).json(deleltedUser)
        }
    }catch(err){
        res.status(500).json({ message: "The user could not be removed" })
    }
})

// Error Page
server.use("*",(req,res)=>{
    res.status(404).json({message:"Oops, wrong turn :("})
})

module.exports = server; // EXPORT YOUR SERVER instead of {}
