const { body } = require("express-validator")
const fs = require('fs');
const path = require('path')
const usersFilePath = path.join(__dirname,'../database/users.json');
const usersList = JSON.parse(fs.readFileSync(usersFilePath, {encoding:'utf-8'}));

const usersValidator= {
    register: [
        body('email')
            .notEmpty()
            .withMessage('El campo email es obligatorio')
            .bail()
            .isEmail()
            .withMessage('Email con formato incorrecto')
            .bail()
            .custom(emailValue => {
                const users = readJson();

                const userFound = users.find(user => user.email == emailValue);

                return !userFound;
            })
            .withMessage('Email ya registrado'),
        body('password')
            .notEmpty()
            .withMessage('El campo password es obligatorio')
            .bail()
            .isLength({ min: 6 })
            .withMessage('La contraseña debe tener al menos 6 caracteres')
            .bail()
            .custom((value, { req }) => value == req.body.retype)
            .withMessage('Las contraseñas no coinciden'),
        body('retype')
            .notEmpty()
            .withMessage('Es obligatorio repetir la contraseña'),
        body('avatar')
            .custom((valueImg, { req }) => req.files[0])
            .withMessage('El avatar es obligatorio')
            .bail()
            .custom((value , { req }) => {
                const acceptedExtensions = ['.jpg', '.png', '.jpeg'];
                const fileExt = path.extname(req.files[0].originalname);
                return acceptedExtensions.includes(fileExt);
            })
            .withMessage('Extensión inválida. Las extensiones aceptadas son: JPG, PNG Y JPEG')
    ],
    login: [
        body('email')
            .notEmpty()
            .withMessage('El campo email es obligatorio')
            .bail()
            .isEmail()
            .withMessage('Email con formato incorrecto')
            .bail()
            .custom((value, { req }) => {
                const allUsers = readJson();
                const userFound = allUsers.find(user => value == user.email);
        
                if(userFound){
                    if(bcrypt.compareSync(req.body.password, userFound.password)){
                        return true;
                    }
                    return false;
                }
                
                return false;
            })
            .withMessage('Email o contraseña inválidos')
    ]
}
module.exports = (usersValidator)