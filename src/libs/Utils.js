import * as identificationPageAnimation from "../animations/identificationPage";
import Cookies from 'js-cookie'

const Utils = {
    getMetaInfosValueByCode(code, metaInfosList) {
        if (metaInfosList) {
            var key = metaInfosList.codes.indexOf(code);
            if (key != -1) {
                return metaInfosList.items[key].value;
            }
        }
        return '';
    },
    parseJson(data) {
        var response = null;
        try {
            response = JSON.parse(data);
        } catch (e) {
            response = data;
        }
        return response;
    },
    convertDateForIos(date) {
        var arr = date.split(/[- :]/);
        date = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);
        return date;
    },

    createCustomerMetaInfos(tab) {
        var codes = [];
        var items = [];
        var item = null;

        for (var key in tab) {
            codes.push(key);
            item = {'code': key, 'value': tab[key]}
            items.push(item);
        }
        return {'metaInfos': {'codes': codes, 'items': items}}
    },
    redirectTo: (url) => {
        window.location.href = url
    },
    browserHistory: {
        pushState(currentSort, appliedFiltersValues, pageIndex, keyWords) {
            var url = "";
            var separator = "?";

            // Keywords
            if (keyWords) {
                url += separator + "KeyWords=" + keyWords;
                separator = "&";
            }

            // Sort
            if (currentSort) {
                url += separator + "SortedBy=" + currentSort;
                separator = "&";
            }

            // Filters
            if (appliedFiltersValues) {
                url += separator + "Filters=" + appliedFiltersValues;
                separator = "&";
            }

            // PageIndex
            if (pageIndex) {
                url += separator + "PageIndex=" + pageIndex;
                separator = "&";
            }


            if (url) {
                history.pushState(null, null, url);
            } else {
                history.pushState(null, null, window.location.pathname);
            }
        },
        pushContextUrl(contextUrl) {
            if (contextUrl) {
                history.pushState(null, null, contextUrl);
            } else {
                history.pushState(null, null, window.location.pathname);
            }
        }
    },
    getWebUserShops() {
        const serializedData = Cookies.get('shopCircle')
        if (serializedData) {
            return JSON.parse(serializedData);
        } else {
            return false;
        }
    },

    getShopCirleFromCookie: function () {
        let shopListData = []
        if (Cookies('shopCircle')) {
            let shopCircleData = JSON.parse(Cookies('shopCircle'));
            if (shopCircleData["circleShops"]) {
                shopListData = shopCircleData["circleShops"];
            }
        }
        return shopListData;
    },

    getShopCirleDataFromCookie: function () {
        let shopCircle = []
        if (Cookies('shopCircle')) {
            let shopCircleData = JSON.parse(Cookies('shopCircle'));
            if (shopCircleData) {
                shopCircle = shopCircleData;
            }
        }
        return shopCircle;
    },

    getProductAvailabilityApiParams: function (allShops, productId) {
        let shopCircle = this.getShopCirleFromCookie();
        let shopCircleData = this.getShopCirleDataFromCookie();
        let view = "ProductSheet"

        if (allShops) {
            view = "StockLocator"
        }
        if (shopCircle.length > 0) {
            let shopIdList = [];
            let counter = 1;
            shopIdList.push(shopCircle[0].id);
            if (allShops) {
                view = "StockLocator"
                while (shopCircle[counter] && shopIdList.length < parseInt(appData.stockLocatorShopsCount)) {
                    if (shopCircle[counter].isMerchant === true) {
                        shopIdList.push(shopCircle[counter].id);
                    }
                    counter++;
                }
            } else {
                while (shopCircle[counter] && shopIdList.length < 4) {
                    if (shopCircle[counter].isMerchant === true) {
                        shopIdList.push(shopCircle[counter].id);
                    }
                    counter++;
                }
            }

            let shopIdListParam = (shopIdList.join()) ? "&ShopIds=" + shopIdList.join() : "";
            return "ProductIds=" + productId + ",1" + shopIdListParam + "&View=" + view + "&ZipCode=" + shopCircleData.zipCode + "&City=" + shopCircleData.city;
        } else {
            return "ProductIds=" + productId + ",1" + "&View=" + view;
        }

    },


    validateEmail: function (email) {
        var re = /^(?:[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
        return re.test(email);
    },

    getDistanceToShop: function (shopId) {
        let distanceToShop = '';
        let circleShops = [];


        const shopCircleData = jQuery.parseJSON(Cookies('shopCircle'));
        circleShops = shopCircleData["circleShops"];

        if (circleShops) {
            circleShops.forEach(function (shop) {
                if (shop.id == shopId.toString()) {
                    distanceToShop = shop.distance;
                }
            });
        }
        return distanceToShop;
    },
    getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    },
    formatPrice(price) {
        return new Intl.NumberFormat('fr-FR', {style: 'currency', currency: 'EUR'}).format(price)
    },
    getFormatedCurrentDate() {
        let today = new Date();
        let day = (today.getDate() >= 10) ? today.getDate() : "0" + today.getDate();
        let currentMonth = today.getMonth() + 1;
        let month = (currentMonth >= 10) ? currentMonth : "0" + currentMonth;
        let year = today.getFullYear();
        return year + "-" + month + "-" + day;
    },

    getFormatedTomorrowDate() {
        let today = new Date();
        let tomorrowDate = today.getDate() + 1
        tomorrowDate = (tomorrowDate >= 10) ? tomorrowDate : '0' + tomorrowDate
        let currentMonth = today.getMonth() + 1;
        let month = (currentMonth >= 10) ? currentMonth : "0" + currentMonth;
        let year = today.getFullYear();
        return year + "-" + month + "-" + tomorrowDate;
    },

    prepareDataForRequest(data, view) {
        const customerData = {};
        customerData['profile[email]'] = data.email;
        customerData['profile[password]'] = data.password;
        customerData['billingAddress[city]'] = data.city;
        customerData['billingAddress[zipCode]'] = data.zipCode;
        customerData['subscription[sms]'] = data.subscriptionSms;
        customerData['subscription[mail]'] = data.subscriptionEmail;
        customerData['view'] = view;
        customerData['billingAddress[isShipping]'] = 1;

        if (view !== "light") {
            customerData['billingAddress[firstname]'] = data.billingAddress_lastName ? data.billingAddress_lastName : null;
            customerData['billingAddress[lastname]'] = data.billingAddress_lastName;
            customerData['billingAddress[phone]'] = data.billingAddress_phone;
            customerData['billingAddress[civility]'] = data.billingAddress_civility;
            customerData['billingAddress[streetAddress]'] = data.billing_streetAddress;
            customerData['billingAddress[streetAddressComplement]'] = "";


            customerData['subscription[partnerOffer]'] = data.partnerOffer;
            customerData['subscription[postalOrPhone]'] = data.postalOrPhone;
            customerData['profile[firstname]'] = data.firstName;
            customerData['profile[lastname]'] = data.lastName;
            customerData['profile[civility]'] = data.civility;
            customerData['profile[phone]'] = data.phone ? data.phone : null;
            customerData['billingAddress[isBilling]'] = 1;
            customerData['billingAddress[isShipping]'] = data.billingAddress_isShipping;
            if (data.billingAddress_isShipping) {
                customerData['shippingAddress[firstname]'] = data.shippingAddress_firstName;
                customerData['shippingAddress[lastname]'] = data.shippingAddress_lastName;
                customerData['shippingAddress[streetAddress]'] = data.shipping_streetAddress;
                customerData['shippingAddress[streetAddressComplement]'] = '';
                customerData['shippingAddress[zipCode]'] = data.shippingAddress_zipCode;
                customerData['shippingAddress[city]'] = data.shippingAddress_civility;
                customerData['shippingAddress[phone]'] = data.shippingAddress_phone;
            }
        }

        if (identificationPageAnimation.hasSocialLoginData()) {
            //TODO ABC: to improve
            customerData['metaInfos[codes][0]'] = 'socialLoginId';
            customerData['metaInfos[codes][1]'] = 'socialLoginToken';
            customerData['metaInfos[items][0][code]'] = 'socialLoginId';
            customerData['metaInfos[items][0][value]'] = $.jStorage.get('user').sub;
            customerData['metaInfos[items][1][code]'] = 'socialLoginToken';
            customerData['metaInfos[items][1][value]'] = $.jStorage.get('idToken');

        }
        return customerData;

    },

    getDataFromDomElement(elementId, dataName) {
        return $("[id*='" + elementId + "']").data(dataName);
    },

    getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1);
        var sURLVariables = sPageURL.split('&');
        for (var i = 0; i < sURLVariables.length; i++) {
            var sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] == sParam) {
                return sParameterName[1];
            }
        }
    },
}

export default Utils;