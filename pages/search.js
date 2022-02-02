import { InformationCircleIcon, SearchIcon } from '@heroicons/react/outline';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import ModalConfrim from '../components/confirm';
import Footer from '../components/footer';
import Navbar from '../components/navbar';
import Loader from '../components/loader';
import apiHandle from '../lib/api';
import cookieHandle from '../lib/cookie';

const SearchPage = () => {
  const router = useRouter();

  const [query, setQuery] = useState(decodeURI(router.asPath.match(new RegExp(`[&?]q=(.*)(&|$)`))?.[1]));
  const [history, setHistory] = useState(query);
  const [searchBookList, setSearchBookList] = useState([]);

  const [alert, setAlert] = useState(false);
  const [xConfirm, setConfirm] = useState(false);
  const [bookID, setBookID] = useState('');

  const clickModal = {
    check: () => {
      setAlert(!alert);
      setConfirm(true);
    },
    cancel: () => {
      setAlert(!alert);
      setConfirm(false);
    }
  }

  const submitQuery = () => {
    router.push(`search?q=${query}`)
    if (cookieHandle.get('AUT')?.token) {
      fetchSearchData(query);
      setHistory(query);
    }
  }

  const fetchSearchData = async (title) => {
    try {
      const response = await apiHandle('GET', `/search`, null, cookieHandle.get('AUT')?.token, { params: { query: title, option: 'title' } });
      const loadData = response.data;
      if (loadData.isError) {
        toast.warn(loadData.message, { autoClose: 1500 });
      } else {
        setSearchBookList(loadData.rows);
      }
    } catch (err) {
      toast.error('서버와의 연결이 끊겼습니다.', { autoClose: 1500 });
    }
  };

  const searchBook = searchBookList && searchBookList.map((item, idx) => (
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
            {idx + 1}
          </div>
          <div className='col-start-2 col-end-11 pl-8 border-l-2 border-solid border-gray'>
            {item.status == 0 ?
              <p className='text-blue-500 mt-1 font-regular text-sm'>대출가능</p>
              : <p className='text-red-600 mt-1 font-regular text-sm'>대출불가</p>}
            <h3 className='text-gray-900 font-medium text-md'>{item?.title}</h3>
            <p className='text-gray-600 mt-1 font-regular text-sm'>{item?.author} | {item?.company} | {item?.bookID}</p>
          </div>
        </li>
      </div>
    </>
  ))

  const loanAction = async (bookID) => {
    try {
      const response = await apiHandle('PUT', '/loanAction', { bookID }, cookieHandle.get('AUT')?.token);
      const loadData = response.data;
      if (loadData.isError) {
        console.log(response)
        toast.error(loadData.message, { autoClose: 1500 })
      } else {
        toast.success(loadData.message, { autoClose: 1500 })
        router.push(`search?q=${history}`);
        fetchSearchData(query);
      }
    } catch (err) {
      toast.error('서버와의 연결이 끊겼습니다.', { autoClose: 1500 });
    }
    setConfirm(false);
  };

  useEffect(() => {
    if (cookieHandle.get('AUT') && cookieHandle.get('AUT')?.token) {
      fetchSearchData(query);
    }
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
        <meta property='og:url' content='https://ddlibrary.vercel.app/' />
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
                    submitQuery();
                  }
                }}
              />
              <button className='text-gray-500 relative right-10 -mr-5' onClick={() => { submitQuery() }}>
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
        <div className='relative'>
          <ul className='rounded-md shadow-md bg-white left-0 right-0 -bottom-18 mt-3 p-3'>
            <li className='text-gray-500 border-b border-gray border-solid py-3 px-3 mb-2'>
              약 {searchBookList?.length}개의 검색 결과가 있습니다.
            </li>
            {searchBook}
          </ul>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default SearchPage;
