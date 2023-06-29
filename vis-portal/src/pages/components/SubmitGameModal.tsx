import React, { ChangeEvent, useState } from "react";
import { TextInput } from "@tremor/react";
import { EnvelopeIcon, KeyIcon, RocketLaunchIcon } from '@heroicons/react/24/solid';
import { XCircleIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import ScoreRequirements from "./ScoreRequirements";
import Link from "next/link";

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
  const [requirements, setRequirements] = useState<{ [key: string]: string }>({});
  const [gameCreationError, setGameCreationError] = useState(true);
  const [gameCreationMessage, setGameCreationMessage] = useState('');
  const [gameCreationStatus, setGameCreationStatus] = useState(0);


  const isStepTwoBlocked = isValidEmail == false || email.length == 0 || creatorKey == '' || gameName == '';
  const isSubmissionBlocked = !selectedFile || !isValidFile

  const emailRegex = /^[a-zA-Z]{2,3}\d+@uakron\.edu$/;

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
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleGameCreation = async () => {
    setGameCreationError(false);
    setGameCreationMessage('');
    
    const createGameResponse = await fetch('/api/addGame', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'email': email,
        'creator_key': creatorKey
      },
      body: JSON.stringify({
        name: gameName,
        score_requirements: requirements
      }),
    });

    if (!createGameResponse.ok) {
      setGameCreationError(true);
      setGameCreationStatus(createGameResponse.status);
      const error = await createGameResponse.json();
      setGameCreationMessage(error.message);
    }

    setStep(3);
  }

  const handleFormSubmission = async () => {
    setStep(4);
    if (selectedFile) {
      try {
        const reader = new FileReader();
        reader.readAsText(selectedFile);
        reader.onload = async () => { // mark this function as async
          let jsonData;
          if (typeof reader.result === 'string' && reader.result !== "") {
            try {
              jsonData = JSON.parse(reader.result);
              setIsValidFile(true);
            } catch (e) {
              setIsValidFile(false);
              alert("Selected file is not a valid JSON file");
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
            console.error(addScoresResponse);
            return;
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  const onFieldsFilledChange = (allFieldsFilled: boolean, requirements:{ [key: string]: string }) => {
    setAllFieldsFilled(allFieldsFilled);
    if (allFieldsFilled) {
      setRequirements(requirements);
      console.log(requirements)
    }
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
                    <ScoreRequirements onFieldsFilledChange={onFieldsFilledChange} />
                  </div>
                ) : step == 3 ? (
                  <div className="h-5/6 w-full">
                    {gameCreationError ? (
                      <div className="flex flex-col items-center w-full h-full">
                        <div className="flex flex-col items-center w-full h-1/3">
                          <XCircleIcon className="h-16 w-16 stroke-red-500" />
                          <h1 className="text-lg">Game Creation Failed</h1>
                        </div>
                        <div className="w-full h-2/3 overflow-y-auto border">
                          <p><strong className="text-red-500">Error:</strong> {gameCreationMessage}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center w-full h-full">
                        <div className="flex flex-col items-center w-full h-1/3">
                          <CheckCircleIcon className="h-16 w-16 stroke-green-500" />
                          <h1 className="text-lg">Game Creation Successful!</h1>
                        </div>
                        <div className="w-full h-2/3 overflow-y-auto border">
                          <p>
                            Click continue to add your list of scores or close this window and programmatically add scores one-by-one via our API.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : step == 4 ? (
                  <div>
                    <label htmlFor="scores-input" className="text-sm font-bold">Scores (JSON files only)</label>
                    <input id="scores-input" onChange={handleJSONUpload} className={`block w-full py-1 text-sm border ${isValidFile ? "border-gray-300" : "border-red-500"} rounded-md cursor-pointer bg-white`} type="file" accept=".json" />
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
                    className="bg-indigo-500 text-white font-bold uppercase text-sm px-6 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 disabled:bg-gray-400"
                    disabled={isStepTwoBlocked}
                  >
                    Continue
                  </button>
                ) : step == 2 ? (
                  <div>
                    <button
                      onClick={() => setStep(1)}
                      className="bg-green-500 text-white font-bold uppercase text-sm px-6 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 disabled:bg-gray-400"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleGameCreation}
                      className="bg-indigo-500 text-white font-bold uppercase text-sm px-6 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 disabled:bg-gray-400"
                      disabled={!allFieldsFilled}
                    >
                      Continue
                    </button>
                  </div>
                ) : step == 3 ? (
                  <div>
                    {gameCreationError ? (
                      <div>
                        {gameCreationStatus == 409 ? (
                          <button
                            onClick={() => setStep(4)}
                            className="bg-indigo-500 text-white font-bold uppercase text-sm px-6 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                          >
                            Continue
                          </button>
                        ) : (
                          <button
                            onClick={() => setStep(2)}
                            className="bg-green-500 text-white font-bold uppercase text-sm px-6 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 disabled:bg-gray-400"
                          >
                            Back
                          </button>
                        )}
                      </div>
                    ) : (
                      <div>
                        <Link href="/apiDocs">
                          <button
                            className="bg-indigo-500 text-white font-bold uppercase text-sm px-6 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                          >
                            API Info
                          </button>
                        </Link>
                        <button
                          onClick={() => setStep(4)}
                          className="bg-indigo-500 text-white font-bold uppercase text-sm px-6 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                        >
                          Continue
                        </button>
                      </div>
                    )}
                  </div>
                ) : step == 4 ? (
                  <div>
                    <button
                      onClick={() => setStep(3)}
                      className="bg-green-500 text-white font-bold uppercase text-sm px-6 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 disabled:bg-gray-400"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleFormSubmission}
                      className="bg-indigo-500 text-white font-bold uppercase text-sm px-6 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 disabled:bg-gray-400"
                      disabled={isSubmissionBlocked}
                    >
                      Submit
                    </button>
                  </div>
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
