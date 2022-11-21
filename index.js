import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';

import { registerValidation } from "./validation/register.js";
import checkAuth from './utils/checkAuth.js';
import { getMe, login, register } from "./controllers/UserControllers.js";
import { createPost, deleteOnePost, getAllPosts, getOnePost, updateOnePost } from "./controllers/PostControllers.js";
import { loginValidation } from "./validation/login.js";
import { postValidation } from "./validation/posts.js";
import handleValidationErrors from "./utils/handleValidationErrors.js";

const ADMIN_MONGO = 'pegas007';
const PASS_MONGO = 'CGez8Q4p';
const DATABASE = 'socium';


mongoose.connect(`mongodb+srv://${ADMIN_MONGO}:${PASS_MONGO}@pegascluster.5mxspgp.mongodb.net/${DATABASE}?retryWrites=true&w=majority`)
  .then(() => {
    console.log('DB connect')
  })
  .catch((err) => {
    console.log('No connect ', err)
  })

const app = express();

const storage = multer.diskStorage({                           //хранилище картинок
  destination: (_, __, callback) => {
    callback(null, 'uploads');                                     //куда сохраняются файлы
  },
  filename: (_, file, callback) => {
    callback(null, file.originalname);                             //как будет называться файл
  }
});

const upload = multer({storage});

app.use(express.json());
app.use('/upload', express.static('uploads'));              //при запросе на upload/...
                                                                 //проверять статичные файлы в папке uploads Пример: картинка со своим url upload/ins.png
app.get('/you', checkAuth, getMe)

app.post('/login', loginValidation, handleValidationErrors, login);

app.post('/register', registerValidation, handleValidationErrors, register);

app.post('/post', checkAuth, postValidation, handleValidationErrors, createPost);

app.get('/post', getAllPosts);

app.get('/post/:id', checkAuth, getOnePost);

app.delete('/post/:id', deleteOnePost);

app.patch('/post/:id', checkAuth, postValidation, handleValidationErrors, updateOnePost);

app.post("/upload", checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,               //Загружаем под оригинальным названием

  })
});

app.listen(3000, () => {
  console.log('server on http://localhost:3000')
});

//mongodb+srv://pegas007:<password>@pegascluster.5mxspgp.mongodb.net/?retryWrites=true&w=majority