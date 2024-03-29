import React, { useState } from "react";
import { TextInput, SelectBox, SelectBoxItem } from "@tremor/react";
import { PlusIcon, MinusIcon } from '@heroicons/react/24/solid';

interface ScoreRequirementsProps {
  onRequirementsChange: (requirements: Requirement[]) => void
  requirements: Requirement[]
}

type Requirement = {
  field: string;
  type: string;
};

const ScoreRequirements: React.FC<ScoreRequirementsProps> = ({ onRequirementsChange, requirements = [] }) => {
  const [allFieldsFilled, setAllFieldsFilled] = useState(false);

  const handleFieldChange = (index: number, newValue: string) => {
    const newRequirements = [...requirements];
    newRequirements[index].field = newValue;
    
    const allFieldsFilled = newRequirements.every(requirement => requirement.field !== "");
    setAllFieldsFilled(allFieldsFilled);

    onRequirementsChange(newRequirements);
  };

  const handleTypeChange = (index: number, newValue: string) => {
    const newRequirements = [...requirements];
    newRequirements[index].type = newValue;

    onRequirementsChange(newRequirements);
  };

  const addRequirement = () => {
    const newRequirements = [...requirements, { field: '', type: 'number' }];
    
    onRequirementsChange(newRequirements);
  };

  const removeRequirement = () => {
    if (requirements.length > 2) {
      const newRequirements = requirements.slice(0, requirements.length - 1);
      onRequirementsChange(newRequirements);
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto">
      {requirements.map((requirement, index) => (
        <div key={index} className="w-full mb-1 px-1 pt-1">
          <div className="flex w-full space-x-1">
            <TextInput 
              className="w-3/4"
              placeholder="Field"
              value={requirement.field}
              onChange={(event) => handleFieldChange(index, event.target.value)}
            />
            <SelectBox
              className="w-1/4"
              value={requirement.type}
              onValueChange={(event) => handleTypeChange(index, event)}
            >
              <SelectBoxItem value="number">number</SelectBoxItem>
              <SelectBoxItem value="string">string</SelectBoxItem>
            </SelectBox>
          </div>
        </div>
      ))}
      <div className="flex space-x-2 mt-1 pl-1">
        <button onClick={addRequirement} className="px-1 py-0.5 bg-indigo-500 shadow-lg rounded-md hover:bg-indigo-600">
          <PlusIcon className="h-5 w-5 fill-white stroke-white" />
        </button>
        <button onClick={removeRequirement} disabled={requirements.length == 2} className="px-1 py-0.5 bg-indigo-500 shadow-lg rounded-md hover:bg-indigo-600 disabled:bg-gray-400">
          <MinusIcon className="h-5 w-5 fill-white stroke-white" />
        </button>
      </div>
    </div>
  );
};

export default ScoreRequirements;
