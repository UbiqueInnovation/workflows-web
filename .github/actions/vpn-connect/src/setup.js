const fs = require("fs");
const core = require("@actions/core");
const exec = require("./exec");
const Tail = require("tail").Tail;

const run = (callback) => {
  const configFile = core.getInput("config_file").trim();
  const clientKey = core.getInput("client_key").trim();
  const tlsAuthKey = core.getInput("tls_auth_key").trim();
  const certificate_authority = core.getInput("certificate_authority").trim();
  const certificate = core.getInput("certificate").trim();

  if (!fs.existsSync(configFile)) {
    throw new Error(`config file '${configFile}' not found`);
  }

  // 1. Configure client

  fs.appendFileSync(configFile, "\n# ----- amendments made by action -----\n");

  // client certificate auth
  if (clientKey) {
    fs.appendFileSync(configFile, "key client.key\n");
    fs.writeFileSync("client.key", clientKey);
  }

  if (tlsAuthKey) {
    fs.appendFileSync(configFile, "tls-auth ta.key 1\n");
    fs.writeFileSync("ta.key", tlsAuthKey);
  }

  if (certificate_authority) {
    fs.appendFileSync(configFile, "ca ca.cert\n");
    fs.writeFileSync("ca.cert", certificate_authority);
  }

  if (certificate) {
    fs.appendFileSync(configFile, "cert cert.cert\n");
    fs.writeFileSync("cert.cert", certificate_authority);
  }

  core.info("========== begin configuration ==========");
  core.info(fs.readFileSync(configFile, "utf8"));
  core.info("=========== end configuration ===========");

  // 2. Run openvpn

  // prepare log file
  fs.writeFileSync("openvpn.log", "");
  const tail = new Tail("openvpn.log");

  try {
    exec(
      `sudo openvpn --config ${configFile} --daemon --log openvpn.log --writepid openvpn.pid`
    );
  } catch (error) {
    core.error(fs.readFileSync("openvpn.log", "utf8"));
    tail.unwatch();
    throw error;
  }

  tail.on("line", (data) => {
    core.info(data);
    if (data.includes("Initialization Sequence Completed")) {
      tail.unwatch();
      clearTimeout(timer);
      const pid = fs.readFileSync("openvpn.pid", "utf8").trim();
      core.info(`VPN connected successfully. Daemon PID: ${pid}`);
      callback(pid);
    }
  });

  const timer = setTimeout(() => {
    core.setFailed("VPN connection failed.");
    tail.unwatch();
  }, 15000);
};

module.exports = run;
