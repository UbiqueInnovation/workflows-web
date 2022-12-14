const core = require("@actions/core");
const coreCommand = require("@actions/core/lib/command");
const setup = require("./setup");
const post = require("./post");

const isPost = !!process.env.STATE_isPost;

if (isPost) {
  // cleanup
  const pid = process.env.STATE_pid;
  try {
    post(pid);
  } catch (error) {
    core.setFailed(error.message);
  }
} else {
  // setup
  try {
    setup((pid) =>
      coreCommand.issueCommand("save-state", { name: "pid" }, pid)
    );
  } catch (error) {
    core.setFailed(error.message);
  } finally {
    // cf. https://github.com/actions/checkout/blob/main/src/state-helper.ts
    coreCommand.issueCommand("save-state", { name: "isPost" }, "true");
  }
}
