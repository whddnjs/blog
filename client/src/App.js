import { useEffect, useState } from 'react';
import axios from 'axios';

const SERVER_URL = 'http://localhost:4000/write';
function App() {
  const [modal, setModal] = useState(false);
  const [notice, setNotice] = useState(null);

  const fetchData = async () => {
    const res = await axios.get(SERVER_URL);
    console.log(res.data);
    setNotice(res.data);
  };
  useEffect(() => {
    fetchData();
  }, [notice]);

  const obSubmitHandler = e => {
    e.preventDefault();
    const title = e.target.title.value;
    const content = e.target.content.value;
    const writer = e.target.writer.value;
    axios.post(SERVER_URL, { title, content, writer });
    fetchData();
    setModal(false);
  };

  return (
    <div className="w-full h-screen">
      <button
        className="border border-black p-1"
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
              <div className="mr-20">{item.title}</div>
              <div>{item.writer}</div>
            </li>
          ))}
        </ul>
      </div>

      {modal && (
        <div className="w-[500px] h-[600px] border-2 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] p-3">
          <form onSubmit={obSubmitHandler}>
            <p>제목</p>
            <input type="text" className="border p-2 w-full" name="title" />
            <p>내용</p>
            <input
              type="text"
              className="border p-2 w-full h-80"
              name="content"
            />
            <p>작성자</p>
            <input type="text" className="border p-2" name="writer" />
            <div className="flex justify-center mt-16">
              {/* <button className="mr-4 border p-1">작성</button> */}
              <input type="submit" className="mr-4 border p-1" value="작성" />
              <button
                className="border p-1"
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
