import {BarChart, DonutChart, Dropdown, DropdownItem, Text, Title} from "@tremor/react";
import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {setGames} from '../../store/slices/gameSlice';
import {setGrades} from '../../store/slices/testSlice';
import {selectGame, selectGrade} from '../../store/store';

const Form = () => {
  const [visualizationType, setVisualizationType] = useState("");
  const [gameTitle, setGameTitle] = useState("");
  // const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [submit, setSubmit] = useState(false);

  const visualizations = ['Pie Chart', 'Bar Chart'];
  const isSubmitDisabled = !gameTitle || !visualizationType;

  const grades = useSelector(selectGrade);
  const games = useSelector(selectGame);

  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchGrades() {
      const response = await fetch('/api/testGrade');
      const json = await response.json();
      dispatch(setGrades(json));
    }

    async function fetchGames() {
      const response = await fetch('/api/gameNames');
      const json = await response.json();
      dispatch(setGames(json));
    }

    fetchGrades();
    fetchGames();

  }, [dispatch]);

  if (!grades) {
    return <div>Loading...</div>;
  } else {
    console.log(grades);
  }

  console.log(games);

  const handleGameTitleChange = (selection: string) => {
    setSubmit(selection === gameTitle ? true : false);
    setGameTitle(selection);
  }

  const handleVisualizationTypeChange = (selection: string) => {
    setSubmit(selection === visualizationType ? true : false);
    setVisualizationType(selection)
  };

  const handleOnSubmit = (game: string, visualizationType: string) => {
    setSubmit(true);
  }

  return (
    <>
      <div id="form" className="w-1/4 h-full border-r border-black">
        <form className="flex-grow p-1">
          <div className="mb-4">
            <Text className="block font-bold text-black text-base mb-2">Game Title</Text>
            <Dropdown
              onValueChange={(e) => handleGameTitleChange(e)}
              placeholder="Select a game to visualize"
            >
              <DropdownItem value="Biology" text="Biology" />
            </Dropdown>
          </div>
          <div className="mb-4">
            <Text className="text-black font-bold text-base">Visualization Type</Text>
            <Dropdown
              className="mt-2"
              onValueChange={(e) => handleVisualizationTypeChange(e)}
              placeholder="Select a visualization type"
            >
              {visualizations.map((visual, index) => (
                <DropdownItem key={index} value={visualizations[index]} text={visual} />
              ))}
            </Dropdown>
          </div>
        </form>
        <div className="flex-shrink-0 p-1">
          <button
            type="submit"
            className="bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600 ease-linear transition-all duration-150 disabled:bg-gray-400 disabled:cursor-not-allowed"
            onClick={() => handleOnSubmit("Biology", "Pie Chart")}
            disabled={isSubmitDisabled}
          >
            Submit
          </button>
        </div>
      </div>
      {submit ? (
        <div className="flex justify-center items-center h-full w-3/4">
          <div id="visualization" className="w-full h-full">
            {visualizationType === "Pie Chart" && (
              <div className="w-full h-full shadow-none flex flex-col justify-center items-center">
                <Title mt-='15px'>Biology Grades</Title>
                <DonutChart
                  className="mt-6 h-2/3 w-2/3 m-auto"
                  data={grades}
                  category="score"
                  index="id"
                  colors={["violet", "rose", "emerald", "purple", "blue", "gray"]}
                />
              </div>
            )}
            {visualizationType === "Bar Chart" && (
              <div className="w-full h-full shadow-none flex flex-col justify-center items-center">
                <Title mt-='15px'>Biology Grades</Title>
                <BarChart
                  className="mt-6 h-2/3 w-full m-auto"
                  data={grades}
                  index="id"
                  categories={["score"]}
                  colors={["blue"]}
                />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-full w-3/4">
          <p className="text-center text-gray-400">
            No data to show. Please select a game and visualization type.
          </p>
        </div>
      )}
    </>
  )
}

export default Form;
