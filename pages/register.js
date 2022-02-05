import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import apiHandle from '../lib/api';
import cryptoHandle from '../lib/crypto';

const Register = () => {

  const router = useRouter();

  const [userID, setID] = useState('');
  const [userPW, setPW] = useState('');
  const [userPW_re, setPW_re] = useState('');
  const [userName, setName] = useState('');
  const [userBirthday, setBirth] = useState('');

  const onClickRegister = async () => {
    if (!userID || !userPW || !userPW_re || !userName || !userBirthday) {
      toast.error('입력하지 않은 값들이 있습니다.', { autoClose: 1500 });
    } else if (userPW.length < 8) {
      toast.error('비밀번호는 8자 이상이여야 합니다.', { autoClose: 1500 });
    } else if (userPW != userPW_re) {
      toast.error('비밀번호가 서로 맞지 않습니다.', { autoClose: 1500 });
    } else {
      try {
        const response = await apiHandle('POST', '/register', {
          userID: cryptoHandle.AES_ENC(userID),
          userPW: cryptoHandle.AES_ENC(userPW),
          userName: cryptoHandle.AES_ENC(userName),
          userBirthday: cryptoHandle.AES_ENC(userBirthday),
        });
        const loadData = response.data;
        if (loadData.isError) {
          toast.error(loadData.message, { autoClose: 1500 });
        }
        router.push(loadData.isError ? '/register' : '/login');
      } catch (err) {
        console.log(err);
        toast.error('서버와의 연결이 끊겼습니다.', { autoClose: 1500 });
      }
    }
  }

  return (
    <>
      <Head>
        <title>단대라이브러리 : 회원가입</title>
        <meta property='og:title' content='단대라이브러리 : 회원가입' />
        <meta property='og:description' content='Click This.' />
        <meta property='og:type' content='website' />
        <meta property='og:url' content='https://ddlib.vercel.app/' />
        <meta property='og:image' content='/img/woongdo.png' />
      </Head>
      <ToastContainer />
      <div className='min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-md w-full space-y-8'>
          <div>
            <h2 className='font-black mt-6 text-4xl'>
              회원가입하기
            </h2>
          </div>
          <form className='mt-8 space-y-6'>
            <div className='inputForm'>
              <input
                name='userID'
                type='text'
                required
                className='relative block w-full px-3 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 text-sm'
                placeholder='아이디를 입력하세요.'
                minLength='5'
                maxLength='30'
                autoComplete='off'
                value={userID}
                onChange={(e) => {
                  setID(e.target.value)
                }}
              />
              <input
                name='userPW'
                type='password'
                required
                className='relative block w-full px-3 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 text-sm'
                placeholder='비밀번호를 입력하세요.'
                minLength='8'
                autoComplete='off'
                value={userPW}
                onChange={(e) => {
                  setPW(e.target.value)
                }}
              />
              <input
                name='userPW_re'
                type='password'
                required
                className='relative block w-full px-3 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 text-sm'
                placeholder='비밀번호를 다시 입력하세요.'
                minLength='8'
                autoComplete='off'
                value={userPW_re}
                onChange={(e) => {
                  setPW_re(e.target.value)
                }}
              />
              <input
                name='userName'
                type='text'
                required
                className='relative block w-full px-3 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 text-sm'
                placeholder='이름을 입력하세요.'
                minLength='1'
                maxLength='10'
                autoComplete='off'
                value={userName}
                onChange={(e) => {
                  setName(e.target.value)
                }}
              />
              <input
                name='userBirthday'
                type='number'
                required
                className='relative block w-full px-3 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 text-sm'
                placeholder='생년월일을 입력하세요. (ex. 040522)'
                minLength='6'
                autoComplete='off'
                value={userBirthday}
                onChange={(e) => {
                  setBirth(e.target.value)
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter')
                    onClickRegister();
                }}
              />
            </div>
            <div className='text-sm pt-4'>
              <p>
                수집된 개인정보는 원활한 서비스 이용을 위한 목적으로 사용되오며,
                일체 다른목적으로 사용되지 않습니다. 회원가입 시{' '}
                <span>
                  <a
                    href='https://diagnostic-fender-8b3.notion.site/34d7e795c317475a8aed82c73e63c2e7'
                    className='font-semibold hover:text-gray-500'
                  >
                    개인정보처리방침
                  </a>
                </span>{' '}
                및{' '}
                <span>
                  <a
                    href='https://diagnostic-fender-8b3.notion.site/cb20a978c0a74c0ab25aba0af413c5a0'
                    className='font-semibold hover:text-gray-500'
                  >
                    서비스 이용약관
                  </a>
                </span>
                에 동의하게 됩니다.
              </p>
            </div>
            <div className='pt-5'>
              <button
                onClick={onClickRegister}
                type='button'
                className='relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500'
              >
                회원가입
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
