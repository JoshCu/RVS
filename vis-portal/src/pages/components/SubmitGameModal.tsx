import React, { ChangeEvent, useState } from "react";
import { TextInput } from "@tremor/react";
import { EnvelopeIcon, KeyIcon, RocketLaunchIcon } from '@heroicons/react/24/solid';

interface InputFormProps {
  closeModal: () => void;
}

const InputFormModal: React.FC<InputFormProps> = ({ closeModal }) => {
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [email, setEmail] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidFile, setIsValidFile] = useState(true);
  const [creatorKey, setCreatorKey] = useState('');
  const [gameName, setGameName] = useState('');
  const [step, setStep] = useState(1);

  const isStepTwoBlocked = isValidEmail == false || email.length == 0 || creatorKey == '' || gameName == '';
  const isStepThreeBlocked = false;
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

  const handleFormSubmission = async () => {
    if (selectedFile) {
      try {
        const reader = new FileReader();
        reader.readAsText(selectedFile);
        reader.onload = async () => { // mark this function as async
          if (typeof reader.result === 'string' && reader.result !== "") {
            try {
              JSON.parse(reader.result);
              setIsValidFile(true);
            } catch (e) {
              setIsValidFile(false);
              alert("Selected file is not a valid JSON file");
            }
          }
          
          const createGameResponse = await fetch('/api/upsertCreator', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: email,
            }),
          });

          // if (!creatorResponse.ok) {
          //   console.error(creatorResponse);
          //   return;
          // }

          // const creatorData = await creatorResponse.json();
          // const creatorId = creatorData._id;
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
    
  const handleCloseModal = () => {
    setEmail("");
    setIsValidEmail(true);
    setIsValidFile(true);
    setShowEmailConfirmation(false);
    closeModal();
  };

  return (
    <>
      <>
        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 shadow-lg">
          <div className="w-100 min-w-100 h-96 min-h-96 bg-white rounded">
            <div className="flex flex-col h-full">
              {showEmailConfirmation ? (
                <div className="p-2 h-full w-full">
                  <div className="h-full w-full">
                    <p className="text-lg text-center h-4/5 w-full">A confirmation email has been sent to {email}, please follow the instructions there to continue.</p>
                    <div className="h-1/5 w-full flex items-center justify-center">
                      <button onClick={handleCloseModal} className="text-red-500 background-transparent font-bold uppercase px-6 py-1 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150">
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="p-2 w-full h-full">
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
                      <div className="h-full w-full overflow-y-auto">
                        <span>2</span>
                      </div>
                    ) : step == 3 ? (
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
                          onClick={() => setStep(3)}
                          className="bg-indigo-500 text-white font-bold uppercase text-sm px-6 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 disabled:bg-gray-400"
                          disabled={isStepThreeBlocked}
                        >
                          Continue
                        </button>
                      </div>
                    ) : step == 3 ? (
                      <div>
                        <button
                          onClick={() => setStep(2)}
                          className="bg-green-500 text-white font-bold uppercase text-sm px-6 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 disabled:bg-gray-400"
                        >
                          Back
                        </button>
                        <button
                          onClick={() => handleFormSubmission}
                          className="bg-indigo-500 text-white font-bold uppercase text-sm px-6 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 disabled:bg-gray-400"
                          disabled={isSubmissionBlocked}
                        >
                          Submit
                        </button>
                      </div>
                    ) : null}
                  </div>
                </>
              )
            }
            </div>
          </div>
        </div>
        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
      </>
    </>
  )
};

export default InputFormModal;
