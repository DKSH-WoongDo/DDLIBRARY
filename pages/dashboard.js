import { CollectionIcon, DatabaseIcon, ShoppingCartIcon, UserGroupIcon } from '@heroicons/react/solid';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import ModalAlert from '../components/alert';
import Footer from '../components/footer';
import Navbar from '../components/navbar';
import apiHandle from '../lib/api';
import cookieHandle from '../lib/cookie';
import cryptoHandle from '../lib/crypto';

const DashboardPage = () => {
    const router = useRouter();

    const [alert, setAlert] = useState(false);
    const [info, setInfo] = useState([]);
    const [bookHistoryList, setBookHistoryList] = useState([]);
    const [checkedItems, setCheckedItems] = useState(new Set());
    const [clickReturn, setClickReturn] = useState(false);

    const [bTitle, setBookTitle] = useState('');
    const [bAuthor, setBookAuthor] = useState('');
    const [bCompany, setBookCompany] = useState('');
    const [bIDforAdd, setBookIDforAdd] = useState('');
    const [bIDforDel, setBookIDforDel] = useState('');

    const clickModal = {
        check: () => {
            setAlert(!alert);
            router.push('/login');
        }
    }

    const checkedItemHandler = (value) => {
        if (checkedItems.has(value)) {
            checkedItems.delete(value);
            setCheckedItems(checkedItems);
        } else {
            checkedItems.add(value);
            setCheckedItems(checkedItems);
        }
    };

    const fetchInfoData = async () => {
        try {
            const response = await apiHandle('GET', '/info', null, cookieHandle.get('AUT')?.token);
            const loadData = response.data;
            setInfo(loadData?.cnt);
        } catch (err) {
            toast.error('서버와의 연결이 끊겼습니다.', { autoClose: 1500 });
        }
    }

    const fetchHistoryData = async () => {
        try {
            const response = await apiHandle('GET', '/history', null, cookieHandle.get('AUT')?.token, { params: { isLoanned: 'true' } });
            const loadData = response.data;
            if (loadData.isError) {
                toast.warn('대출 내역이 없어요.', { autoClose: 1500 });
                setBookHistoryList([]);
            } else {
                setBookHistoryList(loadData?.rows);
                bookHistoryList.sort((a, b) => {
                    const dateA = new Date(a.fromDate).getTime();
                    const dateB = new Date(b.fromDate).getTime();
                    return dateA > dateB ? -1 : 1;
                })
            }
        } catch (err) {
            toast.error('서버와의 연결이 끊겼습니다.', { autoClose: 1500 });
        }
    };

    const getDiff = (endDate) => {
        const currDay = new Date();
        const diffDays = Math.floor((endDate.getTime() - currDay.getTime()) / (1000 * 60 * 60 * 24));
        return diffDays;
    }

    const bookHistory = bookHistoryList && bookHistoryList.map((item) => (
        <>
            <li className='grid grid-cols-10 gap-4 justify-center items-center px-4 py-2 rounded-lg hover:bg-gray-50'>
                <div className='flex justify-center items-center'>
                    <input
                        type='checkbox'
                        className='h-4 w-4 cursor-pointer'
                        onChange={() => checkedItemHandler(`${cryptoHandle.AES_ENC(item?.userID)}:${item?.bookID}`)}
                    />
                </div>
                <div className='col-start-2 col-end-11 pl-8 border-l-2 border-solid border-gray'>
                    <p className='mt-1 font-regular text-sm'>{`${item?.userName} (${item?.userID})`}</p>
                    <h3 className='text-gray-900 font-medium text-md'>{item?.bookTitle} || {item?.bookID}</h3>
                    <p className='text-red-500 mt-1 font-regular text-sm'>
                        반납까지 {getDiff(new Date(item?.endDate))}일 남았습니다.
                    </p>
                </div>
            </li>
        </>
    ))

    const returnValueHandle = () => {
        let arr = [];
        checkedItems.forEach((item) => {
            if (item && typeof item === 'string') {
                let [userID, bookID] = item.split(':');
                arr.push({ userID, bookID });
            }
        })
        return JSON.stringify(arr);
    }

    const onClickReturn = async () => {
        try {
            const result = await apiHandle('PUT', '/returnAction', {
                returnItemString: returnValueHandle()
            }, cookieHandle.get('AUT')?.token);
            const loadData = result.data;
            if (loadData.isError) {
                toast.error(loadData.message, { autoClose: 1500 })
            } else {
                toast.success(loadData.message, { autoClose: 1500 });
            }
        } catch (err) {
            toast.error('서버와의 연결이 끊겼습니다.', { autoClose: 1500 })
        }
        setClickReturn(false);
    }

    const onClickAddBook = async () => {
        try {
            const result = await apiHandle('PUT', '/addBook', {
                bTitle, bAuthor, bCompany, bID: bIDforAdd
            }, cookieHandle.get('AUT')?.token);
            const loadData = result.data;
            if (loadData.isError) {
                toast.error(loadData.message, { autoClose: 1500 })
            } else {
                toast.success(loadData.message, { autoClose: 1500 })
            }
        } catch (err) {
            toast.error('서버와의 연결이 끊겼습니다.', { autoClose: 1500 })
        }
    }

    const onClickDelBook = async () => {
        try {
            const result = await apiHandle('PUT', '/deleteBook', { bID: bIDforDel }, cookieHandle.get('AUT')?.token);
            const loadData = result.data;
            if (loadData.isError) {
                toast.error(loadData.message, { autoClose: 1500 })
            } else {
                toast.success(loadData.message, { autoClose: 1500 })
            }
        } catch (err) {
            toast.error('서버와의 연결이 끊겼습니다.', { autoClose: 1500 })
        }
    }

    useEffect(() => {
        if (cookieHandle.get('AUT')?.token && cookieHandle.get('AUT')?.admin) {
            fetchInfoData();
            fetchHistoryData();
        } else {
            setAlert(true);
        }
    }, [clickReturn]);

    return (
        <>
            <Head>
                <title>단대라이브러리 : 관리자 페이지</title>
                <meta property='og:title' content='단대라이브러리 : 관리자 페이지' />
                <meta property='og:description' content='Click This.' />
                <meta property='og:type' content='website' />
                <meta property='og:url' content='https://ddlib.vercel.app/' />
                <meta property='og:image' content='/img/woongdo.png' />
            </Head>
            <ToastContainer />
            {cookieHandle.get('AUT')?.admin &&
                <>
                    <Navbar />
                    <div className='max-w-screen-xl mx-auto px-2 sm:px-6 lg:px-8'>
                        <div className='mt-16 mb-16 grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4'>
                            <div className='flex items-center p-4 bg-white rounded-lg shadow'>
                                <div className='p-3 mr-4 text-orange-500 bg-orange-100 rounded-full'>
                                    <UserGroupIcon className='w-5 h-5' />
                                </div>
                                <div>
                                    <p className='mb-2 text-sm font-medium text-gray-600'>
                                        단대라이브러리를 이용하는 학생 수
                                    </p>
                                    <p className='text-lg font-semibold text-gray-700'>
                                        {info[0] ??= 0}명
                                    </p>
                                </div>
                            </div>
                            <div className='flex items-center p-4 bg-white rounded-lg shadow'>
                                <div className='p-3 mr-4 text-green-500 bg-green-100 rounded-full'>
                                    <DatabaseIcon className='w-5 h-5' />
                                </div>
                                <div>
                                    <p className='mb-2 text-sm font-medium text-gray-600'>
                                        단대라이브러리에 저장된 책의 수
                                    </p>
                                    <p className='text-lg font-semibold text-gray-700'>
                                        {info[1] ??= 0}권
                                    </p>
                                </div>
                            </div>
                            <div className='flex items-center p-4 bg-white rounded-lg shadow'>
                                <div className='p-3 mr-4 text-blue-500 bg-blue-100 rounded-full'>
                                    <ShoppingCartIcon className='w-5 h-5' />
                                </div>
                                <div>
                                    <p className='mb-2 text-sm font-medium text-gray-600'>
                                        지금까지 책을 빌린 횟수
                                    </p>
                                    <p className='text-lg font-semibold text-gray-700'>
                                        {info[2] ??= 0}번
                                    </p>
                                </div>
                            </div>
                            <div className='flex items-center p-4 bg-white rounded-lg shadow'>
                                <div className='p-3 mr-4 text-teal-500 bg-teal-100 rounded-full'>
                                    <CollectionIcon className='w-5 h-5' />
                                </div>
                                <div>
                                    <p className='mb-2 text-sm font-medium text-gray-600'>
                                        반납을 기다리고 있는 책의 수
                                    </p>
                                    <p className='text-lg font-semibold text-gray-700'>
                                        {bookHistoryList.length ??= 0}권
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className='block'>
                            <hr className='my-16' />
                        </div>
                        <div className='px-4 sm:px-0'>
                            <h3 className='text-4xl tracking-tight leading-tight font-black text-gray-900 sm:leading-none'>빌린 책 반납하기</h3>
                            <p className='mt-4 text-sm text-gray-600'>
                                이곳에서 책을 반납할 수 있어요. 반납하고 싶은 책이 있다면, 왼쪽에 위치한 체크 표시를 누르고 {`'`}반납하기{`'`} 버튼을 눌러주세요.
                            </p>
                        </div>
                        <div className='mt-12 mb-12'>
                            <div className='relative'>
                                <ul className='rounded-md shadow bg-white left-0 right-0 -bottom-18 mt-3 p-3'>
                                    <li className='text-gray-500 border-b border-gray border-solid py-3 px-3 mb-2'>
                                        약 {bookHistoryList.length ??= 0}권의 책이 반납을 기다리고 있어요. {'ᕕ( ᐛ )ᕗ'}
                                    </li>
                                    {bookHistory}
                                </ul>
                            </div>
                        </div>
                        <div className='flex flex-col items-center'>
                            <button
                                onClick={() => {
                                    setClickReturn(true);
                                    onClickReturn();
                                }}
                                type='button'
                                className='cursor-pointer mx-auto hover:bg-blue-600 w-36 px-5 py-3 text-xs leading-5 font-semibold text-white bg-blue-500 inline-flex justify-center rounded-full active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out'>
                                반납하기
                            </button>
                        </div>
                        <div className='block'>
                            <hr className='my-16' />
                        </div>
                        <div className='mt-20 md:grid md:grid-cols-3 md:gap-16'>
                            <div className='md:col-span-1'>
                                <div className='px-4 sm:px-0'>
                                    <h3 className='text-4xl tracking-tight leading-tight font-black text-gray-900 sm:leading-none'>새로운 책 추가하기</h3>
                                    <p className='mt-4 text-sm text-gray-600'>
                                        이 곳에서 새로운 책을 추가할 수 있어요. 추가하고 싶은 책이 있다면, 오른쪽 입력창에 책 정보를 올바르게 입력하고 {`'`}추가하기{`'`} 버튼을 눌러주세요.
                                    </p>
                                    <ul className='mt-4 text-sm text-red-500'>
                                        <li>ㆍ 추가하기 버튼을 누르기 전에 먼저 책 정보를 올바르게 적었는지 확인하세요.</li>
                                    </ul>
                                </div>
                            </div>
                            <div className='mt-5 md:mt-0 md:col-span-2'>
                                <div className='shadow sm:rounded-md sm:overflow-hidden'>
                                    <div className='px-4 py-5 bg-white space-y-6 sm:p-6'>
                                        <div className='col-span-3 sm:col-span-2'>
                                            <label className='block tracking-wide text-gray-700 text-base font-bold mb-2'>
                                                제목
                                            </label>
                                            <input
                                                value={bTitle}
                                                onChange={(e) => {
                                                    setBookTitle(e.target.value)
                                                }}
                                                type='text' placeholder='예) 소나기'
                                                className='required:border-red-500 relative block w-full px-3 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 text-sm'
                                            />
                                        </div>
                                        <div className='col-span-3 sm:col-span-2'>
                                            <label className='block tracking-wide text-gray-700 text-base font-bold mb-2'>
                                                작가
                                            </label>
                                            <input
                                                value={bAuthor}
                                                onChange={(e) => {
                                                    setBookAuthor(e.target.value)
                                                }}
                                                type='text' placeholder='예) 황순원 지음;고성원 그림'
                                                className='required:border-red-500 relative block w-full px-3 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 text-sm'
                                            />
                                        </div>
                                        <div className='col-span-3 sm:col-span-2'>
                                            <label className='block tracking-wide text-gray-700 text-base font-bold mb-2'>
                                                출판사
                                            </label>
                                            <input
                                                value={bCompany}
                                                onChange={(e) => {
                                                    setBookCompany(e.target.value)
                                                }}
                                                type='text' placeholder='예) 맑은소리(거북선)'
                                                className='required:border-red-500 relative block w-full px-3 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 text-sm'
                                            />
                                        </div>
                                        <div className='col-span-3 sm:col-span-2'>
                                            <label className='block tracking-wide text-gray-700 text-base font-bold mb-2'>
                                                식별 아이디 (분류 번호)
                                            </label>
                                            <input
                                                value={bIDforAdd}
                                                onChange={(e) => {
                                                    setBookIDforAdd(e.target.value)
                                                }}
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter')
                                                        onClickAddBook();
                                                }}
                                                type='text' placeholder='예) 813.6황56ㅅ'
                                                className='required:border-red-500 relative block w-full px-3 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 text-sm'
                                            />
                                        </div>
                                        <div className='py-3 text-right'>
                                            <button
                                                onClick={() => onClickAddBook()}
                                                type='button'
                                                className='cursor-pointer mx-auto hover:bg-blue-600 w-36 px-5 py-3 text-xs leading-5 font-semibold text-white bg-blue-500 inline-flex justify-center active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out'
                                            >
                                                추가하기
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='block'>
                            <hr className='my-16' />
                        </div>
                        <div className='mt-20 md:grid md:grid-cols-3 md:gap-16'>
                            <div className='md:col-span-1'>
                                <div className='px-4 sm:px-0'>
                                    <h3 className='text-4xl tracking-tight leading-tight font-black text-gray-900 sm:leading-none'>기존 책 삭제하기</h3>
                                    <p className='mt-4 text-sm text-gray-600'>
                                        이곳에서 기존 책을 삭제할 수 있어요. 삭제하고 싶은 책이 있다면, 오른쪽 입력창에 책 식별 아이디를 올바르게 입력하고 {`'`}삭제하기{`'`} 버튼을 눌러주세요.
                                    </p>
                                    <ul className='mt-4 text-sm text-red-500'>
                                        <li>ㆍ 삭제하기 버튼을 누르기 전에 먼저 책 식별 아이디를 올바르게 적었는지 확인하세요.</li>
                                    </ul>
                                </div>
                            </div>
                            <div className='mt-5 md:mt-0 md:col-span-2'>
                                <div className='shadow sm:rounded-md sm:overflow-hidden'>
                                    <div className='px-4 py-5 bg-white space-y-6 sm:p-6'>
                                        <div className='col-span-3 sm:col-span-2'>
                                            <label className='block tracking-wide text-gray-700 text-base font-bold mb-2'>
                                                식별 아이디 (분류 번호)
                                            </label>
                                            <input
                                                value={bIDforDel}
                                                onChange={(e) => {
                                                    setBookIDforDel(e.target.value)
                                                }}
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter')
                                                        onClickDelBook();
                                                }}
                                                type='text' placeholder='예) 813.6황56ㅅ'
                                                className='required:border-red-500 relative block w-full px-3 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 text-sm'
                                            />
                                        </div>
                                        <div className='py-3 text-right'>
                                            <button
                                                onClick={() => onClickDelBook()}
                                                type='button'
                                                className='cursor-pointer mx-auto hover:bg-red-600 w-36 px-5 py-3 text-xs leading-5 font-semibold text-white bg-red-500 inline-flex justify-center active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out'
                                            >
                                                삭제하기
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Footer />
                </>
            }
            {
                alert &&
                <ModalAlert
                    title={'로그인이 필요합니다.'}
                    message={'이 페이지는 관리자 전용 페이지입니다. 관리자 계정으로 다시 로그인해주세요.'}
                    modalClickAction={clickModal}
                />
            }
        </>
    );
}

export default DashboardPage;