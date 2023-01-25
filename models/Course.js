'use strict';
const { Model} = require('sequelize');

module.exports = (sequelize, DataTypes ) => {
	class Course extends Model {}
	Course.init(
		{
			title: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: {
						msg: 'A title is required',
					},
					notEmpty: {
						msg: 'Please provide a title',
					},
				},
			},
			description: {
				type: DataTypes.TEXT,
				allowNull: false,
				validate: {
					notNull: {
						msg: 'A description is required',
					},
					notEmpty: {
						msg: 'Please provide a description',
					},
				},
			},
			estimatedTime: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: {
						msg: 'An estimated time is required',
					},
					notEmpty: {
						msg: 'Please provide an estimated time',
					},
				},
			},
			materialsNeeded: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: {
						msg: 'A value for materials needed is required',
					},
					notEmpty: {
						msg: 'Please provide a value for materials needed',
					},
				},
			},
		},
		{ sequelize }
	);

	Course.associate = (models) => {
		Course.belongsTo(models.User, {
			foreignKey: {
				as: 'user',
				fieldName: 'userId',
				allowNull: false,
			},
		});
	};
};
