var Background = (function () {
    // variables ----------------------------------------------------------------
    var _this = {},
        _requestFilter = {
            urls: ["<all_urls>"]
        };

    // initialize ---------------------------------------------------------------
    _this.init = function () {
        // receive post messages from "inject.js" and any iframes
        chrome.extension.onRequest.addListener(onReceiveMessage);

        // manage when a user change tabs
        chrome.tabs.onActivated.addListener(onTabActivated);

        //Intercept network request
        chrome.webRequest.onBeforeRequest.addListener(onSendRequest, _requestFilter, ['blocking']);

    };

    //================================================================================//
    //============================= private functions  ===============================//
    //================================================================================//
    function _updateCurrentTab() {
        //Notice the current page refresh, reload luck star
        chrome.tabs.getSelected(null, function (tab) {
            // send a message to all the views (with "*" wildcard)
            _this.tell('current-page-refresh', {});
        });
    };

    //处理来自inject的消息
    function _processMessageFromInject(request) {
        // process the request
        switch (request.message) {
            case 'luck-iframe-loaded':
                message_luckIframeLoaded(request.data);
                break;
            case 'luck-star-clicked':
                message_luckIframeLoaded(request.data);
                break;
        }
    };

    //================================================================================//
    //============================= events processor  ================================//
    //================================================================================//
    function onSendRequest(details) {
        // console.log("------------->> " + details.url);
        return {
            cancel: false
        };
    }

    function onReceiveMessage(request, sender, sendResponse) {
        if (!request.message) return;

        // if it has a "view", it resends the message to all the frames in the current tab
        if (request.data.view) {
            _this.tell(request.message, request.data);
            return;
        }

        processMessageFromInject(request);
    };

    function onTabActivated() {
        _updateCurrentTab();
    };

    //================================================================================//
    //============================= messages processor================================//
    //================================================================================//
    function message_luckIframeLoaded(data) {
        console.log('----------- luck iframe loaded -----------');
    };

    function message_luckStarClicked(data) {
        console.log('----------- luck star clicked -----------');
    };

    //================================================================================//
    //============================= public functions==================================//
    //================================================================================//
    //send a message to "inject.js" and all the iframes
    _this.tell = function (message, data) {
        var data = data || {};

        // find the current tab and send a message to "inject.js" and all the iframes
        chrome.tabs.getSelected(null, function (tab) {
            if (!tab) return;

            chrome.tabs.sendMessage(tab.id, {
                message: message,
                data: data
            });
        });
    };

    return _this;
}());

window.addEventListener("load", function () {
    Background.init();
}, false);