import React from "react";

export default function Charts() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="max-w-sm w-full bg-white rounded-lg shadow-sm dark:bg-gray-800 p-4 md:p-6">
        <div className="flex justify-between mb-5">
          <div className="grid gap-4 grid-cols-2">
            <div>
              <h5 className="inline-flex items-center text-gray-500 dark:text-gray-400 leading-none font-normal mb-2">
                Clicks
              </h5>
              <p className="text-gray-900 dark:text-white text-2xl leading-none font-bold">
                42,3k
              </p>
            </div>
            <div>
              <h5 className="inline-flex items-center text-gray-500 dark:text-gray-400 leading-none font-normal mb-2">
                CPC
              </h5>
              <p className="text-gray-900 dark:text-white text-2xl leading-none font-bold">
                $5.40
              </p>
            </div>
          </div>
          <div>
            <button
              id="dropdownDefaultButton"
              type="button"
              className="px-3 py-2 inline-flex items-center text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100"
            >
              Last week
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 items-center border-gray-200 border-t dark:border-gray-700 justify-between mt-2.5">
          <div className="pt-5 text-center">
            <button className="px-5 py-2.5 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800">
              View full report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
