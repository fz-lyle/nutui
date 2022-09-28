import {
	defineConfig
} from 'vite'
import uni from "@dcloudio/vite-plugin-uni";
export default defineConfig({
	plugins: [
		uni()
	],
	css: {
		preprocessorOptions: {
			scss: {
				additionalData: `@import "~@/nut-ui/styles/variables.scss";`
			}
		}
	}
})
