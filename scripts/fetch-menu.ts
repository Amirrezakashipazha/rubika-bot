export const apiHeader = {
    'App-Version': `70000000`,
    'App-Market': `web`,
    'App-Package': process.env.NEXT_PUBLIC_PACKAGE ?? '',
    'Content-Type': 'application/json',
    'Accept-Language': 'fa',
    apikey:
        '897b2e8a3b67fe80f2d1e799cc810d2824115877e0ec21b71e6b8d98fd180f80' + '',
};
const MENU_BUILDER_URL = 'api/p/arrangement/v1/page/';

import { MenuBuilderMainModel } from '../model/main.model';

export const fetchMenu = async () => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000); // 15 seconds

    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_ENDPOINT}${MENU_BUILDER_URL}`,
            {
                method: "GET",
                headers: apiHeader,
                signal: controller.signal, // pass signal to fetch
            }
        );

        const menu: MenuBuilderMainModel = await res.json();
        return menu;
    } catch (err) {
        if ((err as unknown).name === "AbortError") {
            console.error("Fetch timed out");
        } else {
            console.error(err);
        }
        throw err;
    } finally {
        clearTimeout(timeout);
    }

};
