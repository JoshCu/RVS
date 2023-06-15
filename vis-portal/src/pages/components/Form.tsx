import {BarChart, DonutChart, Dropdown, DropdownItem, Text, Title} from "@tremor/react";
import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {CartesianGrid, Legend, Scatter, ScatterChart, Tooltip, XAxis, YAxis} from "recharts";
import {setGames, setSelectedGameId} from '../../store/slices/gameSlice';
import {setScores} from '../../store/slices/scoreSlice';
import {selectGame, selectScores, selectSelectedGameId} from '../../store/store';
import {Game} from '../api/games';

const Form = () => {
  const [visualizationType, setVisualizationType] = useState("");
  const [submit, setSubmit] = useState(false);
  const [field1, setField1] = useState("");
  const [field2, setField2] = useState("");
  const [parameter1, setParameter1] = useState("");
  const [parameter2, setParameter2] = useState("");
  const [categoricalScores, setCategoricalScores] = useState<string[]>([]);
  const [continuousScores, setContinuousScores] = useState<string[]>([]);

  const visualizations = ['Pie Chart', 'Bar Chart', 'Scatter Chart'];

  const games = useSelector(selectGame);
  const selectedGameId = useSelector(selectSelectedGameId);
  const gameScores = useSelector(selectScores);

  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchGames() {
      const response = await fetch('/api/games');
      const json = await response.json();
      dispatch(setGames(json));
    }

    fetchGames();

  }, [dispatch]);

  const handleGameTitleChange = async (selection: Game) => {
    if (selection._id !== selectedGameId) {
      dispatch(setSelectedGameId(selection._id));

      try {
        const response = await fetch(`/api/gameScores?game_id=${selection._id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          }
        });

        if (!response.ok) {
          console.log(response);
        }

        const json = await response.json();
        dispatch(setScores(json));
      } catch (error) {
        console.log(error);
      }
    }
    setCategoricalScores([]);
    setContinuousScores([]);
    setParameter1("");
    setParameter2("");
    setSubmit(false);
    setVisualizationType("");
  }

  const handleVisualizationTypeChange = async (selection: string) => {
    if (selection !== visualizationType) {
      setCategoricalScores([]);
      setContinuousScores([]);
      setParameter1("");
      setParameter2("");
      setSubmit(false);
      setVisualizationType(selection);

      switch (selection) {
        case 'Pie Chart':
          setField1("Category");
          setField2("Value");
          break;
        case 'Bar Chart':
          setField1("X-Axis");
          setField2("Y-Axis");
          break;
        case 'Scatter Chart':
          setField1("X-Axis");
          setField2("Y-Axis");
          break;
      }

      const categoricalVars = [];
      const continuousVars = [];

      // Iterate over the object's properties
      for (const [key, value] of Object.entries(gameScores[0])) {
        console.log(typeof (value))
        // Check if the value is a number
        if (typeof value === 'number') {
          continuousVars.push(key);
        } else {
          categoricalVars.push(key);
        }
      }

      setCategoricalScores(categoricalVars);
      setContinuousScores(continuousVars);
      console.log(continuousScores)
    } else {
      setSubmit(true);
    }
  };

  const handleOnSubmit = () => {
    setSubmit(true);
  }

  const handleFieldOneChange = (selection: string) => {
    setParameter1(selection);
  }

  const handleFieldTwoChange = (selection: string) => {
    setParameter2(selection);
  }

  const setSubmitButtonStatus = () => {
    switch (visualizationType) {
      case "Pie Chart":
        return parameter1 === "";
      case "Bar Chart":
      case "Scatter Chart":
        return parameter1 === "" || parameter2 === "";
      default:
        return true;
    }
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
              placeholder={visualizationType !== "" ? visualizationType : "Select a visualization type"}
            >
              {visualizations.map((visual, index) => (
                <DropdownItem key={index} value={visualizations[index]} text={visual} />
              ))}
            </Dropdown>
          </div>
          {visualizationType === "Pie Chart" && (
            <div className="mb-4">
              <Text className="text-black font-bold text-base">{field1}</Text>
              <Dropdown
                className="mt-2"
                onValueChange={(e) => handleFieldOneChange(e)}
                placeholder={`Select a parameter for ${field1}`}
              >
                {continuousScores.map((continuousScore, index) => (
                  <DropdownItem key={index} value={continuousScore.toString()} text={continuousScore.toString()} />
                ))}
              </Dropdown>
            </div>
          )}
          {visualizationType === "Bar Chart" && (
            <div>
              <div className="mb-4">
                <Text className="text-black font-bold text-base">{field1}</Text>
                <Dropdown
                  className="mt-2"
                  onValueChange={(e) => handleFieldOneChange(e)}
                  placeholder={`Select a parameter for ${field1}`}
                >
                  {categoricalScores.map((categoricalScore, index) => (
                    <DropdownItem key={index} value={categoricalScore} text={categoricalScore} />
                  ))}
                </Dropdown>
              </div>
              <div className="mb-4">
                <Text className="text-black font-bold text-base">{field2}</Text>
                <Dropdown
                  className="mt-2"
                  onValueChange={(e) => handleFieldTwoChange(e)}
                  placeholder={`Select a parameter for ${field2}`}
                >
                  {continuousScores.map((continuousScore, index) => (
                    <DropdownItem key={index} value={continuousScore} text={continuousScore} />
                  ))}
                </Dropdown>
              </div>
            </div>
          )}
          {visualizationType === "Scatter Chart" && (
            <div>
              <div className="mb-4">
                <Text className="text-black font-bold text-base">{field1}</Text>
                <Dropdown
                  className="mt-2"
                  onValueChange={(e) => handleFieldOneChange(e)}
                  placeholder={`Select a parameter for ${field1}`}
                >
                  {continuousScores.map((continuousScore, index) => (
                    <DropdownItem key={index} value={continuousScore} text={continuousScore} />
                  ))}
                </Dropdown>
              </div>
              <div className="mb-4">
                <Text className="text-black font-bold text-base">{field2}</Text>
                <Dropdown
                  className="mt-2"
                  onValueChange={(e) => handleFieldTwoChange(e)}
                  placeholder={`Select a parameter for ${field2}`}
                >
                  {continuousScores.map((continuousScore, index) => (
                    <DropdownItem key={index} value={continuousScore} text={continuousScore} />
                  ))}
                </Dropdown>
              </div>
            </div>
          )}
        </form>
        <div className="flex-shrink-0 p-1">
          <button
            type="submit"
            className="bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600 ease-linear transition-all duration-150 disabled:bg-gray-400 disabled:cursor-not-allowed"
            onClick={handleOnSubmit}
            disabled={setSubmitButtonStatus()}
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
                <Title mt-='15px'>{parameter1} grouped by player_name</Title>
                <DonutChart
                  className="mt-6 h-2/3 w-2/3 m-auto"
                  data={gameScores}
                  category={parameter1}
                  index="player_name"
                />
              </div>
            )}
            {visualizationType === "Bar Chart" && (
              <div className="w-full h-full shadow-none flex flex-col justify-center items-center">
                <Title mt-='15px'>{parameter2} by {parameter1}</Title>
                <BarChart
                  className="mt-6 h-2/3 w-full m-auto"
                  data={gameScores}
                  index={parameter1}
                  categories={[parameter2]}
                  colors={["blue"]}
                />
              </div>
            )}
            {visualizationType === 'Scatter Chart' && (
              <div className="w-full h-full shadow-none flex flex-col justify-center items-center">
                <Title mt-='15px'>{parameter2} by {parameter1}</Title>
                <ScatterChart
                  width={730}
                  height={250}
                  margin={{
                    top: 20,
                    right: 20,
                    bottom: 10,
                    left: 10,
                  }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={parameter1} type="number" />
                  <YAxis dataKey={parameter2} type="number" />
                  <Tooltip cursor={{strokeDasharray: '3 3'}} />
                  <Legend />
                  <Scatter name={parameter2} data={gameScores} fill="#8884d8" />
                </ScatterChart>
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
      )
      }
    </>
  )
}

export default Form;
