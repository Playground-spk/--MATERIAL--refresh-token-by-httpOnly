require("dotenv").config();
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const handleToken = require("./handleToken");

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

app.post("/login", (req, res, next) => {
  const accessToken = jwt.sign({a:'123'}, process.env.ACCESS_TOKEN_KEY,{expiresIn:'5s'});
  console.log('index refresh', process.env.REFRESH_TOKEN_KEY)
  const refreshToken = jwt.sign({a:'123'}, process.env.REFRESH_TOKEN_KEY,{expiresIn:3600000});

  res.cookie("refresh", refreshToken, { httpOnly: true, maxAge: 9600000 });

  res.cookie('access',accessToken,{ httpOnly: false,maxAge:3600})

  res.status(204).send()
});

app.get('/data',handleToken,(req,res,next)=>{
    let accessToken;
    if (req && req.cookies) accessToken = req.cookies["access"];

    let payload =jwt.decode(accessToken)

    res.status(200).send(payload.a)

})



app.listen(8000,()=>{
    console.log('server is runing on port 8000')
})

// console.log(decoded.exp > Date.now() / 1000);
