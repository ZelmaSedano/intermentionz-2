import dotenv from "dotenv";
import express from "express";
import mime from "mime-types";
import twilio from "twilio";

// import affirmationsRouter from "./affirmationsRouter.mjs";
import jwtCheck from "./jwtCheck.mjs";
// 2nd API
import quoteRouter from "./quoteRouter.mjs";
import taskRouter from "./taskRouter.mjs";
import userRouter from "./userRouter.mjs";

const app = express();

// Twilio
dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
let client = twilio(accountSid, authToken);

// const phone = await db.getPhone(request.user.sub);
// response.json(tasks);
// comment
client.messages.create({
  body: "Howdy!",
  from: "+12178852760",
  to: "+12246027354",
});
// .then(message => console.log(message.sid));

// app.use("/api/affirmations", jwtCheck, affirmationsRouter);
app.use("/api/tasks", jwtCheck, taskRouter);
app.use("/api/users", jwtCheck, userRouter);
// 2nd API
app.use("/api/quote", jwtCheck, quoteRouter);

// Do not comment out or delete this end point. The React development server won't start until it pings this end point successfully.
app.get("/api/ping", (request, response) =>
  response.json({ response: "pong" }),
);

// console.log("process.env:" + process.env?.SERVE_REACT?.toLowerCase());

if (process.env?.SERVE_REACT?.toLowerCase() === "true") {
  app.use(
    express.static("/app", {
      maxAge: "1d",
      setHeaders: (res, path) =>
        ["application/json", "text/html"].includes(mime.lookup(path)) &&
        res.setHeader("Cache-Control", "public, max-age=0"),
    }),
  );

  app.get("*", (req, res) => {
    res.sendFile("/app/index.html");
  });
}

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.info(`Example server listening at http://localhost:${port}`);
});

// console.log("in the bottom of server.mjs");
// everything works in this file, maybe
