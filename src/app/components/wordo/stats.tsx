import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { gameDataInterface } from "./wordo";
import { Dayjs } from "dayjs";

export default function Stats() {
  const [cookies, setCookie] = useCookies(["wordo"]);
  const [statsRanked, setStatsRanked] = useState<scoreInterface[]>([]);

  type scoreInterface = gameDataInterface & {
    finalScore: number;
    dateTime: number;
  };
  function rankStats() {
    const data: scoreInterface[] = cookies.wordo;
    const score: { [key: number]: scoreInterface[] } = [];
    const keys: number[] = [];
    let final: any = [];
    if (!data) return;
    data.forEach((dataRow) => {
      const guessed = dataRow.wordsGuessed;
      const skipped = dataRow.wordsSkipped;
      let result = guessed - (skipped > 0 ? skipped / 2 : 0);
      //For every word you guessed you get a word, for every word skipped you lose half.
      if (result < 0) result = 0;
      //You cannot score less than 0...
      dataRow.finalScore = result;
      if (score[result]) {
        score[result].push(dataRow);
      } else {
        score[result] = [dataRow];
      }
      keys.push(result);
    });

    const rankKeys = keys.sort((a, b) => b - a);
    rankKeys.forEach((rank) => {
      final = [...final, ...score[rank]];
    });
    setStatsRanked(final);
  }
  useEffect(() => {
    rankStats();
  }, [cookies]);

  if (!statsRanked.length) return <></>;
  return (
    <div>
      <div className="relative overflow-y-auto h-[22em]">
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
                key={row.dateTime + index}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <td className="px-6 py-4">#{index + 1}</td>
                <td className="px-6 py-4">{row.wordsGuessed}</td>
                <td className="px-6 py-4">{row.wordsSkipped}</td>
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {row.finalScore}
                </th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
