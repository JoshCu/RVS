import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';

const VerificationHandler = () => {
  const router = useRouter();
  const { token } = router.query;

  const [response, setResponse] = useState("");
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
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
            setLoading(false);
            throw new Error('Request failed with status ' + verificationResponse.status);
          }

          const response = await verificationResponse.json();
          setResponse(response.creator_key);
          setLoading(false);
        } catch (error: any) {
          console.error(error);
          setError(true);
          setResponse("An error occurred when processing your verification. Please try again.");
          setLoading(false);
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

  if (loading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center space-x-2">
        <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin fill-indigo-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
        <div className="text-2xl">Loading...</div>
      </div>
    )
  }

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
          <div className="w-3/4 desktop:w-1/2">
            <h1 className="text-2xl text-center font-bold pb-4">Thank you for becoming a verified creator on VisPortal!</h1>
            <div className="mx-auto w-3/4">
              <p className="text-lg mb-4 text-indigo-500">Here are the details of your new token:</p>
              <ul className="list-disc list-inside mb-4">
                <li>Your token expires in 3 months.</li>
                <li>You can regenerate a new token as long as your school email is valid.</li>
                <li>Each creator is allowed only one token.</li>
              </ul>
              <p className="text-lg mb-4 text-indigo-500">
                Please keep your token secure and follow these guidelines:
              </p>
              <ul className="list-disc list-inside mb-4">
                <li>We won&apos;t display your token again, so make sure to store it securely.</li>
                <li>Do not share your token with others.</li>
              </ul>
            </div>
            <div className="relative w-3/4 mx-auto">
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
