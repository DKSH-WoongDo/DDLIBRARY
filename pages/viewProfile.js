import Head from 'next/head';
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import Footer from '../components/footer';
import Navbar from '../components/navbar';
import apiHandle from '../lib/api';
import cookieHandle from '../lib/cookie';
import cryptoHandle from '../lib/crypto';

const MyPage = () => {
    const [bookHistoryList, setBookHistoryList] = useState([]);

    const fetchHistoryData = async () => {
        try {
            const response = await apiHandle('GET', `/history`, null, cookieHandle.get('AUT')?.token, { params: { userID: cookieHandle.get('AUT').id } });
            const loadData = response.data;
            if (loadData.isError) {
                toast.warn(loadData.message, { autoClose: 1500 });
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

    useEffect(() => {
        if (cookieHandle.get('AUT')?.token)
            fetchHistoryData();
    }, []);

    return (
        <>
            <Head>
                <title>단대라이브러리 : 내 프로필</title>
                <meta property='og:title' content='단대라이브러리 : 내 프로필' />
                <meta property='og:description' content='Click This.' />
                <meta property='og:type' content='website' />
                <meta property='og:url' content='https://ddlib.vercel.app/' />
                <meta property='og:image' content='/img/woongdo.png' />
            </Head>
            <Navbar />
            <ToastContainer />
            <div className='max-w-screen-xl mx-auto px-2 sm:px-6 lg:px-8'>
                <div className='px-3 mt-10 sm:mt-28'>
                    <h2 className='text-4xl tracking-tight leading-tight font-black text-gray-900 sm:text-5xl sm:leading-none'>
                        안녕하세요. {cookieHandle.get('AUT') ? (`${cryptoHandle.AES_DEC(cookieHandle.get('AUT')?.name)}님!`) : ('Guest님!')}
                    </h2>
                </div>
                <div className='mt-6 mb-12 sm:pt-12 md:pt-16 lg:pt-20 xl:pt-28'>
                    <div className='relative'>
                        <ul className='rounded-md shadow-md bg-white left-0 right-0 -bottom-18 mt-3 p-3'>
                            <li className='text-gray-500 border-b border-gray border-solid py-3 px-3 mb-2'>
                                {cookieHandle.get('AUT') ? (`${cryptoHandle.AES_DEC(cookieHandle.get('AUT')?.name)}`) : ('Guest')}님께서 지금까지 빌리셨던 책 목록이에요 {':-)'}
                            </li>
                            {
                                bookHistoryList && bookHistoryList.map((item, idx) => (
                                    <>
                                        <li className='grid grid-cols-10 gap-4 justify-center items-center px-4 py-2 rounded-lg hover:bg-gray-50'>
                                            <div className='flex justify-center items-center'>
                                                {idx + 1}
                                            </div>
                                            <div className='col-start-2 col-end-11 pl-8 border-l-2 border-solid border-gray'>
                                                {item?.status === 0 ?
                                                    <p className='text-blue-500 mt-1 font-regular text-sm'>반납 완료</p>
                                                    : <p className='text-red-600 mt-1 font-regular text-sm'>반납 미완료</p>}
                                                <h3 className='text-gray-900 font-medium text-md'>{item?.bookTitle} {'('}{item?.bookID}{')'}</h3>
                                                <p className='text-gray-600 mt-1 font-regular text-sm'>
                                                    {item?.fromDate.split('T')[0]} - {item?.endDate.split('T')[0]}
                                                </p>
                                            </div>
                                        </li>
                                    </>
                                ))
                            }
                        </ul>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
};

export default MyPage;