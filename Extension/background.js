var port;
var tab;
var started=0;
var tabs = "";

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {


    if (changeInfo.status == 'complete') {
        chrome.tabs.getSelected(null, function (tab) {
            chrome.tabs.sendRequest(tab.id, {method: "getHTML"}, function (response) {


                if (response.data == "yes") {

                    tabs+=tab.id + "|";
                    if(started==0)
                    {
                        port = chrome.runtime.connectNative('com.dlogic.native');
                        started=1;
                    }


                    chrome.browserAction.setIcon({path:"icon128.png"});

                    chrome.tabs.onRemoved.addListener(function(tabid, removed) {

                    tabs = tabs.replace(tabid + "|", "");


                       if (tabs=="")
                        {
                           /* var close = {};
                            close.command = "#EXIT";
                            port.postMessage(close.command);*/
                           port.postMessage("#EXIT");
                            chrome.browserAction.setIcon({path:"icon128red.png"});
                            started=0;

                        }
                    })

                    window.onbeforeunload=function(){
                       /* var close = {};
                        close.command = "#EXIT";
                        port.postMessage(close.command);*/
                        port.postMessage("#EXIT");
                        chrome.browserAction.setIcon({path:"icon128red.png"});
                        started=0;
                    }


                    chrome.tabs.onActivated.addListener(function(activeInfo) {

                        if (tabs.indexOf(activeInfo.tabId) !== -1)
                        {
                            chrome.browserAction.setIcon({path:"icon128.png"});

                        }
                        else
                        {
                            chrome.browserAction.setIcon({path:"icon128red.png"});

                        }
                    });
                }
                else
                {
                    chrome.browserAction.setIcon({path:"icon128red.png"});
                }
            });
        });

    }

});



chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    msg = msg.replace(/"/g, "%%");
    msg = msg.replace(/\\x/g, "&&x");
    console.log(msg + " " + msg.length);
   /* var newMsg= msg.command;
    for (var key in msg) {
        if (msg.hasOwnProperty(key)) {
            if(key!="command")
            {
                newMsg+= " " + msg[key];
            }
        }
    }*/

  //  console.log(newMsg);
    if(msg.length % 8 ==0)
    {
      msg+= " ";
    }
	
	console.log(msg);
    port.postMessage(msg);




    port.onMessage.addListener(function (msg1) {

       // console.log(msg1 + " " + msg1.length);

        msg1 = msg1.trim();
        msg1 = msg1.replace(/%%/g, "\"");
        msg1 = msg1.replace(/&&x/g, "\\x");


             var result = {};
        if(msg1 == "Unknown command")
        {
            result["Status"]="Unknown command";
          //  result["outaput"]="Unknown command";

        } else
        {
            var spl = msg1.split("||")

            var i;
            for (i = 0; i < spl.length; i++) {
                var key = spl[i].split(" -> ")[0];
                var val = spl[i].split(" -> ")[1];
                result[key] = val;
            }




        }
      //  var result = msg1;

        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, result, function (response) {
            });
        });


    });

    port.onDisconnect.addListener(function () {
        console.info("Disconnected.");
    });
});

