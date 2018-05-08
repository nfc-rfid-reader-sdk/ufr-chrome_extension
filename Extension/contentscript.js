if (document.getElementsByTagName("html")[0].getAttribute("ufr") != null) {

    var actualCode = 'function ufRequest(e,n){var t=new CustomEvent("send-ufr",{detail:e,bubbles:!0,cancelable:!0});document.dispatchEvent(t);var u=0;document.addEventListener("get-ufr",function(e){0==u&&n(e),u++})}';
    var script = document.createElement('script');
    script.textContent = actualCode;
    (document.head || document.documentElement).appendChild(script);

    document.addEventListener("send-ufr", function (data) {
        var request = data.detail;
        //console.info(request);
       // chrome.runtime.sendMessage(request, null);
        chrome.runtime.sendMessage(request);
    });

    chrome.runtime.onMessage.addListener(function (response, sender, sendResponse) {

        var event = new CustomEvent("get-ufr", {
            detail: response,
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(event);
    });


}

chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
    if (request.method == "getHTML")
        if (document.getElementsByTagName("html")[0].getAttribute("ufr") != null) {
            sendResponse({data: "yes"})
        }
        else {
            sendResponse({data: "no"})

        }
    else
        sendResponse({});
});