const path = require("path");

// Webpack plugins
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const FaviconsPlugin = require("favicons-webpack-plugin");

// Postcss plugins
const postcssImport = require("postcss-import");
const preCss = require("precss");
const cssNano = require("cssnano");

const prod = "production";
const dev = "development";
const isProd = process.env.NODE_ENV === prod;
const nodeModulesFolder = path.resolve("./", "node_modules");

module.exports = {
	entry: {
		main: path.resolve("./src/main.tsx")
	},
	output: {
		path: path.resolve("./dist"),
		filename: "[name].js"
	},
	devtool: process.env.NODE_ENV === prod ? false : "inline-source-map",
	mode: process.env.NODE_ENV,
	resolve: {
		extensions: [".js", ".ts", ".d.ts", ".tsx", ".jsx"]
	},
	module: {
		rules: [
			{
				test: /\.(js|ts|jsx|tsx)$/,
				exclude: nodeModulesFolder,
				use: [
					{
						loader: "ts-loader"
					}
				]
			},
			{
				test: /\.(css|scss|sass)$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader
					},
					{
						loader: "css-loader",
						options: {
							modules: {
								localIdentName: "[local]-[hash:base64:16]"
							}
						}
					},
					{
						loader: "postcss-loader",
						options: {
							ident: "postcss",
							parser: "postcss-scss",
							plugins: [
								postcssImport(),
								preCss(),
								...(isProd ? [cssNano({preset: "default"})] : [])
							]
						}
					}
				]
			},
			{
				test: /\.(png|svg|jpeg|jpg|gif)$/,
				use: [
					{
						loader: "file-loader",
						options: {
							name: "imgs/[name].[ext]"
						}
					}
				]
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/,
				use: [
					{
						loader: "file-loader",
						options: {
							name: "fonts/[name].[ext]"
						}
					}
				]
			},
			{
				test: /\.(webm)$/,
				use: [
					{
						loader: "file-loader",
						options: {
							name: "audio/[name].[ext]"
						}
					}
				]
			}
		]
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: "style.css"
		}),
		new CopyPlugin({
			patterns: [
				{
					from: "./src/index.html",
					to: "./"
				}
			]
		}),
		new FaviconsPlugin({
			logo: "./src/imgs/favicon.svg",
			outputPath: "./favicons",
			mode: "webapp",
			devMode: "webapp",
			cache: true,
			favicons: {
				background: "#00000000",
				icons: {
					android: false,
					appleIcon: true,
					appleStartup: false,
					coast: false,
					favicons: true,
					firefox: false,
					windows: false,
					yandex: false
				}
			}
		})
	],
	optimization: {
		splitChunks: {
			chunks: "all",
			minSize: 0,
			cacheGroups: {
				vendors: {
					name: "vendors",
					test: path.resolve("./", "node_modules")
				}
			}
		}
	},
	stats: {
		colors: true
	},
	devServer: {
		port: 8080,
		host: "0.0.0.0",
		contentBase: "./dist"
	}
};