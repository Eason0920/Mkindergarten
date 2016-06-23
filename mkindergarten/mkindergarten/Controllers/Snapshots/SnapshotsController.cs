using Common.tools;
using NReco.PhantomJS;
using System;
using System.IO;
using System.Text;
using System.Web.Mvc;

namespace mkindergarten.Controllers.Snapshots {
    public class SnapshotsController : Controller {

        //快照檔資料夾名稱
        private static readonly string SNAPSHOTS_FOLDER = "Snapshots";

        // GET: Snapshots
        public ActionResult Snapshots() {

            string resultContent = string.Empty;

            //將 search bot symbo 去掉後取得實際網址
            //string crawlerUrl = Request.Url.ToString().ToLowerInvariant().Replace(Resources.Public.searchBotParameter, string.Empty);

            //因萌學園前台伺服器主機無法對外連線，所以 PhantomJS 若以目前網址先連外再導回本機爬取資料會錯誤，故改固定以 localhost 直接爬取本機
            Uri uri = Request.Url;
            string crawlerUrl = string.Format(@"{0}://localhost:{1}{2}",
                                                             uri.Scheme,
                                                             uri.Port,
                                                             uri.PathAndQuery.Replace(Resources.Public.searchBotParameter, string.Empty));

            //將實際網址轉換為快照檔名稱(轉換 : 與 / 為 _ 符號)
            string snapshotsFileName = string.Concat(crawlerUrl.Replace(":", "_").Replace("/", "_"), ".html");

            //儲存快照檔目錄
            string snapshotsDirMapPath = Server.MapPath(string.Format("~/{0}/", SNAPSHOTS_FOLDER));

            //快照檔實際路徑(目錄 + 檔名)
            string snapshotsFilePath = string.Concat(snapshotsDirMapPath, snapshotsFileName);

            ////判斷快照檔目錄不存在的話先建立
            if (!Directory.Exists(snapshotsDirMapPath)) {
                Directory.CreateDirectory(snapshotsDirMapPath);
            }

            //要給 PhantomJs 執行的 Javascript 檔案
            string execServerJs = Server.MapPath("~/Scripts/phantomjs-server.js");
            if (System.IO.File.Exists(execServerJs)) {

                //取得 PhantomJS 回傳的 html 串流
                using (MemoryStream momeryStream = new MemoryStream()) {
                    PhantomJS phantomJs = new PhantomJS();

                    try {

                        //執行 PhantomJS(server js 檔案, [要爬取的 url, 無取得 html 預設回傳內容], inputStream, outputStream)
                        phantomJs.Run(execServerJs, new string[] { crawlerUrl, string.Empty }, null, momeryStream);
                        momeryStream.Position = 0;

                        //讀取串流並轉換為字串進行後續處理
                        using (StreamReader streamReader = new StreamReader(momeryStream)) {
                            resultContent = streamReader.ReadToEnd();

                            if (!string.IsNullOrEmpty(resultContent)) {     //有取得 html 資料

                                //寫入實體檔，供日後無取得 html 資料時使用(失敗則忽略)
                                System.IO.File.WriteAllText(snapshotsFilePath, resultContent);

                            } else {        //無取得 html 資料

                                //若歷史快照檔存在，則回應歷史快照檔內容
                                if (System.IO.File.Exists(snapshotsFilePath)) {
                                    resultContent = System.IO.File.ReadAllText(snapshotsFilePath);
                                }
                            }
                        }

                    } finally {
                        phantomJs.Abort();      //退出 PhantomJS

                        //若執行到此 resultContent 變數還是空的，只好回應該網址靜態內容，是否有更好的做法？
                        if (string.IsNullOrEmpty(resultContent)) {
                            resultContent = Utility.getWebContent(crawlerUrl, Encoding.UTF8);
                        }
                    }
                }
            }

            return Content(resultContent, "text/html; charset=utf8");
        }
    }
}