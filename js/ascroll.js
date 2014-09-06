
(function(root, document) {
'use strict';

var $ = function(selector, context) {
		context = context || document;
		return [].slice.call( context.querySelectorAll(selector) );
	};

var accordion = {
	layers: [],
	init: function() {
		var acl  = $('[data-accordion_layer]'),
			lLen = acl.length,
			index;

		// setup accordion parallax
		while (lLen--) {
			index = +acl[lLen].getAttribute('data-accordion_layer');
			acl[lLen].className += ' accordion_layer al-'+ index;
			this.layers.push({
				index : index,
				el    : acl[lLen],
				dim   : this.getDim(acl[lLen])
			});
		}

		// bind scroll handler
		root.addEventListener('scroll', this.doScroll, false);
	},
	doScroll: function(event) {
		var self       = this.accordion,
			scrollTop  = Math.abs(this.pageYOffset || self.scrollTop),
			winHeight  = this.innerHeight,
			whActive   = winHeight * 0.65,
			layersLen  = self.layers.length,
			itemObj,
			itemTop,
			itemPos;
		if (this.innerWidth < 641) return;
		//console.log( scrollTop );

		if (!scrollTop || scrollTop < 0) {
			scrollTop = 0;
			event.preventDefault();
			event.stopPropagation();
			return false;
		}

		// accordion effect
		if (!self.time) {
			// scroll starts
			if ( scrollTop + winHeight >= document.body.offsetHeight ) return;
			//console.log( 'scroll starts' );
			self.scrollStartTop = scrollTop;
			while (layersLen--) {
				itemObj = self.layers[layersLen];
				itemPos = self.getStyle(itemObj.el, 'position');
				if (!(itemPos === 'relative' || itemPos === 'absolute')) {
					itemObj.el.style.position = 'relative';
				}
				itemObj.el.className = itemObj.el.className.replace(/ align/, '');
				//itemObj.top = itemObj.dim.t;
			}
		}
		// scrolling
		//console.log( 'scrolling' );
		layersLen = self.layers.length;
		while (layersLen--) {
			itemObj = self.layers[self.layers.length-layersLen-1];
			itemTop = (scrollTop - self.scrollStartTop) * 0.9;
			itemObj.el.style.top = itemTop +'px';
		}

		clearTimeout(self.time);
		self.time = setTimeout(function() {
			//console.log( 'scroll ends' );
			var ll = self.layers.length,
				el;
			while (ll--) {
				el = self.layers[ll].el;
				el.className += ' align';
				el.style.top = '0px';
			}
			self.time = false;
		}, 80);
	},
	getDim: function(el, a, v, trace) {
		a = a || 'nodeName';
		v = v || 'BODY';
		var p = {w:el.offsetWidth, h:el.offsetHeight, t:0, l:0, obj:el};
		while (el && el[a] != v && (el.getAttribute && el.getAttribute(a) != v)) {
			if (el == document.firstChild) return null;
			if (trace) console.log( el, el.offsetTop );
			p.t += el.offsetTop - el.scrollTop;
			p.l += el.offsetLeft - el.scrollLeft;
			if (el.scrollWidth > el.offsetWidth && el.style.overflow == 'hidden') {
				p.w = Math.min(p.w, p.w-(p.w + p.l - el.offsetWidth - el.scrollLeft));
			}
			el = el.offsetParent;
		}
		return p;
	},
	getStyle: function(el, name) {
		name = name.replace(/([A-Z]|^ms)/g, "-$1" ).toLowerCase();

		var value = document.defaultView.getComputedStyle(el, null).getPropertyValue(name);
		if (name === 'opacity') {
			if (getStyle(el, 'display') === 'none') {
				el.style.display = 'block';
				el.style.opacity = '0';
				value = '0';
			}
		}
		if (value === 'auto') {
			switch (name) {
				case 'top': value = el.offsetTop; break;
				case 'left': value = el.offsetLeft; break;
				case 'width': value = el.offsetWidth; break;
				case 'height': value = el.offsetHeight; break;
			}
		}
		return value;
	}
};

// publish accordion
root.accordion = accordion;

// init on window ready
window.onload = function() {
	this.accordion.init();
};

})(window, document);
