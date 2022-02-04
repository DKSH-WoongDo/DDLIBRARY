import Head from 'next/head';
import Link from "next/link";
import Footer from '../components/footer';
import Navbar from '../components/navbar';

const Error404 = () => {
    return (
        <>
            <Head>
                <title>단대라이브러리 : 404</title>
                <meta property='og:title' content='단대라이브러리 : 404' />
                <meta property='og:description' content='Click This.' />
                <meta property='og:type' content='website' />
                <meta property='og:url' content='https://ddlib.vercel.app/' />
                <meta property='og:image' content='/img/woongdo.png' />
            </Head>
            <Navbar />
            <section style={{ margin: '10vh' }}>
                <div className='pt-10 sm:pt-12 md:pt-16 lg:pt-20 xl:pt-28 bg-white z-10'>
                    <div className='mx-auto max-w-screen-xl px-4 sm:px-6 bg-white'>
                        <div className='text-center flex flex-col items-center'>
                            <h2 className='text-9xl font-black tracking-tight leading-tight'>404</h2>
                            <p className='mt-3 max-w-md mx-auto lg:mx-0 text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl w-8/12'>
                                <Link href='/' className='cursor-pointer'>메인 페이지로 되돌아가기</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    )
}

export default Error404;