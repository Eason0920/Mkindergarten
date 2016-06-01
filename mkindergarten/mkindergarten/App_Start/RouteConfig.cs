using mkindergarten.App_Code.Route;
using System.Web.Mvc;
using System.Web.Routing;

namespace mkindergarten {
    public class RouteConfig {
        public static void RegisterRoutes(RouteCollection routes) {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            //取消網站圖標的路由請求
            routes.IgnoreRoute("favicon.ico");

            //ajax 用路由
            routes.MapRoute(
                name: "AjaxRoute",
                url: "ajax/{controller}/{action}"
            );

            //其他預設路由(強制轉向 controller = "Home", action = "Home")
            routes.Add(new SingleRoute());
        }
    }
}

