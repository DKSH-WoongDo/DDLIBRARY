import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import Loader from '../components/loader';
import apiHandle from '../lib/api';
import cookieHandle from '../lib/cookie';
import cryptoHandle from '../lib/crypto';

const SECONDS_IN_A_HOUR = 60 * 60;

const fetchUserInfo = async (token) => {
  const result = await apiHandle('POST', '/token', { token });
  const loadData = result.data;
  if (!loadData.isError) {
    const userInfo = JSON.stringify({
      admin: loadData?.returnValue?.type === 'A' ? true : false,
      token,
      name: loadData?.returnValue?.name,
      id: loadData?.returnValue?.id
    });
    cookieHandle.set('AUT', userInfo, { path: '/', maxAge: SECONDS_IN_A_HOUR });
  };
}

const Login = () => {

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [id, setID] = useState('');
  const [pw, setPW] = useState('');

  const onClickLogin = async () => {
    if (!id || !pw) {
      toast.error('입력하지 않은 값들이 있습니다.', { autoClose: 1500 });
    } else {
      try {
        const result = await apiHandle('POST', '/login', {
          userID: cryptoHandle.AES_ENC(id),
          userPW: cryptoHandle.AES_ENC(pw)
        });
        const loadData = result.data;
        if (loadData.isError) {
          toast.error(loadData.message, { autoClose: 1500 });
        } else {
          fetchUserInfo(loadData.token);
          setLoading(true);
          toast.success(loadData.message, { autoClose: 1500 });
          setTimeout(() => {
            setLoading(false);
            router.back();
          }, 1500);
        }
      } catch (err) {
        toast.error('서버와의 연결이 끊겼습니다.', { autoClose: 1500 });
      }
    }
  }

  return (
    <>
      <Head>
        <title>단대라이브러리 : 로그인</title>
        <meta property='og:title' content='단대라이브러리 : 로그인' />
        <meta property='og:description' content='Click This.' />
        <meta property='og:type' content='website' />
        <meta property='og:url' content='https://ddlibrary.vercel.app/' />
        <meta property='og:image' content='/img/woongdo.png' />
      </Head>
      <ToastContainer />
      {
        loading ? <Loader />
          :
          <div className='min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
            <div className='max-w-md w-full space-y-8'>
              <div>
                <h2 className='font-black mt-6 text-4xl'>
                  로그인하기
                </h2>
              </div>
              <form className='mt-8 space-y-6'>
                <div className='inputForm'>
                  <input
                    type='text'
                    required
                    className='relative block w-full px-3 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 text-sm'
                    placeholder='아이디를 입력하세요.'
                    minLength='5'
                    maxLength='30'
                    autoComplete='off'
                    value={id}
                    onChange={(e) => {
                      setID(e.target.value)
                    }}
                  />
                  <input
                    type='password'
                    required
                    className='relative block w-full px-3 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 text-sm'
                    placeholder='비밀번호를 입력하세요.'
                    minLength='8'
                    autoComplete='off'
                    value={pw}
                    onChange={(e) => {
                      setPW(e.target.value)
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter')
                        onClickLogin();
                    }}
                  />
                </div>
                <div className='pt-5'>
                  <button
                    onClick={onClickLogin}
                    type='button'
                    className='relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500'
                  >
                    로그인
                  </button>
                </div>
              </form>
            </div>
          </div>
      }
    </>
  );
};

export default Login;
