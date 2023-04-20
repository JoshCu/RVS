import {BarChart, DonutChart, Dropdown, DropdownItem, Text, Title} from "@tremor/react";
import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {setGames, setSelectedGameId} from '../../store/slices/gameSlice';
import {setScores} from '../../store/slices/scoreSlice';
import {setGrades} from '../../store/slices/testSlice';
import {selectGame, selectGrade, selectSelectedGameId} from '../../store/store';
import {Game} from '../api/gameNames';

const Form = () => {
  const [visualizationType, setVisualizationType] = useState("");
  // const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [submit, setSubmit] = useState(false);

  const visualizations = ['Pie Chart', 'Bar Chart'];

  const grades = useSelector(selectGrade);
  const games = useSelector(selectGame);
  const selectedGameId = useSelector(selectSelectedGameId);

  const isSubmitDisabled = !selectedGameId || !visualizationType;

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

  const handleGameTitleChange = async (selection: Game) => {
    if (selection._id !== selectedGameId) {
      dispatch(setSelectedGameId(selection._id));
      const response = await fetch(`/api/gameScores?game_id=${selection._id}`);
      const json = await response.json();
      dispatch(setScores(json));
    }
  }

  const handleVisualizationTypeChange = async (selection: string) => {
    setSubmit(selection === visualizationType ? true : false);
    setVisualizationType(selection)
  };

  const handleOnSubmit = () => {
    setSubmit(true);
  }

  return (
    <>
      <div id="form" className="w-1/4 h-full border-r border-black">
        <form className="flex-grow p-1">
          <div className="mb-4">
            <Text className="block font-bold text-black text-base mb-2">Game Title</Text>
            <Dropdown
              onValueChange={(value) => handleGameTitleChange(JSON.parse(value))}
              placeholder="Select a game to visualize"
            >
              {games.map((game, index) => (
                <DropdownItem key={index} value={JSON.stringify(game)} text={game.name} />
              ))}
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
            onClick={handleOnSubmit}
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
