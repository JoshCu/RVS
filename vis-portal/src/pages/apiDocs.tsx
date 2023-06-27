import React, { useState } from 'react';
import ExpandableText from './components/ExpandableText';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const APIDocs = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleClick = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  }

  return (
    <div>
      <h1 className="text-center text-3xl">API Documentation</h1>
      <div className="flex justify-center mb-2 mt-10">
        <div className="w-full flex items-center justify-center">
          <ExclamationTriangleIcon className="h-5 w-5 stroke-red-500" />
          <p className="text-md text-red-500"><strong>Attention:</strong> Prior to using this API, please make sure all of the metrics for your game are final. Once a game is added it cannot be removed and games with the same name cannot coexist</p>
        </div>
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
              <li>In the header of the request, include your <strong>email</strong> and <strong>creator token</strong></li>
              <li>The body of the request should include 'name' and 'score_requirements'</li>
              <li>'score_requirements' must be an object containing all the fields you wish to show along with their data types</li>
              <li>Valid data types include <strong>boolean</strong>, <strong>number</strong>, and <strong>string</strong></li>
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
              <li>In the header of the request, include your <strong>email</strong> and <strong>creator token</strong></li>
              <li>The body of the request should include 'game', 'player_name', 'player_id', and 'score' which includes each metric specified when the game was created</li>
              <li><strong>Note:</strong> only the game's creator is authorized to add scores for their game</li>
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
              <li>In the header of the request, include your <strong>email</strong> and <strong>creator token</strong></li>
              <li>The body of the request should include 'game' and 'scores' which includes an array of scores which follow the format used for adding a single score (minus the 'game' field)</li>
              <li><strong>Note:</strong> only the game's creator is authorized to add scores for their game</li>
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
