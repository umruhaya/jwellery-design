module.exports = {
	apps: [
		{
			name: 'cyodesign',
			script: 'dist/server/entry.mjs',
			interpreter: 'node',
			node_args: '--env-file=.env',
			cwd: '/home/umernaeem135acc/cyodesign',
			env: {
				NODE_ENV: 'production',
				PORT: '8000',
			},
		},
	],
}
