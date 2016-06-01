using mkindergarten.Models;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;

namespace mkindergarten.App_Code.Handler {
    public class LocationHandler : BaseHandler {

        //Const
        //private readonly string COMPANY_INTRO_FLODER = "company";       //園所環境介紹圖片存放資料夾

        /// <summary>
        /// 依據縣市編號取得園所資訊清單
        /// </summary>
        /// <param name="city_id">查詢園所資訊清單縣市編號</param>
        /// <returns>ResponseResultModel</returns>
        public ResponseResultModel getCompanys(Decimal city_id) {
            string sqlComm = @" SELECT c.[COMPANY_ID], c.[COMPANY_NAME], c.[COMPANY_CITY], c.[COMPANY_ADD], c.[COMPANY_TEL],
                                c.[COMPANY_CONTANT_LAT], c.[COMPANY_CONTANT_LNG],
  
                                --取得園所環境介紹圖片第一筆，若無圖片回傳空字串
                                [COMPANY_INTRO_IMAGE] = ISNULL((SELECT TOP(1) e.[EDIT_IMAGE] FROM [dbo].[MKG_EDIT] AS e WITH(NOLOCK)
                                WHERE e.[EDIT_COMPANY_ID] = c.[COMPANY_ID] AND e.[EDIT_KIND_ID] = 2 AND e.[EDIT_ISON] = 1
                                AND e.[EDIT_SORT] = 1 AND e.[EDIT_DEL_FLAG] = 0), '')
  
                                FROM [dbo].[MKG_COMPANY] AS c WITH(NOLOCK)
                                WHERE c.[COMPANY_CITY] = @COMPANY_CITY AND c.[COMPANY_ISON] = 1 AND c.[COMPANY_DEL_FLAG] = 0 ";

            Dictionary<string, object> dicy = new Dictionary<string, object> { 
                {"@COMPANY_CITY", city_id}
            };

            using (SqlDataReader reader = base.dbTools.requestDBToDataReader(sqlComm, dicy)) {
                if (!base.dbTools.reqError) {
                    List<CompanyModel> resultList = new List<CompanyModel>();

                    try {
                        if (reader.HasRows) {
                            while (reader.Read()) {
                                CompanyModel companyDataModel = new CompanyModel {
                                    id = reader.GetDecimal(0),
                                    name = reader.GetString(1),
                                    city_id = reader.GetDecimal(2),
                                    add = reader.GetString(3),
                                    tel = reader.GetString(4),
                                    lat = reader.GetString(5),
                                    lng = reader.GetString(6),
                                    link = string.Format("{0}://{1}/{2}/{3}",
                                                            base.uri.Scheme,
                                                            base.uri.Authority,
                                                            Resources.Public.companyApplicationPath,
                                                            reader.GetDecimal(0)),
                                    intro_image = ((!string.IsNullOrEmpty(reader.GetString(7))) ?
                                    string.Format("/{0}/{1}/{2}", Resources.Public.companyEnvSliderServerPath,
                                                                  reader.GetDecimal(0),
                                                                  reader.GetString(7)) : string.Empty)
                                };

                                resultList.Add(companyDataModel);
                            }

                            base.responseModel.data = resultList;
                            base.responseModel.result = 1;
                        } else {
                            base.responseModel.result = 0;
                        }

                    } catch (Exception ex) {        //reader讀取失敗
                        base.responseModel.result = Convert.ToInt32(Resources.ResponseCode.dbException);
                        base.responseModel.message = ex.Message;
                    }

                } else {        //資料庫存取失敗
                    base.responseModel.result = Convert.ToInt32(Resources.ResponseCode.dbException);
                    base.responseModel.message = base.dbTools.reqErrorText;
                }
            }

            return base.responseModel;
        }
    }
}