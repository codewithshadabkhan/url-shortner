import express from "express";
import userRouter from "./routes/user.routes.js";

const app = express();
const PORT = process.env.PORT ?? 8000;

app.use(express.json());
app.use("/user", userRouter);

app.get("/", (req, res) => {
  return res.json({ status: "Server is nup and  running...." });
});

app.listen(PORT, () => {
  console.log(`server is running  on port ${PORT}`);
});
