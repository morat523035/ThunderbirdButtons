(function () {
  if (location == "chrome://messenger/content/messenger.xul" ||
      location == "chrome://messenger/content/messengercompose/messengercompose.xul" ||
      location == "chrome://messenger/content/messenger.xhtml" ||
      location == "chrome://messenger/content/messengercompose/messengercompose.xhtml") {
    try {
      var XUL_NS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
      var toolbarbutton = document.createElementNS(XUL_NS, "toolbarbutton");
      toolbarbutton.onclick = function (aEvent) {
        var win = aEvent.target.ownerDocument.defaultView;
        if (aEvent.button == 0) {
          function getCommand(aEvent) {
            win.removeEventListener("command", getCommand, true);
            aEvent.preventDefault();
            aEvent.stopPropagation();
            as.showAlertNotification(image, title, "event listener is removed");
            var label = aEvent.explicitOriginalTarget.getAttribute("label") ||
              aEvent.originalTarget.getAttribute("label");
            if (label) {
              title = title + " : " + label;
            }
            var description = aEvent.originalTarget.getAttribute("oncommand") ||
              aEvent.originalTarget.getAttribute("onclick");
            description = description.search(/\x29$/) > -1 ? description + ";" : description;
            description = description.replace(/\s\s+/g, " ");
            var flags = ps.BUTTON_POS_0 * ps.BUTTON_TITLE_IS_STRING +
              ps.BUTTON_POS_1 * ps.BUTTON_TITLE_IS_STRING +
              ps.BUTTON_POS_2 * ps.BUTTON_TITLE_IS_STRING;
            var button0 = "Copy";
            var button1 = "Cancel";
            var button2 = null;
            var message = null;
            var state = {value: true};
            if (description) {
              var choice = ps.confirmEx(win, title, description, flags, button0, button1, button2, message, state);
              if (choice == 0) {
                var ch = Components.classes["@mozilla.org/widget/clipboardhelper;1"].
                  getService(Components.interfaces.nsIClipboardHelper);
                ch.copyString(description);
              }
            }
          }
          var as = Components.classes["@mozilla.org/alerts-service;1"].
            getService(Components.interfaces.nsIAlertsService);
       // var ps = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]. // Thunderbird 102
          var ps = Components.classes["@mozilla.org/prompter;1"].                 // Thunderbird 115
            getService(Components.interfaces.nsIPromptService);
          var image = "chrome://branding/content/icon48.png";
          var title = "Get Command";
          win.setTimeout(function () {
            win.addEventListener("command", getCommand, true);
          }, 1000);
          as.showAlertNotification(image, title, "event listener is added");
        } else if (aEvent.button == 1) {
          function showCommands() {
            var tagNames = ["command", "broadcaster", "key", "menuitem"];
            var collection = new Object();
            for (var i = 0; i < tagNames.length; i++) {
              collection[tagNames[i]] = document.getElementsByTagName(tagNames[i]);
            }
            var out = new Array();
            var xai = Components.classes["@mozilla.org/xre/app-info;1"].
              getService(Components.interfaces.nsIXULAppInfo);
            out.push(xai.name + " " + xai.version);
            out.push(document.documentElement.getAttribute("windowtype"));
            var menuitems = document.getElementsByTagName("menuitem");
            for (var i in collection) {
              var count = 0;
              out.push("_____ ^ " + i + " " + Array(72 - i.length).join("_"));
              for (var j = 0; j < collection[i].length; j++) {
                var id = collection[i][j].getAttribute("id");
                var oncommand = collection[i][j].getAttribute("oncommand");
                var label = collection[i][j].getAttribute("label");
                var tooltiptext = collection[i][j].getAttribute("tooltiptext");
                var text = label || tooltiptext;
                if (id && oncommand) {
                  count++;
                  var tagNames = ["command", "key", "observes"];
                  for (var m = 0; m < tagNames.length; m++) {
                    if (!text) {
                      for (var n = 0; n < menuitems.length; n++) {
                        if (menuitems[n].getAttribute(tagNames[m]) == id) {
                          text = menuitems[n].getAttribute("label");
                          break;
                        }
                      }
                    }
                  }
                  id = text ? id + " \u25ba " + text : id;
                  oncommand = oncommand.search(/\x29$/) > -1 ? oncommand + ";" : oncommand;
                  oncommand = oncommand.replace(/\s\s+/g, " ");
                  out.push(id + "\n" + oncommand);
                }
              }
              out.push(i + " count " + count);
            }
            out.push("_____ ^ handler " + Array(65).join("_"));
         // var request =  new XMLHttpRequest();
         // request.open("GET", "chrome://global/content/platformHTMLBindings.xml", false); // Thunderbird 60
         // request.send(null);
            var els = [];
         // var els = request.responseXML.getElementsByTagName("handler");
            var cmd = new Array();
            var count = 0;
            for (var i = 0; i < els.length; i++) {
              var command = els[i].getAttribute("command");
              var controller = document.commandDispatcher.getControllerForCommand(command);
              var element = document.getElementById(command);
              var label = element && element.getAttribute("label");
              var tooltiptext = element && element.getAttribute("tooltiptext");
              var text = label || tooltiptext;
              if (command && (controller || element) && cmd.indexOf(command) == -1) {
                count++;
                var tagNames = ["command", "key", "observes"];
                for (var m = 0; m < tagNames.length; m++) {
                  if (!text) {
                    for (var n = 0; n < menuitems.length; n++) {
                      if (menuitems[n].getAttribute(tagNames[m]) == command) {
                        text = menuitems[n].getAttribute("label");
                        break;
                      }
                    }
                  }
                }
                cmd.push(command);
                var id = text ? command + " \u25ba " + text : command;
                var oncommand = "goDoCommand('" + command + "');";
                out.push(id + "\n" + oncommand);
              }
            }
            out.push("handler count " + count);
            for (var i = 0; i < out.length; i++) {
              var suc = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"].
                createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
              suc.charset = "UTF-8";
              out[i] = suc.ConvertFromUnicode(out[i]);
              out[i] = out[i].replace(/&/g, "&amp;");
              out[i] = out[i].replace(/>/g, "&gt;");
              out[i] = out[i].replace(/</g, "&lt;");
              out[i] = out[i].replace(/"/g, "&quot;");
              out[i] = out[i].replace(/'/g, "&apos;");
            }
            var data = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN">';
            data += "<html><head><title>" + out[1] + "</title>";
            data += '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">';
            data += "</head><body><pre>" + out.join("\n\n") + "</pre></body></html>";
            if (xai.name == "Firefox" || xai.name == "SeaMonkey") {
              gBrowser.selectedTab = gBrowser.addTab("data:text/html;charset=utf-8;base64," + btoa(data), {
                triggeringPrincipal: Services.scriptSecurityManager.getSystemPrincipal(),
              });
            }
            if (xai.name == "Thunderbird") {
              openContentTab("data:text/html;charset=utf-8;base64," + btoa(data));
            }
          }
          showCommands();
        }
      };
      var dataUrl = "data:image/png;base64," +
        "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAAB" +
        "l0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAJ+SURBVBgZBcExbFRlAADg" +
        "7//fu7teC3elQEoMgeDkYDQ6oMQQTYyGxMHZuDA6Ypw0cWI20cHJUdl0cJLIiomR6OACGh" +
        "UCpqGWtlzbu/b97/3v9/tCKQVc/e7RRXz+7OrSpUXbW7S9tu8ddv0M+3iCjF1s42v8WAP0" +
        "XffKi2eOXfro9dMAYJ766SL1092jfDa17DfZgycHfvh7/hau1QB9161PhgE8epoNQlAHqp" +
        "rRIDo3iqoYDSpeOjv2zHRl7atfNj6LALltJys1Xc9+CmYtTxtmR8yO2D7kv4MMPr7x0KUL" +
        "K54/NThdA+S2XTs+jOYN86MsxqBGVRErKkEV6BHynp//2fXbw9lGDZBTWp+OK7PDzqIpYi" +
        "yqSMxBFakUVYVS2dxrfHHrrz1crQG6lM6vTwZmR0UHhSoHsSBTKeoS9YU8yLrUXfj+w9d2" +
        "IkBOzfkz05F5KkKkCkFERACEQil0TSOnJkMNV67fHNdVHI4GUcpZVFAUZAEExEibs4P5os" +
        "MeROiadHoUiIEeCgFREAoRBOMB2weNrkmbNz+9UiBCTs1yrVdHqhgIkRL0EOj7QGG5jrZ2" +
        "D+XUbADEy9dunOpSun7xuXMe7xUPNrOd/WyeyKUIoRgOGS8xWWZ7b6FLaROgzim9iXd+vX" +
        "vf7mHtoCnaXDRtkLpel3t9KdamUx+8fcbj7YWc0hZAndv25XffeGH8yfuvAoBcaHOROhS+" +
        "vLlhecD+wUJu222AOrft/cdPZr65ddfqsbHVyZLVlZHpysjx5aHRMBrV0XuX141qtnb25b" +
        "b9F6Duu+7b23funb195955nMRJnMAJTJeGg8HS0sBkZWx1suz3Px79iZ8A/gd7ijssEaZF" +
        "9QAAAABJRU5ErkJggg==";
      var tooltip = [];
      tooltip.push("", "", "L: get command using event listener");
      tooltip.push("M: show commands in new tab");
      tooltip.push("R: open button context popup", "");
      var props = {
        id: "__unique_identifier_4_get_command_button",
        class: "toolbarbutton-1 chromeclass-toolbar-additional",
        label: "Get Command",
        tooltiptext: "Get Command" + tooltip.join("\n"),
        style: 'list-style-image: url("' + dataUrl + '"); -moz-image-region: auto;',
      };
      for (var p in props) toolbarbutton.setAttribute(p, props[p]);
      var a = document.getElementById("mail-toolbar-menubar2") ||
              document.getElementById("toolbar-menubar");
      var b = document.getElementById("compose-toolbar-menubar2");
      var toolbar = a || b;
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
