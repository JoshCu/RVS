import { useRouter } from 'next/router';

const VerificationHandler = () => {
  const router = useRouter();
  console.log(router.query);
  return (
    <div>
      <h1>Verification Page</h1>
    </div>
  )
}

export default VerificationHandler;
