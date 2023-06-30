import React, { useState } from "react";
import { TextInput, SelectBox, SelectBoxItem, Button } from "@tremor/react";
import { PlusIcon, MinusIcon } from '@heroicons/react/24/solid';
import { transform } from "typescript";

type Requirement = {
  field: string;
  type: string;
};

interface ScoreRequirementsProps {
  onFieldsFilledChange: (allFieldsFilled: boolean, requirements: { [key: string]: string }) => void;
}

const ScoreRequirements: React.FC<ScoreRequirementsProps> = ({ onFieldsFilledChange }) => {
  const [requirements, setRequirements] = useState<Requirement[]>([
    { field: '', type: 'number' },
    { field: '', type: 'number' }
  ]);
  const [allFieldsFilled, setAllFieldsFilled] = useState(false);

  const handleFieldChange = (index: number, newValue: string) => {
    const newRequirements = [...requirements];
    newRequirements[index].field = newValue;
    setRequirements(newRequirements);
    
    const allFieldsFilled = newRequirements.every(requirement => requirement.field !== "");
    setAllFieldsFilled(allFieldsFilled);

    onFieldsFilledChange(allFieldsFilled, transformRequirementsToObject(newRequirements));
  };

  const handleTypeChange = (index: number, newValue: string) => {
    const newRequirements = [...requirements];
    newRequirements[index].type = newValue;
    setRequirements(newRequirements);

    onFieldsFilledChange(allFieldsFilled, transformRequirementsToObject(newRequirements));
  };

  const addRequirement = () => {
    const newRequirements = [...requirements, { field: '', type: 'number' }];
    setRequirements(newRequirements);
    setAllFieldsFilled(false);
    
    onFieldsFilledChange(false, transformRequirementsToObject(newRequirements));
  };

  const removeRequirement = () => {
    if (requirements.length > 2) {
      const newRequirements = requirements.slice(0, requirements.length - 1);
      setRequirements(newRequirements);

      const allFieldsFilled = newRequirements.every(requirement => requirement.field !== "");
      onFieldsFilledChange(allFieldsFilled, transformRequirementsToObject(newRequirements));
    }
  };

  // Grants us the final result in typical JSON format { key: value, key: value, etc... }
  const transformRequirementsToObject = (requirements: Requirement[]): { [key: string]: string } => {
    return requirements.reduce((obj: { [key: string]: string }, requirement) => {
      obj[requirement.field] = requirement.type;
      return obj;
    }, {});
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
