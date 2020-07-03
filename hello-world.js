/*
 * This file is hosted at https://github.com/stormforger/example-github-actions/
 * DO NOT EDIT DIRECTLY on app.stormforger.com
 */

definition.setTarget("http://testapp.loadtest.party");

definition.setArrivalPhases([
  {
    duration: 2 * 60,
    rate: 1.0,
  },
]);

definition.setTestOptions({
  cluster: { sizing: "preflight", },
});

definition.session("hello world", function(session) {
  session.get("/");
  session.check("mycheck", session.lastHttpStatus(), "<=", 400);
});
