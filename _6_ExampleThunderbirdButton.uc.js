// main window or 3pane window > chrome://messenger/content/messenger.xul or .xhtml
// message window > chrome://messenger/content/messageWindow.xul or .xhtml
// compose window > chrome://messenger/content/messengercompose/messengercompose.xul or .xhtml
// address book window > chrome://messenger/content/addressbook/addressbook.xul or .xhtml

// xul  #mail-bar3      toolbar element is not available in 3pane   window in Thunderbird 115
// html #unifiedToolbar div     element is     available in 3pane   window in Thunderbird 115
// xul  #mail-bar3      toolbar element is     available in message window in Thunderbird 115

(function () {
  if (location == "chrome://messenger/content/messenger.xul" ||
      location == "chrome://messenger/content/messageWindow.xul" ||
      location == "chrome://messenger/content/messengercompose/messengercompose.xul" ||
      location == "chrome://messenger/content/addressbook/addressbook.xul" ||
      location == "chrome://messenger/content/messenger.xhtml" ||
      location == "chrome://messenger/content/messageWindow.xhtml" ||
      location == "chrome://messenger/content/messengercompose/messengercompose.xhtml" ||
      location == "chrome://messenger/content/addressbook/addressbook.xhtml") {
    try {
      var XUL_NS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
      var toolbarbutton = document.createElementNS(XUL_NS, "toolbarbutton");

      toolbarbutton.addEventListener("command", function (aEvent) {
        var win = aEvent.target.ownerDocument.defaultView;
        Services.prompt.alert(win, "Example 1", document.location.href);
      }, false);

   // toolbarbutton.onclick = function (aEvent) {
   //   var win = aEvent.target.ownerDocument.defaultView;
   //   if (aEvent.button == 0) {
   //     Services.prompt.alert(win, "Example 2", document.location.href);
   //   }
   // };

      var dataUrl = "data:image/svg+xml;charset=utf-8," +
        "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16'>" +
        "<rect width='16' height='16' rx='4' ry='4' fill='yellow'/>" +
        "<circle cx='8' cy='8' r='6' fill='orange'/>" +
        "<circle cx='8' cy='8' r='2' fill='red'/></svg>";
      var dataUrl = "data:image/png;base64," +
        "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAACNFBMVEXDRgDweQDnbwC0Ng" +
        "DCRQC7PQDtpTu+QQD78q3PUwDCRAD//8vbYQDLTgDocAD0iQX1jQbGSgD7iAD4gwDVaw7v" +
        "dwDyegD+igDweQDlawDyhAXveADmZwDzmBbtcwDwkhHveADmhBTkgxbweADkfRH+igD7hA" +
        "DXZQX0gADyjA/tfgvveQDiawDQVADRXgfnbwD1jAb9iQD9z0PVZAbxpinykRHtdgD5mRbE" +
        "RQDDRgDOYArCRAD9iQD3ewDxegD3dwDFRgDAQAD+hgD4fQDucgDtgQftfwTISQDCRQDvdg" +
        "D5lxb1kRb2qh7wnynkagD766LDRQDDRwDDRQDspjbtpzbuqDbvqzv//8DUZAbCRQD//83p" +
        "jhvveQbvggW+QQDfcxLlmUb//8veYADMTwDHSADVVwC8PgDwixb78q3oZgDUWADRVADCRQ" +
        "D9iQDERwDBQQDYVQC+PgC0NgDbYQDWWgDUWADSVQDFSAC+QAC7PAC0NgD+wRL+/kD+/zb+" +
        "7i3+8Cv+/DX+wBL/+DD/rwz+qgz+rwz/tAz+sQzfbAT+3iP/+jD//Dz1jwP+nwf5iwf7pB" +
        "z2tRr4lwb/ogfsdQT+2R7/9ET+2iT8yyLmgBL5iQL2egLokhP7zzT60zv1zUr0gAL1ewP5" +
        "0yn9+UL++EXooyngaAH41EPzowzyySj+xxzlhhHvvyruwjXxvTnUag3+zxrwigP+swz86U" +
        "/ZXwD75lHqegD6xzb//kn+uhPTXAG3OAD/+UC2vFeJAAAAe3RSTlMAAAAAAAAAAAAAAAAA" +
        "AAAAAAAAAACfnwAIaelpAAA2+wD7UQAAa3oArKzRzMysnwgAvPQA/gAAw3prw0oALr16vS" +
        "4AACnF6bspAAAA/mIAADQAAAAAAI8AAEwA0vv7kd2yAuuvr+vKABL23U+8Sk/d9vUDIIAQ" +
        "AAAQgCAfvupHAAABB0lEQVR4Xi3IU3fDABgA0C+u26FdZ9u2bdu2vZSzbds2/tyac3IfLx" +
        "jpGyA6MimqY6gHTNgiiNwkwRM1E7EhTrYyTfMzzsh0ZEPiH+D6+u5mV1jEhpe5haVCYW1T" +
        "4suEvUOkk7PLpVJ5WFnl7hEUDN5LPvsHJ6cazdn13f3DYxu0B35+/Y2qVSr17NzGeUgohI" +
        "VHLK/PMDa39qKieRATGxd/9cS4uU1MwnmQktqY/qGlaVr7/ZOVDTmQm5df8PwyNj4xOTVd" +
        "jOM4kCRZOr+wWFa+srpWQVEU8PnV2zu7NbV19UfHDQRBAIfTdNHc0soVdnR2dfdgGAgEvW" +
        "99/QNc4eDQ8O8Ihv0D77NPgbVLZ6kAAAAASUVORK5CYII=";
      var props = {
        id: "__unique_identifier_6_example_button",
        class: "toolbarbutton-1 chromeclass-toolbar-additional",
        label: "Example",
        tooltiptext: "Example",
     // oncommand: 'Services.prompt.alert(window, "Example 3", document.location.href);',
        style: 'list-style-image: url("' + dataUrl + '"); -moz-image-region: auto;',
      };
      for (var p in props) toolbarbutton.setAttribute(p, props[p]);

   // var toolbar = document.getElementById("mail-bar3");             // mail toolbar 3pane window
   // var toolbar = document.getElementById("unifiedToolbar");        // unified toolbar 3pane window
   // var appMenuButton = document.getElementById("button-appmenu");  // app menu button 3pane window
   // toolbar.insertBefore(toolbarbutton, appMenuButton.nextSibling);

      var a = document.getElementById("mail-toolbar-menubar2") ||
              document.getElementById("toolbar-menubar");           // menu bar 3pane window
      var b = document.getElementById("mail-toolbar-menubar2") ||
              document.getElementById("toolbar-menubar");           // menu bar message window
      var c = document.getElementById("compose-toolbar-menubar2");  // menu bar compose window
      var d = document.getElementById("addrbook-toolbar-menubar2"); // menu bar address book window
      var toolbar = a || b || c || d;
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
