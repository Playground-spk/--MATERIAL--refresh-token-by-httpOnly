const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  const [refreshToken, accessToken] = getRefreshAndAccessToken(req);

  try {
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY);
    next();
  } catch (error) {
    switch (error.name) {
      case "TokenExpiredError":
        console.log("TokenExpiredError...");
        return checkRefreshAndGenNewAccess(req, res, next);

      case "JsonWebTokenError":
        console.log("jwt error ", error.message);
        if (error.message === "jwt must be provided") {
          return checkRefreshAndGenNewAccess(req, res, next);
        }

        return res.status(401).send("invalid token");
      default:
        return res.status(500).send("something went wrong");
    }
  }
};

const checkRefreshAndGenNewAccess = (req, res, next) => {
  console.log("in process try to genarate new access token.... ");
  const [refreshToken, accessToken] = getRefreshAndAccessToken(req);
  try {
    let payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);

    let newAcessToken = jwt.sign({ a: "456" }, process.env.ACCESS_TOKEN_KEY, {
      expiresIn: "5s",
    });

    req.cookies["access"] = newAcessToken;
    res.cookie("access", newAcessToken, { httpOnly: false, maxAge: 36000 });
    console.log(
      "new token set to cookies",
      newAcessToken === req.cookies["access"]
    );
    next();
  } catch (error) {
    console.log("err");
    return res.status(401).send("unauthorized"); //in case error by refresh token
  }
};

const getRefreshAndAccessToken = (req) => {
  let refreshToken;
  let accessToken;
  if (req && req.cookies) refreshToken = req.cookies["refresh"];

  if (req && req.cookies) accessToken = req.cookies["access"];

  return [refreshToken, accessToken];
};
