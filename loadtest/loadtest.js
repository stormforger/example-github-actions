// NOTE: This file assumes one of {staging,production}.js is available during execution.
definition.setTarget($host);

definition.setArrivalPhases([
  {
    duration: 2 * 60,
    rate: 1.0,
  },
]);

definition.setTestOptions({
  cluster: { sizing: "preflight", },
});

definition.session("country-lookup", function(session) {
  var countries = session.ds.loadStructured($dsPrefix + "countries-de.csv");
  var country = session.ds.pickFrom(countries);

  session.get("/?country=:country", {
    tag: "get-country",
    params: {
      country: country.get("code"),
    },
  });
  session.check("mycheck", session.lastHttpStatus(), "<=", 400);
});
