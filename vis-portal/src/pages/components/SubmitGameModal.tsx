import React, { ChangeEvent, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { selectGame } from "@/store/store";
import { TextInput } from "@tremor/react";
import { EnvelopeIcon, KeyIcon, RocketLaunchIcon } from '@heroicons/react/24/solid';
import { XCircleIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import ScoreRequirements from "./ScoreRequirements";
import Link from "next/link";
import { setGames } from "@/store/slices/gameSlice";

interface InputFormProps {
  closeModal: () => void;
}

type Requirement = {
  field: string;
  type: string;
};

const SubmitGameModal: React.FC<InputFormProps> = ({ closeModal }) => {
  const [email, setEmail] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidFile, setIsValidFile] = useState(true);
  const [creatorKey, setCreatorKey] = useState('');
  const [gameName, setGameName] = useState('');
  const [step, setStep] = useState(1);
  const [allFieldsFilled, setAllFieldsFilled] = useState(false);
  const [gameCreationError, setGameCreationError] = useState(false);
  const [gameCreationMessage, setGameCreationMessage] = useState('');
  const [gameCreationStatus, setGameCreationStatus] = useState(0);
  const [scoreSubmissionError, setScoreSubmissionError] = useState(false);
  const [scoreSubmissionMessage, setScoreSubmissionMessage] = useState('');
  const [problematicScore, setProblematicScore] = useState([]);
  const [requirements, setRequirements] = useState<Requirement[]>([
    { field: '', type: 'number' },
    { field: '', type: 'number' }
  ]);
  const [gameLoading, setGameLoading] = useState(false);
  const [scoresLoading, setScoresLoading] = useState(false);

  const isStepTwoBlocked = isValidEmail == false || email.length == 0 || creatorKey == '' || gameName == '';
  const isSubmissionBlocked = !selectedFile || !isValidFile

  const emailRegex = /^[a-zA-Z]{2,3}\d+@uakron\.edu$/;

  const dispatch = useDispatch();
  const games = useSelector(selectGame);

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setEmail(value);

    if (emailRegex.test(value)) {
      setIsValidEmail(true);
    } else {
      setIsValidEmail(false);
    }
  };

  const handleJSONUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setIsValidFile(true);
      setSelectedFile(e.target.files[0]);
    }
  };

  // Grants us the final result in typical JSON format { key: value, key: value, etc... }
  const transformRequirementsToObject = (requirements: Requirement[]): { [key: string]: string } => {
    return requirements.reduce((obj: { [key: string]: string }, requirement) => {
      obj[requirement.field] = requirement.type;
      return obj;
    }, {});
  };

  const handleGameCreation = async () => {
    setGameLoading(true);
    setGameCreationError(false);
    setGameCreationMessage('');
    
    try {
      const createGameResponse = await fetch('/api/addGame', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'email': email,
          'creator_key': creatorKey
        },
        body: JSON.stringify({
          name: gameName,
          score_requirements: transformRequirementsToObject(requirements)
        }),
      });

      const res = await createGameResponse.json();

      if (!createGameResponse.ok) {
        setGameCreationError(true);
        setGameCreationStatus(createGameResponse.status);
        setGameCreationMessage(res.message);
      } else {
        const newGame = res.game;
        const updatedGames = [...games, newGame];
        dispatch(setGames(updatedGames));
      }

      setStep(3);
      setGameLoading(false);
    } catch (error) {
      console.error(error);
      setGameCreationError(true);
      setGameCreationMessage("An unexpected error occurred. Please try again later.");
      setGameLoading(false);
    }
  }

  const handleScoreSubmission = async () => {
    if (selectedFile) {
      setScoresLoading(true);
      setScoreSubmissionError(false);
      setScoreSubmissionMessage('');
      setProblematicScore([]);
      try {
        const reader = new FileReader();
        reader.readAsText(selectedFile);
        reader.onload = async () => {
          let jsonData;
          if (typeof reader.result === 'string' && reader.result !== "") {
            try {
              jsonData = JSON.parse(reader.result);
              setIsValidFile(true);
            } catch (e) {
              setIsValidFile(false);
              setSelectedFile(null);
              alert("Selected file is not a valid JSON file. Double check your syntax to ensure there are no violations.");
              return;
            }
          }

          const addScoresResponse = await fetch('/api/addManyScores', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'email': email,
              'creator_key': creatorKey
            },
            body: JSON.stringify(jsonData)
          })

          if (!addScoresResponse.ok) {
            setScoreSubmissionError(true);
            const error = await addScoresResponse.json();
            setScoreSubmissionMessage(error.message);
            setProblematicScore(error.problematicScore);
            setSelectedFile(null);
          }

          setStep(5);
          setScoresLoading(false);
        }
      } catch (error) {
        console.error(error);
        setScoreSubmissionError(true);
        setScoreSubmissionMessage("An unexpected error occurred. Please try again later");
        setSelectedFile(null);
        setScoresLoading(false);
      }
    }
  }

  const handleRequirementsChange = (requirements: Requirement[]) => {
    setRequirements(requirements);
    setAllFieldsFilled(requirements.every(req => req.field !== ""));
  }
    
  const handleCloseModal = () => {
    setEmail("");
    setIsValidEmail(true);
    setIsValidFile(true);
    closeModal();
  };

  return (
    <>
      <>
        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 shadow-lg">
          <div className="w-100 min-w-100 h-96 min-h-96 bg-white rounded">
            <div className="flex flex-col h-full">
              <div className="p-2 w-full h-5/6">
                <div className="w-full h-1/6">
                  <p className="text-3xl text-center">Submit New Game</p>
                </div>
                {step == 1 ? (
                  <form className="mt-4 h-5/6">
                    <div className="mb-1 flex flex-col space-y-3">
                      <TextInput icon={EnvelopeIcon} onChange={handleEmailChange} error={!isValidEmail} placeholder="Email" value={email} />
                      <TextInput icon={KeyIcon} type="password" onChange={(event) => setCreatorKey(event.target.value)} placeholder="Creator Key" value={creatorKey} />
                      <TextInput icon={RocketLaunchIcon} onChange={(event) => setGameName(event.target.value)} placeholder="Game Name" value={gameName} />
                    </div>
                  </form>
                ) : step == 2 ? (
                  <div className="h-5/6 w-full overflow-y-auto">
                    <ScoreRequirements
                      requirements={requirements}
                      onRequirementsChange={handleRequirementsChange}
                    />
                  </div>
                ) : step == 3 ? (
                  <div className="h-5/6 w-full">
                    {gameCreationError ? (
                      <div className="flex flex-col items-center w-full h-full">
                        <div className="flex flex-col items-center w-full h-2/5">
                          <XCircleIcon className="h-16 w-16 stroke-red-500" />
                          <h1 className="text-lg">Game Creation Failed</h1>
                        </div>
                        <div className="w-full h-3/5 overflow-y-auto border">
                          <p><strong className="text-red-500">Error:</strong> {gameCreationMessage}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center w-full h-full">
                        <div className="flex flex-col items-center w-full h-2/5">
                          <CheckCircleIcon className="h-16 w-16 stroke-green-500" />
                          <h1 className="text-lg">Game Creation Successful!</h1>
                        </div>
                        <div className="w-full h-3/5 overflow-y-auto border">
                          <p>
                            Click continue to add your list of scores or close this window and programmatically add scores one-by-one via our API.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : step == 4 ? (
                  <div className="h-5/6 w-full">
                    <div className="flex flex-col h-full w-full justify-between">
                      <div>
                        <label htmlFor="scores-input" className="text-sm font-bold">Scores (JSON files only)</label>
                        <input id="scores-input" onChange={handleJSONUpload} className={`block w-full py-1 text-sm border ${isValidFile ? "border-gray-300" : "border-red-500"} rounded-md cursor-pointer bg-white`} type="file" accept=".json" />
                      </div>
                    </div>
                  </div>
                ) : step == 5 ? (
                  <div className="h-5/6 w-full">
                    {scoreSubmissionError ? (
                      <div className="flex flex-col items-center w-full h-full">
                        <div className="flex flex-col items-center w-full h-2/5">
                          <XCircleIcon className="h-16 w-16 stroke-red-500" />
                          <h1 className="text-lg">Score Submission Failed</h1>
                        </div>
                        <div className="w-full h-3/5 overflow-y-auto border">
                          <p><strong className="text-red-500">Error:</strong> {scoreSubmissionMessage}</p>
                          {problematicScore && Object.keys(problematicScore).length > 0 ? (
                            <div>
                              <strong className="text-red-500">Problem:</strong>
                              <div>
                                {"{"}
                                <div className="ml-4">
                                  {Object.keys(problematicScore).map((key: string) => {
                                    const value = (problematicScore as { [key: string]: any })[key];
                                    if (typeof value === 'object' && value !== null) {
                                      // If the value is an object, render its properties as well.
                                      return (
                                        <div key={key}>
                                          <span className="text-blue-600">{key}</span>: {"{"}
                                          <div className="ml-4">
                                            {Object.keys(value).map(subKey => (
                                              <div key={subKey}>
                                                <span className="text-blue-600">{subKey}</span>:{" "}
                                                <span className="text-orange-500">{JSON.stringify(value[subKey])}</span>
                                              </div>
                                            ))}
                                          </div>
                                          {"}"}
                                        </div>
                                      );
                                    }

                                    // If the value is not an object, just render it directly.
                                    return (
                                      <div key={key}>
                                        <span className="text-blue-600">{key}</span>:{" "}
                                        <span className="text-orange-500">{JSON.stringify(value)}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                                {"}"}
                              </div>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center w-full h-full">
                        <CheckCircleIcon className="h-16 w-16 stroke-green-500" />
                        <h1 className="text-lg">Score Submission Successful!</h1>
                      </div>
                    )}
                  </div>
                ) : null }
              </div>
              <div className="flex justify-between p-2 space-x-2">
                <button onClick={handleCloseModal} className="h-auto text-red-500 background-transparent font-bold uppercase px-6 py-1 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150">
                  Close
                </button>
                {step == 1 ? (
                  <button
                    onClick={() => setStep(2)}
                    className="bg-indigo-500 text-white font-bold uppercase text-sm px-6 py-2 rounded shadow hover:bg-indigo-600 outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 disabled:bg-gray-400"
                    disabled={isStepTwoBlocked}
                  >
                    Continue
                  </button>
                ) : step == 2 ? (
                  <div className="flex">
                    <button
                      onClick={() => {
                          setStep(1);
                          setGameLoading(true);
                        }
                      }
                      className="bg-green-500 text-white font-bold uppercase text-sm px-6 py-2 rounded shadow hover:bg-green-600 outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 disabled:bg-gray-400"
                    >
                      Back
                    </button>
                    {!gameLoading ? (
                      <button
                        onClick={handleGameCreation}
                        className="bg-indigo-500 text-white flex justify-center w-28 font-bold uppercase text-sm px-6 py-2 rounded shadow hover:bg-indigo-600 outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 disabled:bg-gray-400"
                        disabled={!allFieldsFilled}
                      >
                        Continue
                      </button>
                    ) : (
                      <button
                        className="bg-gray-400 flex justify-center w-28 px-6 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                      >
                        <svg aria-hidden="true" className="w-5 h-5 text-gray-200 animate-spin fill-indigo-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                        </svg>
                      </button>
                    )}
                  </div>
                ) : step == 3 ? (
                  <div>
                    {gameCreationError ? (
                      <div>
                        {gameCreationStatus == 409 ? (
                          <div>
                            <button
                              onClick={() => setStep(1)}
                              className="bg-green-500 text-white font-bold uppercase text-sm px-6 py-2 rounded shadow hover:bg-green-600 outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 disabled:bg-gray-400"
                            >
                              Back
                            </button>
                            <button
                              onClick={() => setStep(4)}
                              className="bg-indigo-500 text-white font-bold uppercase text-sm px-6 py-2 rounded shadow hover:bg-indigo-600 outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 disabled:bg-gray-400"
                              disabled={!allFieldsFilled}
                            >
                              Continue
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setStep(2)}
                            className="bg-green-500 text-white font-bold uppercase text-sm px-6 py-2 rounded shadow hover:bg-green-600 outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 disabled:bg-gray-400"
                          >
                            Back
                          </button>
                        )}
                      </div>
                    ) : (
                      <div>
                        <Link href="/apiDocs">
                          <button
                            className="bg-indigo-500 text-white font-bold uppercase text-sm px-6 py-2 rounded shadow hover:bg-indigo-600 outline-none focus:outline-none mr-1 mb-1"
                          >
                            API Info
                          </button>
                        </Link>
                        <button
                          onClick={() => setStep(4)}
                          className="bg-indigo-500 text-white font-bold uppercase text-sm px-6 py-2 rounded shadow hover:bg-indigo-600 outline-none focus:outline-none mr-1 mb-1"
                        >
                          Continue
                        </button>
                      </div>
                    )}
                  </div>
                ) : step == 4 ? (
                  <div className="flex">
                    <button
                      onClick={() => setStep(3)}
                      className="bg-green-500 text-white font-bold uppercase text-sm px-6 py-2 rounded shadow hover:bg-green-600 outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 disabled:bg-gray-400"
                    >
                      Back
                    </button>
                    {!scoresLoading ? (
                      <button
                        onClick={handleScoreSubmission}
                        className="bg-indigo-500 text-white flex justify-center w-24 font-bold uppercase text-sm px-6 py-2 rounded shadow hover:bg-indigo-600 outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 disabled:bg-gray-400"
                        disabled={isSubmissionBlocked}
                      >
                        Submit
                      </button>
                    ) : (
                      <button
                        className="bg-gray-400 flex justify-center w-24 px-6 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                      >
                        <svg aria-hidden="true" className="w-5 h-5 text-gray-200 animate-spin fill-indigo-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                        </svg>
                      </button>
                    )}
                  </div>
                ) : step == 5 && scoreSubmissionError ? (
                  <button
                    onClick={() => setStep(4)}
                    className="bg-green-500 text-white font-bold uppercase text-sm px-6 py-2 rounded shadow hover:bg-green-600 outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 disabled:bg-gray-400"
                  >
                    Back
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
      </>
    </>
  )
};

export default SubmitGameModal;
