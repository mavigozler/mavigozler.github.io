"use strict";

import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { Configuration } from 'webpack';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

export const webpackConfig: Configuration = {
	context: path.resolve(__dirname, "../../.."),
	entry: path.resolve(__dirname, "../../..", "src/SPREST/SPMetadata.ts"),
	output: {
		path: path.resolve(__dirname, '../../..', 'release/js'),
		filename: 'bundle.js',
	},
	resolve: {
		extensions: ['.ts', '.js'],
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, '../../..', 'html/SPListingTemplate.html'),
		}),
	],
};