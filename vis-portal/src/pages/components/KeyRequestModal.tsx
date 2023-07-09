import React, { ChangeEvent, useState } from "react";
import { TextInput } from "@tremor/react";
import { EnvelopeIcon } from '@heroicons/react/24/solid';

interface InputFormProps {
  closeModal: () => void;
}

const KeyRequestModal: React.FC<InputFormProps> = ({ closeModal }) => {
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [loading, setLoading] = useState(false);

  const isSubmitDisabled = isValidEmail == false || email.length == 0;
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

  const handleFormSubmission = async () => {
    try {
      setLoading(true);
      const creatorResponse = await fetch('/api/upsertCreator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
        }),
      });

      if (!creatorResponse.ok) {
        console.error(creatorResponse);
        return;
      }

      const creatorData = await creatorResponse.json();
      const creatorId = creatorData._id;

      const emailResponse = await fetch('/api/sendGrid', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sendTo: email,
          verificationToken: creatorId
        }),
      });

      if (!emailResponse.ok) {
        console.error(emailResponse);
        return;
      }
      
      const json = await emailResponse.json();
      setShowEmailConfirmation(true);
    } catch (error) {
      console.log(error);
    }
  }


  const handleCloseModal = () => {
    setEmail("");
    setIsValidEmail(true);
    setShowEmailConfirmation(false);
    closeModal();
  };

  return (
    <>
      <>
        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 shadow-lg">
          <div className="w-96 min-w-96 h-60 min-h-60 bg-white rounded">
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
                      <p className="text-3xl text-center">Request Creator Key</p>
                    </div>
                    <div className="w-full mt-4 flex items-center h-5/6">
                      <TextInput icon={EnvelopeIcon} onChange={handleEmailChange} error={!isValidEmail} placeholder="Email" />
                    </div>
                  </div>
                  <div className="flex justify-end p-2 space-x-2">
                    <button onClick={handleCloseModal} className="h-auto text-red-500 background-transparent font-bold uppercase px-6 py-1 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150">
                      Close
                    </button>
                    {!loading ? (
                      <button
                        onClick={handleFormSubmission}
                        className="bg-indigo-500 text-white flex justify-center w-24 font-bold uppercase text-sm px-6 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 disabled:bg-gray-400"
                        disabled={isSubmitDisabled}
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

export default KeyRequestModal;
