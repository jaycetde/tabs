'use strict';

var events = require('event')
  , Emitter = require('emitter')
  , classes = require('classes')
;

module.exports = Tabs;

function Tabs(data) {

    if (!(this instanceof Tabs)) {
        return new Tabs(data);
    }
    
    Emitter.call(this);
    
    this.tabs = {};
    this.current = null;
    
    data && this.data(data);

}

Tabs.prototype = new Emitter();

Tabs.prototype.get = function (i) {
    return this.tabs[i];
};

Tabs.prototype.data = function (data) {
    for (var id in data) {
        if (data.hasOwnProperty(id)) {
            this.add(id, data[id]);
        }
    }
};

Tabs.prototype.default = function (tab) {
    this.default = typeof tab === 'string' ? this.tabs[tab] : tab;
    !this.current && this.show(this.default);
};

Tabs.prototype.add = function (id, tab) {
    
    tab.id = id;
    tab.tabElClasses = classes(tab.tabEl);
    tab.contentElClasses = classes(tab.contentEl);
    tab.initialized = false;

    tab.tabElClasses.add('tabs-tab');
    tab.contentElClasses.add('tabs-content').add('hidden');
    
    events.bind(tab.tabEl, 'click', this.show.bind(this, tab));

    this.tabs[id] = tab;
    
    this.emit('add', tab);

    return tab;

};

Tabs.prototype.show = function (tab) {

    var self = this
      , current = self.current
    ;
    
    tab = typeof tab === 'string' ? self.tabs[tab] : tab;
    
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

       current.tabElClasses.remove('tabs-active');

    } else {
        self.performShow(tab);
    }

    self.current = tab;

    tab.tabElClasses.add('tabs-active');
    
    if (!tab.initialized) {
        tab.init && tab.init.call(self, tab);
        tab.initialized = true;
    }

};

Tabs.prototype.hide = function (tab) {

    tab = (typeof tab === 'string' ? self.tabs[tab] : tab) || this.current;

    if (!tab) {
        return;
    }

    this.performHide(tab);

    this.current = null;
    
    this.default && this.show(this.default);

};

Tabs.prototype.performShow = function (tab, callback) {

    tab.contentElClasses.remove('hidden');

    this.emit('show', tab);

    callback && callback();

};

Tabs.prototype.performHide = function (tab, callback) {

    tab.contentElClasses.add('hidden');

    this.emit('hide', tab);

    callback && callback();

};
