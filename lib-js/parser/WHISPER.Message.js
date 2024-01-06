"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.whisperMessage = void 0;
let oberknecht_utils_1 = require("oberknecht-utils");
let whisper_1 = require("../operations/whisper");
let sendraw_1 = require("../operations/sendraw");
let WHISPER_userstate_1 = require("./subclasses/WHISPER.userstate");
let WHISPER_message_1 = require("./subclasses/WHISPER.message");
let WHISPER_channel_1 = require("./subclasses/WHISPER.channel");
let WHISPER_server_1 = require("./subclasses/WHISPER.server");
let __1 = require("..");
class whisperMessage {
    sym;
    _raw;
    timestamp;
    IRCCommand;
    IRCParameters;
    IRCMessageParts;
    IRCMessagePrefix;
    prefix;
    command;
    badges;
    badgesRaw;
    messageText;
    messageParts;
    messageArguments;
    senderUserName;
    senderDisplayName;
    senderUserID;
    senderUserType;
    senderUserColor;
    emotes;
    emotesRaw;
    turbo;
    turboRaw;
    threadID;
    messageID;
    userstate;
    message;
    channel;
    server;
    constructor(sym, rawMessage) {
        const dn = Date.now();
        this.timestamp = dn;
        this.sym = sym;
        this._raw = rawMessage;
        this.IRCCommand = (0, oberknecht_utils_1.messageCommand)(this._raw);
        this.IRCMessageParts = [
            ...this._raw.split(" ").slice(0, 4),
            (0, oberknecht_utils_1.messageContent)(this._raw),
        ];
        this.IRCParameters = (0, oberknecht_utils_1.messageParameters)(this._raw);
        this.IRCMessagePrefix = (0, oberknecht_utils_1.messagePrefix)(this._raw);
        this.prefix = __1.i.clientData[sym]._options.prefix;
        this.badgesRaw = this.IRCParameters["badges"];
        this.badges = (0, oberknecht_utils_1.messageBadges)(this.badgesRaw);
        this.senderUserName = (0, oberknecht_utils_1.messageUser)(this.IRCMessagePrefix);
        this.senderDisplayName = this.IRCParameters["display-name"];
        this.senderUserID = this.IRCParameters["user-id"];
        this.senderUserType = this.IRCParameters["user-type"];
        this.senderUserColor = this.IRCParameters["color"];
        this.emotesRaw = this.IRCParameters["emotes"];
        this.emotes = (0, oberknecht_utils_1.messageEmotes)(this.emotesRaw);
        this.messageText = this.IRCMessageParts[4];
        this.messageParts = this.messageText.split(" ");
        this.messageArguments = [...this.messageParts];
        let msgmatch = this.messageText.match(new RegExp(`^${this.prefix}+\\w+`, "gi"));
        this.command =
            msgmatch ?? undefined
                ? msgmatch?.[0]?.replace(new RegExp(`^${this.prefix}`), "")
                : undefined;
        if (msgmatch)
            this.messageArguments = this.messageArguments.slice(this.prefix.split(" ").length - 1);
        this.turboRaw = this.IRCParameters["turbo"];
        this.turbo = this.turboRaw === "1";
        this.threadID = this.IRCParameters["thread-id"];
        this.messageID = this.IRCParameters["message-id"];
        this.userstate = new WHISPER_userstate_1.userstate(this);
        this.message = new WHISPER_message_1.message(this);
        this.channel = new WHISPER_channel_1.channel(this);
        this.server = new WHISPER_server_1.server(this);
    }
    async whisper(message) {
        return (0, whisper_1.whisper)(this.sym, this.senderUserID, message);
    }
    send = this.whisper;
    reply = this.whisper;
    action = this.whisper;
    async sendRaw(message) {
        return (0, sendraw_1.sendraw)(this.sym, message).catch();
    }
}
exports.whisperMessage = whisperMessage;
