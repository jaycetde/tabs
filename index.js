'use strict';

var events = require('event')
  , Emitter = require('emitter')
  , classes = require('classes')
;

module.exports = Tabs;

function Tabs() {

    if (!(this instanceof Tabs)) {
        return new Tabs();
    }
    
    Emitter.call(this);

    this.tabs = [];
    this.current = null;

}

Tabs.prototype = new Emitter();

Tabs.prototype.get = function (i) {
    return this.tabs[i];
};

Tabs.prototype.add = function (tabEl, contentEl, init) {

    if (!tabEl || !contentEl) {
        throw "a required argument is missing";
    }
    
    var tab = {
        tab: tabEl
      , tabClasses: classes(tabEl)
      , content: contentEl
      , contentClasses: classes(contentEl)
      , init: init
      , initialized: false
    }

    tab.tabClasses.add('tabs-tab');
    tab.contentClasses.add('tabs-content').add('hidden');
    
    events.bind(tabEl, 'click', this.show.bind(this, tab));

    this.tabs.push(tab);
    
    this.emit('add', tab);

    return tab;

};

Tabs.prototype.show = function (tab) {

    var self = this
      , current = self.current
    ;
    
    tab = typeof tab === 'number' ? self.tabs[tab] : tab;
    
    if (!tab) {
        return;
    }

    if (current) {

        if (self.performTransition) {
            self.performTransition(current, tab);
        } else {
            self.performHide(current, function () {
                self.performShow(tab);
            });
        }

       current.tabClasses.remove('tabs-active');

    } else {
        self.performShow(tab);
    }

    self.current = tab;

    tab.tabClasses.add('tabs-active');
    
    if (!tab.initialized) {
        tab.init && tab.init.call(self, tab);
        tab.initialized = true;
    }

};

Tabs.prototype.hide = function (tab) {

    tab = typeof tab === 'number' ? self.tabs[tab] : tab;
    tab = tab || this.current;

    if (!tab) {
        return;
    }

    this.performHide(tab);

    this.current = null;

};

Tabs.prototype.performShow = function (tab, callback) {

    tab.contentClasses.remove('hidden');

    this.emit('show', tab);

    callback && callback();

};

Tabs.prototype.performHide = function (tab, callback) {

    tab.contentClasses.add('hidden');

    this.emit('hide', tab);

    callback && callback();

};
