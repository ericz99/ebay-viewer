const request = require("request-promise");
const cheerio = require("cheerio");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

class EbayView {
  constructor(url, counter) {
    this.url = url;
    this.counter = counter;
    this.headers = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36"
    };

    this.jar = request.jar(); // creating same session...
    this.request = request.defaults({ jar: this.jar });
  }

  async init() {
    try {
      await this.view();
    } catch (err) {
      if (err) throw new Error("err", err);
    }
  }

  async view() {
    let opts = {
      uri: this.url,
      method: "GET",
      resolveWithFullResponse: true
    };

    const res = await this._makeRequest(opts);

    if (res.statusCode == 200) {
      console.log("AYEE VIEWED THE PAGE! " + "[" + this.counter + "]");
    }
  }

  async _makeRequest(options) {
    options.method = options.method || "GET";

    let headers = this.headers;

    let settings = {
      ...options,
      uri: options.uri,
      method: options.method,
      headers
    };

    return await this.request(settings);
  }
}

var i = 0;

function _init() {
  const startTime = +new Date();
  rl.question("Enter EBAY item: ", answer => {
    const url = answer;

    rl.question("Enter VIEW count: ", answer => {
      const entries = parseInt(answer);

      const thread = setInterval(() => {
        // create a new object
        new EbayView(url, i++).view();
        const endTime = +new Date();

        if (i === entries) {
          clearInterval(thread);
          console.log("FINISHED: " + (endTime - startTime) + " MS...");
          process.exit(1);
        }
      }, 1);
    });
  });
}

_init();
