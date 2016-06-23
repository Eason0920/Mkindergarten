using mkindergarten.App_Code.Handler;
using mkindergarten.Models;
using System;
using System.Web.Mvc;

namespace mkindergarten.Controllers.Home {
    public class HomeController : Controller {
        // GET: Index
        public ActionResult Home() {
            //ViewBag.Title = getPageTitle();
            ViewBag.Keywords = "萌學園幼兒園,萌學園,萌學園幼稚園";
            ViewBag.Description = "東森電視擁有獨家且豐富的影音資源，將萌學園幼兒園配合學校教學主題。延伸為培養孩子品格、安全、環保之家庭教育，且增進親子關係，為萌學園幼兒園與一般幼兒園差異化的重要特色";
            return View();      //sh讀取Views\Home\Home.cshtml
        }

        #region *** 通用資料要求 ***

        /// <summary>
        /// 取得所有縣市名稱、編號與所屬縣市園所數量資料
        /// </summary>
        /// <returns>ResponseResultModel</returns>
        [HttpGet]
        public ActionResult getCitysWithCompanyCountAction() {
            ResponseResultModel responseModel = new BaseHandler().getCitysWithCompanyCount();
            return Json(responseModel, JsonRequestBehavior.AllowGet);
        }

        #endregion

        #region *** 首頁 ***

        /// <summary>
        /// 取得首頁所有輪播資訊
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult getSlidersAction() {
            ResponseResultModel resultModel = new IndexHandler().getSliders();
            return Json(resultModel, JsonRequestBehavior.AllowGet);
        }

        #endregion

        #region *** 據點分佈 ***

        /// <summary>
        /// 取得據點分佈所有園所資訊
        /// </summary>
        /// <param name="city_id">縣市編號</param>
        /// <returns></returns>
        [HttpGet]
        public ActionResult getCompanysAction(Decimal city_id) {
            ResponseResultModel resultModel = new LocationHandler().getCompanys(city_id);
            return Json(resultModel, JsonRequestBehavior.AllowGet);
        }

        #endregion

        #region *** 人才招募 ***

        /// <summary>
        /// 取得所有職缺內容資訊
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult getRecruitJobsAction() {
            ResponseResultModel resultModel = new RecruitHandler().getRecruitJobs();
            return Json(resultModel, JsonRequestBehavior.AllowGet);
        }

        #endregion

        #region *** 招募職務園所 ***

        /// <summary>
        /// 取得招募職缺的園所資訊
        /// </summary>
        /// <param name="job_kind_id">職務類型編號</param>
        /// <returns></returns>
        [HttpGet]
        public ActionResult getRecruitJobCompanysAction(Decimal job_kind_id) {
            ResponseResultModel resultModel = new RecruitListHandler().getRecruitJobCompanys(job_kind_id);
            return Json(resultModel, JsonRequestBehavior.AllowGet);
        }

        #endregion

        #region *** 共用函式 ***

        /// <summary>
        /// 根據要求頁面不同定義頁面標題
        /// </summary>
        /// <returns></returns>
        private string getPageTitle() {
            string result = string.Empty;
            switch (Request.ApplicationPath.ToLowerInvariant()) {
                case "/":
                    result = "萌學園幼兒園";
                    break;
                case "/intro":
                    result = "萌學園幼兒園 - 什麼是萌學園";
                    break;
                case "/plan":
                    result = "萌學園幼兒園 - 什麼是萌學園";
                    break;
                case "/location":
                    result = "萌學園幼兒園 - 據點分佈";
                    break;
                case "/recruit":
                    result = "萌學園幼兒園 - 人才招募";
                    break;
            }
            return result;
        }

        #endregion

    }
}