import express from "express";
import cors from "cors";
import dbConnect from "./DB/DBConnect.js";
import IndexRoute from "./routes/Index.routes.js";
import cookieParser from "cookie-parser";
import helmet from "helmet";
const app = express();
const PORT = process.env.PORT || 4100 || 3000;
console.log("PORT", process.env.PORT);
console.log("JWT_SECRET", process.env.JWT_SECRET);

app.use(express.json({ limit: "50mb" }));
app.use(
  cors({
    origin: `https://superlative-kheer-29e175.netlify.app`,
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://superlative-kheer-29e175.netlify.app"], // Add your frontend URL here
      styleSrc: ["'self'", "https://superlative-kheer-29e175.netlify.app"], // Add your frontend URL here
      connectSrc: ["'self'", "https://test-backend-nh9c.onrender.com"], // Allow connections to your backend
      // Add other directives as needed
    },
  })
);

app.use("/api/v1", IndexRoute);

app.get("/check", (req, res) => {
  res.send("hello server");
});

dbConnect()
  .then(() =>
    app.listen(PORT, () => {
      console.log("server is running on PORT ", PORT);
    })
  )
  .catch((err) => console.log("error", err));
