using mkindergarten.Models;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;

namespace mkindergarten.App_Code.Handler {
    public class RecruitListHandler : BaseHandler {

        /// <summary>
        /// 取得招募職缺的園所資訊
        /// </summary>
        /// <param name="job_kind_id">招募職務編號</param>
        /// <returns>ResponseResultModel</returns>
        public ResponseResultModel getRecruitJobCompanys(Decimal job_kind_id) {
            string sqlComm = @" SELECT j.[JOB_ID], jk.[JOB_KIND_NAME], c.[COMPANY_ID], c.[COMPANY_NAME],
                                c.[COMPANY_CITY], c.[COMPANY_ADD], c.[COMPANY_TEL]
                                FROM [dbo].[MKG_JOB] AS j WITH(NOLOCK)
                                JOIN [dbo].[MKG_JOB_KIND] AS jk WITH(NOLOCK) ON j.[JOB_KIND_ID] = jk.[JOB_KIND_ID]
                                JOIN [dbo].[MKG_COMPANY] AS c WITH(NOLOCK) ON j.[JOB_COMPANY_ID] = c.[COMPANY_ID]
                                WHERE j.[JOB_KIND_ID] = @JOB_KIND_ID AND j.[JOB_DEL_FLAG] = 0
                                AND c.[COMPANY_ISON] = 1 AND c.[COMPANY_DEL_FLAG] = 0 ";

            Dictionary<string, object> dicy = new Dictionary<string, object>() {
                {"@JOB_KIND_ID", job_kind_id}
            };

            using (SqlDataReader reader = base.dbTools.requestDBToDataReader(sqlComm, dicy)) {
                if (!base.dbTools.reqError) {
                    if (reader.HasRows) {
                        List<RecruitJobCompanyModel> recruitJobCompanyList = new List<RecruitJobCompanyModel>();

                        try {
                            while (reader.Read()) {
                                RecruitJobCompanyModel model = new RecruitJobCompanyModel {
                                    job_id = reader.GetDecimal(0),
                                    job_kind_name = reader.GetString(1),
                                    company_id = reader.GetDecimal(2),
                                    company_name = reader.GetString(3),
                                    company_city_id = reader.GetDecimal(4),
                                    company_add = reader.GetString(5),
                                    company_tel = reader.GetString(6),
                                    company_link = string.Format("{0}://{1}/{2}/{3}",
                                                            base.uri.Scheme,
                                                            base.uri.Authority,
                                                            Resources.Public.companyApplicationPath,
                                                            reader.GetDecimal(2))
                                };

                                recruitJobCompanyList.Add(model);
                            }

                            base.responseModel.result = 1;
                            base.responseModel.data = recruitJobCompanyList;
                        } catch (Exception ex) {        //取得資料庫欄位值失敗
                            base.responseModel.result = Convert.ToInt32(Resources.ResponseCode.dbException);
                            base.responseModel.message = ex.Message;
                        }

                    } else {        //無資料筆數
                        base.responseModel.result = 0;
                    }

                } else {        //資料庫要求失敗
                    base.responseModel.result = Convert.ToInt32(Resources.ResponseCode.dbException);
                    base.responseModel.message = base.dbTools.reqErrorText;
                }
            }

            return base.responseModel;
        }
    }
}