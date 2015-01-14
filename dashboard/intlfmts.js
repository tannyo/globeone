/*
 * intlfmts.js
 * create json documents of international date, number, and currency formats.
 *
 * Country Codes Found at: http://www.nationsonline.org/oneworld/currencies.htm
 * Created on 21 Nov 2012 with help building the table from Saerom. TKO
 */

var intlfmts = new function () {
    var regions = {}, defaultRegion, dateFormats;
    /* 0 - no zero padding, 1 - zero padding of numbers */
    dateFormats = {0: ["M/d/yyyy","d/M/yyyy","yyyy/M/d"], 1: ["MM/dd/yyyy","dd/MM/yyyy","yyyy/MM/dd"]};

    function copyRegion(region) {
        this.locale = region.locale;
        this.date_component_order = region.date_component_order;
        this.date_string = region.date_string;
        this.time_string = region.time_string;
        this.clock_24_hour = region.clock_24_hour;
        this.am_string = region.am_string;
        this.pm_string = region.pm_string;
        this.am_pm_position = region.am_pm_position;
        this.decimal_string = region.decimal_string;
        this.number_leading_zero = region.number_leading_zero;
        this.currency_name = region.currency_name;
        this.currency_code = region.currency_code;
        this.currency_string = region.currency_string;
        this.currency_position = region.currency_position;
        this.currency_space = region.currency_space;
        this.thousand_string = region.thousand_string;
        this.year_format = region.year_format;
        this.country_name = region.country_name;
        this.language_name = region.language_name;
    }

    // Regional preferences table
    function RegionalPreferences(
            sLocale,
            sDate_component_order,
            sDate_string,
            sTime_string,
            sClock_24_hour,
            sAm_string,
            sPm_string,
            sAm_pm_position,
            sDecimal_string,
            sNumber_leading_zero,
            sCurrency_string,
            sCurrency_position,
            sCurrency_space,
            sThousand_string,
            sYear_format,
            sCountryName,
            sLanguageName,
            sCurrencyName,
            sCurrencyCode) {
        this.locale = sLocale;
        this.date_component_order = parseInt(sDate_component_order,10);
        this.date_string = sDate_string;
        this.time_string = sTime_string;
        this.clock_24_hour = parseInt(sClock_24_hour,10);
        this.am_string = sAm_string;
        this.pm_string = sPm_string;
        this.am_pm_position = parseInt(sAm_pm_position,10);
        this.decimal_string = sDecimal_string;
        this.number_leading_zero = parseInt(sNumber_leading_zero,10);
        this.currency_name = sCurrencyName || "";
        this.currency_code = sCurrencyCode || "";
        this.currency_string = sCurrency_string;
        this.currency_position = parseInt(sCurrency_position,10);
        this.currency_space = parseInt(sCurrency_space,10);
        this.thousand_string = sThousand_string;
        this.year_format = parseInt(sYear_format,10);
        this.country_name = sCountryName;
        this.language_name = sLanguageName;

        this.copy = copyRegion;
    }

    regions["en-us"] = new RegionalPreferences("en-US","0","/",":","0","AM","PM","1",".","1","$","0","0",",","1","United States","English","US Dollar","USD");
    regions["af"] = new RegionalPreferences("af","2","/",":","1","vm","nm","1",".","1","R","0","1",",","1","South Africa","Afrikaans","Rand","ZAR");
    regions["ar"] = new RegionalPreferences("ar","1","/",":","0","\u0635","\u0645","1",".","1","\u062f.\u0625.\u200f","0","1",",","1","","Arabic","","");
    regions["ar-ae"] = new RegionalPreferences("ar-AE","1","/",":","0","\u0635","\u0645","1",".","1","\u062f.\u0625.\u200f","0","1",",","1","United Arab Emirates","Arabic","UAE Dirham","AED");
    regions["ar-bh"] = new RegionalPreferences("ar-BH","1","/",":","0","\u0635","\u0645","1",".","1","\u062f.\u0628.\u200f","0","1",",","1","Bahrain","Arabic","Bahraini Dinar","BHD");
    regions["ar-dz"] = new RegionalPreferences("ar-DZ","1","-",":","0","\u0635","\u0645","1",".","1","\u062f.\u062c.\u200f","0","1",",","1","Algeria","Arabic","Algerian Dinar","DZD");
    regions["ar-eg"] = new RegionalPreferences("ar-EG","1","/",":","0","\u0635","\u0645","1",".","1","\u062c.\u0645.\u200f","0","1",",","1","Egypt","Arabic","Egyptian Pound","EGP");
    regions["ar-jo"] = new RegionalPreferences("ar-JO","1","/",":","0","\u0635","\u0645","1",".","1","\u062f.\u0627.\u200f","0","1",",","1","Jordan","Arabic","Jordanian Dinar","JOD");
    regions["ar-kw"] = new RegionalPreferences("ar-KW","1","/",":","0","\u0635","\u0645","1",".","1","\u062f.\u0643.\u200f","0","1",",","1","Kuwait","Arabic","Kuwaiti Dinar","KWD");
    regions["ar-lb"] = new RegionalPreferences("ar-LB","1","/",":","0","\u0635","\u0645","1",".","1","\u0644.\u0644.\u200f","0","1",",","1","Lebanon","Arabic","Lebanese Pound","LBP");
    regions["ar-ma"] = new RegionalPreferences("ar-MA","1","-",":","0","\u0635","\u0645","1",".","1","\u062f.\u0645.\u200f","0","1",",","1","Morocco","Arabic","Moroccan Dirham","MAD");
    regions["ar-om"] = new RegionalPreferences("ar-OM","1","/",":","0","\u0635","\u0645","1",".","1","\u0631.\u0639.\u200f","0","1",",","1","Oman","Arabic","Rial Omani","OMR");
    regions["ar-qa"] = new RegionalPreferences("ar-QA","1","/",":","0","\u0635","\u0645","1",".","1","\u0631.\u0642.\u200f","0","1",",","1","Qatar","Arabic","Qatari Rial","QAR");
    regions["ar-sa"] = new RegionalPreferences("ar-SA","1","/",":","0","\u0635","\u0645","1",".","1","\u0631.\u0633.\u200f","0","1",",","1","Saudi Arabia","Arabic","Saudi Riyal","SAR");
    regions["ar-sy"] = new RegionalPreferences("ar-SY","1","/",":","0","\u0635","\u0645","1",".","1","\u0644.\u0633.\u200f","0","1",",","1","Syrian Arab Republic","Arabic","Syrian Pound","SYP");
    regions["ar-tn"] = new RegionalPreferences("ar-TN","1","-",":","0","\u0635","\u0645","1",".","1","\u062f.\u062a.\u200f","0","1",",","1","Tunisia","Arabic","Tunisian Dinar","TND");
    regions["ar-ye"] = new RegionalPreferences("ar-YE","1","/",":","0","\u0635","\u0645","1",".","1","\u0631.\u064a.\u200f","0","1",",","1","Yemen","Arabic","Yemeni Rial","YER");
    regions["be"] = new RegionalPreferences("be","1",".",":","1","AM","PM","1",",","1","\u0440.","1","1"," ","1","Belarus","Byelorussian","Belarussian Ruble","BYR");
    regions["be-by"] = new RegionalPreferences("be-BY","1",".",":","1","AM","PM","1",",","1","\u0440.","1","1"," ","1","Belarus","Byelorussian","Belarussian Ruble","BYR");
    regions["bg"] = new RegionalPreferences("bg","1",".",":","1","AM","PM","1",",","1","\u043b\u0432","1","1"," ","1","Bulgaria","Bulgarian","Bulgarian Lev","BGN");
    regions["bg-bg"] = new RegionalPreferences("bg-BG","1",".",":","1","AM","PM","1",",","1","\u043b\u0432","1","1"," ","1","Bulgaria","Bulgarian","Bulgarian Lev","BGN");
    regions["ca"] = new RegionalPreferences("ca","1","/",":","1","AM","PM","1",",","1","\u20ac","1","1",".","1","Spain","Catalan","Euro","EUR");
    regions["cs"] = new RegionalPreferences("cs","1",".",":","1","dop.","odp.","1",",","1","K\u010d","1","1"," ","1","Czech Republic","Czech","Czech Koruna","CZK");
    regions["cy-gb"] = new RegionalPreferences("cy-GB","1","/",":","1","AM","PM","1",".","1","\u00a3","0","0",",","1","United Kingdom - Welsh","English","Pound Sterling","GBP");
    regions["da"] = new RegionalPreferences("da","1","-",":","1","AM","PM","1",",","1","kr","0","1",".","1","Denmark","Danish","Danish Krone","DKK");
    regions["da-dk"] = new RegionalPreferences("da-DK","1","-",":","1","AM","PM","1",",","1","kr","0","1",".","1","Denmark","Danish","Danish Krone","DKK");
    regions["de"] = new RegionalPreferences("de","1",".",":","1","AM","PM","1",",","1","\u20ac","1","1",".","1","Germany","German","Euro","EUR");
    regions["de-at"] = new RegionalPreferences("de-AT","1",".",":","1","AM","PM","1",",","1","\u20ac","0","1",".","1","Austria","German","Euro","EUR");
    regions["de-ch"] = new RegionalPreferences("de-CH","1",".",":","1","AM","PM","1",".","1","SFr.","0","1","'","1","Switzerland","German","Swiss Franc","CHF");
    regions["de-de"] = new RegionalPreferences("de-DE","1",".",":","1","AM","PM","1",",","1","\u20ac","1","1",".","1","Germany","German","Euro","EUR");
    regions["de-li"] = new RegionalPreferences("de-LI","1",".",":","1","AM","PM","1",".","1","CHF","0","1","'","1","Liechtenstein","German","Swiss Franc","CHF");
    regions["de-lu"] = new RegionalPreferences("de-LU","1",".",":","1","AM","PM","1",",","1","\u20ac","1","1",".","1","Luxembourg","German","Euro","EUR");
    regions["el"] = new RegionalPreferences("el","1","/",":","1","\u03c0\u03bc","\u03bc\u03bc","1",",","1","\u20ac","1","1",".","1","Greece","Greek","Euro","EUR");
    regions["el-gr"] = new RegionalPreferences("el-GR","1","/",":","1","\u03c0\u03bc","\u03bc\u03bc","1",",","1","\u20ac","1","1",".","1","Greece","Greek","Euro","EUR");
    regions["en"] = new RegionalPreferences("en","0","/",":","0","AM","PM","1",".","1","$","0","0",",","1","","English","","");
    regions["en-au"] = new RegionalPreferences("en-AU","1","/",":","0","AM","PM","1",".","1","$","0","0",",","1","Australia","English","Australian Dollar","AUD");
    regions["en-ca"] = new RegionalPreferences("en-CA","0","/",":","0","AM","PM","1",".","1","$","0","0",",","1","Canada","English","Canadian Dollar","CAD");
    regions["en-gb"] = new RegionalPreferences("en-GB","1","/",":","1","AM","PM","1",".","1","\u00a3","0","0",",","1","United Kingdom","English","Pound Sterling","GBP");
    regions["en-hk"] = new RegionalPreferences("en-HK","0","/",":","0","AM","PM","1",".","1","$","0","0",",","1","Hong Kong","English","Hong Kong Dollar","HKD");
    regions["en-ie"] = new RegionalPreferences("en-IE","1","/",":","1","AM","PM","1",".","1","\u20ac","0","0",",","1","Ireland","English","Euro","EUR");
    regions["en-in"] = new RegionalPreferences("en-IN","0","/",":","0","AM","PM","1",".","1","$","0","0",",","1","India","English","Indian Rupee","INR");
    regions["en-jm"] = new RegionalPreferences("en-JM","1","/",":","0","AM","PM","1",".","1","J$","0","0",",","1","Jamaica","English","Jamaican Dollar","JMD");
    regions["en-nz"] = new RegionalPreferences("en-NZ","1","/",":","0","a.m.","p.m.","1",".","1","$","0","0",",","1","New Zealand","English","New Zealand Dollar","NZD");
    regions["en-ph"] = new RegionalPreferences("en-PH","0","/",":","0","AM","PM","1",".","1","Php","0","0",",","1","Philippines","English","Philippine Peso","PHP");
    regions["en-sg"] = new RegionalPreferences("en-SG","0","/",":","0","AM","PM","1",".","1","$","0","0",",","1","Singapore","English","Singapore Dollar","SGD");
    regions["en-za"] = new RegionalPreferences("en-ZA","2","/",":","1","AM","PM","1",".","1","R","0","1",",","1","South Africa","English","Rand","ZAR");
    regions["es"] = new RegionalPreferences("es","1","/",":","1","AM","PM","1",",","1","\u20ac","1","1",".","1","","Spanish","Euro","EUR");
    regions["es-ar"] = new RegionalPreferences("es-AR","1","/",":","1","a.m.","p.m.","1",",","1","$","0","1",".","1","Argentina","Spanish","Argentine Peso","ARS");
    regions["es-bo"] = new RegionalPreferences("es-BO","1","/",":","1","a.m.","p.m.","1",",","1","$b","0","1",".","1","Bolivia","Spanish","Boliviano","BOB");
    regions["es-cl"] = new RegionalPreferences("es-CL","1","-",":","1","AM","PM","1",",","1","$","0","1",".","1","Chile","Spanish","Chilean Peso","CLP");
    regions["es-co"] = new RegionalPreferences("es-CO","1","/",":","0","a.m.","p.m.","1",",","1","$","0","1",".","1","Colombia","Spanish","Colombian Peso","COP");
    regions["es-cr"] = new RegionalPreferences("es-CR","1","/",":","0","a.m.","p.m.","1",",","1","\u20a1","0","0",".","1","Costa Rica","Spanish","Costa Rican Colon","CRC");
    regions["es-do"] = new RegionalPreferences("es-DO","1","/",":","0","a.m.","p.m.","1",".","1","RD$","0","0",",","1","Dominican Republic","Spanish","Dominican Peso","DOP");
    regions["es-ec"] = new RegionalPreferences("es-EC","1","/",":","1","AM","PM","1",",","1","$","0","1",".","1","Ecuador","Spanish","US Dollar","USD");
    regions["es-es"] = new RegionalPreferences("es-ES","1","/",":","1","AM","PM","1",",","1","\u20ac","1","1",".","1","Spain","Spanish","Euro","EUR");
    regions["es-gt"] = new RegionalPreferences("es-GT","1","/",":","0","a.m.","p.m.","1",".","1","Q","0","0",",","1","Guatemala","Spanish","Quetzal","GTQ");
    regions["es-hn"] = new RegionalPreferences("es-HN","1","/",":","0","a.m.","p.m.","1",".","1","L.","0","1",",","1","Honduras","Spanish","Lempira","HNL");
    regions["es-mx"] = new RegionalPreferences("es-MX","1","/",":","0","a.m.","p.m.","1",".","1","$","0","0",",","1","Mexico","Spanish","Mexican Peso","MXN");
    regions["es-ni"] = new RegionalPreferences("es-NI","1","/",":","0","a.m.","p.m.","1",".","1","C$","0","1",",","1","Nicaragua","Spanish","Cordoba Oro","NIO");
    regions["es-pa"] = new RegionalPreferences("es-PA","0","/",":","0","a.m.","p.m.","1",".","1","B/.","0","1",",","1","Panama","Spanish","US Dollar","USD");
    regions["es-pe"] = new RegionalPreferences("es-PE","1","/",":","0","a.m.","p.m.","1",".","1","S/.","0","1",",","1","Peru","Spanish","Nuevo Sol","PEN");
    regions["es-pr"] = new RegionalPreferences("es-PR","1","/",":","0","a.m.","p.m.","1",".","1","$","0","1",",","1","Puerto Rico","Spanish","US Dollar","USD");
    regions["es-py"] = new RegionalPreferences("es-PY","1","/",":","0","a.m.","p.m.","1",",","1","Gs","0","1",".","1","Paraguay","Spanish","Guarani","PYG");
    regions["es-sv"] = new RegionalPreferences("es-SV","1","/",":","0","a.m.","p.m.","1",".","1","\u20a1","0","0",",","1","El Salvador","Spanish","US Dollar","USD");
    regions["es-us"] = new RegionalPreferences("es-US","1","/",":","1","AM","PM","1",",","1","\u20ac","1","1",".","1","United States","Spanish","US Dollar","USD");
    regions["es-uy"] = new RegionalPreferences("es-UY","1","/",":","1","a.m.","p.m.","1",",","1","$U","0","1",".","1","Uruguay","Spanish","Peso Uruguayo","UYU");
    regions["es-ve"] = new RegionalPreferences("es-VE","1","/",":","1","a.m.","p.m.","1",",","1","Bs","0","1",".","1","Venezuela","Spanish","Bolívar fuerte venezolano","VEF");
    regions["et"] = new RegionalPreferences("et","1",".",":","1","EL","PL","1",",","1","kr","0","0"," ","1","estonia","Estonian","Kroon","EEK");
    regions["et-ee"] = new RegionalPreferences("et-EE","1",".",":","1","EL","PL","1",",","1","kr","0","0"," ","1","estonia","Estonian","Kroon","EEK");
    regions["fi"] = new RegionalPreferences("fi","1",".",".","1","AM","PM","1",",","1","\u20ac","1","1"," ","1","Finland","Finnish","Euro","EUR");
    regions["fi-fi"] = new RegionalPreferences("fi-FI","1",".",".","1","AM","PM","1",",","1","\u20ac","1","1"," ","1","Finland","Finnish","Euro","EUR");
    regions["fr"] = new RegionalPreferences("fr","1","/",":","1","AM","PM","1",",","1","\u20ac","1","1"," ","1","","French","Euro","EUR");
    regions["fr-be"] = new RegionalPreferences("fr-BE","1","/",":","1","AM","PM","1",",","1","\u20ac","1","1",".","1","Belgium","French","Euro","EUR");
    regions["fr-ca"] = new RegionalPreferences("fr-CA","2","-",":","1","AM","PM","1",",","1","$","1","1"," ","1","Canada","French","Canadian Dollar","CAD");
    regions["fr-ch"] = new RegionalPreferences("fr-CH","1",".",":","1","AM","PM","1",".","1","SFr.","0","1","'","1","Switzerland","French","Lilangeni","SZL");
    regions["fr-fr"] = new RegionalPreferences("fr-FR","1","/",":","1","AM","PM","1",",","1","\u20ac","1","1"," ","1","France","French","Euro","EUR");
    regions["fr-lu"] = new RegionalPreferences("fr-LU","1","/",":","1","AM","PM","1",",","1","\u20ac","1","1"," ","1","Luxembourg","French","Euro","EUR");
    regions["gu"] = new RegionalPreferences("gu","0","/",":","0","AM","PM","1",".","1","$","0","0",",","1","India","Gujarati","Indian Rupee","INR");
    regions["gu-in"] = new RegionalPreferences("gu-IN","0","/",":","0","AM","PM","1",".","1","$","0","0",",","1","India","Gujarati","Indian Rupee","INR");
    regions["he"] = new RegionalPreferences("he","1","/",":","1","AM","PM","1",".","1","\u20aa","0","1",",","1","Israel","Hebrew","New Israeli Sheqel","ILS");
    regions["he-il"] = new RegionalPreferences("he-IL","1","/",":","1","AM","PM","1",".","1","\u20aa","0","1",",","1","Israel","Hebrew","New Israeli Sheqel","ILS");
    regions["hi"] = new RegionalPreferences("hi","1","-",":","1","\u092a\u0942\u0930\u094d\u0935\u093e\u0939\u094d\u0928","\u0905\u092a\u0930\u093e\u0939\u094d\u0928","0",".","1","\u0930\u0941","0","1",",","1","India","Hindi","Indian Rupee","INR");
    regions["hi-in"] = new RegionalPreferences("hi-IN","1","-",":","1","\u092a\u0942\u0930\u094d\u0935\u093e\u0939\u094d\u0928","\u0905\u092a\u0930\u093e\u0939\u094d\u0928","0",".","1","\u0930\u0941","0","1",",","1","India","Hindi","Indian Rupee","INR");
    regions["hr"] = new RegionalPreferences("hr","1",".",":","1","AM","PM","1",",","1","kn","1","1",".","1","Croatia","Croatian","Croatian Kuna","HRK");
    regions["hr-hr"] = new RegionalPreferences("hr-HR","1",".",":","1","AM","PM","1",",","1","kn","1","1",".","1","Croatia","Croatian","Croatian Kuna","HRK");
    regions["hu"] = new RegionalPreferences("hu","2",".",":","0","de.","du.","1",",","1","Ft","1","1"," ","1","Hungary","Hungarian","Forint","HUF");
    regions["hu-hr"] = new RegionalPreferences("hu-HR","2",".",":","0","de.","du.","1",",","1","Ft","1","1"," ","1","Hungary","Hungarian","Forint","HUF");
    regions["id"] = new RegionalPreferences("id","1","/",":","1","AM","PM","1",",","1","Rp","0","0",".","1","Indonesia","Indonesian","Rupiah","IDR");
    regions["id-id"] = new RegionalPreferences("id-ID","1","/",":","1","AM","PM","1",",","1","Rp","0","0",".","1","Indonesia","Indonesian","Rupiah","IDR");
    regions["is"] = new RegionalPreferences("is","1",".",":","1","AM","PM","1",",","1","kr.","1","1",".","1","Iceland","Icelandic","Iceland Krona","ISK");
    regions["is-is"] = new RegionalPreferences("is-IS","1",".",":","1","AM","PM","1",",","1","kr.","1","1",".","1","Iceland","Icelandic","Iceland Krona","ISK");
    regions["it"] = new RegionalPreferences("it","1","/",".","1","AM","PM","1",",","1","\u20ac","0","1",".","1","Italy","Italian","Euro","EUR");
    regions["it-ch"] = new RegionalPreferences("it-CH","1",".",":","1","AM","PM","1",".","1","SFr.","0","1","'","1","Switzerland","Italian","Swiss Franc","CHF");
    regions["it-it"] = new RegionalPreferences("it-IT","1","/",".","1","AM","PM","1",",","1","\u20ac","0","1",".","1","Italy","Italian","Euro","EUR");
    regions["ja"] = new RegionalPreferences("ja","2","/",":","1","\u5348\u524d","\u5348\u5f8c","0",".","1","\u00a5","0","0",",","1","Japan","Japanese","Yen","JPY");
    regions["ja-jp"] = new RegionalPreferences("ja-JP","2","/",":","1","\u5348\u524d","\u5348\u5f8c","0",".","1","\u00a5","0","0",",","1","Japan","Japanese","Yen","JPY");
    regions["kk"] = new RegionalPreferences("kk","1",".",":","1","AM","PM","1",",","1","\u0422","0","0"," ","1","Kazakhstan","Kazakh","Tenge","KZT");
    regions["kk-kz"] = new RegionalPreferences("kk-KZ","1",".",":","1","AM","PM","1",",","1","\u0422","0","0"," ","1","Kazakhstan","Kazakh","Tenge","KZT");
    regions["ko"] = new RegionalPreferences("ko","2","-",":","0","\uc624\uc804","\uc624\ud6c4","0",".","1","\u20a9","0","0",",","1","Korea","Korean","Won","KRW");
    regions["ko-kr"] = new RegionalPreferences("ko-KR","2","-",":","0","\uc624\uc804","\uc624\ud6c4","0",".","1","\u20a9","0","0",",","1","Korea","Korean","Won","KRW");
    regions["lt"] = new RegionalPreferences("lt","2",".",":","1","AM","PM","1",",","1","Lt","1","1",".","1","Lithuania","Lithuanian","Lithuanian Litas","LTL");
    regions["lv"] = new RegionalPreferences("lv","2",".",":","1","AM","PM","1",",","1","Ls","1","1"," ","1","Latvia","Latvian","Latvian Lats","LVL");
    regions["mk"] = new RegionalPreferences("mk","1",".",":","1","AM","PM","1",",","1","$","1","1",".","1","Macedonia","Macedonian","Denar","MKD");
    regions["mt"] = new RegionalPreferences("mt","1","/",":","1","QN","WN","1",".","1","Lm","0","0",",","1","Malta","Maltese","Maltese Lira","MTL");
    regions["mt-mt"] = new RegionalPreferences("mt-MT","1","/",":","1","QN","WN","1",".","1","Lm","0","0",",","1","Malta","Maltese","Maltese Lira","MTL");
    regions["mr"] = new RegionalPreferences("mr","1","-",":","1","\u092e.\u092a\u0942.","\u092e.\u0928\u0902.","0",".","1","\u0930\u0941","0","1",",","1","India","Marathi","Indian Rupee","INR");
    regions["mr-in"] = new RegionalPreferences("mr-IN","1","-",":","1","\u092e.\u092a\u0942.","\u092e.\u0928\u0902.","0",".","1","\u0930\u0941","0","1",",","1","India","Marathi","Indian Rupee","INR");
    regions["ms"] = new RegionalPreferences("ms","1","/",":","1","AM","PM","1",",","1","R","0","0",".","1","Malaysia","Malay","Malaysian Ringgit","MYR");
    regions["ms-my"] = new RegionalPreferences("ms-MY","1","/",":","1","AM","PM","1",",","1","R","0","0",".","1","Malaysia","Malay","Malaysian Ringgit","MYR");
    regions["nb"] = new RegionalPreferences("nb","1",".",":","1","AM","PM","1",",","1","kr","0","1"," ","1","Norway","Norwegian","Norwegian Krone","NOK");
    regions["nb-no"] = new RegionalPreferences("nb-NO","1",".",":","1","AM","PM","1",",","1","kr","0","1"," ","1","Norway","Norwegian","Norwegian Krone","NOK");
    regions["nl"] = new RegionalPreferences("nl","1","-",":","1","AM","PM","1",",","1","\u20ac","0","1",".","1","Netherlands","Dutch","Euro","EUR");
    regions["nl-be"] = new RegionalPreferences("nl-BE","1","/",":","1","AM","PM","1",",","1","\u20ac","1","1",".","1","Belgium","Dutch","Euro","EUR");
    regions["nl-nl"] = new RegionalPreferences("nl-NL","1","-",":","1","AM","PM","1",",","1","\u20ac","0","1",".","1","Netherlands","Dutch","Euro","EUR");
    regions["nn"] = new RegionalPreferences("nn","1",".",":","1","AM","PM","1",",","1","kr","0","1"," ","1","Norway","Norwegian","Norwegian Krone","NOK");
    regions["nn-no"] = new RegionalPreferences("nn-NO","1",".",":","1","AM","PM","1",",","1","kr","0","1"," ","1","Norway","Norwegian","Norwegian Krone","NOK");
    regions["no"] = new RegionalPreferences("no","1",".",":","1","AM","PM","1",",","1","kr","0","1"," ","1","Norway","Norwegian","Norwegian Krone","NOK");
    regions["pl"] = new RegionalPreferences("pl","2","-",":","1","AM","PM","1",",","1","z\u0142","1","1"," ","1","Poland","Polish","Zloty","PLN");
    regions["pt"] = new RegionalPreferences("pt","1","-",":","1","AM","PM","1",",","1","\u20ac","1","1",".","1","Portugal","Portuguese","Euro","EUR");
    regions["pt-br"] = new RegionalPreferences("pt-BR","1","/",":","1","AM","PM","1",",","1","R$ ","0","0",".","1","Brazil","Portuguese","Brazilian Real","BRL");
    regions["pt-pt"] = new RegionalPreferences("pt-PT","1","-",":","1","AM","PM","1",",","1","\u20ac","1","1",".","1","Portugal","Portuguese","Euro","EUR");
    regions["ro"] = new RegionalPreferences("ro","1",".",":","1","AM","PM","1",",","1","lei","1","1",".","1","Romania","Romanian","Leu","ROL");
    regions["ro-md"] = new RegionalPreferences("ro-MD","1",".",":","1","AM","PM","1",",","1","lei","1","1",".","1","Moldova, Republic Of","Romanian","Moldovan Leu","MDL");
    regions["ro-ro"] = new RegionalPreferences("ro-RO","1",".",":","1","AM","PM","1",",","1","lei","1","1",".","1","Romania","Romanian","Leu","ROL");
    regions["ru"] = new RegionalPreferences("ru","1",".",":","1","AM","PM","1",",","1","rub","1","0"," ","1","Russia","Russian","Russian Ruble","");
    regions["ru-ru"] = new RegionalPreferences("ru-RU","1",".",":","1","AM","PM","1",",","1","rub","1","0"," ","1","Russia","Russian","Russian Ruble","RUB");
    regions["sk"] = new RegionalPreferences("sk","1",".",":","1","AM","PM","1",",","1","Sk","1","1"," ","1","Slovakia","Slovak","Slovak Koruna","SKK");
    regions["sk-sk"] = new RegionalPreferences("sk-SK","1",".",":","1","AM","PM","1",",","1","Sk","1","1"," ","1","Slovakia","Slovak","Slovak Koruna","SKK");
    regions["sl"] = new RegionalPreferences("sl","1",".",":","1","AM","PM","1",",","1","\u20ac","1","1",".","1","Slovenia","Slovenian","Euro","EUR");
    regions["sl-si"] = new RegionalPreferences("sl-SI","1",".",":","1","AM","PM","1",",","1","\u20ac","1","1",".","1","Slovenia","Slovenian","Euro","EUR");
    regions["sq"] = new RegionalPreferences("sq","2","-",":","1","PD","MD","1",",","1","Lek","1","0",".","1","Albania","Albanian","Lek","ALL");
    regions["sr"] = new RegionalPreferences("sr","1",".",":","1","AM","PM","1",",","1","\u0414\u0438\u043d.","1","1",".","1","Serbia","Serbian","Serbian Dinar","CSD");
    regions["sv"] = new RegionalPreferences("sv","2","-",":","1","AM","PM","1",",","1","kr","1","1"," ","1","Sweden","Swedish","Swedish Krona","SEK");
    regions["ta"] = new RegionalPreferences("ta","1","-",":","0","\u0b95\u0bbe\u0bb2\u0bc8","\u0bae\u0bbe\u0bb2\u0bc8","0",".","1","\u0bb0\u0bc2","0","1",",","1","India","Tamil","Indian Rupee","INR");
    regions["ta-in"] = new RegionalPreferences("ta-IN","1","-",":","0","\u0b95\u0bbe\u0bb2\u0bc8","\u0bae\u0bbe\u0bb2\u0bc8","0",".","1","\u0bb0\u0bc2","0","1",",","1","India","Tamil","Indian Rupee","INR");
    regions["te"] = new RegionalPreferences("te","0","/",":","0","AM","PM","1",".","1","$","0","0",",","1","India","Telugu","Indian Rupee","INR");
    regions["te-in"] = new RegionalPreferences("te-IN","0","/",":","0","AM","PM","1",".","1","$","0","0",",","1","India","Telugu","Indian Rupee","INR");
    regions["th"] = new RegionalPreferences("th","1","/",":","1","AM","PM","1",".","0","\u0e3f","0","0",",","1","Thailand","Thai","Baht","THB");
    regions["th-th"] = new RegionalPreferences("th-TH","1","/",":","1","AM","PM","1",".","0","\u0e3f","0","0",",","1","Thailand","Thai","Baht","THB");
    regions["tr"] = new RegionalPreferences("tr","1",".",":","1","AM","PM","1",",","1","TL","1","1",".","1","Turkey","Turkish","Yeni Türk Liras (YTL)","TRY");
    regions["tr-tr"] = new RegionalPreferences("tr-TR","1",".",":","1","AM","PM","1",",","1","TL","1","1",".","1","Turkey","Turkish","Yeni Türk Liras (YTL)","TRY");
    regions["uk"] = new RegionalPreferences("uk","1",".",":","1","AM","PM","1",",","1","\u0433\u0440\u043d.","1","1"," ","1","Ukraine","Ukrainian","Hryvnia","UAH");
    regions["uk-ua"] = new RegionalPreferences("uk-UA","1",".",":","1","AM","PM","1",",","1","\u0433\u0440\u043d.","1","1"," ","1","Ukraine","Ukrainian","Hryvnia","UAH");
    regions["vi"] = new RegionalPreferences("vi","1","/",":","0","SA","CH","1",",","0","\u20ab","1","1",".","1","Vietnam","Vietnamese","Dong","VND");
    regions["vi-vn"] = new RegionalPreferences("vi-VN","1","/",":","0","SA","CH","1",",","0","\u20ab","1","1",".","1","Vietnam","Vietnamese","Dong","VND");
    regions["zh-cn"] = new RegionalPreferences("zh-CN","2","-",":","1","\u4e0a\u5348","\u4e0b\u5348","0",".","0","\uffe5","0","0",",","1","China","Chinese","Yuan Renminbi","CNY");
    regions["zh-hk"] = new RegionalPreferences("zh-HK","1","/",":","1","AM","PM","1",".","1","HK$","0","0",",","1","Hong Kong","Chinese","Hong Kong Dollar","HKD");
    regions["zh-mo"] = new RegionalPreferences("zh-MO","1","/",":","1","AM","PM","1",".","1","P","0","0",",","1","Macau","Chinese","Pataca","MOP");
    regions["zh-sg"] = new RegionalPreferences("zh-SG","1","/",":","0","AM","PM","0",".","1","$","0","0",",","1","Singapore","Chinese","Singapore Dollar","SGD");
    regions["zh-tw"] = new RegionalPreferences("zh-TW","2","/",":","0","\u4e0a\u5348","\u4e0b\u5348","0",".","1","NT$","0","0",",","1","Taiwan","Chinese","New Taiwan Dollar","TWD");
    regions["x-kok"] = new RegionalPreferences("x-KOK","0","/",":","0","AM","PM","1",".","1","$","0","0",",","1","India","Konkani","Indian Rupee","INR");

    function getCurrent() {
        var r = new RegionalPreferences();
        r.copy(defaultRegion);
        return r;
    }
    function getRegion(lang) {
        var r;
        if(!lang) {
            return getCurrent();
        }

        var region = regions[lang.toLowerCase()];
        if(region)  {
            r = new RegionalPreferences();
            r.copy(region);
            return r;
        }

        return undefined;
    }
    function setRegion(lang) {
        lang = lang || (navigator.language || navigator['userLanguage']);
        var region = regions[lang.toLowerCase()], r;

        if(region) {
            defaultRegion = region;
            r = new RegionalPreferences();
            r.copy(region);
            return r;
        }

        return undefined;
    }
    function formatNumber(n, c, region) {
        c = isNaN(c = Math.abs(c)) ? 2 : c;
        var d = region.decimal_string,
            t = region.thousand_string,
            m = n < 0 ? "-" : "",
            i = parseInt(n = Math.abs(+n || 0).toFixed(c),10) + "",
            j = i.length;
            j = j > 3 ? j % 3 : 0;
        return m + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
    }
    /* allow for a variable number of arguments */
    function formatCurrency() {
        var n, c, region, bIncludeCurrencyCode = false;
        for(var i = 0, l = arguments.length; i < l; i++) {
            var arg = arguments[i];
            if(typeof arg === "number") {
                if(n === undefined) {
                    n = arg;
                } else {
                    c = arg;
                }
            } else if(typeof arg === "object") {
                region = arg;
            } else if(typeof arg === "boolean") {
                bIncludeCurrencyCode = arg;
            }
        }

        function getCurrencyString(region) {
            /* does currency string go behind the number? */
            if(region.currency_position) {
                return (region.currency_space ? " " : "") + region.currency_string;
            }

            /* currency string goes in front of the number. */
            return region.currency_string + (region.currency_space ? " " : "");
        }
        var tmp = region || defaultRegion,
            num = formatNumber(n, c, tmp);
        return (!tmp.currency_position ? getCurrencyString(tmp) : "") + num  + (tmp.currency_position ? getCurrencyString(tmp) : "") + (bIncludeCurrencyCode ? " " + tmp.currency_code : "");
    }

    function formatDate(date, region, formatType) {
        var format = dateFormats[region.number_leading_zero][region.date_component_order],
            year = date.getFullYear(),
            month = date.getMonth()+1,
            day = date.getDate(),
            aMonths = formatType === "l" ? ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"] : formatType === "L" ? ["","January","February","March","April","May","June","July","August","September","October","November","December"] : [];
        formatType = formatType || "s";

        function leadingZero(s){
            s=''+s;
            return s.length > 1 ? s : '0'+s;
        }

        format = format.replace(/yyyy/, year);
        format = format.replace(/yy/, String(year).substr(2));

        if(formatType === "l" || formatType === "L") {
            if(/MM/.test(format)) {
                format = format.replace(/MM/, aMonths[month]);
            } else {
                format = format.replace(/M/, aMonths[month]);
            }
        } else {
            format = format.replace(/MM/,  leadingZero(month));
            format = format.replace(/M/, month);
        }

        format = format.replace(/dd/, leadingZero(day));
        format = format.replace(/d/, day);
        if(formatType === "l" || formatType === "L") {
            if(region.date_component_order === 0) {
                format = format.replace(/\//, " ").replace(/\//, ", ");
            } else {
                format = format.replace(/\//g, " ");
            }
        } else {
            format = format.replace(/\//g, region.date_string);
        }

        return format;
    }

    function format() {
        var n, c, d, region = defaultRegion, formatType = "";

        for(var i = 0, l = arguments.length; i < l; i++) {
            var arg = arguments[i];
            if(typeof arg === "number") {
                if(n === undefined) {
                    n = arg;
                } else {
                    c = arg;
                }
            } else if(typeof arg === "object") {
                /* is this a date object? */
                if(typeof arg.getDate === "undefined") {
                    region = arg;
                } else {
                    d = arg;
                }
            } else if(typeof arg === "string") {
                if(arg.length === 1) {
                    formatType = arg;
                } else {
                    region = getRegion(arg);
                    if(!region) {
                        region = defaultRegion;
                    } else {
                        arguments[i] = region;
                    }
                }
            }
        }

        if(d) {
            return formatDate(d, region, formatType);
        }

        if(formatType === "c") {
            return formatCurrency.apply(formatCurrency, arguments);
        }
        return formatNumber(n, c, region);
    }
    function get(region) {
        if(arguments.length === 0 || typeof region === "string") {
            return getRegion(region);
        }

        return format.apply(format, arguments);
    }

    /* set the default region */
    setRegion();

    /* public functions */
    this.get = get;
    this.set = setRegion;
    this.format = format;
}();