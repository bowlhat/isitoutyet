"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions = __importStar(require("firebase-functions"));
const web_push_1 = __importDefault(require("web-push"));
const config_1 = __importDefault(require("../config"));
let privateKey = 'Dm92rAVXyVCdq8qEv9C5-ItDKC9NEAaHAbn5p6ZnyzY';
let publicKey = 'BDcpUmAVHSCuC9B8xYGR8LE0fDYzXzGAXKAmHmuzPazWSup0Ow9ZVjrVY8zoyHpVKH3WWr0HFcEcgbRukTkQMm8';
if (functions.config().vapid) {
    privateKey = functions.config().vapid.private_key;
    publicKey = functions.config().vapid.public_key;
}
if (config_1.default.webPush.publicKey && config_1.default.webPush.privateKey) {
    web_push_1.default.setVapidDetails('https://isitoutyet.info/', publicKey, privateKey);
}
exports.VapidKey = (req, res) => {
    res.send(publicKey);
};
