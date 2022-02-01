import { ClipboardCopyIcon } from '@heroicons/react/outline';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard/lib/Component';
import { toast, ToastContainer } from 'react-toastify';
import ModalConfrim from '../components/confirm';
import Footer from '../components/footer';
import Loader from '../components/loader';
import Navbar from '../components/navbar';
import apiHandle from '../lib/api';
import cookieHandle from '../lib/cookie';
import cryptoHandle from '../lib/crypto';

const SettingPage = () => {

    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(false);
    const [xConfirm, setConfirm] = useState(false);
    const [old_userPW, setPW] = useState('');
    const [new_userPW, setNewPW] = useState('');
    const [new_userPW_re, setNewPW_re] = useState('');

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

    const onClickResetPW = async () => {
        if (!old_userPW || !new_userPW || !new_userPW_re) {
            toast.error('입력하지 않은 값들이 있습니다.', { autoClose: 1500 });
        } else if (new_userPW.length < 8) {
            toast.error('새로운 비밀번호는 8자 이상이여야 합니다.', { autoClose: 1500 });
        } else if (new_userPW != new_userPW_re) {
            toast.error('비밀번호가 서로 맞지 않습니다.', { autoClose: 1500 });
        } else {
            try {
                const result = await apiHandle('POST', '/pwReset', {
                    old_userPW: cryptoHandle.AES_ENC(old_userPW),
                    new_userPW: cryptoHandle.AES_ENC(new_userPW),
                    new_userPW_re: cryptoHandle.AES_ENC(new_userPW_re),
                }, cookieHandle.get('AUT')?.token);
                const loadData = result.data;
                if (loadData.isError) {
                    toast.error(loadData.message, { autoClose: 1500 });
                } else {
                    setLoading(true);
                    cookieHandle.remove('AUT');
                    toast.success(loadData.message, { autoClose: 1500 });
                    setTimeout(() => {
                        setLoading(false);
                        router.push('/login')
                    }, 1500);
                }
            } catch (err) {
                toast.error('서버와의 연결이 끊겼습니다.', { autoClose: 1500 });
            }
        }
    }

    const onClickWithDraw = async () => {
        try {
            if (xConfirm) {
                const result = await apiHandle('DELETE', '/withDraw', null, cookieHandle.get('AUT')?.token);
                const loadData = result.data;
                if (loadData.isError) {
                    toast.error(loadData.message, { autoClose: 1500 })
                } else {
                    setLoading(true);
                    cookieHandle.remove('AUT');
                    toast.success(loadData.message, { autoClose: 1500 })
                    setTimeout(() => {
                        setLoading(false);
                        router.push('/login')
                    }, 1500);
                }
            }
        } catch (err) {
            toast.error('서버와의 연결이 끊겼습니다.', { autoClose: 1500 })
        }
        setConfirm(false);
    }

    useEffect(() => {
        onClickWithDraw()
    }, [xConfirm])

    return (
        <>
            <Head>
                <title>단대라이브러리 : 설정</title>
                <meta property='og:title' content='단대라이브러리 : 설정' />
                <meta property='og:description' content='Click This.' />
                <meta property='og:type' content='website' />
                <meta property='og:url' content='https://ddlibrary.vercel.app/' />
                <meta property='og:image' content='/img/woongdo.png' />
            </Head>
            <ToastContainer />
            {
                alert &&
                <ModalConfrim
                    title={'정말 탈퇴하시겠습니까?'}
                    message={`지금까지 웅도 서비스를 이용해주셔서 감사합니다. 회원 탈퇴 처리 후에는 회원님의 대출 내역 이 외의 개인정보를 복원할 수 없습니다.`}
                    modalClickAction={clickModal}
                />
            }
            {loading ? <Loader /> :
                <>
                    <Navbar />
                    <div className='max-w-screen-xl mx-auto px-2 sm:px-6 lg:px-8'>
                        {!cookieHandle.get('AUT')?.token && (
                            <div className='mt-8'>
                                <div className='flex p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg'>
                                    <svg xmlns='http://www.w3.org/1500/svg' className='inline flex-shrink-0 mr-3 w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                                    </svg>
                                    <div>
                                        <p>이 곳은 로그인이 되어있지 않은 상태에서는 수행할 수 없어요.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className='mt-16 md:grid md:grid-cols-3 md:gap-16'>
                            <div className='md:col-span-1'>
                                <div className='px-4 sm:px-0'>
                                    <h3 className='text-4xl tracking-tight leading-tight font-black text-gray-900 sm:leading-none'>기본 프로필</h3>
                                    <p className='mt-4 text-sm text-gray-600'>
                                        웅도 서비스 계정 정보를 여기에서 확인해보세요. 필요에 따라 쿨하게 탈퇴하실 수도 있어요. 그래도 탈퇴는 안 하실꺼죠? ( ╥ω╥ )
                                    </p>
                                </div>
                            </div>
                            <div className='mt-5 md:mt-0 md:col-span-2'>
                                <div className='shadow sm:rounded-md sm:overflow-hidden'>
                                    <div className='px-4 py-5 bg-white space-y-6 sm:p-6'>
                                        <div className='col-span-3 sm:col-span-2'>
                                            <label className='block tracking-wide text-gray-700 text-base font-bold mb-2'>
                                                아이디
                                            </label>
                                            <input
                                                disabled
                                                type='text'
                                                className='relative block w-full px-3 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 text-sm'
                                                value={cryptoHandle.AES_DEC(cookieHandle.get('AUT')?.id)}
                                            />
                                        </div>
                                        <div className='col-span-3 sm:col-span-2'>
                                            <label className='block tracking-wide text-gray-700 text-base font-bold mb-2'>
                                                이름
                                            </label>
                                            <input
                                                disabled
                                                type='text'
                                                className='relative block w-full px-3 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 text-sm'
                                                value={cryptoHandle.AES_DEC(cookieHandle.get('AUT')?.name)}
                                            />
                                        </div>
                                        <div className='col-span-3 sm:col-span-2'>
                                            <label className='block tracking-wide text-gray-700 text-base font-bold mb-2'>
                                                액세스 토큰
                                            </label>
                                            <div className='flex'>
                                                <CopyToClipboard text={cookieHandle.get('AUT')?.token}>
                                                    <button
                                                        type='button'
                                                        className='inline-flex items-center px-3 text-sm text-gray-600 bg-gray-200 rounded-l-md border border-r-0 border-gray-300'>
                                                        <ClipboardCopyIcon className='w-5 h-6' />
                                                    </button>
                                                </CopyToClipboard>
                                                <input
                                                    disabled
                                                    type='text'
                                                    className='relative block w-full px-3 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 text-sm'
                                                    value={cookieHandle.get('AUT')?.token}
                                                />
                                            </div>
                                        </div>
                                        <div className='py-3 text-right'>
                                            <button
                                                onClick={() => { setAlert(true); onClickWithDraw(); }}
                                                type='button'
                                                className='cursor-pointer mx-auto hover:bg-red-700 w-36 px-5 py-3 text-xs leading-5 font-semibold text-white bg-red-600 inline-flex justify-center active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out'
                                            >
                                                탈퇴하기
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='hidden sm:block'>
                            <hr className='my-16' />
                        </div>
                        <div className='mt-16 md:grid md:grid-cols-3 md:gap-16'>
                            <div className='md:col-span-1'>
                                <div className='px-4 sm:px-0'>
                                    <h3 className='text-4xl tracking-tight leading-tight font-black text-gray-900 sm:leading-none'>비밀번호 변경</h3>
                                    <p className='mt-4 text-sm text-gray-600'>
                                        회원님의 개인정보를 보호하기 위해, 암호화를 진행하고 있습니다. 안전하고 새로운 웅도 서비스 계정 비밀번호를 만들어 수정해보세요.
                                    </p>
                                    <ul className='mt-4 text-sm text-red-500'>
                                        <li>ㆍ 이전 비밀번호를 옳게 적어야해요.</li>
                                        <li>ㆍ 새로운 비밀번호와 확인용 비밀번호를 똑같게 적어야해요.</li>
                                        <li>ㆍ 최소 8문자 이상 적어야해요.</li>
                                    </ul>
                                </div>
                            </div>
                            <div className='mt-5 md:mt-0 md:col-span-2'>
                                <div className='shadow sm:rounded-md sm:overflow-hidden'>
                                    <div className='px-4 py-5 bg-white space-y-6 sm:p-6'>
                                        <div className='col-span-3 sm:col-span-2'>
                                            <label className='block tracking-wide text-gray-700 text-base font-bold mb-2'>
                                                현재 비밀번호
                                            </label>
                                            <input
                                                value={old_userPW}
                                                onChange={(e) => {
                                                    setPW(e.target.value)
                                                }}
                                                type='password' placeholder='******************'
                                                className='required:border-red-500 relative block w-full px-3 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 text-sm'
                                            />
                                        </div>
                                        <div className='col-span-3 sm:col-span-2'>
                                            <label className='block tracking-wide text-gray-700 text-base font-bold mb-2'>
                                                새로운 비밀번호
                                            </label>
                                            <input
                                                value={new_userPW}
                                                onChange={(e) => {
                                                    setNewPW(e.target.value)
                                                }}
                                                type='password' placeholder='******************'
                                                className='required:border-red-500 relative block w-full px-3 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 text-sm'
                                            />
                                        </div>
                                        <div className='col-span-3 sm:col-span-2'>
                                            <label className='block tracking-wide text-gray-700 text-base font-bold mb-2'>
                                                새로운 비밀번호 (재)
                                            </label>
                                            <input
                                                value={new_userPW_re}
                                                onChange={(e) => {
                                                    setNewPW_re(e.target.value)
                                                }}
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter')
                                                        onClickResetPW();
                                                }}
                                                type='password' placeholder='******************'
                                                className='required:border-red-500 relative block w-full px-3 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 text-sm'
                                            />
                                        </div>
                                        <div className='py-3 text-right'>
                                            <button
                                                onClick={() => onClickResetPW()}
                                                type='button'
                                                className='cursor-pointer mx-auto hover:bg-blue-600 w-36 px-5 py-3 text-xs leading-5 font-semibold text-white bg-blue-500 inline-flex justify-center active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out'
                                            >
                                                저장하기
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
        </>
    )
}

export default SettingPage;