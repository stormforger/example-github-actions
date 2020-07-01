definition.setTarget("http://testapp.loadtest.party");

definition.setArrivalPhases([
  {
    duration: 5 * 60,  // 5min in seconds
    rate: 1.0,         // clients per second to launch
  },
]);

definition.setTestOptions({
  cluster: { sizing: "preflight", },
});

definition.session("hello world", function(session) {
  session.get("/");
  session.check("mycheck", session.lastHttpStatus(), "<=", 400);
});
