declare const versionForProject: (requestedProject: string, version: string) => Promise<{
    text: string;
    ssml: string;
    data: {
        Project: any;
        Version: any;
        Codename: any;
        Date: Date;
    };
    cardTitle: string;
    image: any;
    url: string;
} | {
    text: string;
    data: {
        Project: any;
        Version?: undefined;
        Codename?: undefined;
        Date?: undefined;
    };
    cardTitle: string;
    image: any;
    ssml?: undefined;
    url?: undefined;
} | {
    text: string;
    data: {
        Project?: undefined;
        Version?: undefined;
        Codename?: undefined;
        Date?: undefined;
    };
    cardTitle: string;
    image: string;
    ssml?: undefined;
    url?: undefined;
}>;
export { versionForProject };
