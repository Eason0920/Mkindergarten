using Common.tools;
using mkindergarten.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Web;

namespace mkindergarten.App_Code.Handler {
    public class BaseHandler {

        protected ResponseResultModel responseModel = new ResponseResultModel();      //回應伺服器處理結果模型
        protected DBTools dbTools = new DBTools(ConfigurationManager.ConnectionStrings["connStr_MKG"].ToString());
        protected Uri uri = HttpContext.Current.Request.Url;        //目前的網站 Uri 資訊

        /// <summary>
        /// 取得所有縣市資料
        /// </summary>
        public ResponseResultModel getCitysWithCompanyCount() {
            string sqlComm = @" SELECT city.[CITY_ID], city.[CITY_NAME], [COMPANY_COUNT] = COUNT(com.[COMPANY_ID])
                                FROM [dbo].[MKG_CITY] AS city WITH(NOLOCK)
                                LEFT JOIN [dbo].[MKG_COMPANY] AS com WITH(NOLOCK)
                                ON city.[CITY_ID] = com.[COMPANY_CITY]
                                AND com.[COMPANY_ISON] = 1
                                AND com.[COMPANY_DEL_FLAG] = 0
                                GROUP BY city.[CITY_ID], city.[CITY_NAME] ";

            using (SqlDataReader reader = this.dbTools.requestDBToDataReader(sqlComm)) {
                try {
                    if (reader.HasRows) {
                        if (!this.dbTools.reqError) {
                            List<CityWithCompanyCountModel> citysList = new List<CityWithCompanyCountModel>();

                            while (reader.Read()) {
                                CityWithCompanyCountModel model = new CityWithCompanyCountModel {
                                    id = reader.GetDecimal(0),
                                    name = reader.GetString(1),
                                    company_count = reader.GetInt32(2)
                                };

                                citysList.Add(model);
                            }

                            responseModel.result = 1;
                            responseModel.data = citysList;

                        } else {        //存取資料庫失敗
                            responseModel.result = Convert.ToInt32(Resources.ResponseCode.dbException);
                            responseModel.message = this.dbTools.reqErrorText;
                        }

                    } else {
                        responseModel.result = 0;
                    }

                } catch (Exception ex) {        //存取資料庫失敗
                    responseModel.result = Convert.ToInt32(Resources.ResponseCode.dbException);
                    responseModel.message = ex.Message;
                }

            }

            return this.responseModel;
        }
    }
}