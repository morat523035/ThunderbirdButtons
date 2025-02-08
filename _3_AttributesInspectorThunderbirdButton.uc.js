(function () {
  if (location == "chrome://messenger/content/messenger.xul" ||
      location == "chrome://messenger/content/messenger.xhtml") {
    try {
      var XUL_NS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
      var toolbarbutton = document.createElementNS(XUL_NS, "toolbarbutton");
      toolbarbutton.onclick = function (aEvent) {
        var win = aEvent.target.ownerDocument.defaultView;
        if (aEvent.button == 0) {
          var file = Services.dirsvc.get("UChrm", Components.interfaces.nsIFile);
          file.append("attrsInspector.js");
          var fileURI = Services.io.newFileURI(file);
          var options = {target: window, charset: "UTF-8", ignoreCache: true};
          Services.scriptloader.loadSubScriptWithOptions(fileURI.spec, options);
        } else if (aEvent.button == 1) {
       // BrowserToolboxProcess.init();  // Thunderbird 68
          BrowserToolboxLauncher.init(); // Thunderbird 78
        }
      };
      var dataUrl = "data:image/png;base64," +
        "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACW0lEQVQ4jW2SP0tbURjGf+" +
        "fc6/US0iHcRLA4xTpI45/BwX6BKuIkFHF2KH4AdXTxE7RD184uJdLFJRmtdpCSOlQUihGR" +
        "IphokhPvzT1vh5irpn3h5XDgPM/7PM95lYiwvr7ura2tvddaaxFRAP85hYeK41iWlpY+Hh" +
        "8fxy7A0NBQKpPJfNBaE0UR1locx6GHUUqhlEJrjVIKay1BEHwCugS+7+tarUa1WiWVSqGU" +
        "otFokM1myeVyCVBEErLJyUkXuHcBPM8PqtULZmffJBPi2HJy8ot6vU4mk6G/hoeHXQANUK" +
        "2ez01NTSEiWGsBcBzN6Ogrrq6u/gErpchmsy6A22V7ORZ1LCoM0Uo/exhFnWf3XqXT6YFE" +
        "QaVSuRBraTXbNJsGY+4x7XsaTcPt7W3i+2mgvu87CcHdXf1rqVQmijrchyGtlqHZaPGzUi" +
        "EIgiTEpySe5zmJheXlZZPL5djdLZIfHWPAdTk9PeHo6DszMzNMTBQSgh6J67qPCkREFQoF" +
        "Vlbe8SLtoVTE4uI8GxsblEolisXiM4KHndCJgq4qhed5TE9PIyLJEm1tbbG9vY3v+ywsLN" +
        "AdqLqAngJA93vUWqO1ZmRkhM3NTcrlMuVyGWuF2Nrku3X3zx33aVD9nc/nWV1d5eDggP39" +
        "b4iNCcPwUYHW2unf9/4eH3/N27l5zs9/47oOh4eHjQc/wt7e3lS73RZjjBhjpNVqPetGoy" +
        "k3N3W5uamJMUbOzs5+BEHgi0g3RGNM7fLy8rOIWMCKiFVKWRGxItjYStzphNYfHAzr9fqf" +
        "nZ2dL9fX122Av72HMgq8RKT9AAAAAElFTkSuQmCC";
      var dataUrl = "data:image/png;base64," +
        "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAACXBIWXMAAA7EAAAOxAGVKw" +
        "4bAAAAdUlEQVQokZVSwRHAIAgLPYfoXs7RCTpG53Avt7APrhaFU8gLMEEJAkEQgFbc7Ixk" +
        "Vjt0r6Sp7VIVITumBpKt00FA2ThmjXzkfMMWO8EZFSj8LrUyjsG9b9DaJXq+qAIVxEUxtL" +
        "HpaXE95dj1NcK2rmbwaGJ4Af0tIg00j/6iAAAAAElFTkSuQmCC";
      var tooltip = [];
      tooltip.push("", "", "L: enable or disable popup locker");
      tooltip.push("M: open developer toolbox");
      tooltip.push("R: open button context popup");
      tooltip.push("Esc: disable popup locker", "");
      tooltip.push("C+U, C+D: navigate to parent/child node");
      tooltip.push("C+L, C+R: navigate to previous/next sibling node");
      tooltip.push("C+S+C: copy tooltip's contents", "");
      tooltip.push("M, C+L, C+I: inspect node in dom inspector");
      tooltip.push("C+S+W: inspect node's window object in dom inspector", "");
      tooltip.push("Hold shift key to show tooltips and popups.");
      var props = {
        id: "__unique_identifier_3_attributes_inspector_button",
        class: "toolbarbutton-1 chromeclass-toolbar-additional",
        label: "Attributes Inspector",
        tooltiptext: "Attributes Inspector" + tooltip.join("\n"),
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
