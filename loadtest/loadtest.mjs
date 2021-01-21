/*
 * NOTICE: DO NOT EDIT!
 *
 * This file is managed via https://github.com/stormforger/example-github-actions/
 */

var config;

// Define the target environment via --define ENV=\"staging\"
if (ENV == "staging") {
  config = {
    dsPrefix: "example-github-actions/staging/",
    host: "http://testapp.loadtest.party:9001",
  }
} else if (ENV == "production") {
  config = {
    dsPrefix: "example-github-actions/production/",
    host: "https://testapp.loadtest.party",
  }
} else {
  throw new Error("unknown environment");
}


definition.setTarget(config.host);

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
  var countries = session.ds.loadStructured(config.dsPrefix + "countries-de.csv");
  var country = session.ds.pickFrom(countries);

  visitLandingPage(session, country);
  login(session);
  viewProduct(session, country);
});


function visitLandingPage(session, country) {
  session.get("/:country/", {
    tag: "t100_landing",
    params: {
      country: country.get("code"),
    },
  });
  session.check("c100_landing", session.lastHttpStatus(), "<=", 400);
}

function login(session) {
  // in this example we just fetch a session token and use that for the rest of the requests
  session.post("/random/get_token", {
    tag: "t200_login",
    extraction: {
      jsonpath: {
        "auth_token": "$.token",
      }
    },
  });
  session.assert("c200_login", session.getVar("auth_token"), "!=", "");

  // Our only shop accepts the auth token in the Authorization header.
  session.defaults.setAuthentication({
    username: "",
    password: session.getVar("auth_token"),
  });
}

function viewProduct(session, country) {
  session.get("/data/test.json?country=:country", {
    tag: "t300_viewproduct",
    params: {
      country: country.get("code"),
    },
    abort_on_error: true,
    extraction: {
      jsonpath: {
        product: "$.root.list[0].id",
      }
    }
  });
  session.if(session.getVar("product"), "!=", "", function(ctx) {
    // productID is not empty
    ctx.get("/?country=:country&product=:product", {
      tag: "t310_viewproduct",
      abort_on_error: true,
      params: {
        country: country.get("code"),
        product: session.getVar("product"),
      }
    });
  });
}
