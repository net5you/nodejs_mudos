var skill = function() {
	this.name = "";
}

skill.base_skills = {
		"unarmed" : "拳脚",
		"sword":	"剑法",
		"blade":	"刀法",
		"stick":	"棍法",
		"staff":	"杖法",
		"throwing":	"暗器",
		"force":	"内功",
		"parry":	"招架",
		"dodge":	"轻功",
		"spells":	"法术",
		"whip" :	"鞭法",
		"spear":	"枪法",
		"axe":      "斧法",
		"mace":     "锏法",
		"fork":		"叉法",
		"rake":		"钯法",
//		"archery":	"弓箭",
		"hammer":	"锤法",
		"literate": "读书识字"
};

skill.prototype.valid_use = function(me) {
	return 1;
}

skill.prototype.valid_learn = function(me, weapon) {
	return 1;
}

skill.prototype.valid_effect = function(me, weapon, action) {
	return 1;
}

skill.prototype.action = function(me, lv, other) {
	return "$N使用" + this.name + "攻击了$n";
}

skill.prototype.cost = function(me, lv, other) {
	return null;
}

skill.prototype.damage = function(me, lv, other) {
	return null;
}

/**
 * There are two types of skill: martial, knowledge
 */
skill.prototype.type = function() {
	return 'martial';
}

skill.prototype.skill_improved = function(me) {}

module.exports = skill;