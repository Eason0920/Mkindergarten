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
            string controllerName = string.Empty;
            string actionName = string.Empty;

            //判斷來源要求者類型
            if (httpContext.Request.RawUrl.ToLowerInvariant().Contains(Resources.Public.searchBotParameter)) {     //search bot coming
                controllerName = "Snapshots";
                actionName = "Snapshots";
            } else {        //human browser coming
                controllerName = "Home";
                actionName = "Home";
            }

            routeData.Values.Add("controller", controllerName);     //預設 controller
            routeData.Values.Add("action", actionName);     //預設 action
            return routeData;
        }

        public override VirtualPathData GetVirtualPath(RequestContext requestContext, RouteValueDictionary values) {
            throw new NotImplementedException();
        }
    }
}