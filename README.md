UnedditExtension
================

Chrome Extension for Uneddit Reddit

This extension is now essentially useless. Reddit has removed the identifiers from deleted comments, so you cannot undelete any more comments, and UnedditReddit.com has gone to a for-pay service, changing its API. I'm leaving this code up for the sake of posterity, but use this only at your own risk. It uses whatever protocol you're browsing reddit in, so if you did in fact pay for UnedditReddit, then you probably shouldn't use this extension.

This extension is pretty simple, as it just grabs the undeleted comments from UnedditReddit.com and then replaces them inline with Reddit.

The project consists of:

1. `manifest.json` - Basic manifest file for Chrome
2. `uneddit.js` - The content script that does all of the work of the extension
3. `jquery-1.8.3.min.js` - jQuery 1.8.3
4. `snuownd.js` - SnuOwnd, the Reddit markdown javascript
5. `icon*.png` - Icons
