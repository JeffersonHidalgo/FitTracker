import React from "react";

export default function Plan() {
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
              Product name
            </th>
            <th scope="col" className="px-6 py-3">
              Disponibilidad
            </th>
            <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
              Category
            </th>
            <th scope="col" className="px-6 py-3">
              Precio
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th
              scope="row"
              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800"
            >
              Membresia del Gym"
            </th>
            <td className="px-6 py-4">Disponible</td>
            <td className="px-6 py-4 bg-gray-50 dark:bg-gray-800">Digital</td>
            <td className="px-6 py-4">$1,000</td>
          </tr>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th
              scope="row"
              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800"
            >
              Coach Personal Asignado
            </th>
            <td className="px-6 py-4">No disponible</td>
            <td className="px-6 py-4 bg-gray-50 dark:bg-gray-800">FIsico</td>
            <td className="px-6 py-4">$3,000</td>
          </tr>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th
              scope="row"
              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800"
            >
              Rutina Semanal
            </th>
            <td className="px-6 py-4">Disponible</td>
            <td className="px-6 py-4 bg-gray-50 dark:bg-gray-800">
              Fisico/Digital
            </td>
            <td className="px-6 py-4">$250</td>
          </tr>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th
              scope="row"
              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800"
            >
              Plan de Nutricion
            </th>
            <td className="px-6 py-4">Disponible</td>
            <td className="px-6 py-4 bg-gray-50 dark:bg-gray-800">Personal</td>
            <td className="px-6 py-4">1,200</td>
          </tr>
          <tr>
            <th
              scope="row"
              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800"
            >
              Plan 5
            </th>
            <td className="px-6 py-4">No stock</td>
            <td className="px-6 py-4 bg-gray-50 dark:bg-gray-800">Wearables</td>
            <td className="px-6 py-4">$9999</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
