import { Disclosure, Menu, Transition } from '@headlessui/react';
import { MenuIcon, UserIcon, XIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import cookieHandle from '../lib/cookie';

const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Docs', href: 'https://github.com/DKSH-WoongDo/Introduce-Woongdo' },
    { name: 'API', href: 'https://github.com/DKSH-WoongDo/Woongdo-API' },
]

const Navbar = () => {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const logout = () => {
        setIsLoggedIn(false);
        cookieHandle.remove('AUT');
        toast.success('로그아웃이 완료되었습니다.', {
            autoClose: 1500,
            position: toast.POSITION.TOP_RIGHT
        });
        router.reload();
    }

    useEffect(() => {
        if (cookieHandle.get('AUT')?.token) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    return (
        <>
            <ToastContainer />
            <Disclosure as='nav'>
                {({ open }) => (
                    <>
                        <div className='max-w-screen-xl mx-auto px-2 sm:px-6 lg:px-8'>
                            <div className='relative flex items-center justify-between h-16'>
                                <div className='absolute inset-y-0 left-0 flex items-center sm:hidden'>
                                    <Disclosure.Button className='inline-flex items-center justify-center p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'>
                                        <span className='sr-only'>Open main menu</span>
                                        {open ?
                                            <XIcon className='block h-6 w-6' aria-hidden='true' />
                                            : <MenuIcon className='block h-6 w-6' aria-hidden='true' />
                                        }
                                    </Disclosure.Button>
                                </div>
                                <div className='flex-1 flex items-center justify-center sm:items-stretch sm:justify-start'>
                                    <div className='hidden sm:block'>
                                        <div className='flex space-x-4'>
                                            {navigation.map((item) => (
                                                <button
                                                    key={item.name}
                                                    onClick={() => router.push(item.href)}
                                                    className='px-3 py-2 rounded-md text-sm font-medium'
                                                >
                                                    {item.name}
                                                </button>
                                            ))}
                                            {cookieHandle.get('AUT')?.admin && (
                                                <button
                                                    onClick={() => router.push('manage')}
                                                    className='px-3 py-2 rounded-md text-sm font-medium'
                                                >
                                                    Manage
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className='z-50 absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0'>
                                    <Menu as='div' className='ml-3 relative'>
                                        <div>
                                            <Menu.Button className='p-2 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white'>
                                                <span className='sr-only'>Open user menu</span>
                                                <UserIcon className='h-6 w-6' aria-hidden='true' />
                                            </Menu.Button>
                                        </div>
                                        <Transition
                                            as={Fragment}
                                            enter='transition ease-out duration-100'
                                            enterFrom='transform opacity-0 scale-95'
                                            enterTo='transform opacity-100 scale-100'
                                            leave='transition ease-in duration-75'
                                            leaveFrom='transform opacity-100 scale-100'
                                            leaveTo='transform opacity-0 scale-95'
                                        >
                                            <Menu.Items className='origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none'>
                                                {isLoggedIn ?
                                                    <>
                                                        <div
                                                            className='cursor-pointer hover:bg-gray-200 block px-4 py-2 text-sm text-gray-700'
                                                            onClick={() => router.push('viewProfile')}
                                                        >
                                                            내 프로필
                                                        </div>
                                                        <div
                                                            className='cursor-pointer hover:bg-gray-200 block px-4 py-2 text-sm text-gray-700'
                                                            onClick={() => router.push('settings')}
                                                        >
                                                            설정
                                                        </div>
                                                        <div
                                                            className='cursor-pointer hover:bg-gray-200 block px-4 py-2 text-sm text-gray-700'
                                                            onClick={() => logout()}
                                                        >
                                                            로그아웃
                                                        </div>
                                                    </>
                                                    :
                                                    <>
                                                        <div
                                                            className='cursor-pointer hover:bg-gray-200 block px-4 py-2 text-sm text-gray-700'
                                                            onClick={() => router.push('login')}
                                                        >
                                                            로그인하기
                                                        </div>
                                                        <div
                                                            className='cursor-pointer hover:bg-gray-200 block px-4 py-2 text-sm text-gray-700'
                                                            onClick={() => router.push('register')}>
                                                            회원가입하기
                                                        </div>
                                                    </>
                                                }
                                            </Menu.Items>
                                        </Transition>
                                    </Menu>
                                </div>
                            </div>
                        </div>
                        <Disclosure.Panel className='sm:hidden'>
                            <div className='px-2 pt-2 pb-3 space-y-1'>
                                {navigation.map((item) => (
                                    <button
                                        key={item.name}
                                        onClick={() => router.push(item.href)}
                                        className='block px-3 py-2 rounded-md text-base font-medium'
                                    >
                                        {item.name}
                                    </button>
                                ))}
                                {cookieHandle.get('AUT')?.admin && (
                                    <button
                                        onClick={() => router.push('manage')}
                                        className='block px-3 py-2 rounded-md text-base font-medium'
                                    >
                                        Manage
                                    </button>
                                )}
                            </div>
                        </Disclosure.Panel>
                    </>
                )}
            </Disclosure >
        </>
    )
};

export default Navbar;