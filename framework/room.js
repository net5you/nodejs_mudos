var extend = require('./oo.js'),
	fm = require('framework');
	MObject = require('./mobject.js'),
	fs = require('fs'),
	path = require('path');

var ROOM = extend(function(){}, MObject);

ROOM.__DIRECTORIES__ = {
	"east" : "东",
	"west" : "西",
	"north" : "北",
	"south" : "南",
	
	"northeast" : "东北",
	"southeast" : "东南",
	"northwest" : "西北",
	"southwest" : "西南",
	
	"up" : "上",
	"down" : "下",
	
	"enter" : "内",
	"out" : "外"
}

ROOM.loadFromJSON = function(data) {
	var ret = new ROOM();
	ret.name = data.name || "unnamed";
	ret.desc = data.desc || "";
	ret.exits = data.exits || {};
	ret.objs = {};
	var objs = data.objs || {};
	for (var name in objs) {
		var count = objs[name],
			i = 0,
			pathname = fm.find_file(DATA_PATH, name);
			fs.accessSync(pathname, fs.F_OK | fs.R_OK);
		while (i < count) {
			if (!pathname)
				break;
			
			var id = name + '#' + i,
				tmp = require(pathname);
			
			if (typeof tmp !== 'function')
				break;
			
			var obj = new tmp();
			if (obj && obj instanceof fm.MObject) {
				obj.id = id;
				if (obj instanceof fm.NPC)
					_objs.npcs[id] = obj;
				else
					_objs.items[id] = obj;
				obj.move_to(ret);
			}
			i++;
		}
	}
	return ret;
}

ROOM.load = function(filename) {
	var data = require(filename);
	return ROOM.loadFromJSON(data);
}

ROOM.prototype.look_response = function(avoid) {
	var ret = {
			'name' : this.name,
			'desc' : this.desc,
			'exits' : {},
			'objs' : {}
	};
	
	for (var dir in this.exits) {
		if (!(dir in ROOM.__DIRECTORIES__))
			continue;
			
		var room_id = this.exits[dir];
		if (_objs.rooms[room_id]) {
			ret['exits'][dir] = {
					id : room_id,
					dir : dir,
					dir_name : ROOM.__DIRECTORIES__[dir],
					name : _objs.rooms[room_id].name
			};
		}
	}
	
	for (var objId in this.contains) {
		if (avoid && avoid[objId])
			continue;
		
		ret['objs'][this.contains[objId].name] = this.contains[objId].id;
	}
	return ret;
}

module.exports = ROOM;
