require('dotenv').config()

const express = require('express');
const router = express.Router()
const User = require('../../models/User')
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwtToken = require('jsonwebtoken')

const checkRegist = [
    check('login', 'Некоректный login').isLength({ min: 4 }),
    check('password', 'Некоректный пароль').isLength({ min: 6 })
]

router.post('/registration', checkRegist, async (req, res) => {
    try {
        console.log(req.body)
        const { login, name, password } = req.body


        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                msg: "Некоректные данные при регистрации"
            })
        }


        const isUsed = await User.findOne({ login })
        if (isUsed) {
            return res.status(300).json({ msg: "Данный login уже занят, попробуйте другой!" })
        }

        const hashedPassword = await bcrypt.hash(password, 12)
        console.log(hashedPassword)

        const user = new User({
            login, name, password: hashedPassword
        })
        await user.save()
        res.status(201).json({ msg: 'Пользователь создан' })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ msg: "Ощибка сервера" })
    }
})

const checkLogin = [
    check('login', 'Некоректный login').exists(),
    check('password', 'Некоректный пароль').exists()
]

router.post('/login', checkLogin, async (req, res) => {
    try {

        const { login, password } = req.body

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                msg: "Некоректные данные при регистрации"
            })
        }

        //Поиск User
        const user = await User.findOne({ login })

        //Проверка если нет такого User
        if (!user) {
            return res.status(400).json({ msg: 'Такого login нет!' })
        }

        //Розшифровка пароля
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({ msg: 'Не верный пароль!' })
        }

        //Секретный токен
        const jwtSecret = process.env.JWT_SECRET

        //Создание секретного токена
        const token = jwtToken.sign(
            { userId: user.id },
            jwtSecret,
            { expiresIn: '10h' }
        )

        res.json({
            token, name: user.name,
            userId: user.id,
            login: user.login,
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ msg: "Ощибка сервера" })
    }
})

module.exports = router;
