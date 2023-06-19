const Router = require('express')
const router = new Router()
const controller = require('./authController')
const {check} = require("express-validator")
const roleMiddleware = require('../middlewaree/roleMiddleware')

router.post('/regist', [
    check('username', "Имя пользователя не может быть пустым").isLength({min:4, max:12}),
    check('password', "Пароль должен быть больше 4 и меньше 10 символов").isLength({min:6, max:20})
], controller.registration)
router.post('/login', controller.login)
router.post('/add-post', roleMiddleware(["ADMIN"]), controller.addPost)
router.delete('/delete', roleMiddleware(["ADMIN"]), controller.deletePost)
router.put('/edit-post', roleMiddleware(["ADMIN"]), controller.editPost)
router.get('/users', roleMiddleware(["ADMIN"]), controller.getUsers)

module.exports = router
