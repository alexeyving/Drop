const path = require('path');
const webpack = require('webpack');
const { CONFIG, PATHS, UTILS } = require('./config');
const { isExternal } = UTILS;
const { ASSET_TEMPLATE } = CONFIG;
const { SRC, DIST, ASSETS } = PATHS;
const PAGES = require('./pages.config.js');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

let webpackConfig = {
	devtool: 'eval',
	watch: true,
	cache: true,

	entry: {
		'app': path.join(SRC, 'js/main.js')
	},

	output: {
		path: DIST,
		filename: '[name].js',
		chunkFilename: '[id]-chunk.js',
	},

	resolve: {
		extensions: [
			'.js'
		],
		alias: {
			"assets": ASSETS
		}
	},

	module: {
		rules: [
			{
				test: /\.js$/,
				use: 'babel-loader',
				exclude: /node_modules/
			},

			{
				test: /\.pug/,
				use: 'pug-loader?pretty=true'
			},

			{
				test: /\.scss$/,
				use: ExtractTextPlugin.extract({
					fallback: "style-loader",
					use: 'css-loader!postcss-loader!sass-loader'
				})
			},
			{
				test: /\.(svg|png|jpg|gif|eot|woff|woff2|ttf)$/,
				use: `url-loader?name=${ASSET_TEMPLATE}`
			}
		]
	},

	plugins: [
		new CommonsChunkPlugin({
			name: 'common',
			minChunks: function (module, count) {
				return !isExternal(module) && count >= 2; // adjustable cond
			}
		}),
		new CommonsChunkPlugin({
			name: 'vendors',
			chunks: ['common'],
			// or if you have an key value object for your entries
			// chunks: Object.keys(entry).concat('common')
			minChunks: function (module) {
				return isExternal(module);
			}
		}),
		new ExtractTextPlugin("styles.css"),
	]
};
let items = Object.keys(PAGES).map((key, i) => {
	let item = Object.assign({}, PAGES[key], {
		alwaysWriteToDisk: true,
		filename: `${key}.html`
	});
	return new HtmlWebpackPlugin(item);
});

webpackConfig.plugins.push(...items, new HtmlWebpackHarddiskPlugin());

module.exports = webpackConfig;