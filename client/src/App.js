import { useEffect, useState } from 'react';
import axios from 'axios';

const SERVER_URL = 'http://localhost:4000';
function App() {
  const [modal, setModal] = useState(false);
  const [notice, setNotice] = useState(null);

  const fetchData = async () => {
    const res = await axios.get(SERVER_URL);
    console.log(res.data.posts);
    setNotice(res.data.posts);
  };

  // const addData = async ()=>{
  //   const res = await axios.get()
  // }

  useEffect(() => {
    fetchData();
  }, []);

  const obSubmitHandler = async e => {
    e.preventDefault();
    const title = e.target.title.value;
    const content = e.target.content.value;
    const writer = e.target.writer.value;
    await axios.post('http://localhost:4000/add', { title, content, writer });
    console.log('zz');
    fetchData();
    setModal(false);
    console.log(notice);
  };

  return (
    <div className="w-full h-screen">
      <button
        className="p-1 border border-black"
        onClick={() => {
          setModal(true);
        }}
      >
        글쓰기
      </button>

      <div>
        <ul>
          {notice?.map(item => (
            <li className="flex" key={item.id}>
              <div className="mr-20">{item._id}</div>
              <div className="mr-20">{item.title}</div>
              <div>{item.writer}</div>
              <button className="ml-2 border">삭제</button>
            </li>
          ))}
        </ul>
      </div>

      {modal && (
        <div className="w-[500px] h-[600px] border-2 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] p-3">
          <form onSubmit={obSubmitHandler}>
            <p>제목</p>
            <input type="text" className="w-full p-2 border" name="title" />
            <p>내용</p>
            <input
              type="text"
              className="w-full p-2 border h-80"
              name="content"
            />
            <p>작성자</p>
            <input type="text" className="p-2 border" name="writer" />
            <div className="flex justify-center mt-16">
              {/* <button className="p-1 mr-4 border">작성</button> */}
              <input type="submit" className="p-1 mr-4 border" value="작성" />
              <button
                className="p-1 border"
                onClick={() => {
                  setModal(false);
                }}
              >
                취소
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
