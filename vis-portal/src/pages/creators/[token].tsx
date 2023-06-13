import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';

const VerificationHandler = () => {
  const router = useRouter();
  const { token } = router.query;

  const [response, setResponse] = useState("");
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const textFieldRef = useRef(null);
  
  useEffect(() => {
    if (token) {
      const verifyCreator = async () => {
        try {
          const verificationResponse = await fetch('/api/verifyCreator', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              token: token,
            }),
          });

          if (!verificationResponse.ok) {
            const response = await verificationResponse.json();
            setResponse(response.message);
            setError(true);
            throw new Error('Request failed with status ' + verificationResponse.status);
          }

          const response = await verificationResponse.json();
          setResponse(response.creatorKey);
        } catch (error: any) {
          console.error(error);
        }
      }
      verifyCreator();
    }
  }, [token]);

  const handleCopy = () => {
    navigator.clipboard.writeText(response)
      .then(() => setCopied(true))
      .catch((error) => console.error('Failed to copy text:', error));
  };

  return (
    <div className="w-screen h-screen">
      <div className="text-center h-1/20">
        <h1 className="text-3xl">VisPortal</h1>
      </div>
      <div className="w-full h-19/20 flex justify-center items-center m-auto">
        {error ? (
          <div>
            <h1 className="text-xl">{response}</h1>
          </div>
        ): (
          <div className="w-2/3 lg:w-1/3">
            <h1 className="text-2xl text-center font-bold">Thank you for becoming a verified creator on VisPortal!</h1>
            <p className="text-lg mb-4 text-indigo-500 text-center">Here are the details of your new token:</p>
            <ul className="list-disc list-inside mb-4">
              <li>Your token expires in 3 months.</li>
              <li>You can regenerate a new token as long as your school email is valid.</li>
              <li>Each creator is allowed only one token.</li>
            </ul>
            <p className="text-lg mb-4 text-indigo-500 text-center">
              Please keep your token secure and follow these guidelines:
            </p>
            <ul className="list-disc list-inside mb-4">
              <li>We won't display your token again, so make sure to store it securely.</li>
              <li>Do not share your token with others.</li>
            </ul>
            <div className="relative">
              <input
                ref={textFieldRef}
                type="text"
                className="rounded-lg border-2 border-gray-400 p-2 pl-4 pr-10 w-full focus:outline-none"
                value={response}
                readOnly
              />
              <button
                className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-indigo-500 text-white rounded-lg w-12 h-8 flex items-center justify-center focus:outline-none"
                onClick={handleCopy}
              >
                {copied ? '✔' : 'Copy'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default VerificationHandler;
