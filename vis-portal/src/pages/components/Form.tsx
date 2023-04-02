import React, { useEffect, useState } from 'react';
import { Grade } from '../api/testGrade';
import { Card, Title, DonutChart } from "@tremor/react";

const Form = () => {
  const [data, setData] = useState<Grade[] | null>(null);
  const [visualizationType, setVisualizationType] = useState("");
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [submit, setSubmit] = useState(false);

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

  const handleOnSubmit = (game: string, visualizationType: string) => {
    setSubmit(true);
  }

  return (
    <>
      <div id="form" className="w-1/2 h-full border-r border-black">
        <form className="flex-grow p-1">
          <div className="mb-4">
            <label htmlFor="game-title" className="block font-bold mb-2">
              Game Title
            </label>
            <select id="game-title" name="game-title" className="block w-full py-2 cursor-pointer border-gray-300 rounded-sm shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              <option value="">Select a game title</option>
              <option value="Biology">Biology</option>
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
              <option value="type1">Pie Chart</option>
            </select>
          </div>
        </form>
        <div className="flex-shrink-0 p-1">
          <button
            type="submit"
            className="bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600"
            onClick={() => handleOnSubmit("Biology", "Pie Chart")}
          >
            Submit
          </button>
        </div>
      </div>
      {submit &&
        <div id="visualization" className="w-2/5 h-3/4 m-auto">
          <Card className="w-full h-full bg-gray-200 shadow-none">
            <Title>Biology Grades</Title>
            <DonutChart
              className="mt-6 h-2/3 w-2/3 m-auto"
              data={data}
              category="score"
              index="id"
              colors={["violet","rose"]}
            />
          </Card>
        </div>
      }
    </>
  )
}

export default Form;
