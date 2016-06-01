using System;

namespace mkindergarten.Models {

    /// <summary>
    /// 回應伺服器結果模型
    /// </summary>
    public class ResponseResultModel {
        public int result { get; set; }
        public object data { get; set; }
        public string message { get; set; }
    }

    /// <summary>
    /// 輪播資料模型
    /// </summary>
    public class SliderModel {
        public Decimal id { get; set; }
        public string title { get; set; }
        public string image { get; set; }
        public string link { get; set; }
    }

    /// <summary>
    /// 縣市資料模型
    /// </summary>
    public class CityWithCompanyCountModel {
        public Decimal id { get; set; }
        public string name { get; set; }
        public Int32 company_count { get; set; }
    }

    /// <summary>
    /// 園所資料模型
    /// </summary>
    public class CompanyModel {
        public Decimal id { get; set; }
        public string name { get; set; }
        public Decimal city_id { get; set; }
        public string add { get; set; }
        public string tel { get; set; }
        public string lat { get; set; }
        public string lng { get; set; }
        public string link { get; set; }
        public string intro_image { get; set; }
    }

    /// <summary>
    /// 招募職務種類資料模型
    /// </summary>
    public class JobKindModel {
        public Decimal id { get; set; }
        public string name { get; set; }
        public string desc_html { get; set; }
    }

    /// <summary>
    /// 招募職務園所資料模型
    /// </summary>
    public class RecruitJobCompanyModel {
        public Decimal job_id { get; set; }
        public string job_kind_name { get; set; }
        public Decimal company_id { get; set; }
        public string company_name { get; set; }
        public Decimal company_city_id { get; set; }
        public string company_add { get; set; }
        public string company_tel { get; set; }
        public string company_link { get; set; }
    }
}