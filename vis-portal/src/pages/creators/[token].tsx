import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const VerificationHandler = () => {
  const router = useRouter();
  const { token } = router.query;

  const [response, setResponse] = useState("");
  const [error, setError] = useState(false);
  
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
          setResponse(response.apiKey);
        } catch (error: any) {
          console.error(error);
        }
      }
      verifyCreator();
    }
  }, [token]);

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      {error ? (
        <div>
          <h1 className="text-xl">{response}</h1>
        </div>
      ): (
        <div>
          <h1 className="text-xl">Success!</h1>
        </div>
      )}
    </div>
  )
}

export default VerificationHandler;
