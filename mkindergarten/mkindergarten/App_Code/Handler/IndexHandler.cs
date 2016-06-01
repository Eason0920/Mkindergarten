using mkindergarten.Models;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;

namespace mkindergarten.App_Code.Handler {

    public class IndexHandler : BaseHandler {

        //Const
        private readonly string SLIDER_FLODER = "slider";       //總部輪播圖片存放資料夾

        public ResponseResultModel getSliders() {
            string sqlComm = @" SELECT [EDIT_ID], [EDIT_TITLE], [EDIT_IMAGE], [EDIT_LINK] FROM [dbo].[MKG_EDIT] WITH(NOLOCK)
                                WHERE [EDIT_COMPANY_ID] = 0 AND [EDIT_KIND_ID] = 1 AND [EDIT_ISON] = 1 AND [EDIT_DEL_FLAG] = 0
                                AND GETDATE() BETWEEN [EDIT_BEG_DATE] AND [EDIT_END_DATE]
                                ORDER BY [EDIT_SORT], [EDIT_MODIFYDATE] DESC ";

            using (SqlDataReader reader = base.dbTools.requestDBToDataReader(sqlComm)) {
                if (!base.dbTools.reqError) {
                    if (reader.HasRows) {
                        List<SliderModel> sliderList = new List<SliderModel>();

                        try {
                            while (reader.Read()) {
                                SliderModel model = new SliderModel {
                                    id = reader.GetDecimal(0),
                                    title = reader.GetString(1),
                                    image = string.Format("/{0}/{1}/{2}", Resources.Public.headImageServerPath, this.SLIDER_FLODER, reader.GetString(2)),
                                    link = reader.GetString(3)
                                };

                                sliderList.Add(model);
                            }

                            base.responseModel.result = 1;
                            base.responseModel.data = sliderList;
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