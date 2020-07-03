/*
 * This file is hosted at https://github.com/stormforger/example-github-actions/
 * DO NOT EDIT DIRECTLY on app.stormforger.com
 */

const dsPrefix = "example-github-actions/staging/";

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
  var countries = session.ds.loadStructured(dsPrefix + "countries-de.csv");
  var country = session.ds.pickFrom(countries);

  session.get("/?country=:country", {
    tag: "get-country",
    params: {
      country: country.get("code"),
    },
  });
  session.check("mycheck", session.lastHttpStatus(), "<=", 400);
});
