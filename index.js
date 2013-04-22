'use strict';

var each = require('each')
	, events = require('event')
	, Emitter = require('emitter')
	, classes = require('classes')
	, inherit = require('inherit')
;

module.exports = Tabs;

function Tabs(tabs) {

	if (!(this instanceof Tabs)) {
		return new Tabs(tabs);
	}

	var self = this;

	if (tabs) {
		each(tabs, function (tab) {
			self.add(tab.id, tab.tab, tab.content);
		});
	}

	this.tabs = {};
	this.current = null;

}

inherit(Tabs, Emitter);

Tabs.prototype.get = function (id) {

	return this.tabs[id];

};

Tabs.prototype.add = function (id, tab, content) {

	if (!id || !tab || !content) {
		throw "a required argument is missing";
	}

	classes(tab).add('tabs-tab');
	classes(content).add('tabs-content').add('tabs-hidden');

	this.tabs[id] = {
		id: id,
		tab: tab,
		content: content
	};

	this.emit('add', this.tabs[id]);

};

Tabs.prototype.show = function (id) {

	var self = this
		, tab = this.get(id)
		, current = self.current
	;

	if (!tab) {
		throw "could not find the specified tab";
	}

	if (current) {

		self.performHide(current, function () {
			classes(current.content).add('tabs-hidden');
			classes(tab.content).remove('tabs-hidden');
			self.performShow(tab);
			self.emit('show', tab);
		});

		self.emit('hide', current);

		classes(current.tab).remove('tabs-active');

	} else {
		classes(tab.content).remove('tabs-hidden');
		self.performShow(tab);
	}

	self.current = tab;

	classes(tab.tab).add('tabs-active');

};

Tabs.prototype.hide = function (id) {

	var tab = id ? this.get(id) : this.current;

	if (!tab) {
		return;
	}

	this.performHide(tab, function () {
		classes(tab.content).add('tabs-hidden');
	});
	this.emit('hide', tab);

	this.current = null;

};

Tabs.prototype.performShow = function (tab, callback) {

	if (callback) {
		callback();
	}

};

Tabs.prototype.performHide = function (tab, callback) {

	if (callback) {
		callback();
	}

};
