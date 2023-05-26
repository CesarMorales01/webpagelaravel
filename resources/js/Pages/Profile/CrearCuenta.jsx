import React from 'react'
import { useState, useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import { Link } from '@inertiajs/react';
import Swal from 'sweetalert2';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const CrearCuenta = (params) => {
  const [usuario, setUsuario] = useState('')
  const [email, setEmail] = useState('')
  const [email1, setEmail1] = useState('')
  const [contraseña, setContraseña] = useState('')
  const [contraseña1, setContraseña1] = useState('')

  function establecerUsuario(e) {
    setUsuario(e.target.value)
  }

  function establecerEmail(e) {
    setEmail(e.target.value)
  }

  function establecerEmail1(e) {
    setEmail1(e.target.value)
  }

  function establecerContraseña(e) {
    setContraseña(e.target.value)
  }

  function establecerContraseña1(e) {
    setContraseña1(e.target.value)
  }

  function loadingOn() {
    document.getElementById('btnEnviar').style.display = 'none'
    document.getElementById('btnLoading').style.display = ''
  }

  function loadingOff() {
    document.getElementById('btnEnviar').style.display = ''
    document.getElementById('btnLoading').style.display = 'none'
  }


  function validarDatos(e) {
    e.preventDefault()
    if (email != email1) {
      sweetAlert('Debes ingresar el mismo email!')
    } else {
      if (contraseña != contraseña1) {
        sweetAlert('Debes ingresar la misma contraseña!')
      } else {
        loadingOn()
        fetchValidarCorreo()
      }
    }
  }

  function sweetAlert(mensaje) {
    Swal.fire({
      title: mensaje,
      icon: 'warning',
      showCancelButton: false,
      showConfirmButton: false,
      timer: 1500,
    })
  }

  function fetchValidarCorreo() {
    let url = params.globalVars.thisUrl + "profile/checkemail/" + email
    fetch(url)
      .then(function (response) {
        return response.json()
      }).then(function (data) {
        if (data != 'vacio') {
          loadingOff()
          sweetAlert('Ya existe una cuenta asociada a este correo!')
        } else {
          document.getElementById('formCrear').submit()
        }
      }).catch(function (error) {

      })
  }

  return (
    <>
      <Head title="Welcome" />
      <AuthenticatedLayout user={params.auth} info={params.info} globalVars={params.globalVars} productos={params.productos} >
        <GuestLayout >
          <div className='grid place-items-center'>
            <Link href="/">
              <img className='img-fuild rounded' width="120em" height="120em" src={params.info.length == 0 ? '' : params.globalVars.urlRoot + '/Imagenes_productos/' + params.info.logo} />
            </Link>
          </div>
          <form action={route('profile.store')} id='formCrear' method="post">
            <input type="hidden" name='_token' value={params.token} />
            <p style={{ textAlign: 'justify' }}>Nombre de usuario</p>
            <input type="text" name="nombre" className="form-control" onChange={establecerUsuario} required value={usuario} />
            <br />
            <p style={{ textAlign: 'justify', color: 'black' }}>Correo electrónico</p>
            <input type="text" name="email" required onChange={establecerEmail} className="form-control" value={email} />
            <br />
            <p style={{ textAlign: 'justify', color: 'black' }}>Repite el correo electrónico</p>
            <input type="text" name="mail2" required onChange={establecerEmail1} className="form-control" value={email1} />
            <br />
            <p style={{ textAlign: 'justify', color: 'black' }}>Contraseña</p>
            <input type="password" name="password" required className="form-control" onChange={establecerContraseña} value={contraseña} />
            <br />
            <p style={{ textAlign: 'justify', color: 'black' }}>Repite la contraseña</p>
            <input type="password" name="contraseña2" required onChange={establecerContraseña1} className="form-control" value={contraseña1} />
            <div style={{ marginTop: '2em' }} className="grid place-items-center">
              <PrimaryButton id='btnEnviar' type="submit" style={{ backgroundColor: params.info.color_pagina }} className="ml-4"  >
                Registrarse
              </PrimaryButton>
              <PrimaryButton id='btnLoading' style={{ display: 'none', backgroundColor: 'gray' }} type="button" disabled>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Loading...
              </PrimaryButton>
            </div>
          </form>
          <div className="flex items-center justify-end mt-4">
            <a href={route('gologin', 'no')} className="btn btn-outline-primary btn-sm" >
              Iniciar sesión
            </a>
          </div>
        </GuestLayout>
      </AuthenticatedLayout>
    </>
  )
}

export default CrearCuenta