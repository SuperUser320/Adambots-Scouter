
function text(t) {
	return {name:"#text",contents:t,attr:[]};
}
function tag(name,arg) {
	if (typeof arg == "string") {
		arg = text(arg);
	}
	var r = {name:name,attr:[]};
	r.set = function(n,v) { r.attr[n] = v; return r; };
	r.add = function(e) {
		r.contents.push(e);
	}
	if (arg && arg.length) {
		var a = [];
		for (var i = 0; i < arg.length; i++) {
			a.push(arg[i]);
		}
		for (var i = 0; i < a.length; i++) {
			if (typeof a[i] == "string") {
				a[i] = text(a[i]);
			}
		}
		r.contents = a;
		return r;
	}
	if (arg) {
		r.contents = [arg];
		return r;
	}
	r.contents = [];
	return r;
}

function applyAttribute(name,val,el) {
	if ("className onkeydown onkeyup onclick".split(" ").indexOf(name) >= 0) {
		el[name] = val;
	} else {
		el.setAttribute(name,val);
	}
}

function render(t) {
	if (t.name == "#text") {
		var q = document.createTextNode(t.contents);
		t.el = q;
		return q;
	}
	var q = document.createElement(t.name);
	t.el = q;
	for (var i = 0; i < t.contents.length; i++) {
		var ren = render(t.contents[i]);
		q.appendChild(ren);
	}
	for (i in t.attr) {
		applyAttribute(i,t.attr[i],q);
	}
	t.set = function(n,v) {applyAttribute(n,v,q); return t;};
	return q;
}

function display(t) {
	container.appendChild(render(t));
}

function storage(name) {
	var e = {name:name||"",val:""};
	e.listeners = [];
	e.listen = function(f) {
		e.listeners.push(f);
	}
	e.unlisten = function(f) {
		for (var i = 0; i < e.listeners.length; i++) {
			if (e.listeners[i] == f) {
				e.listeners.splice(i,1);
				i--;
			}
		}
	}
	e.set = function(v) {
		e.val = v;
		for (var i = 0; i < e.listeners.length; i++) {
			e.listeners[i](v);
		}
	}
	e.get = function() {
		return e.val;
	}
	return e;
}


function input(st) {
	var e = tag("input");
	e.val = "";
	e.assigned = st;
	st.listen(function(v) {
		if (v != e.el.value) {
			e.el.value = v;
		}
	});
	e.attr.onkeyup = function() {
			st.set(e.el.value);
	}
	return e;
}
function check(st,def) {
	st.set(!(def||false));
	var e = tag("div");
	function click() {
		if (st.get()) {
			st.set(false);
			e.check.set("className","checkFalse");
		} else {
			st.set(true);
			e.check.set("className","checkTrue");
		}
	}
	e.dummy = tag("div");
	e.dummy.set("className","checkDummy");
	e.add(e.dummy);
	e.check = tag("div",text("✓"));
	e.check.set("className","check");
	e.add(e.check);
	e.set("className","checkbox");
	e.set("onclick",click);
	click();
	return e;
}
function output(st) {
	var e = tag("div");
	e.assigned = null;
	function setter(val) {
		e.el.innerHTML = val;
	}
	e.unassign = function() {
		if (e.assigned) {
			assigned.unlisten(setter);
			e.assigned = null;
		}
	}
	e.assign = function(str) {
		if (e.assigned) {
			assigned.unlisten(setter);
		}
		e.assigned = st;
		st.listen(setter);
	}
	if (st) {
		e.assign(st);
	}
	return e;
}



//=================================================================================================================================
//=                                                                                                                               =
//=                                    Storage Construction                                                                       =
//=                                                                                                                               =
//=================================================================================================================================

//display(createTitle(createLabel("Match List",createCheck(storage()))));

var showMatchlist = storage();

display(tag("h1",["Match List ",check(showMatchlist)]));

var matchesList = [];
for (var i = 0; i < 200; i++) {
	matchesList[i] = {};
	matchesList[i].red = {teams:[storage(),storage(),storage()],score:storage()};
	matchesList[i].blue = {teams:[storage(),storage(),storage()],score:storage()};
}
var cardsList = [];
for (var i = 0; i < 1200; i++) {
	cardsList[i] = {vals:[]};
	for (var j = 0; j < 6; j++) {
		cardsList[i].vals[j] = storage();
	}
}


var matchesContainer = tag("div");
matchesContainer.set("className","hidden");
var matchesEls = [];
for (var i = 0; i < matchesList.length; i++) {
	match = {};
	match.red = {teams:[]}
	match.red.teams[0] = input(matchesList[i].red.teams[0]).set("className","red");
	match.red.teams[1] = input(matchesList[i].red.teams[1]).set("className","red");
	match.red.teams[2] = input(matchesList[i].red.teams[2]).set("className","red");
	match.red.score    = input(matchesList[i].red.score).set("className","red");
	match.blue = {teams:[]}
	match.blue.teams[0] = input(matchesList[i].blue.teams[0]).set("className","blue");
	match.blue.teams[1] = input(matchesList[i].blue.teams[1]).set("className","blue");
	match.blue.teams[2] = input(matchesList[i].blue.teams[2]).set("className","blue");
	match.blue.score    = input(matchesList[i].blue.score).set("className","blue");
	match.el = tag("div",
		[tag("div","Match " + (i+1) + ": ").set("className","fixedLabel")
		,match.red.teams[0],match.red.teams[1],match.red.teams[2]
		,match.blue.teams[0],match.blue.teams[1],match.blue.teams[2]
		,match.red.score
		,match.blue.score
		]);
	matchesContainer.add(match.el)
	matchesContainer.add(tag("hr"));
}
display(matchesContainer);

showMatchlist.listen(function(v) {
	if (v) {
		// show the match list
		matchesContainer.set("className","");
	} else {
		// hide the match list
		matchesContainer.set("className","hidden");
	}
});

// That is the team result.