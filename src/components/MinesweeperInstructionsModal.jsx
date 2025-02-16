import React from 'react';

const MinesweeperInstructionsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-neutral-50 rounded-lg p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Minesweeper Rules</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-4 text-gray-600">
          <div>
            <h3 className="font-semibold text-lg mb-2">🎯 Objective</h3>
            <p>Clear all non-mine cells without detonating any mines.</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">🕹️ Controls</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Left Click: Reveal cell</li>
              <li>Right Click: Flag potential mine</li>
              {/* <li>Double Click (on numbers): Clear surrounding cells</li> */}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">🔍 Number System</h3>
            <p>Numbers indicate how many mines are adjacent to that cell.</p>
            <div className="flex gap-2 mt-2">
              {[1, 2, 3, 4].map((num) => (
                <div
                  key={num}
                  className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded"
                >
                  {num}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">🚩 Flagging</h3>
            <p>Right-click to mark potential mines. Flags prevent accidental clicks.</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded transition-colors"
        >
          Start Sweeping!
        </button>
      </div>
    </div>
  );
};

export default MinesweeperInstructionsModal;