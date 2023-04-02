import {Open_Sans} from 'next/font/google';
import Head from 'next/head';
import React, {useEffect, useState} from 'react';
import {Grade} from './api/testGrade';

const openSans = Open_Sans({subsets: ['latin']})

export default function Home() {
  const [data, setData] = useState<Grade | null>(null);
  const [visualizationType, setVisualizationType] = useState("");
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('/api/testGrade');
      const json = await response.json();
      setData(json);
    }
    fetchData();
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  } else {
    console.log(data);
  }

  const handleVisualizationTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setVisualizationType(value);
    setShowAdditionalFields(value === "type1");
  };

  return (
    <>
      <Head>
        <title>VisPortal</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="h-screen w-screen overflow-hidden">
        <h1 className="text-center text-3xl">VisPortal</h1>
        <div className="w-full h-full flex justify-center">
          <div id="main-card" className="bg-gray-200 w-3/4 h-3/4 m-auto shadow-lg flex flex-row">
            <div id="form" className="w-1/2 h-full border-r border-black">
              <form className="flex-grow p-1">
                <div className="mb-4">
                  <label htmlFor="game-title" className="block font-bold mb-2">
                    Game Title
                  </label>
                  <select id="game-title" name="game-title" className="block w-full py-2 cursor-pointer border-gray-300 rounded-sm shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    <option value="">Select a game title</option>
                    <option value="game1">Game 1</option>
                    <option value="game2">Game 2</option>
                    <option value="game3">Game 3</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label htmlFor="visualization-type" className="block font-bold mb-2">
                    Visualization Type
                  </label>
                  <select
                    id="visualization-type"
                    name="visualization-type"
                    value={visualizationType}
                    onChange={handleVisualizationTypeChange}
                    className="block w-full py-2 cursor-pointer border-gray-300 rounded-sm shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="">Select a visualization type</option>
                    <option value="type1">Type 1</option>
                    <option value="type2">Type 2</option>
                    <option value="type3">Type 3</option>
                  </select>
                </div>
                {showAdditionalFields && (
                  <div>
                    <div className="mb-4">
                      <label htmlFor="param1" className="block font-bold mb-2">
                        Parameter 1
                      </label>
                      <select
                        id="param1"
                        name="param1"
                        className="block w-full py-2 cursor-pointer border-gray-300 rounded-sm shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value="">Select a parameter</option>
                        <option value="param1value1">Param 1 Value 1</option>
                        <option value="param1value2">Param 1 Value 2</option>
                        <option value="param1value3">Param 1 Value 3</option>
                      </select>
                    </div>
                    <div className="mb-4">
                      <label htmlFor="param1" className="block font-bold mb-2">
                        Parameter 2
                      </label>
                      <select
                        id="param1"
                        name="param1"
                        className="block w-full py-2 cursor-pointer border-gray-300 rounded-sm shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value="">Select a parameter</option>
                        <option value="param1value1">Param 1 Value 1</option>
                        <option value="param1value2">Param 1 Value 2</option>
                        <option value="param1value3">Param 1 Value 3</option>
                      </select>
                    </div>
                  </div>
                )}
              </form>
              <div className="flex-shrink-0 p-1">
                <button type="submit" className="bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600">
                  Submit
                </button>
              </div>
            </div>
            <div id="visualization" className="w-1/2"></div>
          </div>
        </div>
      </div>
    </>
  )
}
