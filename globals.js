(function(r) {
	global._cmds = {};
	global._daemons = {};
	global.FUNCTIONS = {};
	global._objs = { 'players' : {}, 'rooms': {}, 'npcs' : {}, 'areas' : {} };
	
	global.FLAGS = {
			O_HEART_BEAT : 0x01,
			O_IS_WIZARD : 0x02,
			O_LISTENER : 0x04,
	};
	
	global.HB_ENGINE = r('heartbeat')();
	global.HB_ENGINE.init();
	
	global.DATA_PATH = global.__BASE_PATH + global.__config.data_dir;
	
	
	var fm = r('./framework'),
		fs = r('fs'),
		path = r('path');
	
	//init functions
	r('funs');
	//init commands
	r('cmds');
	
	// load all rooms from ROOM_PATH
	function init_rooms(basedir, prefix) {
		prefix = prefix || '';
		var dir = path.normalize(path.join(basedir, prefix));
	
		var files = fs.readdirSync(dir);
		files.forEach(function(file) {
			var pathname = path.join(dir, file),
				stat = fs.lstatSync(pathname),
				fname = path.parse(file).name;
			
			if (stat.isDirectory()) {
				if (fname === 'obj')
					return;
				if (fname === 'npc')
					return;
				
				init_rooms(basedir, path.join(prefix, file));
			} else {
				var id = path.join(prefix, path.parse(file).name),
					areaId = prefix,
					room = null;
				
				if (areaId === '')
					areaId = 'no_area';
				
				if (path.extname(file) === '.json') {
					room = fm.ROOM.load(pathname);
				} else if (path.extname(file) === '.js') {
					room = new r(pathname);
				}
				global._objs.rooms[id] = room;
				global._objs.areas[areaId] = global._objs.areas[areaId] || new Array();
				global._objs.areas[areaId].push(id);
			}
		});
	}
	
	//init rooms
	init_rooms(global.DATA_PATH);
			
//	global._objs.rooms['office'] = fm.ROOM.load(ROOM_PATH + "office.json"); 
//	global._objs.rooms['meeting-room-a'] = fm.ROOM.load(ROOM_PATH + "meeting-room-a.json");
	


})(require);