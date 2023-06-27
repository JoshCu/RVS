import React, { ChangeEvent, useState } from "react";
import { TextInput } from "@tremor/react";
import { EnvelopeIcon } from '@heroicons/react/24/solid';

interface InputFormProps {
  closeModal: () => void;
}

const InputFormModal: React.FC<InputFormProps> = ({ closeModal }) => {
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);

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
                    <button
                      onClick={handleFormSubmission}
                      className="bg-indigo-500 text-white font-bold uppercase text-sm px-6 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 disabled:bg-gray-400"
                      disabled={isSubmitDisabled}
                    >
                      Submit
                    </button>
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
