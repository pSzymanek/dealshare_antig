const { createServer } = require("http");
const next = require("next");

const hostname = "0.0.0.0";
const port = Number(process.env.PORT || process.env.NODE_PORT || 3000);
const app = next({ dev: false, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    handle(req, res);
  }).listen(port, hostname, () => {
    console.log(`dealshare ready on ${hostname}:${port}`);
  });
});
