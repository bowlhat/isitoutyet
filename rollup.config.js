import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import svelte from 'rollup-plugin-svelte';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import config from 'sapper/config/rollup.js';
import pkg from './package.json';

const mode = process.env.NODE_ENV;
const dev = mode === 'development';
const legacy = !!process.env.SAPPER_LEGACY_BUILD;

const onwarn = (warning, onwarn) =>
	(warning.code === 'MISSING_EXPORT' && /'preload'/.test(warning.message)) ||
	(warning.code === 'CIRCULAR_DEPENDENCY' && /[/\\]@sapper[/\\]/.test(warning.message)) ||
	onwarn(warning);

export default {
	client: {
		input: config.client.input(),
		output: config.client.output(),
		plugins: [
			replace({
				'process.browser': true,
				'process.env.NODE_ENV': JSON.stringify(mode),
			}),
			svelte({
				compilerOptions: {
					dev,
					hydratable: true,
				},
				emitCss: true
			}),
			resolve({
				browser: true,
				dedupe: ['svelte'],
			}),
			commonjs({
				namedExports: {
					// left-hand side can be an absolute path, a path
					// relative to the current directory, or the name
					// of a module in node_modules
					'node_modules/idb/build/idb.js': ['openDb'],
					'node_modules/firebase/dist/index.cjs.js': ['initializeApp', 'firestore'],
				}
			}),

			legacy && babel({
				extensions: ['.js', '.mjs', '.html', '.svelte'],
				babelHelpers: 'runtime',
				exclude: ['node_modules/@babel/**'],
				presets: [
					['@babel/preset-env', {
						targets: '> 0.25%, not dead'
					}]
				],
				plugins: [
					'@babel/plugin-syntax-dynamic-import',
					['@babel/plugin-transform-runtime', {
						useESModules: true
					}]
				]
			}),

			!dev && terser({
				module: true
			})
		],

		preserveEntrySignatures: false,
		onwarn,
	},

	server: {
		input: config.server.input(),
		output: config.server.output(),
		plugins: [
			replace({
				'process.browser': false,
				'process.env.NODE_ENV': JSON.stringify(mode),
			}),
			replace({
				'"__sapper__/build"': 'process.cwd()',
				'delimiters': ['',''],
			}),
			!dev && replace({
				'!emitted_basepath && process.send': 'false',
				'delimiters': ['',''],
			}),
			svelte({
				compilerOptions: {
					dev,
					generate: 'ssr',
					hydratable: true,
				},
			}),
			resolve({
				dedupe: ['svelte'],
			}),
			commonjs(),
			babel({
				extensions: ['.js', '.mjs', '.html', '.svelte'],
				babelHelpers: 'runtime',
				exclude: ['node_modules/@babel/**'],
				presets: [
					['@babel/preset-env', {
						targets: {node: true},
					}],
				],
				plugins: [
					'@babel/plugin-syntax-dynamic-import',
					'@babel/plugin-transform-runtime',
				],
			}),
		],
		external: Object.keys(pkg.dependencies).concat(require('module').builtinModules),

		preserveEntrySignatures: true, // true because we need exports for Firebase Cloud Functions
		onwarn,
	},

	serviceworker: {
		input: config.serviceworker.input(),
		output: config.serviceworker.output(),
		plugins: [
			resolve(),
			replace({
				'process.browser': true,
				'process.env.NODE_ENV': JSON.stringify(mode)
			}),
			commonjs(),
			!dev && terser()
		],

		preserveEntrySignatures: false,
		onwarn,
	},

};
