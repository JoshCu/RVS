import {Button} from "@tremor/react";
import {ChangeEvent, useState} from "react";
import {FaSpinner} from "react-icons/fa";

const InputFormModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isFileSubmitted, setIsFileSubmitted] = useState(false);

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const {value} = event.target;

    if (emailRegex.test(value) && value.endsWith("@uakron.edu")) {
      setEmail(value);
      setIsValidEmail(true);
    } else {
      alert("Please enter a valid University of Akron Email.");
    }
  };

  const handleJSONUpload = () => {
    setIsUploading(true);

    // Replace this with actual JSON upload code
    setTimeout(() => {
      setIsUploading(false);
      setIsFileSubmitted(true);
      alert("JSON data uploaded!");
    }, 2000);
  };

  const handleUploadButtonClick = () => {
    if (isValidEmail && isFileSubmitted) {
      alert("File Submitted.");
    } else {
      alert("Please enter a valid email and file.");
    }
  };

  return (
    <>
      <Button onClick={() => setShowModal(true)}>Submit New Game</Button>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">
                    Submit New Game
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      X
                    </span>
                  </button>
                </div>
                <div className="flex flex-col space-y-2">
                  <label htmlFor="email" className="font-bold text-lg">
                    Email:
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={handleEmailChange}
                    className={'border rounded-lg p2 ${isValidEmail ? "border-green-500" : "border-red-500"}'}
                  />
                  {!isValidEmail && (
                    <p className="text-red-500"> Please enter a valid University of Akron Email</p>
                  )}
                  <button onClick={handleJSONUpload} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                    {isUploading ? (
                      <div className="flex items-center">
                        <FaSpinner className="animate-spin mr-2" />
                        Uploading...
                      </div>
                    ) : ("Submit File")}
                  </button>
                </div>
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  <button
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null
      }
    </>
  )
};
export default InputFormModal;
