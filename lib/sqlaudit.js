const fs     = require("fs");
const mysql  = require("mysql");
const pegjs  = require("pegjs");
const debug  = require("debug")("sqlaudit");
const tools  = require("./tools");
const parser = pegjs.generate(fs.readFileSync(__dirname + "/lexer.bnf").toString());

class Audit {
	constructor(options = {}) {
		this.db    = mysql.createConnection(options.db);
		this.debug = options.debug ?? null;

		if (this.debug === true) {
			this.debug = (...args) => {
				debug(...args);
			};
		} else if (typeof this.debug != "function") {
			this.debug = false;
		}
	}

	runFile(filename, next) {
		fs.readFile(filename, (err, data) => {
			if (err) return next(err);

			this.runCode(data.toString().trim(), next);
		});
	}

	runCode(data, next) {
		const code = parser.parse(data, {
			tools : tools,
			debug : this.debug,
			db    : this.db,
		});

		code({}, next);
	}
}

module.exports = Audit;
