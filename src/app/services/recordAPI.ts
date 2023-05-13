import { FetchRecordsResponse } from "../components/wordo/stats";

export function saveRecord(wordsGuessed: number, wordsSkipped: number) {
  fetch("/api/saveRecord", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ wordsGuessed, wordsSkipped }),
  })
    .then((res) => res.json())
    .then(({ data }) => console.log(data));
}

export function fetchRecords(callback: Function) {
  fetch("/api/fetchRecords")
    .then((res) => res.json())
    .then((response: FetchRecordsResponse) => {
      callback(response.records);
    });
}
