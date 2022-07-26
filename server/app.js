const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

let id = 1;
const notice = [
  {
    id: 0,
    title: '제목0',
    content: '내용0',
    writer: '작성자0',
  },
];

app.get('/write', (req, res) => {
  res.json(notice);
});

app.post('/write', (req, res) => {
  console.log(req.body);
  const { title, content, writer } = req.body;
  notice.push({
    id: id++,
    title,
    content,
    writer,
  });
});

app.listen(4000, () => {
  console.log('server start');
});
