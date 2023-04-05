import {Open_Sans} from 'next/font/google';
import Head from 'next/head';
import Form from './components/Form';

const openSans = Open_Sans({subsets: ['latin']})

export default function Home() {

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="h-screen w-screen overflow-hidden">
        <h1 className="text-center text-3xl">VisPortal</h1>
        <div className="w-full h-full flex justify-center">
          <div id="main-card" className="bg-gray-200 w-3/4 h-3/4 m-auto shadow-lg flex flex-row">
            <Form />
          </div>
        </div>
      </div>
    </>
  )
}
