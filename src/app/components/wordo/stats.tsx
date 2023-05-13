import { fetchRecords } from "@/app/services/recordAPI";
import { useEffect, useState } from "react";

export interface FetchRecordsResponse {
  records: Record[];
  success: boolean;
}

export interface Record {
  id: number;
  wordsGuessed: number;
  wordsSkipped: number;
  score: number;
  createdAt: string;
}

export default function Stats() {
  const [statsRanked, setStatsRanked] = useState<Record[]>([]);

  useEffect(() => {
    fetchRecords((records: Record[]) => {
      setStatsRanked(records);
    });
  }, []);

  function rankStats(data: Record[]) {
    setStatsRanked(data.sort((a, b) => b.score - a.score));
  }

  if (!statsRanked.length) return <></>;
  return (
    <div>
      <div className="relative overflow-y-auto max-h-[22em] stats-board">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Rank
              </th>
              <th scope="col" className="px-6 py-3">
                Words Guessed
              </th>
              <th scope="col" className="px-6 py-3">
                Words Skipped
              </th>
              <th scope="col" className="px-6 py-3">
                Final Score
              </th>
            </tr>
          </thead>
          <tbody>
            {statsRanked.map((row, index) => (
              <tr
                key={row.createdAt + index}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <td className="px-6 py-4">#{index + 1}</td>
                <td className="px-6 py-4">{row.wordsGuessed}</td>
                <td className="px-6 py-4">{row.wordsSkipped}</td>
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {row.score}
                </th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
