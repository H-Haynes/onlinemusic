module.exports = {
	// presets: ["@vue/cli-plugin-babel/preset"],
	presets: ["@vue/cli-plugin-babel/preset"],
	plugins: [
		[
			"import",
			{
				libraryName: "view-design",
				libraryDirectory: "src/components",
			},
		],
		[
			"component",
			{
				"libraryName": "element-ui",
				"styleLibraryName": "theme-chalk"
			}
		]
	],
};