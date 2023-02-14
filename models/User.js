'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
	class User extends Model {}
	User.init(
		{
			firstName: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: {
						msg: 'A firstname is required',
					},
					notEmpty: {
						msg: 'Please provide a firstname',
					},
				},
			},
			lastName: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: {
						msg: 'A lastname is required',
					},
					notEmpty: {
						msg: 'Please provide a lastname',
					},
				},
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: {
					msg: 'The email you entered already exists',
				},
				validate: {
					notNull: {
						msg: 'An email is required',
					},
					isEmail: {
						msg: 'Please provide a valid email address',
					},
				},
			},
			password: {
				type: DataTypes.VIRTUAL,
				allowNull: false,
				validate: {
					notNull: {
						msg: 'A password is required',
					},
					notEmpty: {
						msg: 'Please provide a password',
					},
					len: {
						args: [8, 20],
						msg: 'Password must be between 8 and 20 characters',
					},
				},
			},
			confirmedPassword: {
				type: DataTypes.STRING,
				allowNull: false,
				set(val) {
					if (val === this.password) {
						const hashedPassword = bcrypt.hashSync(val, 10);
						this.setDataValue('confirmedPassword', hashedPassword);
					}
				},
				validate: {
					notNull: {
						msg: 'Both passwords must match',
					},
				},
			},
		},
		{ sequelize }
	);

	User.associate = (models) => {
		User.hasMany(models.Course, {
			foreignKey: {
				fieldName: 'userId',
				as: 'user',
				allowNull: false,
			},
		});
	};

	return User;
};
