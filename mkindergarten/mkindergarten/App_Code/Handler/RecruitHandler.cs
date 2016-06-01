using mkindergarten.Models;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;

namespace mkindergarten.App_Code.Handler {
    public class RecruitHandler : BaseHandler {

        /// <summary>
        /// 取得所有職缺內容資訊
        /// </summary>
        /// <returns>ResponseResultModel</returns>
        public ResponseResultModel getRecruitJobs() {
            string sqlComm = @" SELECT [JOB_KIND_ID], [JOB_KIND_NAME], [JOB_KIND_DESC_HTML]
                                FROM [dbo].[MKG_JOB_KIND] WITH(NOLOCK) ";

            using (SqlDataReader reader = base.dbTools.requestDBToDataReader(sqlComm)) {
                if (!base.dbTools.reqError) {
                    if (reader.HasRows) {
                        List<JobKindModel> jobKindList = new List<JobKindModel>();

                        try {
                            while (reader.Read()) {
                                JobKindModel model = new JobKindModel {
                                    id = reader.GetDecimal(0),
                                    name = reader.GetString(1),
                                    desc_html = reader.GetString(2)
                                };

                                jobKindList.Add(model);
                            }

                            base.responseModel.result = 1;
                            base.responseModel.data = jobKindList;
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