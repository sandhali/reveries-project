/*
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/



function distance(lat1, lon1, lat2, lon2, unit) {
    var radlat1 = Math.PI * lat1 / 180;
    var radlat2 = Math.PI * lat2 / 180;
    var theta = lon1 - lon2;
    var radtheta = Math.PI * theta / 180;
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist = dist * 180 / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit === 'K') { dist = dist * 1.609344 }
    if (unit === 'N') { dist = dist * 0.8684 }
    return dist
}
(function(document) {
    'use strict';
    console.log('ready app')
        // Grab a reference to our auto-binding template
        // and give it some initial binding values
        // Learn more about auto-binding templates at http://goo.gl/Dx1u2g
    var app = document.querySelector('#app');

    // Sets app default base URL
    app.baseUrl = '/';
    if (window.location.port === '') { // if production
        // Uncomment app.baseURL below and
        // set app.baseURL to '/your-pathname/' if running from folder in production
        // app.baseUrl = '/polymer-starter-kit/';
    }

    app.displayInstalledToast = function() {
        // Check to make sure caching is actually enabled—it won't be in the dev environment.
        if (!Polymer.dom(document).querySelector('platinum-sw-cache').disabled) {
            Polymer.dom(document).querySelector('#caching-complete').show();
        }
    };


    // Listen for template bound event to know when bindings
    // have resolved and content has been stamped to the page
    app.addEventListener('dom-change', function() {
        console.log('ready-dom')
        app.fire('routingReady', null)
        app.$.selectTabsPOI.addEventListener('iron-select', function() {
            var selected = app.$.selectTabsPOI.selected;
            if (selected === 'POIREG') {
                this.set('showReg', true);
                this.set('showFromMap', false);
                this.set('customMap', false);

            }
            if (selected === 'POIMAP') {
                this.set('showFromMap', true);
                this.set('showReg', false);
                this.set('customMap', false);
            }
            if (selected === 'CUSTOMMAP') {
                this.set('showFromMap', false);
                this.set('showReg', false);
                this.set('customMap', true);
            }

        }.bind(this))

        app.$.poimap.addEventListener('poi-changed', function(event) {
            app.fire('poi-changed', auth.detail, { bubbles: false, node: app.$.poidisplay });
            app.fire('poi-changed', auth.detail, { bubbles: false, node: app.$.publicpoi });
            app.fire('poi-changed', auth.detail, { bubbles: false, node: app.$.gameactivity });
        });

        app.$.poireg.addEventListener('poi-changed', function(event) {
            app.fire('poi-changed', auth.detail, { bubbles: false, node: app.$.poidisplay });
            app.fire('poi-changed', auth.detail, { bubbles: false, node: app.$.publicpoi });
            app.fire('poi-changed', auth.detail, { bubbles: false, node: app.$.gameactivity });

        });

        app.$.fileupload.addEventListener('success', function(event) {
            app.fire('media-changed', auth.detail, { bubbles: false, node: app.$.mediaviewer });
            app.fire('media-changed', auth.detail, { bubbles: false, node: app.$.mediavieweractivity });
            app.fire('media-changed', auth.detail, { bubbles: false, node: app.$.gameactivity });
            app.$.mediaSuccess.open();
        })
        app.$.gameactivity.addEventListener('unitGameSaved', function() {
            app.$.listfreetext.requestElements();
        })
        app.$.mediaactivity.addEventListener('saveFreeTextActivity', function() {
            app.$.listgamesactivity.requestElements();
        })

        console.log('Our app is ready to rock!');
        app.$.auth.addEventListener('authentification-changed', function(auth) {
            app.auth = auth.detail;

            app.fire('authentification-changed', auth.detail, { bubbles: false, node: app.$.publicpoi });
            app.fire('authentification-changed', auth.detail, { bubbles: false, node: app.$.poidisplay });
            app.fire('authentification-changed', auth.detail, { bubbles: false, node: app.$.mediaactivity });
            app.fire('authentification-changed', auth.detail, { bubbles: false, node: app.$.mediaviewer });
            app.fire('authentification-changed', auth.detail, { bubbles: false, node: app.$.gameactivity });
            app.fire('authentification-changed', auth.detail, { bubbles: false, node: app.$.listgamesactivity });


        })

    });

    // Main area's paper-scroll-header-panel custom condensing transformation of
    // the appName in the middle-container and the bottom title in the bottom-container.
    // The appName is moved to top and shrunk on condensing. The bottom sub title
    // is shrunk to nothing on condensing.
    window.addEventListener('paper-header-transform', function(e) {
        var appName = Polymer.dom(document).querySelector('#mainToolbar .app-name');
        var middleContainer = app;
        var bottomContainer = app;
        var detail = e.detail;
        var heightDiff = detail.height - detail.condensedHeight;
        var yRatio = Math.min(1, detail.y / heightDiff);
        // appName max size when condensed. The smaller the number the smaller the condensed size.
        var maxMiddleScale = 0.50;
        var auxHeight = heightDiff - detail.y;
        var auxScale = heightDiff / (1 - maxMiddleScale);
        var scaleMiddle = Math.max(maxMiddleScale, auxHeight / auxScale + maxMiddleScale);
        var scaleBottom = 1 - yRatio;

        // Move/translate middleContainer
        Polymer.Base.transform('translate3d(0,' + yRatio * 100 + '%,0)', middleContainer);

        // Scale bottomContainer and bottom sub title to nothing and back
        Polymer.Base.transform('scale(' + scaleBottom + ') translateZ(0)', bottomContainer);

        // Scale middleContainer appName
        Polymer.Base.transform('scale(' + scaleMiddle + ') translateZ(0)', appName);
    });

    // Scroll page to top and expand header
    app.scrollPageToTop = function() {
        app.$.headerPanelMain.scrollToTop(true);
    };
    app.isHidden = function() {
        if (this.selectedAddPOI == "POIREG") {
            return true;
        }
        return false;
    };
    app.closeDrawer = function() {
        app.$.paperDrawerPanel.closeDrawer();
    };


})(document);
