import "@babel/polyfill";

const PORT_MAPPINGS = {
  '8080': 9090,
  '8000': 9000,
};

export const API_ENDPOINT = `http://0.0.0.0:${PORT_MAPPINGS[window.location.port]}`

export default {
  async postRecord(mood, feelings, comment) {
    await fetch(`${API_ENDPOINT}/record`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mood, feelings, comment })
    });
  },

  async getRecords() {
    const records = await fetch(`${API_ENDPOINT}/record`);

    return records;
  }
};
