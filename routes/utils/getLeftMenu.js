/**
 * Created by Bli on 14-2-10.
 */

module.exports = function (req, res) {
	var menu = [];

	//主页选项
	menu.push({
		id: 'home',
		title: '主页',
		icon: 'icon-home',
		link: '#/users'
	});

	//销售单据管理选项
	menu.push({
		id: 'sales',
		title: '销售单据管理',
		icon: 'icon-cart',
		link: '#',
		submenus: [
			{
				id: 'sales-manage-xsd',
				title: '[管理]销售单',
				icon: 'icon-copy',
				link: '#'
			},
			{
				id: 'sales-create-xsd',
				title: '[新建]销售单',
				icon: 'icon-new',
				link: '#'
			}
		]
	});

	//基础信息管理选项
	menu.push({
		id: 'basics',
		title: '基础信息管理',
		icon: 'icon-clipboard',
		link: '#/users'
	});

	//历史记录选项
	menu.push({
		id: 'history',
		title: '历史记录管理',
		icon: 'icon-history',
		link: '#/users'
	});

	//系统功能选项
	menu.push({
		id: 'systems',
		title: '系统功能',
		icon: 'icon-list',
		link: '#/users'
	});

	res.contentType('json');
	res.json(menu);
};