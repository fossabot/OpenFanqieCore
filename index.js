"use strict";
const express = require("express");
const axios = require("axios");
const querystring = require('querystring');
const PORT = 53316;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.get("/data", (_req, res) => {
//   res.send("1");
// });
app.get("/", (_req, res) => {
  res.redirect("/Zhipu-index.html");
});
app.get("/Zhipu-jsCode", (req, res) => {
  if (req.query?.editor === "y")
    res.sendFile("/static/Zhipu-jsCode-editor-y.js", { root: __dirname });
  else res.sendFile("/static/Zhipu-jsCode.js", { root: __dirname });
});
app.get("/zhipu-getExampleFile", (req, res) => {
  res.sendFile(`/static/Public/examples/example-${req.query.id}.json`, {
    root: __dirname,
  });
});
// app.post("/Zhipu-draw", (_req, res) => {
//   res.sendFile("/static/Zhipu-draw", { root: __dirname });
// });
app.use(express.urlencoded({ extended: true }));

app.post("/Zhipu-draw", async (req, res) => {
  try {
    // 转换请求体为 URL 编码格式
    const formData = querystring.stringify(req.body);

    // 转发请求到目标 URL
    const response = await axios.post(
      "http://zhipu.lezhi99.com/Zhipu-draw",
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
          Referer: "http://zhipu.lezhi99.com/Zhipu-index.html",
          Origin: "http://zhipu.lezhi99.com",
          Accept: "*/*",
          "Accept-Encoding": "gzip, deflate",
          "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
          "X-Requested-With": "XMLHttpRequest",
        },
      }
    );
    res.status(response.status).set(response.headers).send(response.data);
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});
app.use(express.static("static"));
app.listen(PORT, () => {
  console.log("服务器启动，端口号", PORT);
});
