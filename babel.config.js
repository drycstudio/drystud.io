module.exports = {
	presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
	plugins: [
		[
			'module-resolver',
			{
				// * Important:
				// ! Warning: do not activate the following option "root" to avoid the error:
				// ? - TypeError: Cannot read properties of null(reading 'useContext')
				// root: '.',
				extensions: ['.js', '.jsx', '.ts', '.tsx', '.mdx'],
				alias: {
					'@assets': './src/assets',
					'@config': './src/config',
					'@components': './src/components',
					'@constants': './src/constants',
					'@contexts': './src/contexts',
					'@global-types': './src/@types',
					'@helpers': './src/helpers',
					'@hooks': './src/hooks',
					'@project-types': './src/types',
					'@theme': './src/theme',
					'@utils': './src/utils',
				},
				cwd: 'babelrc',
			},
		],
	],
};
