(function () {
  if (location == "chrome://messenger/content/messenger.xul" ||
      location == "chrome://messenger/content/messengercompose/messengercompose.xul" ||
      location == "chrome://messenger/content/messenger.xhtml" ||
      location == "chrome://messenger/content/messengercompose/messengercompose.xhtml") {
    try {
      function showTab(aArray) {
        for (var i = 0; i < aArray.length; i++) {
          var converter = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"].
            createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
          converter.charset = "UTF-8";
          aArray[i] = converter.ConvertFromUnicode(aArray[i]);
          aArray[i] = aArray[i].replace(/&/g, "&amp;");
          aArray[i] = aArray[i].replace(/"/g, "&quot;");
          aArray[i] = aArray[i].replace(/'/g, "&apos;");
          aArray[i] = aArray[i].replace(/</g, "&lt;");
          aArray[i] = aArray[i].replace(/>/g, "&gt;");
        }
        var data = [];
        data.push('<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN">', "<html>", "<head>");
        data.push('<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">');
        data.push("<title>" + aArray[0] + "</title>", "</head>", "<body>");
        data.push("<pre>", aArray.join("\n\n"), "</pre>", "</body>", "</html>");
        var win = Services.wm.getMostRecentWindow("mail:3pane");
        if (win) {
          win.document.getElementById("tabmail").openTab("contentTab", {
            contentPage: "data:text/html;charset=utf-8;base64," + btoa(data.join("\n")), // Thunderbird 78
                    url: "data:text/html;charset=utf-8;base64," + btoa(data.join("\n")), // Thunderbird 91
            background: true});
          win.focus();
        }
      }
      function readFromClipboard(aContext) {
        var str = {};
        var strLength = {};
        var result = "";
        try {
          var clip = Components.classes["@mozilla.org/widget/clipboard;1"].
            getService(Components.interfaces.nsIClipboard);
          var kGlobalClipboard = clip.kGlobalClipboard;
          var trans = Components.classes["@mozilla.org/widget/transferable;1"].
            createInstance(Components.interfaces.nsITransferable);
          if ("init" in trans) {
            trans.init(aContext);
          }
       // trans.addDataFlavor("text/unicode");                   // Thunderbird 68
          trans.addDataFlavor("text/plain");
          clip.getData(trans, kGlobalClipboard);
       // trans.getTransferData("text/unicode", str, strLength); // Thunderbird 68
          trans.getTransferData("text/plain", str);
          if (str.value instanceof Components.interfaces.nsISupportsString) {
            result = str.value.data;
          }
        } catch (e) {}
        return result;
      }
      function test_readFromClipboard(aEvent) {
        var win = aEvent.target.ownerDocument.defaultView;
        var loadContext = win.docShell.QueryInterface(Components.interfaces.nsIInterfaceRequestor).
          getInterface(Components.interfaces.nsIWebNavigation).
          QueryInterface(Components.interfaces.nsILoadContext);
        var code = readFromClipboard(loadContext);
        try {
          try {
            if (!aEvent.shiftKey) eval(code);
            else Services.prompt.alert(win, "Test Code", eval(code));
          } catch (e) {
            if (e.name == "SyntaxError" && e.message == "return not in function") {
              if (!aEvent.shiftKey) new Function(code)();
              else Services.prompt.alert(win, "Test Code", new Function(code)());
            } else {
              Services.prompt.alert(win, "Test Code", e);
            }
          }
        } catch (e) {
          Services.prompt.alert(win, "Test Code", e);
        }
      }
      function openConfigManager() {
        var win = Services.wm.getMostRecentWindow("Preferences:ConfigManager");
        if (win) {
          win.focus();
        } else {
          var features = "chrome,extrachrome,menubar,resizable,scrollbars,status,toolbar";
          features += ",centerscreen,width=960,height=600";
       // window.open("chrome://global/content/config.xul",   "_blank", features); // Thunderbird 68
       // window.open("chrome://global/content/config.xhtml", "_blank", features); // Thunderbird 78
        }
        var win = Services.wm.getMostRecentWindow("mail:3pane"); // Thunderbird 91
        var tabmail = win.document.getElementById("tabmail");
        for (var tabInfo of tabmail.tabInfo) {
          var tab = tabmail.getTabForBrowser(tabInfo.browser);
          if (tab && tab.urlbar && tab.urlbar.value == "about:config") {
            tabmail.switchToTab(tabInfo);
            return;
          }
        }
        tabmail.openTab("contentTab", {
          url: "about:config",
        });
      }
      function show_readFromClipboard(aEvent) {
        var win = aEvent.target.ownerDocument.defaultView;
        var loadContext = win.docShell.QueryInterface(Components.interfaces.nsIInterfaceRequestor).
          getInterface(Components.interfaces.nsIWebNavigation).
          QueryInterface(Components.interfaces.nsILoadContext);
        var code = readFromClipboard(loadContext);
        try {
          var node = eval(code);
          if (node && node.attributes) {
            var out = [];
            out.push("Attributes");
            out.push(node);
            for (var i = 0; i < node.attributes.length; i++) {
              try {
                out.push(node.attributes[i].nodeName + " " + typeof node.attributes[i].nodeValue + "\n" + node.attributes[i].nodeValue);
              } catch (e) {}
            }
            showTab(out);
          }
          if (node) {
            var out = [];
            out.push("Properties");
            out.push(node);
            for (var i in node) {
              try {
                out.push(i + " " + typeof node[i] + "\n" + node[i]);
              } catch (e) {}
            }
            showTab(out);
          }
        } catch (e) {
          Services.prompt.alert(win, "Test Code", e);
        }
      }
      function viewChromeDocument() {
        var enumerator = Services.ww.getWindowEnumerator();
        var out = [];
        while (enumerator.hasMoreElements()) {
          var win = enumerator.getNext();
          if (win && win.document) {
            if (win.document.location != "chrome://extensions/content/dummy.xul" &&
                win.document.location != "chrome://extensions/content/dummy.xhtml") {
              out.push(win.document);
            }
          }
        }
     // var ps = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]. // Thunderbird 102
        var ps = Components.classes["@mozilla.org/prompter;1"].                 // Thunderbird 115
          getService(Components.interfaces.nsIPromptService);
        for (var i = 0; i < out.length; i++) {
          var title = "Test Code";
          var arr = [];
          arr.push("Title" + "\n" + out[i].title);
          arr.push("Location" + "\n" + out[i].location);
          if (out[i].documentElement.hasAttribute("id")) {
            arr.push("Id" + "\n" + out[i].documentElement.getAttribute("id"));
          }
          if (out[i].documentElement.hasAttribute("windowtype")) {
            arr.push("Window Type" + "\n" + out[i].documentElement.getAttribute("windowtype"));
          }
          var description = arr.join("\n\n");
          var flags = ps.BUTTON_POS_0 * ps.BUTTON_TITLE_IS_STRING +
            ps.BUTTON_POS_1 * ps.BUTTON_TITLE_IS_STRING +
            ps.BUTTON_POS_2 * ps.BUTTON_TITLE_IS_STRING;
          var button0 = "Yes";
          var button1 = "No";
          var button2 = null;
          var message = null;
          var state = {value: true};
          var choice = ps.confirmEx(null, title, description, flags, button0, button1, button2, message, state);
          if (choice == 0) {
            tabmail.openTab("contentTab", {
              url: "view-source:" + out[i].documentURIObject.spec,
            });
            break;
          }
        }
      }
      var XUL_NS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
      var ios = Components.classes["@mozilla.org/network/io-service;1"].
        getService(Components.interfaces.nsIIOService);
      var sss = Components.classes["@mozilla.org/content/style-sheet-service;1"].
        getService(Components.interfaces.nsIStyleSheetService);
      var css = "";
      css += '@namespace url("' + XUL_NS + '");';
      css += 'tooltip[label^="' + "Test Code" + '\\000a\\000a"] {';
      css += "-moz-appearance: none !important;";
      css += "border: 1px solid silver !important;";
      css += "max-width: none !important;";
      css += "background: black !important;";
      css += "color: silver !important;";
      css += "font-family: monospace !important;";
      css += "}";
      var uss = ios.newURI("data:text/css," + encodeURIComponent(css), null, null);
      if (!sss.sheetRegistered(uss, sss.AGENT_SHEET)) {
        sss.loadAndRegisterSheet(uss, sss.AGENT_SHEET);
      }
      var toolbarbutton = document.createElementNS(XUL_NS, "toolbarbutton");
      toolbarbutton.onmouseover = function (aEvent) {
        var win = aEvent.target.ownerDocument.defaultView;
        var loadContext = win.docShell.QueryInterface(Components.interfaces.nsIInterfaceRequestor).
          getInterface(Components.interfaces.nsIWebNavigation).
          QueryInterface(Components.interfaces.nsILoadContext);
        var code = readFromClipboard(loadContext);
        toolbarbutton.tooltipText = code ? "Test Code" + "\n\n" + code : "Test Code";
      };
      toolbarbutton.onclick = function () {
        toolbarbutton.tooltipText = "Test Code";
      };
      var clipboardFavicon = "data:image/png;base64," +
        "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG" +
        "9iZSBJbWFnZVJlYWR5ccllPAAAAadJREFUeNpinGLPAAaMjAxwcJ9Tk+0Bt7YPkCkKFXqt" +
        "8PXqFsXv13/B1Pz/D6FZENoYZgKxMYgh9OI6i567q5hFUp4kiH9i3qTnT3auqWPgZ/gDVX" +
        "sWiNPBFk+2hxtwxi0syfjy5csM0vFzGTg42Bj4+XnAEh8/fmH48eMXw9OFyQy6uroMu1bN" +
        "AxlgAnbB338IJ6hlzWU4uXgJw6FDO4Ga+Rl4eXkZWFlZGb58/crw6eNHBjG7Iga1yAiG7S" +
        "vmwfWw/P2LMADkraiYaIb79+4xYAOKSkpgNch6UFzwFxgy//79Y5BTUMBqwF+g3H8mJgZk" +
        "PSgu+Ac04M+/fwz4AAswulBc8Ocfqg1/kGWxAEagAch6WP78RfUCIQOYmJkZ/qC44A+qAb" +
        "8JeIEZZMkfXC4gwgsQNUgG/CbRC2BXIhvw8AsDgzQnkgEEvACxBMJ++h0YJmufMTA8ABry" +
        "8xckGkFOxIdBakBqQXpAekGZiXPTSwbeUAEgB5hsObm58acDoJp3nxkYNn1gEANyP4MNAG" +
        "Kxh18ZbsXxsjMQA97/Z7gF0gPEfwACDAB/y9xB1I3/FQAAAABJRU5ErkJggg==";
      var menupopup = document.createElementNS(XUL_NS, "menupopup");
      var menuitem = document.createXULElement("menuitem");
      menuitem.setAttribute("class", "menuitem-iconic");
      menuitem.setAttribute("image", clipboardFavicon);
      menuitem.setAttribute("label", "Test Code");
      menuitem.setAttribute("tooltiptext", "L: execute js\nS+L: execute js and display result");
      menuitem.addEventListener("click", function (aEvent) {
        test_readFromClipboard(aEvent);
      }, false);
      menupopup.appendChild(menuitem);
      if (location == "chrome://messenger/content/messenger.xul" ||
          location == "chrome://messenger/content/messenger.xhtml") {
        var menuseparator = document.createXULElement("menuseparator");
        menupopup.appendChild(menuseparator);
        var menuitem = document.createXULElement("menuitem");
        menuitem.setAttribute("class", "menuitem-iconic");
        menuitem.setAttribute("label", "Set Window Properties");
        menuitem.setAttribute("oncommand", "window.moveTo(-7, 0); window.resizeTo(1597, 1167);");
        menupopup.appendChild(menuitem);
        var menuitem = document.createXULElement("menuitem");
        menuitem.setAttribute("class", "menuitem-iconic");
        menuitem.setAttribute("label", "Show Window Properties");
        menuitem.setAttribute("oncommand", "alert(`outerWidth: ${window.outerWidth}, outerHeight: ${window.outerHeight}, screenX: ${window.screenX}, screenY: ${window.screenY}`);");
        menupopup.appendChild(menuitem);
        var menuseparator = document.createXULElement("menuseparator");
        menupopup.appendChild(menuseparator);
        var menuitem = document.createXULElement("menuitem");
        menuitem.setAttribute("class", "menuitem-iconic");
        menuitem.setAttribute("label", "Error Console");
        menuitem.setAttribute("oncommand", "toJavaScriptConsole();");
        menupopup.appendChild(menuitem);
        var menuitem = document.createXULElement("menuitem");
        menuitem.setAttribute("class", "menuitem-iconic");
        menuitem.setAttribute("label", "Config Manager");
        menuitem.addEventListener("command", function () {
          openConfigManager();
        }, false);
        menupopup.appendChild(menuitem);
        var menuitem = document.createXULElement("menuitem");
        menuitem.setAttribute("class", "menuitem-iconic");
        menuitem.setAttribute("label", "About About");
        menuitem.addEventListener("command", function () {
          tabmail.openTab("contentTab", {
            url: "about:about",
          });
        }, false);
        menupopup.appendChild(menuitem);
      }
      var menuseparator = document.createXULElement("menuseparator");
      menupopup.appendChild(menuseparator);
      var menuitem = document.createXULElement("menuitem");
      menuitem.setAttribute("class", "menuitem-iconic");
      menuitem.setAttribute("image", clipboardFavicon);
      menuitem.setAttribute("label", "Show Attributes and Properties");
      menuitem.addEventListener("command", function (aEvent) {
        show_readFromClipboard(aEvent);
      }, false);
      menupopup.appendChild(menuitem);
      var menuitem = document.createXULElement("menuitem");
      menuitem.setAttribute("class", "menuitem-iconic");
      menuitem.setAttribute("label", "View Chrome Document");
      menuitem.addEventListener("command", function () {
        viewChromeDocument();
      }, false);
      menupopup.appendChild(menuitem);
      toolbarbutton.appendChild(menupopup);
      var dataUrl = "data:image/png;base64," +
        "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAhpJRE" +
        "FUOMvN0UtI1FEUx/HvnfufV874n0lHfJQjlWTS6EKIxCFqE0S0yxaBLoooCIxoUbaIQCxy" +
        "kT1oE0Utgh6Q0M4kCiE3qYuIFmG+KPMx5gzTjP7Hmfu/LSIz0B606awu9xw+91x+8I8lVm" +
        "sMXmfzghF+hMMXZO7tkWgrT/9KfnPb35uc6tbz0090363qT6NX8a0051jpcuQujYHqQztQ" +
        "M+SscTZs31cykqL1j4DhHjwJwh0F4RrG+zsZHrhBQTCBWR45+eoCFb8FrBFOldYdrshOP6" +
        "D2wBi7jhrEPj5jY7TKm9SOS78EPjyk1C6sO+MJrMUpv5DvC1BU4CftVLi8s4S2rG980U50" +
        "VeBznIvFkf2+XGYSb5FJTZXENN1URhRKzVC50yFiyMt6WXry++HdTbYZ6/Zcyy8OC61iCK" +
        "lJZd4TDBWyu8Eia8cx3HG8edmy7pAe7XrJ6+UbiFQu70rJ1r0OlY2DSLOYs2hqLub4MReZ" +
        "xQTSGUfINJX1NqZJe9dZ8paA520cDESa67VKg7AQIoMhU/Q/HmKodwCnN4l0LeJ0f3utoY" +
        "myqQlOLwHaX36uaFMUpdJAFhxZvMzRcS/I+Tt1yDUC6f7x4WAZhGs5AWAAGJ6QaRgC2+UC" +
        "IUEIMp58enomUa4JwEIaP8e3kGR+CZgcGmzpu9/WKQ3h1/Y8WufQ2gIy2HpWaTRag7axlU" +
        "anZoklpmjhv6ivwhPCjfsi85IAAAAASUVORK5CYII=";
      var props = {
        id: "__unique_identifier_2_test_code_button",
        class: "toolbarbutton-1 chromeclass-toolbar-additional",
        type: "menu",
        label: "Test Code",
        tooltiptext: "Test Code",
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
