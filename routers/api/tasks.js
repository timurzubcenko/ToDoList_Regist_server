const express = require('express');
const router = express.Router()
const Task = require('../../models/Task')

router.post('/add', async (req, res) => {
    try {
        const { description, login } = req.body

        const task = await new Task({
            description,
            login: login,
            done: false
        })

        await task.save()
        res.json(task)
    }
    catch (err) {
        console.log(err)
    }
})

router.get('/', async (req, res) => {
    try {
        const { userId } = req.query

        const task = await Task.find({ login: userId })

        res.json(task)
    }
    catch (err) {
        console.log(err)
    }
})

router.delete('/delete/:id', async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id })

        res.json(task)
    }
    catch (err) {
        console.log(err)
    }
})

router.put('/done/:id', async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id })

        task.done = !task.done

        await task.save()
        res.json(task)

    } catch (err) {
        console.log(err)
    }
})

module.exports = router