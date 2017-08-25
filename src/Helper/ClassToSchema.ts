import { Schema } from 'mongoose'

const isAttribute = (obj) => obj === String || obj === Number || obj === Boolean || obj === Date ||
           obj === Schema.Types.Mixed || obj === Schema.Types.ObjectId;

function getAllProps(obj) {
	let props = {
		methods: {},
		staticMethods: {},
		attributes: {},
		staticAttributes: {}
	};

	const usedNames = new Set();

	do {
		const tempStatics = Object.getOwnPropertyNames(obj.constructor).filter((value) =>
			value !== 'length' && value !== 'name' && value !== 'prototype' &&
			!usedNames.has(value)
		);

		tempStatics.forEach((value) => {
			const pValue = obj.constructor[value]
			if (typeof pValue === 'function' && !isAttribute(pValue)) {
				props.staticMethods[value] = pValue
			} else {
				props.staticAttributes[value] = pValue
			}

			usedNames.add(value)
		});

		const temp = Object.getOwnPropertyNames(obj)
			.concat(Object.getOwnPropertySymbols(obj).map(s => s.toString()))
			.filter((value, i, arr) =>
				value !== 'constructor' &&
				(i == 0 || value !== arr[i - 1]) &&
				!usedNames.has(value)
			);

		temp.forEach((value) => {
			const pValue = obj[value];
			if (typeof pValue === 'function' && !isAttribute(pValue)) {
				props.methods[value] = pValue
			} else {
				props.attributes[value] = pValue
			}

			usedNames.add(value)
		})
	}
	while ((obj = Object.getPrototypeOf(obj)) && Object.getPrototypeOf(obj));

	return props;
}

export default function classToSchema(obj: any, schemaOptions?: any): any {
	const props = getAllProps(obj);
	const schema = new Schema(props.attributes, schemaOptions);

	schema.statics = props.staticMethods;
	schema.methods = props.methods;

	return schema
}