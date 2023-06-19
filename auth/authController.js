const User = require('../models/User')
const Role = require('../models/Role')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {secret} = require("./config")
const Post = require('../models/post');
const express = require('express');
const fs = require('fs');

const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());

const generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles
    }
    return jwt.sign(payload, secret, {expiresIn: "24h"} )
}

class authController {
    async registration(req, res) {
        try {
            const {username, password} = req.body;
            if (username.length < 2 || username.length > 20) 
                return res.status(400).json({message: "Количество символов в имени должно быть от 2 до 20"})
            if (password.length < 2 || password.length > 20) 
                return res.status(400).json({message: "Количество символов в пароле должно быть от 6 до 20"})
            const candidate = await User.findOne({username})
            if (candidate) {
                return res.status(400).json({message: 'Пользователь ' + username + ' уже существует'})
            }
            const hashPassword = bcrypt.hashSync(password, 7);
            const userRole = await Role.findOne({value: "USER"})
            const user = new User({username, password: hashPassword, roles: [userRole.value]})
            await user.save()
            return res.json({message: "Пользователь успешно зарегистрирован"})
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Registration error'})
        }
    }

    async login(req, res) {
        try {
            const {username, password} = req.body
            console.log(username, password);
            const user = await User.findOne({username})
            if (!user) {
                console.log({message: `Пользователь ${username} не найден`})
                return res.status(400).json({message: `Пользователь ${username} не найден`})
            }
            const validPassword = bcrypt.compareSync(password, user.password)
            if (!validPassword) {
                return res.status(400).json({message: `Введен неверный пароль`})
            }
            const token = generateAccessToken(user._id, user.roles)
            res.cookie('token', token, { maxAge: 86400000 });
            return res.json({token})
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Login error'})
        }
    }

    async getUsers(req, res) {
        try {
            const users = await User.find()
            console.log(users)
            res.json(users)
        } catch (e) {
            console.log(e)
        }
    }

    async editPost(req, res) {
        const { id, title, author, text } = req.body;
        Post
            .findByIdAndUpdate(id, { title, author, text })
            .then((result) => res.redirect(`/posts/${id}`))
            .catch((error) => {
                console.log(error);
            });
    }

    async deletePost(req, res) {
        const { id, path } = req.body
        Post
        .findByIdAndDelete(id)
        .then((result) => {
            res.sendStatus(200);
            const fullpath = './images/portfolio/' + path;
            fs.unlink(fullpath, (err) => {
                if (err) throw err;
                console.log('Файл успешно удален');
            });
        })
        .catch((error) => {
            console.log(error);
            res.render(createPath('error'), { title: 'Error' });
        });
    }

    async addPost(req, res) {
        try {
            const {title, author, text} = req.body
            const post = new Post({ title, author, text });
            post
                .save()
                // .then((result) => res.redirect('/posts'))
                .catch((error) => {
                    console.log(error);
                });

            return res.json("so good")
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Login error'})
        }
    }
}

module.exports = new authController()
