import React from 'react';
import { AlertTriangle, Shield, Gavel, MapPin } from 'lucide-react';

const CircuitInfo = ({ circuitInfo }) => {
  // Determine styling based on hostility level
  const getHostilityColor = (hostility) => {
    switch (hostility) {
      case 'EXTREMELY HOSTILE':
        return {
          text: 'text-red-400',
          icon: <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
        };
      case 'Protective':
        return {
          text: 'text-green-400',
          icon: <Shield className="h-5 w-5 text-green-400 mr-2" />
        };
      default:
        return {
          text: 'text-blue-400',
          icon: <Gavel className="h-5 w-5 text-blue-400 mr-2" />
        };
    }
  };

  const hostilityStyle = getHostilityColor(circuitInfo.hostility);

  return (
    <div>
      <div className="flex items-center mb-3">
        <MapPin className="h-5 w-5 text-gray-400 mr-2" />
        <h3 className="text-lg font-semibold text-white">{circuitInfo.name}</h3>
        <div className={`ml-3 flex items-center ${hostilityStyle.text}`}>
          {hostilityStyle.icon}
          <span className="font-medium">{circuitInfo.hostility}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-1">States/Territories</h4>
          <p className="text-sm text-gray-400">
            {circuitInfo.states.join(', ')}
          </p>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-1">Qualified Immunity</h4>
          <p className="text-sm text-gray-400">
            {circuitInfo.qualifiedImmunity}
          </p>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-1">Section 1983 Cases</h4>
          <p className="text-sm text-gray-400">
            {circuitInfo.section1983}
          </p>
        </div>
      </div>

      {circuitInfo.hostility === 'EXTREMELY HOSTILE' && (
        <div className="mt-3 flex items-start">
          <AlertTriangle className="h-4 w-4 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-300">
            Exercise extreme caution in this circuit. Constitutional protections are severely limited.
          </p>
        </div>
      )}
    </div>
  );
};

export default CircuitInfo;