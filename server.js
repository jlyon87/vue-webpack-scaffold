const path = require("path");
const express = require("express");
const app = express();

const PORT = process.env.PORT || 3030;

// Node Server Routes ABOVE Webpack.
app.get("/hello", (req, res) => {
	res.send({ hi: "there" });
});

app.use((req, res, next) => {
	console.log("req path", req.originalUrl);
	next();
});

// Webpack Comes last.
console.log("app root", __dirname);
console.log("dist", path.join(__dirname, "dist"));
console.log("index.html", path.join(__dirname, "dist", "index.html"));
if (process.env.NODE_ENV !== "production") {
	const webpackMiddleware = require("webpack-dev-middleware");
	const webpack = require("webpack");
	const webpackConfig = require("./webpack.config.js");

	app.use(webpackMiddleware(webpack(webpackConfig)));

} else {
	app.use(express.static("dist"));
	app.get("*", (req, res) => {
		console.log("index.html get *", path.join(__dirname, "dist", "index.html"));
		res.sendFile(path.join(__dirname, "dist", "index.html"));
	});
}

console.log("NODE_ENV", process.env.NODE_ENV);
app.listen(PORT, () => console.log("Listening on port: ", PORT));
