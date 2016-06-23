using System.Web.Optimization;

namespace mkindergarten {
    public class BundleConfig {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles) {

            bundles.Add(new ScriptBundle("~/Scripts/public").Include(
                "~/Scripts/jquery.min.js",
                "~/Scripts/angular.min.js",
                "~/Scripts/angular-route.js",
                "~/Scripts/angular-sanitize.js",
                "~/Scripts/angular-animate.js",
                "~/Scripts/flickity.pkgd.js",
                "~/Scripts/jquery.spritely-0.1.js",
                "~/Scripts/public-tools.js",
                "~/Scripts/public-angular-service.js",
                "~/Scripts/public-angular-directive.js"
            ));

            bundles.Add(new ScriptBundle("~/Scripts/app").Include(
                "~/Scripts/app-shared.js",
                "~/Scripts/app.js",
                "~/Scripts/app-directive.js",
                "~/Scripts/app-service.js",
                "~/Scripts/app-controller.js"
            ));

            bundles.Add(new ScriptBundle("~/Scripts/gmap").Include(
                "~/Scripts/lodash.js",
                "~/Scripts/angular-simple-logger.js",
                "~/Scripts/angular-google-maps.js"));

            bundles.Add(new StyleBundle("~/Css/public").Include(
                "~/Content/flickity.css",
                "~/Content/m.css",
                "~/Content/m-pc.css",
                "~/Content/app-shared.css",
                "~/Content/public-angular-style.css"
            ));

            bundles.Add(new StyleBundle("~/Css/gmap").Include(
                "~/Content/app-gmap.css"
            ));
        }
    }
}
