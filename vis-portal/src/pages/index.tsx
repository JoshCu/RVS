import {Open_Sans} from 'next/font/google';
import Head from 'next/head';
import VisualizationController from './components/VisualizationController';
import TokenRequestModal from './components/TokenRequestModal';
import SubmitGameModal from './components/SubmitGameModal';
import React, { useState } from 'react';
import Link from 'next/link';

const openSans = Open_Sans({subsets: ['latin']})

export default function Home() {
  const [showTokenRequestModal, setShowTokenRequestModal] = useState(false);
  const [showSubmitGameModal, setShowSubmitGameModal] = useState(false);

  return (
    <>
        <Head>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="h-screen w-screen overflow-hidden">
          <div className="grid grid-cols-3">
            <h1 className="m-auto text-center text-3xl col-start-2">VisPortal</h1>
            <div className="w-full flex space-x-2 justify-end pr-1">
              <Link href="/apiDocs" className="mr-1 mt-1 py-2 px-4 bg-white rounded hover:text-indigo-500">Documentation</Link>
              <button className="mr-1 mt-1 py-2 px-4 bg-white rounded hover:text-indigo-500" onClick={() => setShowTokenRequestModal(true)}>Request Creator Key</button>
              <button className="mr-1 mt-1 py-2 px-4 bg-indigo-500 rounded text-white hover:bg-indigo-600" onClick={() => setShowSubmitGameModal(true)}>Submit New Game</button>
            </div>
          </div>
          {showTokenRequestModal && <TokenRequestModal closeModal={() => setShowTokenRequestModal(false)} />}
          {showSubmitGameModal && <SubmitGameModal closeModal={() => setShowSubmitGameModal(false)} />}
          <div className="w-full h-full flex justify-center">
            <div id="main-card" className="bg-gray-200 w-3/4 h-3/4 m-auto shadow-lg flex flex-row">
              <VisualizationController />
            </div>
          </div>
        </div>
    </>
  )
}
