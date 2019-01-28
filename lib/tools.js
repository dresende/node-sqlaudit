const async = require("async");

exports.async = async;

exports.resolve = (context, element, next) => {
	if (typeof context == "function") throw new Error("RESOLVING WITH FUNCTION CONTEXT");

	if (typeof element == "function") {
		return element(context, next);
	}


	return next(null, element);
};

exports.Query_SQL = function (table, escape_id = "`", escape_string = "\"") {
	let select = [];
	let where  = [];
	let orders = [];
	let limit  = null;
	let type   = "all";
	let prop   = null;
	let $      = {
		escapeId : (id) => {
			return `${escape_id}${id}${escape_id}`;
		},
		escapeValue : (value) => {
			if (typeof value == "string") {
				return `${escape_string}${value}${escape_string}`;
			}
			return value;
		},
		select : (sel) => {
			select.push(sel);

			return $;
		},
		where : (condition) => {
			where.push(condition);

			return $;
		},
		order : (...order) => {
			orders = orders.concat(order);

			return $;
		},
		limit : (start, len) => {
			limit = (start ? [ start, len ] : [ len ]);

			return $;
		},
		type : (t) => {
			if (typeof t == "undefined") {
				return type;
			}

			type = t;

			return $;
		},
		prop : (p) => {
			prop = p;

			return $;
		},
		build : () => {
			let q = `SELECT ${select.length ? select.join(", ") : "*"} FROM ${$.escapeId(table)}`;

			if (where.length) {
				q += ` WHERE ${where.join(" AND ")}`;
			}

			if (orders.length) {
				q += ` ORDER BY ${orders.map((order) => (order[0] == "-" ? `${$.escapeId(order.substr(1))} DESC` : $.escapeId(order))).join(", ")}`;
			}
			if (limit) {
				q += ` LIMIT ${limit.join(", ")}`;
			}

			return q;
		},
		query : (db, next) => {
			db.query($.build(), (err, results) => {
				if (err) return next(err);
				if (!results) return next(null, null);

				switch (type) {
					case "one":
						return next(null, results[0][Object.keys(results[0])[0]]);
					case "row":
						if (prop && results[0]) {
							return next(null, results[0][prop]);
						}
						return next(null, results[0]);
					// all
					default:
						return next(null, results);
				}
			});
		}
	};

	return $;
}
