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
const express_1 = __importDefault(require("express"));
const register_1 = require("./register");
const unregister_1 = require("./unregister");
const vapidKey_1 = require("./vapidKey");
const app = express_1.default();
app.get('/api/vapidPublicKey', vapidKey_1.VapidKey);
app.post('/api/project/:project/register', register_1.RegisterPushNotification);
app.post('/api/project/:project/unregister', unregister_1.UnRegisterPushNotification);
exports.WebPushHandler = functions.https.onRequest(app);
