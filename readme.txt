Thunderbird Autoconfig
----------------------

http://kb.mozillazine.org/Installation_directory
http://kb.mozillazine.org/Profile_folder

* <install directory>\defaults\pref\autoconfig.js

The autoconfig.js file should be in the same folder as the channel-prefs.js file.

* <install directory>\mozilla.cfg

The mozilla.cfg file should be in the same folder as the thunderbird.exe executable.

* <profile directory>\chrome\_AttributesInspectorThunderbirdButton.uc.js
* <profile directory>\chrome\_ExampleThunderbirdButton.uc.js
* <profile directory>\chrome\_GetCommandThunderbirdButton.uc.js
* <profile directory>\chrome\_PreferenceTrackerThunderbirdButton.uc.js
* <profile directory>\chrome\_RestartThunderbirdButton.uc.js
* <profile directory>\chrome\_TestCodeThunderbirdButton.uc.js

note: "uc" in *.uc.js files stands for User Chrome

* <profile directory>\chrome\__StylesThunderbird.as.css

note: "as" in *.as.css files stands for Agent Sheet

* <profile directory>\chrome\attrsInspector.js

The attrsInspector.js subscript is loaded by Attributes Inspector script.

Thunderbird 32-bit:

* C:\Program Files\Mozilla Thunderbird\defaults\pref\autoconfig.js
* C:\Program Files\Mozilla Thunderbird\mozilla.cfg

Thunderbird 64-bit:

* C:\Program Files (x86)\Mozilla Thunderbird\defaults\pref\autoconfig.js
* C:\Program Files (x86)\Mozilla Thunderbird\mozilla.cfg

Thunderbird Portable 32-bit:

* C:\ThunderbirdPortable\App\Thunderbird\defaults\pref\autoconfig.js
* C:\ThunderbirdPortable\App\Thunderbird\mozilla.cfg

Thunderbird Portable 64-bit:

* C:\ThunderbirdPortable\App\Thunderbird64\defaults\pref\autoconfig.js
* C:\ThunderbirdPortable\App\Thunderbird64\mozilla.cfg

More info:

http://web.archive.org/web/20191006061004/https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Enterprise_deployment_before_60
http://web.archive.org/web/20191006034558/https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Observer_Notifications
http://web.archive.org/web/20190930102512/https://developer.mozilla.org/en-US/docs/Archive/Add-ons/Using_the_Stylesheet_Service
