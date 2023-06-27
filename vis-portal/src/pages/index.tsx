import {Open_Sans} from 'next/font/google';
import Head from 'next/head';
import Form from './components/Form';
import InputFormModal from './components/InputFormModal';
import React, { useState } from 'react';

const openSans = Open_Sans({subsets: ['latin']})

export default function Home() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
        <Head>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="h-screen w-screen overflow-hidden">
          <div className="grid grid-cols-3">
            <h1 className="m-auto text-center text-3xl col-start-2">VisPortal</h1>
            <div className="w-full flex justify-end bg-blue-200">
              <button className="mr-1 mt-1 py-2 px-4 bg-indigo-500 rounded text-white hover:bg-indigo-600" onClick={() => setShowModal(true)}>Submit New Game</button>
            </div>
          </div>
          {showModal && <InputFormModal closeModal={() => setShowModal(false)} />}
          <div className="w-full h-full flex justify-center">
            <div id="main-card" className="bg-gray-200 w-3/4 h-3/4 m-auto shadow-lg flex flex-row">
              <Form />
            </div>
          </div>
        </div>
    </>
  )
}
