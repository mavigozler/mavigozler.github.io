"use strict";


export { Glogger, tasksCalled, GulpDict, GulpfileConfigs, gulpSrcAllowEmpty, LogLevel };

import type { GulpfileConfigsInfo, glogVerbosity } from "./gulpfiledecls.d.ts";
// has to be separated from 'import type' because it's a value
//import type { LogLevel } from "./gulpfiledecls.d.ts";
import { fwdSlash } from "./stringsExtended.js";
		// from "../../../src/GenLib/stringsExtended.js"
import winston from "winston";
import "winston-daily-rotate-file";
import "winston-color";
//import { default } from './gulpfile.js';
//import { default } from './gulpfile';

enum LogLevel {
	FATAL,
	ERROR,
	WARN,
	INFO,
	HTTP,
	VERBOSE,
	DEBUG,
	SILLY
}

const // JsMapDeleteDefault = true,
//	doubleStarSlash = "**/",
	tasksCalled: string[] = [],
	gulpSrcAllowEmpty = {allowEmpty: true};

const GulpfileConfigs: GulpfileConfigsInfo = {} as GulpfileConfigsInfo;

/**
 * class Glogger
 *   this is a Gulp logger 
 */
class Glogger {
	verbosity: glogVerbosity;
	winstlog: {
		logger: winston.Logger | null
	} = {
		logger: null
	};

	constructor(options: {
		verbosity: glogVerbosity
	}) {
		this.verbosity = options.verbosity;
	}

	glog = (
		message: string, options?: {
			verbosity?: glogVerbosity,
			err?: unknown,
			level?: LogLevel
		}
	): void => {
	//	console.log(message);
		let verbosity;
		if (!options?.verbosity)
			verbosity = 1;
		else
			verbosity = options.verbosity;
		if (typeof verbosity == "number" && ((verbosity as number) > (this.verbosity as number)))
			return;
		else {
			switch (verbosity) {
			case "high":
				if (this.verbosity == "minimal" || this.verbosity == "medium")
					return;
				break;
			case "medium":
				if (this.verbosity == "minimal")
					return;
			}
		}
		let modMessage: string = message;
		if (message.search(/\$\{ERR\}/) >= 0 && options?.err)
			if ((options.err as Error).message)
				modMessage = message.replace(/\$\{ERR\}/, (options.err as Error).message);
			else
				modMessage = message.replace(/\$\{ERR\}/, options.err.toString());
		if (!this.winstlog.logger) {
			const levelString = options?.level ? options.level : "";
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			console.log(`${(LogLevel as any)[levelString]}: ${modMessage}`);
		} else {
			if (options?.level && modMessage.search(/ERROR/) >= 0)
				options.level = LogLevel.ERROR;
			else if (options?.level && modMessage.search(/WARN/) >= 0)
				options.level = LogLevel.WARN;
			else if (options?.level && modMessage.search(/FATAL/) >= 0)
				options.level = LogLevel.FATAL;
			switch (options?.level) {
			case LogLevel.ERROR:
				this.winstlog.logger!.error(modMessage);
				break;
			case LogLevel.WARN:
				this.winstlog.logger!.warn(modMessage);
				break;
			case LogLevel.INFO:
			default:
				this.winstlog.logger!.info(modMessage);
				break;
			case LogLevel.HTTP:
				this.winstlog.logger!.http(modMessage);
				break;
			case LogLevel.VERBOSE:
				this.winstlog.logger!.verbose(modMessage);
				break;
			case LogLevel.DEBUG:
				this.winstlog.logger!.debug(modMessage);
				break;
			case LogLevel.SILLY:
				this.winstlog.logger!.silly(modMessage);
				break;
			case LogLevel.FATAL:
				this.winstlog.logger!.error(modMessage);
				throw "Fatal error...exiting";
			}
		}
	}
}

/**
 * class GulpDictionarySystem
 *   this is a Gulp dictionary system
 *  contains get/set methods for substitutions
 */
class GulpDictionarySystem {
	SubstitutionsDictionary: {[key: string]: string} = {};

	get = (key: string): string => {
		return this.SubstitutionsDictionary[key];
	}

	set = (key: string, def: string) => {
		this.SubstitutionsDictionary[key] = def;
	}

	resolveString = (text: string): string => {
		let matches: RegExpMatchArray | null;
		if (typeof text == "string") {
			while ((matches = text.match(/\$\{([^}]+)\}/)) != null)
				for (let i = 1; i < matches.length; i++)
					text = text.replace(new RegExp("\\$\\{" + matches[i] + "\\}"), this.SubstitutionsDictionary[matches[i]]);
			text = text.replace(/\/{2,}(?<!:\/\/)/g, "/");
		}
		return text;
	}

	resolveArrayOfStrings = (texts: string[], setFwdSlash?: boolean): string[] => {
		const newTexts: string[] = [];
		if (!setFwdSlash)
			setFwdSlash = false;
		for (let item of texts) {
			if (setFwdSlash == true)
				item = fwdSlash(item);
			newTexts.push(this.resolveString(item));
		}
		return newTexts;
	}
}

const GulpDict = new GulpDictionarySystem();

