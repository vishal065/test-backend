import express from "express";
import cors from "cors";
import dbConnect from "./DB/DBConnect.js";
import IndexRoute from "./routes/Index.routes.js";
import cookieParser from "cookie-parser";
const app = express();
const PORT = process.env.PORT || 4100 || 3000;
console.log("PORT", process.env.PORT);
console.log("JWT_SECRET", process.env.JWT_SECRET);

app.use(express.json({ limit: "50mb" }));
app.use(
  cors({
    origin: `https://superlative-kheer-29e175.netlify.app`,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());



app.use("/api/v1", IndexRoute);

app.get("/check", (req, res) => {
  const accessCookie = {
    sameSite: "None",
    maxAge: 1000 * 60 * 60, // 1 hour
    httpOnly: true,
    secure: true,
  };
  const accessCookie2 = {
    sameSite: "Lax",
    maxAge: 1000 * 60 * 60, // 1 hour
    httpOnly: true,
    secure: true,
  };
  res
    .cookie("token", "token", accessCookie)
    .cookie("role", "user", accessCookie2);
     return res.send("hello")
});

dbConnect()
  .then(() =>
    app.listen(PORT, () => {
      console.log("server is running on PORT ", PORT);
    })
  )
  .catch((err) => console.log("error", err));
