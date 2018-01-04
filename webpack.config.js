const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const VENDOR_LIBS = [
	"axios",
	"vue",
	"vue-router",
	"vuelidate",
	"vuetify",
	"vuex"
];

module.exports = {
	entry: {
		bundle: './src/main.js',
		vendor: VENDOR_LIBS
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'js/[name].[hash].js'
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					'vue-style-loader',
					'css-loader'
				],
			},
			{
				test: /\.vue$/,
				loader: 'vue-loader',
				options: {
					extractCSS: true,
					loaders: {}
					// other vue-loader options go here
				}
			},
			{
				test: /\.js$/,
				loader: 'buble-loader',
				exclude: /node_modules/
			},
			{
				test: /\.(png|jpg|gif|svg)$/,
				loader: 'file-loader',
				options: {
					name: 'assets/[name].[ext]?[hash]'
				}
			}
		]
	},
	plugins: [
		new ExtractTextPlugin("css/style.css"),
		new webpack.optimize.CommonsChunkPlugin({
			names: ["vendor", "manifest"]
		}),
		new HtmlWebpackPlugin({
			template: "index.html"
		}),
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: '"production"'
			}
		})
	],
	resolve: {
		alias: {
			'vue$': 'vue/dist/vue.esm.js'
		},
		extensions: ['*', '.js', '.vue', '.json']
	},
	devServer: {
		historyApiFallback: true,
		noInfo: true,
		overlay: true
	},
	performance: {
		hints: false
	},
	devtool: '#eval-source-map'
};

if (process.env.NODE_ENV === 'production') {
	module.exports.devtool = '#source-map'
	// http://vue-loader.vuejs.org/en/workflow/production.html
	module.exports.plugins = (module.exports.plugins || []).concat([
		new webpack.optimize.UglifyJsPlugin({
			sourceMap: true,
			compress: {
				warnings: false
			}
		}),
		new webpack.LoaderOptionsPlugin({
			minimize: true
		})
	])
}
