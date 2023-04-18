import { Button } from "@tremor/react";
import { ChangeEvent, useState } from "react";
import { FaSpinner } from "react-icons/fa";

const InputFormModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidFile, setIsValidFile] = useState(true);

  const isSubmitDisabled = isValidEmail == false || !selectedFile;
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

  const handleFormSubmission = () => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.readAsText(selectedFile);
      reader.onload = () => {
        if (typeof reader.result === 'string' && reader.result !== "") {
          try {
            JSON.parse(reader.result);
            setIsUploading(true);
            setTimeout(() => {
              setIsUploading(false);
              alert("JSON data uploaded!");
            }, 2000);
            setIsValidFile(true);
          } catch (e) {
            setIsValidFile(false);
            alert("Selected file is not a valid JSON file");
          }
        }
      }
    }
  };

  const handleCloseModal = () => {
    setEmail("");
    setSelectedFile(null);
    setIsValidEmail(true);
    setIsValidFile(true);
    setShowModal(false);
  };

  return (
    <>
      <button className="absolute top-3 right-2 py-2 px-4 bg-indigo-500 rounded text-white hover:bg-indigo-600" onClick={() => setShowModal(true)}>Submit New Game</button>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 shadow-lg">
            <div className="w-96 min-w-96 h-60 min-h-60 bg-white rounded">
              <div className="flex flex-col h-full">
                <div className="p-2">
                  <p className="text-3xl text-center">Upload Game Data</p>
                  <form className="mt-4 flex-grow">
                    <div className="mb-2">
                      <label htmlFor="email" className="block text-sm font-bold">
                        Email
                      </label>
                      <input id="email" onChange={handleEmailChange} className={`w-full py-1 border ${isValidEmail ? "border-gray-300" : "border-red-500"} border-gray-300 rounded focus:outline-none`} type="email" placeholder="user@domain.com" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold" htmlFor="file-upload">Game File Upload (only accepts JSON files)</label>
                      <input onChange={handleJSONUpload} className={`block w-full py-1 text-sm border ${isValidFile ? "border-gray-300" : "border-red-500"} rounded cursor-pointer bg-white`} id="default_size" type="file" accept=".json" />
                    </div>
                  </form>
                </div>
                <div className="flex justify-end p-2 space-x-2">
                  <button onClick={handleCloseModal} className="text-red-500 background-transparent font-bold uppercase px-6 py-1 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150">
                    Close
                  </button>
                  <button
                    onClick={handleFormSubmission}
                    className="bg-indigo-500 text-white font-bold uppercase text-sm px-6 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 disabled:bg-gray-400"
                    disabled={isSubmitDisabled}
                  >
                    {isUploading ? (
                      <div className="flex items-center">
                        <FaSpinner className="animate-spin mr-2" />
                        Uploading
                      </div>
                    ) : ("Upload")}
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
