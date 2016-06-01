using System;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace mkindergarten.App_Code.Route {

    /// <summary>
    /// 預設路由類別
    /// </summary>
    public class SingleRoute : RouteBase {

        public override RouteData GetRouteData(HttpContextBase httpContext) {
            RouteData routeData = new RouteData(this, new MvcRouteHandler());
            routeData.Values.Add("controller", "Home");     //預設 controller
            routeData.Values.Add("action", "Home");     //預設 action
            return routeData;
        }

        public override VirtualPathData GetVirtualPath(RequestContext requestContext, RouteValueDictionary values) {
            throw new NotImplementedException();
        }
    }
}