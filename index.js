const readline = require("readline");
const fs = require("fs");
const { table } = require("table");
const { wrapText, formatDate } = require("./helpers");
const statusCodes = require("./statusCodes.json");

//  read the filePath from command line options
const [filePath] = process.argv.slice(2);

// object to store the Overall API stats
const insights = {
  totalReqsPerStatus: {},
  totalReqsPerEndPoint: {},
  totalReqsPerMinute: {},
};

/*
 * extracts useful imformation for single api log ()
 * {string} line - single log
 */
const extractInformationFromLine = (line = "") => {
  const extractionRegex = /"([^"]+)" (\d+) (\d+) "-"/;
  const APIInformationExtracted = line.match(extractionRegex);

  //  if no API Information is extracted
  if (!APIInformationExtracted) {
    return;
  }

  //  Timestamp when api is hit
  const timestamp = line.substring(0, line.indexOf(": "));
  const formattedDate = formatDate(timestamp);

  //  API status code and endPoint extraction
  const HTTPStatus = APIInformationExtracted[2] || "N/A";
  const endPoint = APIInformationExtracted[1].substring(
    0,
    APIInformationExtracted[1].indexOf(" HTTP")
  );

  //   add stats by API Method
  insights.totalReqsPerStatus[HTTPStatus] = insights.totalReqsPerStatus[
    HTTPStatus
  ]
    ? insights.totalReqsPerStatus[HTTPStatus] + 1
    : 1;

  //  add Stats by API EndPoint
  insights.totalReqsPerEndPoint[endPoint] = insights.totalReqsPerEndPoint[
    endPoint
  ]
    ? insights.totalReqsPerEndPoint[endPoint] + 1
    : 1;

  //   add stats by API Hitting TimeStamp
  insights.totalReqsPerMinute[formattedDate] = insights.totalReqsPerMinute[
    formattedDate
  ]
    ? insights.totalReqsPerMinute[formattedDate] + 1
    : 1;
};

/*
 * processes log file and generates the stastics
 * {String} filePath
 */
async function processFileLineByLine(filePath) {
  const fileStream = fs.createReadStream(filePath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity, // To handle both \r\n and \n line endings
  });
  console.log("Processing Data.....");

  for await (const line of rl) {
    // extracts infromation from single log
    extractInformationFromLine(line);
  }
}

processFileLineByLine(filePath)
  .then(() => {
    // tables with corresponding headers
    const timeSeriesAPITable = [["Timestamp", "Total Requests Made"]];
    const statusAPITable = [
      ["Status Code Meaning", "Status Code", "Total Requests Made"],
    ];
    const reqsEndPointTable = [["EndPoint", "Total Requests Made"]];

    //  add data to tables from json objects
    Object.entries(insights.totalReqsPerMinute).forEach((row) => {
      timeSeriesAPITable.push([row[0], row[1]]);
    });
    Object.entries(insights.totalReqsPerStatus).forEach((row) => {
      statusAPITable.push([statusCodes[row[0]] || "N/A", row[0], row[1]]);
    });

    Object.entries(insights.totalReqsPerEndPoint).forEach((row) => {
      reqsEndPointTable.push([wrapText(row[0]), row[1]]);
    });

    //  print the tables
    console.log("Processing Time series API Table...");
    console.log(table(timeSeriesAPITable));
    console.log("Processing API Status Table...");
    console.log(table(statusAPITable));
    console.log("Processing Request EndPoint Table");
    console.log(table(reqsEndPointTable));
  })
  .catch((error) => {
    console.error("An error occurred:", error);
  });
