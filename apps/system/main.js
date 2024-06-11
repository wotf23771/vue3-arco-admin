import appRoutes from './router'
import router from "@/router";

if (appRoutes && appRoutes.length > 0) {
    appRoutes.forEach(item => {
        router.addRoute(item)
    })
}
