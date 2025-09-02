
import React from 'react';

const DepartmentBlock: React.FC<{ name: string; className?: string; area: string }> = ({ name, className, area }) => (
  <div className={`flex flex-col items-center justify-center p-4 text-center rounded-lg shadow-sm border ${className}`} style={{ gridArea: area }}>
    <h4 className="font-bold">{name}</h4>
  </div>
);

export const VirtualMap: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
      <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">Wezi Medical Centre Layout</h3>
      <div className="bg-slate-50 p-4 rounded-lg">
        <div className="grid grid-cols-4 grid-rows-3 gap-4 h-96" style={{
            gridTemplateAreas: `
                "entrance reception pharmacy emergency"
                "opd admissions theatre emergency"
                "opd admissions waiting waiting"
            `
        }}>
          <DepartmentBlock name="Main Entrance" className="bg-green-100 text-green-800 border-green-200" area="entrance" />
          <DepartmentBlock name="Reception" className="bg-blue-100 text-blue-800 border-blue-200" area="reception" />
          <DepartmentBlock name="Pharmacy" className="bg-purple-100 text-purple-800 border-purple-200" area="pharmacy" />
          <DepartmentBlock name="Emergency" className="bg-red-200 text-red-800 border-red-300 font-extrabold" area="emergency" />
          <DepartmentBlock name="Out-Patient Dept (OPD)" className="bg-yellow-100 text-yellow-800 border-yellow-200" area="opd" />
          <DepartmentBlock name="In-Patient (Admissions)" className="bg-indigo-100 text-indigo-800 border-indigo-200" area="admissions" />
          <DepartmentBlock name="Theatre" className="bg-gray-200 text-gray-800 border-gray-300" area="theatre" />
          <DepartmentBlock name="Waiting Area" className="bg-teal-100 text-teal-800 border-teal-200" area="waiting" />
        </div>
      </div>
       <div className="mt-6 text-center">
        <p className="text-slate-600">This is a simplified map. For assistance, please visit the reception.</p>
      </div>
    </div>
  );
};
