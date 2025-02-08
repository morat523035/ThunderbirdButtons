(function () {
  if (location == "chrome://messenger/content/messenger.xul" ||
      location == "chrome://messenger/content/messenger.xhtml") {
    try {
      var XUL_NS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
      var toolbarbutton = document.createElementNS(XUL_NS, "toolbarbutton");
      toolbarbutton.onclick = function (aEvent) {
        var win = aEvent.target.ownerDocument.defaultView;
        if (aEvent.button == 0) {
          if (aEvent.shiftKey) {
            Services.appinfo.invalidateCachesOnRestart();
            Services.prompt.alert(win, "Restart", "Invalidate caches on restart.");
          }
          var os = Components.classes["@mozilla.org/observer-service;1"].
            getService(Components.interfaces.nsIObserverService);
          var cancelQuit = Components.classes["@mozilla.org/supports-PRBool;1"].
            createInstance(Components.interfaces.nsISupportsPRBool);
          os.notifyObservers(cancelQuit, "quit-application-requested", "restart");
          if (cancelQuit.data) {
            Services.prompt.alert(win, "Restart", "Abort restart process.");
          } else {
            var appStartup = Components.classes["@mozilla.org/toolkit/app-startup;1"].
              getService(Components.interfaces.nsIAppStartup);
            appStartup.quit(appStartup.eAttemptQuit | appStartup.eRestart);
          }
        } else if (aEvent.button == 1) {
          if (aEvent.shiftKey) {
            Services.appinfo.invalidateCachesOnRestart();
            Services.prompt.alert(win, "Restart", "Invalidate caches on startup.");
          }
          var os = Components.classes["@mozilla.org/observer-service;1"].
            getService(Components.interfaces.nsIObserverService);
          var cancelQuit = Components.classes["@mozilla.org/supports-PRBool;1"].
            createInstance(Components.interfaces.nsISupportsPRBool);
          os.notifyObservers(cancelQuit, "quit-application-requested", null);
          if (cancelQuit.data) {
            Services.prompt.alert(win, "Restart", "Abort quit process.");
          } else {
            var prefBranch = Components.classes["@mozilla.org/preferences-service;1"].
              getService(Components.interfaces.nsIPrefBranch);
            var pref = "browser.sessionstore.resume_session_once";
            prefBranch.setBoolPref(pref, true);
            var appStartup = Components.classes["@mozilla.org/toolkit/app-startup;1"].
              getService(Components.interfaces.nsIAppStartup);
            appStartup.quit(appStartup.eAttemptQuit);
          }
        }
      };
      var dataUrl = "data:image/png;base64," +
        "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAANbY1E9YMgAAAB" +
        "h0RVh0U29mdHdhcmUAUGFpbnQuTkVUIHYzLjM2qefiJQAAA2hJREFUOE9tkm1MU1ccxg9F" +
        "YKIIxbdgw4e9GEQYoomArRVYwsIoEakUsRQ3KQpiF8SXMDdtajL8gho+TKeJyYxaFGyltg" +
        "ZK1bkurg4uQ0QMgjSbOrbwUoIglPbe9tm5NdGgO8mT3PM/9/md/8sJIv+3JOYwGk6miolY" +
        "HB4y5ZqeIcDfxD87SH4vmg5YJOZk4veOvm+XmOOE+XfOZp7qfya/+Ny7/dq/KNAPTafoHv" +
        "VH5LZdJWmNnxKxKSE8xzYQuvHCl3MBEnNSwv7OkVKrC0rrBDabXiLX7EbhbQ6VncCBLi9S" +
        "dT2TCdXM5PbGIURlndv7FiAxR0fm3W4qu+VC0c1RyJpGkWucQLZxGjKLF1tsfqjuAYcesj" +
        "ja60F568hcQFhWqyL95JNXiisvkHGyF+LaHmSfcXKlLS5UOGZRbGex7RcOOxwc1AyLCus7" +
        "gCWKuz/FVTH+5UrjhFDeMB68qamPrD2tjSk0n19/5IHr4B9uVHR6UeLwYGeHB5Vtw3MzEE" +
        "hNTuGWyz+LSs7r53924Rz5sCyF1hcVKtWvj69qZ3R9s9AOsPj2iRdHn7LQ2N4BhGU21IiK" +
        "6nct2/pDSfCaY2JqXkAVLJBa7CuK7b41BxgkH2Sw9hCDdVQrd//GhaTUVxBaez7dsHyQP+" +
        "R/4iVS2X1BEuN9CllEtVQQ93XaUlmtIkZ+XBkiPn2YxlbwcbJkm12hsY1AO+jDdwMcjjk5" +
        "fN/vQbzmXve8xJovApmk6mM/yDJoY3deqovKbzQESU2DfHl8hgHA3rYRqLt8+IrhoOnmUN" +
        "PtBm3cmEjZdoaIm8sFm0y/CuVXB5crm5+vqmJ80Xk3DNQcTRUUAFRSQHk3oO6ks3ZQkIM2" +
        "qd2NMusYZD862Y3HH/kyTz32FdIRp5/omwlNqddQc/gbAD9TXZ8Hh3tZlHb46bxZyK0z2G" +
        "yZhNwyjvzmYRS3DENtG8OiHFMLiZGtpmZB4BXyGRQ3DSGxumMqTfdw6pseD/bRMlR33Sho" +
        "nULBzXHsuDUONc1m9b52F1lZzfeFb+zrRaewNTy75U/yieZzEn9EGpFjuZ6q7XIW6l/MqA" +
        "z/oODiX96MusdDUTnGBvJxZSa1RL65PUDYYBCRxNoM+iWkmkc+Ko8mSSckJLletSD97B6S" +
        "VLebgvNIZGIsPV8410zIfzl/yL/mmVpFAAAAAElFTkSuQmCC";
      var tooltip = [];
      tooltip.push("", "", "L: restart application with previous windows and tabs");
      tooltip.push("M: quit application, open previous windows and tabs on startup");
      tooltip.push("R: open button context popup", "");
      tooltip.push("S+L: left click option and invalidate caches on restart");
      tooltip.push("S+M: middle click option and invalidate caches on startup");
      var props = {
        id: "__unique_identifier_1_restart_button",
        class: "toolbarbutton-1 chromeclass-toolbar-additional",
        label: "Restart",
        tooltiptext: "Restart" + tooltip.join("\n"),
        style: 'list-style-image: url("' + dataUrl + '"); -moz-image-region: auto;',
      };
      for (var p in props) toolbarbutton.setAttribute(p, props[p]);
      var toolbar = document.getElementById("mail-toolbar-menubar2") ||
                    document.getElementById("toolbar-menubar");
      var toolbaritem = document.getElementById("menubar-items") ||
                        document.getElementById("mail-menubar");
      toolbar.insertBefore(toolbarbutton, toolbaritem.nextSibling);
    } catch (aError) {
      // [check] Show Content Messages in Thunderbird 102
      // [select] Browser Console Mode Multiprocess in Thunderbird 115
      Components.utils.reportError(aError);
    }
  }
})();
