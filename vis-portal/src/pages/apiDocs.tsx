import React, { useState } from 'react';
import ExpandableText from './components/ExpandableText';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

const APIDocs = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleClick = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  }

  return (
    <div>
      <div className="w-full grid grid-cols-3">
        <h1 className="text-center text-3xl col-start-2">API Documentation</h1>
        <div className="w-full flex justify-end">
          <Link href="/" className="mr-1 mt-1 py-2 px-4 hover:text-indigo-500">Home</Link>
        </div>
      </div>
      <div className="flex justify-center mb-2 mt-10 flex-col">
        <div className="w-full flex items-center justify-center">
          <ExclamationTriangleIcon className="h-5 w-5 stroke-red-500" />
          <p className="text-md text-red-500"><strong>Attention:</strong> Prior to using this API, please make sure all of the metrics for your game are final. Once a game is added it cannot be removed and games with the same name cannot coexist</p>
        </div>
        <p className="text-center text-md font-bold">Click to expand:</p>
      </div>
      <div className="w-1/2 m-auto">
        <ExpandableText
          onClick={() => handleClick(0)}
          isOpen={openIndex === 0}
          endpointName="addGame"
          content="1">
          <div className="w-full h-full px-5">
            <ul className="list-disc list-inside">
              <li>Adds a game to the database (must be done before any subsequent endpoint can be used)</li>
              <li>In the header of the request, include your <strong>email</strong> and <strong>creator_key</strong></li>
              <li>The body of the request should include &apos;name&apos; and &apos;score_requirements&apos;</li>
              <li>&apos;score_requirements&apos; must be an object containing all the fields you wish to show along with their data types</li>
              <li>Valid data types include <strong>number</strong>, and <strong>string</strong></li>
              <li>Sample request body:</li>
            </ul>
            <pre className="flex justify-center">
    <code>
        {`{
    "name": "binary boss",
    "score_requirements": {
      "level": "number",
      "time_taken_seconds": "number",
      "coins_collected": "number",
      "obstacles_hit": "number",
      "score": "number"
    }
}`}
    </code>
</pre>

          </div>
        </ExpandableText>
        <ExpandableText
          onClick={() => handleClick(1)}
          isOpen={openIndex === 1}
          endpointName="addSingleScore"
          content="2">
          <div className="w-full h-full px-5">
            <ul className="list-disc list-inside">
              <li>Adds a single score to the corresponding game</li>
              <li>In the header of the request, include your <strong>email</strong> and <strong>creator_key</strong></li>
              <li>The body of the request should include &apos;game&apos;, &apos;player_name&apos;, &apos;player_id&apos;, and &apos;score&apos; which includes each metric specified when the game was created</li>
              <li><strong>Note:</strong> only the game&apos;s creator is authorized to add scores for their game</li>
              <li>Sample request body:</li>
            </ul>
            <pre className="flex justify-center">
    <code>
        {`{
    "game": "binary boss",
    "player_name": "John Doe",
    "player_id": "jd1",
    "score": {
      "level": 7,
      "time_taken_seconds": 102,
      "coins_collected": 61,
      "obstacles_hit": 9,
      "score": 1753
    }
}`}
    </code>
</pre>
          </div>
        </ExpandableText>
        <ExpandableText
          onClick={() => handleClick(2)}
          isOpen={openIndex === 2}
          endpointName="addManyScores"
          content="2">
          <div className="w-full h-full px-5">
            <ul className="list-disc list-inside">
              <li>Adds a list of scores to the corresponding game</li>
              <li>In the header of the request, include your <strong>email</strong> and <strong>creator_key</strong></li>
              <li>The body of the request should include &apos;game&apos; and &apos;scores&apos; which includes an array of scores which follow the format used for adding a single score (minus the &apos;game&apos; field)</li>
              <li><strong>Note:</strong> only the game&apos;s creator is authorized to add scores for their game</li>
              <li>Sample request body:</li>
            </ul>
            <pre className="flex justify-center">
    <code>
        {`{
    "game": "Delta Droids",
    "scores" [
      {
        "player_name": "John Miller",
        "player_id": "jbm1",
        "score": {
          "level": 1,
          "score": 25
        }
      },
      {
        "player_name": "John Miller",
        "player_id": "jbm1",
        "score": {
          "level": 2,
          "score": 50
        }
      },
      etc...
    ]
}`}
    </code>
</pre>
          </div>
        </ExpandableText>
      </div>
    </div>
  );
}

export default APIDocs;
