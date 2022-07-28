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

app.get('/', async (req, res) => {
  await db
    .collection('notice')
    .find()
    .toArray((err, rst) => {
      console.log(rst);
      res.json({ posts: rst });
    });
});

app.post('/add', async (req, res) => {
  await db.collection('id').findOne({ name: 'id' }, async (err, rst) => {
    const 저장할거 = {
      _id: rst.totalPost,
      title: req.body.title,
      content: req.body.content,
      writer: req.body.writer,
    };

    await db.collection('notice').insertOne(저장할거, async (err, rst) => {
      console.log('저장완료');

      await db
        .collection('id')
        .updateOne({ name: 'id' }, { $inc: { totalPost: 1 } }, (err, rst) => {
          if (err) return console.log(err);
        });
    });
  });
  return res.send('success');
});

app.delete('/delete', (req, res) => {
  console.debug(req.body.id);
  db.collection('notice').deleteOne({ _id: req.body.id }, (err, rst) => {
    console.log('삭제완료');
    if (err) console.log(err);
    return res.send('success');
  });
});

app.put('/edit', (req, res) => {
  console.log(req.body);
  db.collection('notice').updateOne(
    { _id: req.body._id },
    {
      $set: {
        title: req.body.title,
        content: req.body.content,
        writer: req.body.writer,
      },
    },
    (err, rst) => {
      console.log('수정완료');
      return res.send('success');
    }
  );
});
