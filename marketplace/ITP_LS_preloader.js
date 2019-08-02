// ITP 2.1 COOKIE SYNC SCRIPT
// SAVES COOOKIES IN TO LOCAL STORAGE AND REVIVES THEM WHEN THEY CANNOT BE FOUND
// CONTACT JAMES.LINGHAM@TEALIUM.COM / SUPPORT@TEALIUM.COM FOR HELP OR ISSUES

// SCOPE THIS EXTENSION TO "PRELOADER"

// UPDATE COOKIEARR VALUES TO CONFIGURE COOKIES

// NAME: COOKIE NAME
// LIFE: LIFE SPAN OF COOKIE IN DAYS
// PERSIST: DOES THE EXPIREY DATE PERSIST (DOES NOT UPDATE)
// SECURE: DOES THE COOKIE HAVE THE SECURE FLAG

window.isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/)
if (isSafari){
        window.utag_cfg_ovrd = window.utag_cfg_ovrd || {};
        var defaultConsent = utag_cfg_ovrd.consentPeriod || "90";
        var cookieArr = [{
            "name": "utag_main",
            "life": 365,
            "persist": false,
            "secure": false
        }, {
            "name": "CONSENTMGR",
            "life": defaultConsent,
            "persist": true,
            "secure": false
        }, {
            "name": "OPTOUTMULTI",
            "life": defaultConsent,
            "persist": true,
            "secure": false
        }, ];
        window.SyncCookie = function(cookieArr) {
                if (typeof (Storage) !== "undefined") {
                    var date = new Date();
                    date = date.setTime(date.getTime());
                    for (var j = 0; j < cookieArr.length; j++) {
                        var cookie = cookieArr[j];
                        cookie.value = getCookie(cookie.name);
                        var arr = [];
                        var save = true;
                        if (typeof (cookie.value) == "string") {
                            for (var i = 0; i < localStorage.length; i++) {
                                if (cookie.persist && cookie.value == localStorage[localStorage.key(i)]) {
                                    save = false;
                                    continue;
                                } else {
                                     if (localStorage.key(i).substring(0, cookie.name.length + 5) == 'teal_' + cookie.name) {
                                        arr.push(localStorage.key(i));
                                    }
                                }
                            }
                            var exp = new Date();
                            exp.setTime(exp.getTime() + (cookie.life * 24 * 60 * 60 * 1000));
                            if (cookie.value.indexOf("$_ss:1") == -1) {
                                for (var i = 0; i < arr.length; i++) {
                                    localStorage.removeItem(arr[i]);
                                }
                            } else if (arr.length > 0 && cookie.value != localStorage[arr[0]]) {
                                cookie = updateCookie(cookie, arr[0]);
                                for (var i = 0; i < arr.length; i++) {
                                    localStorage.removeItem(arr[i]);
                                }
                            }
                            if (save) {
                                localStorage.setItem("teal_" + cookie.name + "_" + Date.parse(exp), cookie.value);
                            }
                        }
                    }
                    var updateArr = [];
                    var deleteArr = []
                    for (var i = 0; i < localStorage.length; i++) {
                        var key = localStorage.key(i);
                        if (key.substring(0, 5) == 'teal_') {
                            var exp = key.substring(key.lastIndexOf("_") + 1, key.length);
                            if (exp > date) {
                                //if (key.substring(key.indexOf("_") + 1, key.lastIndexOf("_")) !== "utag_main") {
                                    updateArr.push(key);
                                //}
                            } else {
                                deleteArr.push(key);
                            }
                        }
                    }
                    for (var i = 0; i < updateArr.length; i++) {
                        var secure = "";
                        var key = updateArr[i];
                        var v = localStorage[key];
                        var a = key.substring(key.indexOf("_") + 1, key.lastIndexOf("_"));
                        var x = new Date(parseInt(key.substring(key.lastIndexOf("_") + 1, key.length)));
                        for (var j = 0; j < cookieArr.length; j++) {
                            if (cookieArr[j].name == a && cookieArr[j].secure) {
                                secure = ";secure";
                            }
                            if (cookieArr[j].name == a && a == "utag_main") {
                                if (getCookie("utag_main") == null) {
                                    cookie = updateCookie(cookieArr[j], key);
                                    v = cookie.value;
                                }
                            }
                        }
                        u = "" + location.hostname;
                        b = u.split(".");
                        c = (/\.co\.|\.com\.|\.org\.|\.edu\.|\.net\.|\.asn\./.test(u)) ? 3 : 2;
                        domain = b.splice(b.length - c, c).join(".");
                        document.cookie = a + "=" + v + ";path=/;domain=" + domain + ";expires=" + x + secure;
                    }
                    for (var i = 0; i < deleteArr.length; i++) {
                        localStorage.removeItem(deleteArr[i]);
                    }
                } else {}
            }
    function pad(a, b, c, d) {
                a = "" + ((a - 0).toString(16));
                d = '';
                if (b > a.length) {
                    for (c = 0; c < (b - a.length); c++) {
                        d += '0'
                    }
                }
                return "" + d + a
            }
    function updateCookie(cookie, lsName) {
                if (cookie.value==null & cookie.name == "utag_main"){
                    t = (new Date()).getTime();
                    a = this.pad(t, 12);
                    b = "" + Math.random();
                    a += this.pad(b.substring(2, b.length), 16);
                    try {
                        a += this.pad((navigator.plugins.length ? navigator.plugins.length : 0), 2);
                        a += this.pad(navigator.userAgent.length, 3);
                        a += this.pad(document.URL.length, 4);
                        a += this.pad(navigator.appVersion.length, 3);
                        a += this.pad(screen.width + screen.height + parseInt((screen.colorDepth) ? screen.colorDepth : screen.pixelDepth), 5)
                    } catch (e) {
                        a += "12345"
                    }
                    ;v_id = a;
                    cookie.value ="v_id:" + v_id + "$_sn:1$_se:1$_ss:1$_st:1554828234756$ses_id:1554826434756$_pn:1"
                    var firstSession = true;
                }
                var newcookie = localStorage[lsName];
                var v_id = "";
                var ses_id = "";
                var sn = "";
                var st = "";
                var pn = "";
                var temp = newcookie.split("$");
                for (var i = 0; i < temp.length; i++) {
                    xx = temp[i].split(":");
                    if (xx[0] == "v_id") {
                        v_id = xx[1]
                    } else if (xx[0] == "ses_id") {
                        ses_id = xx[1]
                    } else if (xx[0] == "_sn") {
                        sn = xx[1]
                    } else if (xx[0] == "_st") {
                        st = xx[1]
                    } else if (xx[0] == "_pn") {
                        pn = xx[1]
                    }
                }
                x = cookie.value.split("$");
                for (var i = 0; i < x.length; i++) {
                    xx = x[i].split(":");
                    if (xx[0] == "_sn") {
                        newcookie = newcookie.replace("_sn:" + sn, "_sn:" + (parseInt(sn) + 1));
                    } else if (xx[0] == "_ss") {
                        newcookie = newcookie.replace("_ss:0", "_ss:1");
                    } else if (xx[0] == "ses_id") {
                        //newcookie = newcookie.replace("ses_id:" + ses_id, "ses_id:" + xx[1]);
                    } else if (xx[0] == "_pn") {
                        newcookie = newcookie.replace("_pn:" + pn, "_pn:1");
                    } else if (xx[0] == "_st") {
                        newcookie = newcookie.replace("_st:" + st, "_st:" + xx[1]);
                    }
                }
                if (firstSession){
                        newcookie = newcookie.replace("$ses_id:" + ses_id, "");
                }
                cookie.value = newcookie;
                return cookie;
            }
    function getCookie(name) {
        return (name = (document.cookie + ';').match(new RegExp(name + '=.*;'))) && name[0].split(/=|;/)[1];
    }
    SyncCookie(cookieArr);
}
