const express = require('express')
const router = express.Router();

const Student = require('../models/student.model')
const verifySupabase = require('../middleware/verifySupabase');

//GET: List
router.get('/', async (req,res) => {
    try{
        const students = await Student.find();
        res.status(200).json(students);
    }
    catch(error){
        res.status(500).json({message: "An Error Occured", error: error});
    }
})

//GET: By Id
router.get('/:id', async (req,res) => {
    try{
        const id = req.params.id;
        const student = await Student.findOne({_id: id})
        res.status(200).json(student);
    }
    catch(error){
        res.status(500).json({message: "An Error Occured", error: error});
    }
})

//POST: create
router.post('/', verifySupabase, async (req,res) => {
    try{
        const student = new Student(req.body);
        const savedStudent = await student.save();
        res.status(200).json(savedStudent)
    }
    catch(error){
        res.status(500).json({message: "An Error Occured", error: error});
    }
})

//PUT: Update
router.put('/:id', verifySupabase, async (req,res) => {
    try{
            const id = req.params.id;
            const student = req.body;
            const updatedDstudent = await Student.findOneAndUpdate(
                {
                    _id: id
                },
                {
                    $set: student
                },
                {
                    new: true
                }
            );
            res.status(200).json(updatedDstudent);
    }
    catch(error){
        res.status(500).json({message: "An Error Occured", error: error});
    }
})

//DELETE: remove student
router.delete('/:id', verifySupabase, async (req,res) => {
    try{
        const id = req.params.id;
        const deletedStudent = await Student.deleteOne({_id:id});
        res.status(200).json(deletedStudent);
    }
    catch(error){
        res.status(500).json({message: "An Error Occured", error: error});
    }
})

module.exports = router;