import { SearchIcon } from '@heroicons/react/outline';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Footer from '../components/footer';
import Navbar from '../components/navbar';

const Home = () => {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const submitQuery = () => {
    router.push(`search?q=${query}`);
  }

  return (
    <>
      <Head>
        <title>단대라이브러리 : 책을 더 쉽게</title>
        <meta property='og:title' content='단대라이브러리 : 책을 더 쉽게' />
        <meta property='og:description' content='Click This.' />
        <meta property='og:type' content='website' />
        <meta property='og:url' content='https://ddlib.vercel.app/' />
        <meta property='og:image' content='/img/woongdo.png' />
      </Head>
      <Navbar />
      <div className='main'>
        <div className='max-w-screen-xl mx-auto px-2 sm:px-6 lg:px-8'>
          <div className='text-base px-3 py-2'>
            <h4 className='text _1'>
              세상에서 가장 편한 도서관
            </h4>
            <h1 className='font-black text-white text-5xl'>
              단대라이브러리
            </h1>
            <h4 className='text _2'>
              손쉽게 책을 검색하고 빌려보세요. 찾고 싶은 책의 제목을 적어보세요.
            </h4>
          </div>
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
                  if (e.key === 'Enter')
                    submitQuery();
                }}
              />
              <button className='text-gray-500 relative right-10 -mr-5' onClick={() => { submitQuery() }}>
                <SearchIcon className='h-6 w-6' aria-hidden='true' />
              </button>
            </div>
          </div>
          <div className='px-2 mt-36'>
            <div className='py-6'>
              <p className='mt-8 font-semibold text-indigo-500'>
                이전에 있던 사이트가 보기 힘들었다고요?
              </p>
              <p className='mt-4 text-2xl sm:text-4xl font-extrabold tracking-tight'>
                원하는 책 정보를 가독성 높은 웹사이트로.{' '}
                <div style={{ margin: '8px' }}></div>
                단대라이브러리로{' '}
                <span className='px-2 text-white bg-indigo-600'>깔끔하게.</span>
              </p>
              <p className='mt-4 max-w-3xl'>
                우리 학교가 사용하고 있던 기존 도서 검색 시스템은 알아보기 어려운 디자인과 그에 따른 접근성이 매우 낮았죠.
                <br />
                단대라이브러리는 이러한 단점을 완벽하게 보완했어요.
              </p>
            </div>
            <div className='py-6'>
              <p className='mt-8 font-semibold text-pink-500'>
                더이상 번거롭게 책을 빌리기 싫으시다고요?
              </p>
              <p className='mt-4 text-2xl sm:text-4xl font-extrabold tracking-tight'>
                원하는 책 대출부터 대출 내역까지.
                <div style={{ margin: '8px' }}></div>
                단대라이브러리로{' '}
                <span className='px-2 text-white bg-pink-500'>스마트하게.</span>
              </p>
              <p className='mt-4 max-w-3xl'>
                단국대학교부속소프트웨어고등학교의 가장 편리한 온라인 도서관,
                단대라이브러리에 로그인하여 온라인으로 책을 빌려보세요. 원하는
                책 대출은 기본, 여태까지 빌렸던 책 대출 내역을 한 번에 볼 수
                있어요.
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Home;
