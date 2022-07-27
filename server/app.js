const express = require('express');
const app = express();
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
app.use(cors());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
require('dotenv').config();

let db;
MongoClient.connect(process.env.DB_URL, (err, client) => {
  // 에러표시
  if (err) return console.log(err);

  db = client.db('blog');

  app.listen(process.env.PORT, () => {
    console.log('port 4000 on');
  });
});

// let id = 1;
// const notice = [
//   {
//     id: 0,
//     title: '제목0',
//     content: '내용0',
//     writer: '작성자0',
//   },
// ];

// app.get('/', (req, res) => {
//   res.json(notice);
// });

app.get('/', (req, res) => {
  db.collection('notice')
    .find()
    .toArray((err, rst) => {
      console.log(rst);
      res.json({ posts: rst });
    });
});

app.post('/add', (req, res) => {
  console.log(req.body);
  db.collection('id').findOne({ name: 'id' }, (err, rst) => {
    console.log(rst.totalPost);

    const 저장할거 = {
      _id: rst.totalPost,
      title: req.body.title,
      content: req.body.content,
      writer: req.body.writer,
    };

    db.collection('notice').insertOne(저장할거, (err, rst) => {
      console.log('저장완료');
      db.collection('id').updateOne(
        { name: 'id' },
        { $inc: { totalPost: 1 } },
        (err, rst) => {
          if (err) return console.log(err);
        }
      );
    });
  });
  return res.send('success');
});

app.post('/', (req, res) => {
  console.log(req.body);
  const { title, content, writer } = req.body;
  notice.push({
    id: id++,
    title,
    content,
    writer,
  });
  res.send('seccess');
});
