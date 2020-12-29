const express = require('express');
const router = express.Router();
const multer = require('multer');
const {check, validationResult, body} = require('express-validator'); 
const fs = require('fs');
const path = require('path')

const usersFilePath = path.join(__dirname,'../database/users.json');
const users = JSON.parse(fs.readFileSync(usersFilePath, {encoding:'utf-8'}));

const avatarsFilePath = path.join(__dirname,'../../public/images/users');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, avatarsFilePath)
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + "_" + path.basename(file.originalname, path.extname(file.originalname)) +"_" + Date.now() + path.extname(file.originalname))
    }
  })
  
const upload = multer({ storage: storage })

const userController = require('../controllers/userController');
const usersValidator = require('../middlewares/usersValidator');
const guest = require('../middlewares/guest');
const auth = require('../middlewares/auth');

// Muestra la vista de registro
router.get('/register',guest, userController.showRegister);

// Procesa la vista de registro
router.post('/register',upload.any(), usersValidator.register ,userController.processRegister);

// Muestra la vista de login
router.get('/login', guest, userController.showLogin);

// Procesa la vista de login
router.post('/login', upload.any(), usersValidator.login ,userController.processLogin);

// Muestra el perfil del usuario
router.get('/profile',auth, userController.showProfile);

// Cierra la sesión
router.get('/logout', auth, userController.logout);


module.exports = router;