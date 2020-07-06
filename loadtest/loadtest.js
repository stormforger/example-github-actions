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

  visitLandingPage(session, country);
  login(session);
  viewProduct(session, country);
});


function visitLandingPage(session, country) {
  session.get("/:country/", {
    tag: "100-landing",
    params: {
      country: country.get("code"),
    },
  });
  session.check("landing", session.lastHttpStatus(), "<=", 400);
}

function login(session) {
  // in this example we just fetch a session token and use that for the rest of the requests
  session.post("/random/get_token", {
    tag: "200-login",
    extraction: {
      jsonpath: {
        "auth_token": "$.token",
      }
    },
  });
  session.assert("200-login", session.getVar("auth_token"), "!=", "");

  // Our only shop accepts the auth token in the Authorization header.
  session.setAuthentication({
    username: "",
    password: session.getVar("auth_token"),
  });
}

function viewProduct(session, country) {
  session.get("/data/test.json?country=:country", {
    tag: "300-viewproduct",
    params: {
      country: country.get("code"),
    },
    abort_on_error: true,
    extraction: {
      jsonpath: {
        productID: "$.root.list[0].id",
      }
    }
  });
  session.if("productfound", session.getVar("productID"), "!=", "", function(ctx) {
    // productID is not empty

    session.get("/?country=:country&product=:product", {
      tag: "310-viewproduct",
      abort_on_error: true,
      params: {
        country: country.get("code"),
        product: session.getVar("productID"),
      }
    });
  });
}