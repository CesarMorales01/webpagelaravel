import { useEffect } from 'react';
import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Link, useForm } from '@inertiajs/react';
import GlobalFunctions from '../services/GlobalFunctions';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Login({ status, canResetPassword, info, auth, productos, globalVars, request }) {

    const glob = new GlobalFunctions();
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });
    console.log(request)
    useEffect(() => {
        validarRemember()
        validarRedirect()
        return () => {
            reset('password');
        };
    }, []);

    function validarRedirect(){
        if(request.email!=''){
            setData((valores) => ({
                ...valores,
                email: request.email,
                password: request.password,
                remember: true
            }))
            setTimeout(() => {
              //  console.log('go')
             // document.getElementById('btnLogin').click()
            }, 200);
        }
    }

    function validarRemember() {
        if (glob.getCookie('email') != '') {
            setData((valores) => ({
                ...valores,
                email: glob.getCookie('email'),
                password: glob.getCookie('password'),
                remember: true
            }))
        }
    }

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <>

            <Head title="Welcome" />
            <AuthenticatedLayout user={auth} info={info} globalVars={globalVars} productos={productos} >
                <GuestLayout >
                    <Head title="Log in" />
                    {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}
                    <div className='grid place-items-center m-3'>
                        <Link href="/">
                            <img className='img-fuild rounded' width="120em" height="120em" src={info.length == 0 ? '' : globalVars.urlRoot + '/Imagenes_productos/' + info.logo} />
                        </Link>
                    </div>
                    <form id='formLogin'action={route('login')}  method="post" onSubmit={submit}>
                        <div>
                            <InputLabel htmlFor="email" value="Email" />

                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full"
                                autoComplete="username"
                                isFocused={true}
                                onChange={(e) => setData('email', e.target.value)}
                            />

                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="password" value="Password" />

                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full"
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                            />

                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div style={{ marginTop: '2em' }} className="grid place-items-center">
                            <PrimaryButton id='btnLogin' type='submit' style={{ backgroundColor: info.color_pagina }} className="ml-4" disabled={processing}>
                                Iniciar sesión
                            </PrimaryButton>
                        </div>
                        <div style={{ marginTop: '1.5em' }} className="grid place-items-center m-3">
                            <label className="flex items-center">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                />
                                <span className="ml-2 text-sm text-gray-600">Remember me</span>
                            </label>
                        </div>
                    </form>
                    <div className="flex items-center justify-end mt-4">
                        <Link
                            href={route('password.request')}
                            className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Forgot your password?
                        </Link>
                    </div>
                    <div className="flex items-center justify-end mt-4">
                        <a href={route('profile.create')} className="btn btn-outline-primary btn-sm" disabled={processing}>
                            Crear una cuenta
                        </a>
                    </div>
                </GuestLayout>
            </AuthenticatedLayout>
        </>
    );
}
