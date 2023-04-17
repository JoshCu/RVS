import {Open_Sans} from 'next/font/google';
import Head from 'next/head';
import {Provider} from 'react-redux';
import {store} from '../store/store';
import Form from './components/Form';
import InputFormModal from './components/InputFormModal';

const openSans = Open_Sans({subsets: ['latin']})

export default function Home() {

  return (
    <>
      <Provider store={store}>
        <Head>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="h-screen w-screen overflow-hidden">
          <h1 className="text-center text-3xl">VisPortal</h1>
          <InputFormModal />
          <div className="w-full h-full flex justify-center">
            <div id="main-card" className="bg-gray-200 w-3/4 h-3/4 m-auto shadow-lg flex flex-row">
              <Form />
            </div>
          </div>
        </div>
      </Provider>
    </>
  )
}
