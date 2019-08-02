// ITP 2.1 COOKIE SYNC SCRIPT
// CONTACT JAMES.LINGHAM@TEALIUM.COM / SUPPORT@TEALIUM.COM FOR HELP OR ISSUES

//SCOPE TO BEFORE LOAD RULES "RUN ONCE"

if (isSafari){
        utag.loader.SC = function(a, b, c, d, e, f, g, h, i, j, k, x, v) {
        if (!a)
            return 0;
        if (a == "utag_main" && utag.cfg.nocookie)
            return 0;
        v = "";
        var date = new Date();
        var exp = new Date();
        exp.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));
        x = exp.toGMTString();
        if (c && c == "da") {
            x = "Thu, 31 Dec 2009 00:00:00 GMT";
        } else if (a.indexOf("utag_") != 0 && a.indexOf("ulog") != 0) {
            if (typeof b != "object") {
                v = b
            }
        } else {
            d = utag.loader.RC(a, 0);
            for (e in utag.loader.GV(b)) {
                f = "" + b[e];
                if (f.match(/^(.*);exp-(\d+)(\w)$/)) {
                    g = date.getTime() + parseInt(RegExp.$2) * ((RegExp.$3 == "h") ? 3600000 : 86400000);
                    if (RegExp.$3 == "u")
                        g = parseInt(RegExp.$2);
                    f = RegExp.$1 + ";exp-" + g;
                }
                if (c == "i") {
                    if (d[e] == null)
                        d[e] = f;
                } else if (c == "d")
                    delete d[e];
                else if (c == "a")
                    d[e] = (d[e] != null) ? (f - 0) + (d[e] - 0) : f;
                else if (c == "ap" || c == "au") {
                    if (d[e] == null)
                        d[e] = f;
                    else {
                        if (d[e].indexOf("|") > 0) {
                            d[e] = d[e].split("|")
                        }
                        g = (d[e]instanceof Array) ? d[e] : [d[e]];
                        g.push(f);
                        if (c == "au") {
                            h = {};
                            k = {};
                            for (i = 0; i < g.length; i++) {
                                if (g[i].match(/^(.*);exp-(.*)$/)) {
                                    j = RegExp.$1;
                                }
                                if (typeof k[j] == "undefined") {
                                    k[j] = 1;
                                    h[g[i]] = 1;
                                }
                            }
                            g = [];
                            for (i in utag.loader.GV(h)) {
                                g.push(i);
                            }
                        }
                        d[e] = g
                    }
                } else
                    d[e] = f;
            }
            h = new Array();
            for (g in utag.loader.GV(d)) {
                if (d[g]instanceof Array) {
                    for (c = 0; c < d[g].length; c++) {
                        d[g][c] = encodeURIComponent(d[g][c])
                    }
                    h.push(g + ":~" + d[g].join("|"))
                } else
                    h.push((g + ":").replace(/[\,\$\;\?]/g, "") + encodeURIComponent(d[g]))
            }
            if (h.length == 0) {
                h.push("");
                x = ""
            }
            v = (h.join("$"));
        }
                
        document.cookie = a + "=" + v + ";path=/;domain=" + utag.cfg.domain + ";expires=" + x;
        
        // Start of Local Storage
        if (typeof(Storage) !== "undefined") {
            //localStorage.setItem("key", "value");
        var arr = []; // Array to hold the keys
        for (var i = 0; i < localStorage.length; i++){ // check for existing "cookies" with different expirey dates
            if (localStorage.key(i).substring(0,a.length+5) == 'teal_'+ a) {
                arr.push(localStorage.key(i));
            }
        }
        for (var i = 0; i < arr.length; i++) {
            localStorage.removeItem(arr[i]);
        }
        localStorage.setItem("teal_" + a + "_" + Date.parse(exp), v);
          } else {
            // no web storage support
          }
    
        return 1
    }
    
    if (b['cp.utag_main__sn'] == "1" && b['cp.utag_main__pn'] == "1"){ // if its the first page view, we need to update cookies for the first time and save to LS
        SyncCookie(cookieArr);
    } else {
        SyncCookie([{"name": "utag_main", "life": 365, "persist": false, "secure": false}]); // Calling this will update LS with the new page utag_main cookie
    }
}
