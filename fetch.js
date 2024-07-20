import axios from "axios";

async function fetchInfo(symbol) {
  let config = {
    method: "get",
    url: `https://api.twelvedata.com/time_series?apikey=${API_KEY}&interval=1min&country=India&symbol=${symbol}&exchange=NSE&type=stock&format=JSON`,
    headers: { "User-Agent": "request" },
  };

  try {
    const response = await axios(config);
    console.log(response.data.values[0]);
    return `
    open: ${JSON.stringify(response.data.values[0].open)},
    close:${JSON.stringify(response.data.values[0].close)},
    high:${JSON.stringify(response.data.values[0].high)},
    low:${JSON.stringify(response.data.values[0].low)},
    volume:${JSON.stringify(response.data.values[0].volume)}`;
  } catch (error) {
    console.log(error);
    return `An error occurred while fetching the stock price for ${symbol}.`;
  }
}
export default fetchInfo;