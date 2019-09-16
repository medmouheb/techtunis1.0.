import axios from 'axios'
import Cookies from 'js-cookie'
import Utils from "./Utils";

const ApiCaller = axios.create();

ApiCaller.defaults.headers.common['Accept'] = 'application/json'

ApiCaller.interceptors.request.use((config) => {
    if (config.method === 'post') {
        let data = new URLSearchParams();
        Object.keys(config.data).forEach(function (key) {
            data.append(key, config.data[key]);
        });
        config.data = data;
    }
    config.baseURL = '/Api/Rest';
    if (config.overrideHeaders === true) {
        config.headers.common['content-type'] = 'application/json'
        return config
    } else {
        config.headers.common['WORDING-VERSION'] = 'Mobile'
        config.headers.common['Navigation-Token'] = Cookies.get('navigationToken')
        config.headers.post['content-type'] = 'application/x-www-form-urlencoded';

        var navigationMetaInfosConfigs = appData.navigationMetaInfosConfigs;
        Object.keys(navigationMetaInfosConfigs).forEach(function (key) {
            var navigationMetaInfoName = navigationMetaInfosConfigs[key].pattern;
            this.headers.common[navigationMetaInfoName] = Cookies.get(navigationMetaInfoName)

        }, config);
        return config
    }
});

ApiCaller.interceptors.response.use((config) => {

    if (config.headers.hasOwnProperty('navigation-token')) { //TODO To check why it necessery
        Cookies.set('navigationToken', config.headers['navigation-token'], {domain: appData.cookieDomain});
        Cookies.set('navigationTokenExTime', config.headers['navigation-token-ex-time'], {domain: appData.cookieDomain})
    }

    var navigationMetaInfosConfigs = appData.navigationMetaInfosConfigs;
    Object.keys(navigationMetaInfosConfigs).forEach(function (key) {

        var navigationMetaInfoName = navigationMetaInfosConfigs[key].pattern;

        var navigationMetaInfoValue = '';
        if (this.headers.hasOwnProperty(navigationMetaInfoName)) {

            var navigationTokenMetaInfoHeaderValue = this.headers[navigationMetaInfoName];

            if (typeof navigationTokenMetaInfoHeaderValue != 'undefined' && navigationTokenMetaInfoHeaderValue != 'undefined'
                && navigationTokenMetaInfoHeaderValue != null) {

                navigationMetaInfoValue = navigationTokenMetaInfoHeaderValue;
            }
        }
        var navigationMetaInfoConfigs = navigationMetaInfosConfigs[key];
        var lifeTime = parseFloat(navigationMetaInfoConfigs.duration) / (60 * 60 * 24);
        Cookies.set(navigationMetaInfoConfigs.pattern, navigationMetaInfoValue, {
            path: navigationMetaInfoConfigs.path,
            domain: navigationMetaInfoConfigs.domain,
            expires: lifeTime
        });
    }, config);
    let body = config.data;
    try {
        if (body !== null) {
            if (typeof body.debugData !== 'undefined') {
                let debugBarData = Utils.parseJson(body.debugData);
                delete body.debugData;
                let id = debugBarData.__meta.id;
                if (typeof phpdebugbar !== 'undefined')
                    phpdebugbar.addDataSet(debugBarData, id);
            } else if (Array.isArray(body) && typeof body['debugData'] !== 'undefined') {
                let debugBarData = body.pop();
                debugBarData = Utils.parseJson(debugBarData);
                let id = debugBarData.__meta.id;
                if (typeof phpdebugbar !== 'undefined')
                    phpdebugbar.addDataSet(debugBarData, id);
            }

        }
    }
    catch (err) {
        console.log(err);
    }

    return config

});


//TODO SES  Handle debugbar data async

export default ApiCaller;