import { useEffect, useState } from 'react';
import axios from 'axios';

const SERVER_URL = process.env.REACT_APP_URL;

function App() {
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [notices, setNotices] = useState(null);
  const [edit, setEdit] = useState({});

  const fetchData = async () => {
    const res = await axios.get(SERVER_URL);
    console.log(res.data.posts);
    setNotices(res.data.posts);
    console.debug(notices);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onSubmitHandler = async e => {
    e.preventDefault();

    const formData = {
      title: e.target.title.value,
      content: e.target.content.value,
      writer: e.target.writer.value,
    };

    const { createNoticeId } = await axios.post(`${SERVER_URL}/add`, formData);
    // 백틱 `` 활용하셈프론트에서도저거랑똑같이쓰면
    // 근데 리액트에서는 아쉽게도ㄹ 아쉬운게ㅏ니라 리액트에서 dotenv 내장되어있음 그래서 파을 그냥 만들고 쓰면되는데 규칙이 있음
    // res.createNoticeId <- 뭐 이런거 리턴 받아서
    console.debug('저장 성공');

    // setTimeout(async () => {
    //   await fetchData();
    // }, 1000);

    // 저장하고 데이터 저렇게 리스트 통으로 받아서 새로 하는 방법도 있지만 사실 클라이언트단에서 해결할 수도 있음
    console.debug('db데이터 받아옴');

    const newNotices = [...notices, { ...formData, _id: createNoticeId }];
    // 뭐 이런식으로 생성한 놈 아이디 받아서 굳이 리스트 다 호출 안하고 생성한놈만 리스트에 추가해주는거임 이게 방법 2임 납득감?ㅇㅇ
    // 근데 이 방법은 트래픽으로는 아낄 수 있어서 장점이지만 프론트엔드 코드가 좀더 복잡해지는 단점이 있음 그래서 프로젝트 성격에 따라서 뭐 할지 선택하면됨
    // 근데 배우는 입장에선 백엔드에서 너가 한것처럼 api 그냥 호출하는 방식으로 깔끔하게 가는게 나음 트레픽 생각하지말고
    // 결론: mysql로 바꾸셈 ㅋㅋㅇㅋ
    // 간단한 crud 구현 잘 하고있는거 같은데, 다 좋고 뭐 코드 리팩토링같은건 하다보면 느는건데 백엔드쪽에서 db만 관계형 쓰셈 그럼 완벽함 오래남ㄴ에하니까 존나어렵다 ㄹㅇ 마음 꺽이;ㄹ거같다
    // 조낸 어렵지 그냥 그런거 재지말고 꾸준히 조금씩 하다보면 보답은 받으니까 선택은 너가 하는거다 아 대충 crud 프로젝트 쳐놓고 코드 보내줄라 했는데 한두시간 걸릴거같아서 포기
    // 이번 주말중에 시간내서 해줌 -> 정석 오브 정석이니까 도움 많이 될꺼임굿

    setNotices(newNotices);

    setAddModal(false);
  };

  const onUpdateHandler = async e => {
    e.preventDefault();

    const formData = {
      _id: edit._id,
      title: e.target.title.value,
      content: e.target.content.value,
      writer: e.target.writer.value,
    };

    await axios.put(`${SERVER_URL}/edit`, formData);
    fetchData();
    setEditModal(false);
  };

  const deleteNotice = async id => {
    await axios.delete(`${SERVER_URL}/delete`, {
      data: {
        id,
      },
    });
    fetchData();
  };

  const editNotice = async id => {
    const 찾은거 = notices.filter(item => item._id === id);
    console.log(찾은거);
    const 넣을거 = {
      _id: 찾은거[0]._id,
      title: 찾은거[0].title,
      content: 찾은거[0].content,
      writer: 찾은거[0].writer,
    };
    console.log(넣을거);
    setEdit({ ...넣을거 });
    console.log(edit);
    setEditModal(true);
  };

  return (
    <div className="w-full h-screen">
      <button
        className="p-1 border border-black"
        onClick={() => {
          setAddModal(true);
        }}
      >
        글쓰기
      </button>

      <div className="w-[30%] border">
        <ul>
          <li className="flex items-center h-10 text-center bg-gray-200 border-b">
            <div className="w-[10%]">글번호</div>
            <div className="w-[50%]">글제목</div>
            <div className="w-[20%]">작성자</div>
            <div className="w-[10%]">수정</div>
            <div className="w-[10%]">삭제</div>
          </li>
          {notices?.map(item => (
            <li
              className="flex items-center h-8 text-center border-t"
              key={item._id}
            >
              <div className="w-[10%] border-r h-8 leading-8">{item._id}</div>
              <div className="w-[50%] border-r h-8 leading-8">{item.title}</div>
              <div className="w-[20%] border-r h-8 leading-8">
                {item.writer}
              </div>
              <button
                className="w-[10%] border-r h-8 leading-8"
                onClick={() => {
                  editNotice(item._id);
                }}
              >
                수정
              </button>
              <button
                className="w-[10%] h-8 leading-8"
                onClick={() => {
                  deleteNotice(item._id);
                }}
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      </div>

      {addModal && (
        <div className="w-[500px] h-[600px] border-2 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] p-3">
          <form onSubmit={onSubmitHandler}>
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
                onClick={e => {
                  e.preventDefault();
                  setAddModal(false);
                }}
              >
                취소
              </button>
            </div>
          </form>
        </div>
      )}

      {editModal && (
        <div className="w-[500px] h-[600px] border-2 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] p-3">
          <form onSubmit={onUpdateHandler}>
            <p>제목</p>
            <input
              type="text"
              className="w-full p-2 border"
              name="title"
              defaultValue={edit.title}
            />
            <p>내용</p>
            <input
              type="text"
              className="w-full p-2 border h-80"
              name="content"
              defaultValue={edit.content}
            />
            <p>작성자</p>
            <input
              type="text"
              className="p-2 border"
              name="writer"
              defaultValue={edit.writer}
            />
            <div className="flex justify-center mt-16">
              {/* <button className="p-1 mr-4 border">작성</button> */}
              <input type="submit" className="p-1 mr-4 border" value="수정" />
              <button
                className="p-1 border"
                onClick={e => {
                  e.preventDefault();
                  setEditModal(false);
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
