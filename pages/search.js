import { InformationCircleIcon, SearchIcon } from '@heroicons/react/outline';
import * as cookie from 'cookie';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import ModalConfrim from '../components/confirm';
import Footer from '../components/footer';
import Navbar from '../components/navbar';
import apiHandle from '../lib/api';
import cookieHandle from '../lib/cookie';


export const getServerSideProps = async (ctx) => {
  try {
    const response = await apiHandle(
      'GET', `/search`, null,
      JSON.parse(cookie.parse(ctx.req.headers?.cookie).AUT)?.token,
      { params: { query: ctx.query.q, option: 'title' } });
    const loadData = response.data;
    return {
      props: { isError: loadData.isError, data: loadData.rows ??= [], message: loadData.message },
    }
  } catch (err) {
    return {
      props: { isError: true, data: [], message: '서버와의 연결이 끊겼습니다.' },
    }
  }
}

const SearchPage = ({ isError, data, message }) => {

  const getItems = () => {
    let itemList = [];
    for (let i = (curPage - 1) * 10; i < curPage * 10; ++i) {
      if (data[i])
        itemList.push(data[i]);
    }
    return itemList;
  }

  const router = useRouter();

  const [query, setQuery] = useState(decodeURI(router.asPath.match(new RegExp(`[&?]q=(.*)(&|$)`))?.[1]));
  const [history, setHistory] = useState(query);

  const [enterQ, setEnterQ] = useState(false);

  const [alert, setAlert] = useState(false);
  const [xConfirm, setConfirm] = useState(false);
  const [bookID, setBookID] = useState('');

  const clickModal = {
    check: () => {
      setAlert(false);
      setConfirm(true);
    },
    cancel: () => {
      setAlert(false);
      setConfirm(false);
    }
  }

  const [curPage, setPage] = useState(1);

  useEffect(() => {
    router.push(`/search?q=${history}`)
    setEnterQ(false);
  }, [enterQ, curPage])

  let pageSet = new Set([1, Math.ceil(data.length / 10)]);
  let pageResult = [];

  for (let i = -2; i <= 2; ++i) {
    if (1 <= curPage + i && curPage + i <= Math.ceil(data.length / 10))
      pageSet.add(curPage + i);
  }

  let pageList = Array.from(pageSet).sort((l, r) => {
    return l - r;
  });

  let lastPage = 0;
  for (let pgContent of pageList) {
    if (pgContent !== lastPage + 1)
      pageResult.push(
        <li className='text-sm font-medium leading-none cursor-pointer text-gray-600 hover:text-blue-600 border-t border-transparent hover:border-blue-300 pt-3 mr-4 px-2'>...</li>
      );
    pageResult.push(
      <li
        onClick={() => setPage(pgContent)}
        className={curPage === pgContent ?
          'text-sm font-black leading-none cursor-pointer text-blue-600 border-t border-blue-300 pt-3 mr-4 px-2' :
          'text-sm font-medium leading-none cursor-pointer text-gray-600 hover:text-blue-700 border-t border-transparent hover:border-blue-300 pt-3 mr-4 px-2'}>
        {pgContent}
      </li>
    );
    lastPage = pgContent;
  }

  const bookDataRender = !isError && getItems().map((item, idx) => (
    <>
      <div
        className='cursor-pointer'
        onClick={() => {
          setBookID(item?.bookID);
          setAlert(true);
        }}
      >
        <li className='grid grid-cols-10 gap-4 justify-center items-center px-4 py-2 rounded-lg hover:bg-gray-50'>
          <div className='flex justify-center items-center'>
            {(idx + 1) + ((curPage - 1) * 10)}
          </div>
          <div className='col-start-2 col-end-11 pl-8 border-l-2 border-solid border-gray'>
            {item?.status == 0 ?
              <p className='text-blue-500 mt-1 font-regular text-sm'>대출가능</p>
              : <p className='text-red-600 mt-1 font-regular text-sm'>대출불가</p>}
            <h3 className='text-gray-900 font-medium text-md'>{item?.title}</h3>
            <p className='text-gray-600 mt-1 font-regular text-sm'>{item?.author} | {item?.company} | {item?.bookID}</p>
          </div>
        </li>
      </div>
    </>
  ));

  const loanAction = async (bookID) => {
    try {
      const response = await apiHandle('PUT', '/loanAction', { bookID }, cookieHandle.get('AUT')?.token);
      const loadData = response.data;
      if (loadData.isError) {
        toast.error(loadData.message, { autoClose: 1500 })
      } else {
        toast.success(loadData.message, { autoClose: 1500 })
        router.push(`search?q=${history}`);
      }
    } catch (err) {
      toast.error('서버와의 연결이 끊겼습니다.', { autoClose: 1500 });
    }
    setConfirm(false);
  };

  useEffect(() => {
    if (xConfirm) {
      loanAction(bookID);
    }
  }, [xConfirm]);

  return (
    <>
      <Head>
        <title>단대라이브러리 : 검색 결과</title>
        <meta property='og:title' content='단대라이브러리 : 검색 결과' />
        <meta property='og:description' content='Click This.' />
        <meta property='og:type' content='website' />
        <meta property='og:url' content='https://ddlib.vercel.app/' />
        <meta property='og:image' content='/img/woongdo.png' />
      </Head>
      <Navbar />
      <ToastContainer />
      {
        alert &&
        <ModalConfrim
          title={'정말 이 책을 빌리시겠습니까?'}
          message={'대출 신청 후 신청한 책은 직접 도서관에서 가져가셔야 합니다. 선택하신 책을 대출하시겠습니까?'}
          modalClickAction={clickModal}
        />
      }
      <div className='max-w-screen-xl mx-auto px-2 sm:px-6 lg:px-8'>
        <div className='px-3 mt-10 sm:mt-28'>
          <h2 className='text-5xl tracking-tight leading-tight font-black text-gray-900 sm:leading-none'>
            검색 결과
          </h2>
          <p className='mt-3 text-base text-gray-500 sm:mt-3 sm:text-lg sm:mx-auto md:text-xl lg:mx-0'>
            {`제목을 기준으로 '${history}'을 검색하셨어요.`}
          </p>
        </div>
        <div className='mt-6 mb-12 sm:pt-12 md:pt-16 lg:pt-20 xl:pt-28'>
          <div className='px-3 mb-24 flex flex-col items-center'>
            <div className='w-full mx-auto flex items-center'>
              <input
                name='q'
                type='text'
                placeholder='검색어 입력 후 엔터를 치세요'
                className='shadow-lg mx-auto w-full aggroM-font border border-gray-200 py-4 px-5 pl-5 pr-10 rounded-lg focus:outline-none'
                autoComplete='off'
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    setHistory(query);
                    setEnterQ(true);
                  }
                }}
              />
              <button className='text-gray-500 relative right-10 -mr-5' onClick={() => {
                setHistory(query);
                setEnterQ(true);
              }}>
                <SearchIcon className='h-6 w-6' aria-hidden='true' />
              </button>
            </div>
          </div>
        </div>
        {!cookieHandle.get('AUT')?.token && (
          <div>
            <div className='flex p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg'>
              <InformationCircleIcon className='inline flex-shrink-0 mr-3 w-5 h-5' />
              <div>
                <p>단대라이브러리는 본교 학우들과 선생님들을 제외한 사용자에게는 책 정보를 제공하고 있지 않습니다.</p>
              </div>
            </div>
          </div>
        )}
        {cookieHandle.get('AUT')?.token && isError && (
          <div>
            <div className='flex p-4 mb-4 text-sm text-yellow-700 bg-yellow-100 rounded-lg'>
              <InformationCircleIcon className='inline flex-shrink-0 mr-3 w-5 h-5' />
              <div>
                <p>{message}</p>
              </div>
            </div>
          </div>
        )}
        <div className='relative'>
          <ul className='rounded-md shadow-md bg-white left-0 right-0 -bottom-18 mt-3 p-3'>
            <li className='text-gray-500 border-b border-gray border-solid py-3 px-3 mb-2'>
              약 {data?.length}개의 검색 결과가 있습니다.
            </li>
            {bookDataRender}
            <div className='flex items-center justify-center py-10 lg:px-0 sm:px-6 px-4'>
              <div className='flex items-center justify-between border-t border-gray-200'>
                <div className='flex'>
                  {pageResult}
                </div>
              </div>
            </div>
          </ul>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default SearchPage;
