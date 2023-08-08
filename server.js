const express = require('express');
const path = require('path');
const morgan = require('morgan');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Post = require('./models/post');
const Contact = require('./models/contact');
const FileUpload = require('express-fileupload'); 
const multer = require('multer');
const bodyParser = require('body-parser');
const authRouter = require('./auth/authRouter')

const app = express();

app.set('view engine', 'ejs');

const PORT = process.env.PORT || 3000;
const db = 'mongodb+srv://drl1ng:090101Danil@cluster0.plxxmmk.mongodb.net/node-rustam?retryWrites=true&w=majority';

mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((res) => console.log('Connected to DB'))
  .catch((error) => console.log(error));

const createPath = (page) => path.resolve(__dirname, 'ejs-views', `${page}.ejs`);

// подключаюсь к порту
app.listen(PORT, (error) => {
  error ? console.log(error) : console.log(`listening port ${PORT}`);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// тут идет сохранение фото на сервер
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images/portfolio');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

app.post('/upload-photo', upload.single('photo'), (req, res) => {
  res.send('Photo uploaded successfully');
  console.log(req.file.filename);
});

app.use("/auth", authRouter)

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

app.use(express.static('styles'));
app.use(express.static('images'));
app.use(express.static('js'));

app.use(methodOverride('_method'));

app.use(FileUpload({}));

// app.get('/', (req, res) => {
//   const title = 'Home';
//   res.render(createPath('pseudo'), { title });
// });

app.get('/', (req, res) => {
  Post
    .find()
    .sort({ createdAt: -1 })
    .then(posts => res.render(createPath('index'), { posts }))
    .catch((error) => {
      console.log(error);
      res.render(createPath('error'), { title: 'Error' });
    });
});

app.get('/contacts', (req, res) => {
  const title = 'Contacts';
  Contact
    .find()
    .then(contacts => res.render(createPath('contacts'), { contacts, title }))
    .catch((error) => {
      console.log(error);
      res.render(createPath('error'), { title: 'Error' });
    });
});

app.get('/posts/:id', (req, res) => {
  const title = 'Post';
  Post
    .findById(req.params.id)
    .then(post => res.render(createPath('post'), { post, title }))
    .catch((error) => {
      console.log(error);
      res.render(createPath('error'), { title: 'Error' });
    });
});

app.get('/posts', (req, res) => {
  const title = 'Posts';
  Post
    .find()
    .sort({ createdAt: -1 })
    .then(posts => res.render(createPath('posts'), { posts, title }))
    .catch((error) => {
      console.log(error);
      res.render(createPath('error'), { title: 'Error' });
    });
});

app.get('/index', (req, res) => {
  Post
    .find()
    .sort({ createdAt: -1 })
    .then(posts => res.render(createPath('index'), { posts }))
    .catch((error) => {
      console.log(error);
      res.render(createPath('error'), { title: 'Error' });
    });
});

app.get('/edit/:id', (req, res) => {
  const title = 'Edit Post';
  Post
    .findById(req.params.id)
    .then(post => res.render(createPath('edit-post'), { post, title }))
    .catch((error) => {
      console.log(error);
      res.render(createPath('error'), { title: 'Error' });
    });
});

app.get('/add-post', (req, res) => {
  const title = 'Add Post';
  res.render(createPath('add-post'), { title });
});

app.use((req, res) => {
  const title = 'Error Page';
  res
    .status(404)
    .render(createPath('error'), { title });
});

