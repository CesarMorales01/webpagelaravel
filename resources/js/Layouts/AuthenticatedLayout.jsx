import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import { Link } from '@inertiajs/react';
import MuiAutoComplete from '@/Pages/UIGeneral/MuiAutoComplete'
import React, { useState, useEffect } from 'react'

export default function Authenticated({ user, header, children, info, globalVars, thisUrl, productos }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false)

    useEffect(() => {
        getSize()
    }, [])

    function goHome() {
        document.getElementById('linkHome').click()
    }

    window.onresize= getSize

    function getSize() {
        const ancho=window.innerWidth;
        if(ancho>768 & document.getElementById('search1')!=null){
            document.getElementById('search1').style.display='inline'
            document.getElementById('search2').style.display='none'
        }else{
            document.getElementById('search1').style.display='none'
            document.getElementById('search2').style.display='inline'
        }
    }

    return (
        <div className="min-h-screen bg-white">
            <nav style={{ backgroundColor: info.color_pagina }} >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                                <Link id='linkHome' href={route('index')}>
                                    <img className='img-fuild rounded' width="60em" height="60em" src={info.logo == '' ? globalVars.urlRoot + '/Imagenes_config/noPreview.jpg' : globalVars.urlRoot + "/Imagenes_productos/" + info.logo} />
                                </Link>
                                <span onClick={goHome} style={{ color: 'white', cursor: 'pointer', marginLeft: '0.2em' }}>{info.nombre}</span>
                            </div>
                            <div className="hidden space-x-8 md:-my-px md:ml-10 md:flex ">
                                <div id='search1' style={{ marginTop: '0.6em'}}>
                                    <MuiAutoComplete className='form-control mr-sm-2' productos={productos} url={globalVars.thisUrl}></MuiAutoComplete>
                                </div>
                                <NavLink active={route().current('categorias')}>
                                    Categorias
                                </NavLink>
                                <NavLink href={route('index')} active={route().current('contactanos')}>
                                    Contáctanos
                                </NavLink>
                            </div>
                        </div>

                        <div className="hidden md:flex md:items-center md:ml-6">
                            <div className="ml-3 relative">
                                {user ?
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-md">
                                                <button type="button"
                                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150" >
                                                    {user.name}
                                                    <svg className="ml-2 -mr-0.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" >
                                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </span>
                                        </Dropdown.Trigger>

                                        <Dropdown.Content>
                                            <Dropdown.Link href={route('profile.edit')}>Cuenta</Dropdown.Link>
                                            <Dropdown.Link href={route('logout')} method="post" as="button">
                                                Salir
                                            </Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                    :
                                    <a href={route('gologin', 'no')} className="inline-flex rounded-md">
                                        <button type="button"
                                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150" >
                                            Ingresar
                                        </button>
                                    </a>
                                }
                            </div>
                        </div>

                        <div className="-mr-2 flex items-center md:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 bg-white hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div style={{ marginLeft: '0.5em' }} className={(showingNavigationDropdown ? 'block' : 'hidden') + ' md:hidden'}>
                    <div className="pt-2 pb-3 space-y-1">
                        <NavLink href={route('gologin', 'no')} active={route().current('dashboard')}>
                            Categorias
                        </NavLink>


                    </div>
                    <div className="pt-4 pb-1 border-t border-gray-200">
                        {user ?
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <span className="inline-flex rounded-md">
                                        <button type="button"
                                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150" >
                                            {user.name}
                                            <svg className="ml-2 -mr-0.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" >
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </span>
                                </Dropdown.Trigger>

                                <Dropdown.Content>
                                    <Dropdown.Link href={route('profile.edit')}>Cuenta</Dropdown.Link>
                                    <Dropdown.Link href={route('logout')} method="post" as="button">
                                        Salir
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                            :
                            <a href={route('gologin', 'no')} className="inline-flex rounded-md">
                                <button type="button"
                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150" >
                                    Ingresar
                                </button>
                            </a>
                        }
                    </div>
                </div>
                <div id='search2' >
                    <MuiAutoComplete className='form-control mr-sm-2' productos={productos}></MuiAutoComplete>
                </div>

            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{header}</div>
                </header>
            )}

            <main>{children}</main>

        </div>
    );
}

