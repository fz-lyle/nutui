const fs = require('fs')
const path = require('path')
const util = require('./util.js')
const buildReadme = require('./build-readme.js')
function buildLib(callback) {
	const root = path.join(__dirname, '..')
	const nutui = path.join(root, 'uni_modules')
	const packages = path.join(root, 'packages')
	const lib = path.join(packages, 'lib')
	var filenames = []
	var filenamesUpper = []

	const nutuiPackagePath = path.join(packages, 'package.json')
	let nutuiData = util.read(path.join(nutui, 'nut-ui', 'package.json'))
	let nutuiPackageData = util.read(nutuiPackagePath)
	nutuiData = JSON.parse(nutuiData)
	nutuiPackageData = JSON.parse(nutuiPackageData)
	// if (nutuiPackageData.version === nutuiData.version) {
	// 	console.log('当前版本号一致，请先执行 npm run build:release 更新 uni-ui 组件后再次执行当前命令');
	// 	return
	// }

	nutuiPackageData.version = nutuiData.version
	// nut-ui 版本更新
	util.write(nutuiPackagePath, JSON.stringify(nutuiPackageData, null, 2))
	let rootPath = path.join(root, 'package.json')
	let rootPackage = util.read(rootPath)
	rootPackage = JSON.parse(rootPackage)
	rootPackage.version = nutuiData.version
	// // 根目录版本更新
	util.write(rootPath, JSON.stringify(rootPackage, null, '\t'))
	// 同步文档
	buildReadme()
	util.copyFile(path.join(root, 'README.md'), path.join(packages, 'README.md'))

	const exists = fs.existsSync(lib)
	if (exists) {
		util.deleteFolder(lib)
	}
	const packagesLists = fs.readdirSync(nutui)
	packagesLists.reduce((promise, item) => {
		if (item === 'nut-test' || item === 'nut-ui'|| item === '.DS_Store') return promise
		if(item === 'nut-scss'){
			let scsspath  = path.join(nutui, item)
			util.copyDir(scsspath, path.join(lib, item))
			return promise
		}
		const comPath = path.join(nutui, item, 'components')
		const coms = fs.readdirSync(comPath)

		return coms.reduce((promise, item) => {
			const componentsPath = path.join(comPath, item)
			util.copyDir(componentsPath, path.join(lib, item))
			// console.log(item + ' 组件同步成功');
			return promise
		}, promise)
	}, Promise.resolve([])).then(() => {
		console.log('SUCCESS');
		typeof callback === 'function' && callback()
	})

}

module.exports = buildLib
