"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_1 = require("../firebase");
const models_1 = require("../data/models");
exports.UnRegisterPushNotification = (req, res) => {
    const { token } = req.body;
    if (!token) {
        console.error('Unregister Push: No token provided by client');
        return res.send(403);
    }
    models_1.Project.findOne({
        where: {
            slug: req.params.project,
        },
    }).then((project) => __awaiter(this, void 0, void 0, function* () {
        if (project) {
            return firebase_1.admin.messaging().unsubscribeFromTopic(token, project['slug'])
                .then(response => {
                console.log('Unregister push: Successfully unsubscribed:', response);
                res.sendStatus(200);
            }).catch(e => {
                console.log('Unregister push: Error unsubscribing:', e);
                res.sendStatus(500);
            });
        }
        console.error('Unregister push: Project does not exist:', req.params.project);
        return res.sendStatus(404);
    })).catch(e => {
        console.log('Unregister push: Error looking-up project:', e);
        res.sendStatus(500);
    });
};
