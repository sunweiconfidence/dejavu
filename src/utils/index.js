import urlParser from 'url-parser-lite';

import getDateFormat from './date';

const parseUrl = url => {
	if (!url) {
		return {
			credentials: null,
			url: null,
		};
	}
	const { auth } = urlParser(url);
	const filteredUrl = auth ? url.replace(`${auth}@`, '') : url;
	return {
		credentials: auth,
		url: filteredUrl,
	};
};

// convert search params to object
const getUrlParams = url => {
	if (!url) {
		// treat a falsy value as having no params
		return {};
	}
	const searchParams = new URLSearchParams(url);
	return Array.from(searchParams.entries()).reduce(
		(allParams, [key, value]) => ({
			...allParams,
			[key]: value,
		}),
		{},
	);
};

const getHeaders = rawUrl => {
	const headers = {
		'Content-Type': 'application/json',
	};
	if (!rawUrl) {
		return headers;
	}
	const { credentials } = parseUrl(rawUrl);

	if (credentials) {
		headers.Authorization = `Basic ${btoa(credentials)}`;
	}
	return headers;
};

const isVaildJSON = str => {
	try {
		JSON.parse(str);
	} catch (e) {
		return false;
	}
	return true;
};

const isEmptyObject = obj => {
	if (obj === null) return true;
	if (!Object.keys(obj).length) return true;
	return false;
};

const isObject = obj =>
	obj !== undefined && obj !== null && obj.constructor === Object;

const updateQueryStringParameter = (uri, key, value) => {
	const re = new RegExp(`([?&])${key}=.*?(&|$)`, 'i');
	const separator = uri.indexOf('?') !== -1 ? '&' : '?';
	if (uri.match(re)) {
		return uri.replace(re, `$1${key}=${value}$2`);
	}
	return `${uri}${separator}${key}=${value}`;
};

export {
	parseUrl,
	getUrlParams,
	getHeaders,
	getDateFormat,
	isVaildJSON,
	isEmptyObject,
	isObject,
	updateQueryStringParameter,
};
