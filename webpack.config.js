// webpack v4
const glob = require('glob');
const path = require('path');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const getNameFromDir = dir => {
	const lastSlash = dir.lastIndexOf('/');
	return dir.slice(lastSlash + 1);
};

const generateHTMLPlugins = () =>
	glob.sync('./src/pages/**/*.html').map(dir => {
		return new HtmlWebpackPlugin({
			filename: getNameFromDir(dir), // Output
			inject: false,
			template: dir // Input
		});
	});

// const generateCSSPlugins = () =>
// glob.sync('./src/**/*.scss').map(dir => {

//   const name = getNameFromDir(dir).replace('.scss', '');
//   console.log(dir);

//   return new MiniCssExtractPlugin({
//     // filename: 'style.css',
//     filename: 'styles/' + name+ '.css', // Output
//     chunkFilename: "[id].css"
//   })
// }
// );

const entryArray = glob.sync('./src/**/index.js');

const entryObject = entryArray.reduce((acc, item) => {
	if (item.indexOf('components') === -1) {
		const name = item.replace('./src/', '');
		console.log(name);

		acc[name] = item;
	}
	return acc;
}, {});

module.exports = {
	entry: entryObject,
	output: {
		path: path.resolve('dist'),
		filename: 'js/[name]'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader'
				}
			},
			{
				test: /\.scss$/,
				use: [
					'style-loader',
					MiniCssExtractPlugin.loader,
					'css-loader?url=false',
					'postcss-loader',
					'sass-loader'
				]
			},
			{
				test: /\.html$/,
				loader: 'raw-loader'
			}
		]
	},
	resolve: {
		alias: {
			components: path.resolve(__dirname, 'src/components/'),
			pages: path.resolve(__dirname, 'src/pages/'),
			static: path.resolve(__dirname, 'src/static/')
		}
	},
	devServer: {
		contentBase: path.join(__dirname, 'dist'),
		compress: true,
		port: 8080
	},
	plugins: [
		new CleanWebpackPlugin('dist', {}),
		new MiniCssExtractPlugin({
			filename: 'style.css'
		}),
		new CopyWebpackPlugin([
			{
				from: './src/static/',
				to: './static/'
			}
		]),
		...generateHTMLPlugins()
		// ...generateCSSPlugins(),
		// new WebpackMd5Hash()
	]
};
