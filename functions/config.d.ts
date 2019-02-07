/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */
declare const _default: {
    port: string | number;
    trustProxy: string;
    strictTransportSecurity: string | undefined;
    api: {
        clientUrl: string;
        serverUrl: string;
    };
    databaseUrl: string;
    analytics: {
        googleTrackingId: string | undefined;
        applicationInsightsKey: string | undefined;
    };
    auth: {
        jwt: {
            secret: string;
        };
        facebook: {
            id: string;
            secret: string;
        };
        google: {
            id: string;
            secret: string;
        };
        twitter: {
            key: string;
            secret: string;
        };
    };
    webPush: {
        privateKey: any;
        publicKey: any;
    };
};
export default _default;
