// SCOPE TO DOM READY

if (!window.addEvent) {
  window.addEvent = function(element, evnt, funct) {
    try {
      if (element.attachEvent) {
        return element.attachEvent('on' + evnt, funct);
      }
      return element.addEventListener(evnt, funct, false);
    } catch (e) {
      try {
        console.log('addEvent failed: ' + e);
      } catch (e) {}
    }
  };
}
try {
  utag.ut.scrollTracker = {
    1: false,
    2: false,
    3: false,
    4: false
  };
  addEvent(window, 'scroll', function() {
    var html = document.documentElement;
    var body = document.body;
    var viewPort = {
        yScroll: window.pageYOffset || (html && html.scrollTop) || body.scrollTop,
        hScroll: document.compatMode === 'CSS1Compat' ? html.clientHeight || window.innerHeight || 0 : body.clientHeight || 0
      },
      windowHeight = Math.max(body.scrollHeight, html.scrollHeight, body.offsetHeight, html.offsetHeight, body.clientHeight, html.clientHeight),
      quartile = Number(((viewPort.hScroll + viewPort.yScroll) / windowHeight * 4)).toFixed(0);
    for (var key in utag.ut.scrollTracker) {
      if (key <= quartile && !utag.ut.scrollTracker[key]) {
        utag.link({
          "event_name": "user_scroll",
          "event_category": "Behavior",
          "event_action": "Scroll",
          "event_label": key * 25
        });
        utag.ut.scrollTracker[key] = true;
        console.log((key * 25) + "% viewed : " + utag.ut.scrollTracker[key] + " for: " + key + "/4 part viewed");
      }
    }
  });
} catch (e) {
  utag.DB('Error with performing the scroll tracker: ' + e);
}
