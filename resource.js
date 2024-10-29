// @ts-check

import { Http } from "./http.js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";

/**
 * Load a resource from a URL.
 * @param {string} url 
 * @returns {Promise<Buffer>}
 * @throws {Error}
 */
export async function loadResource(url)
{
    if (url.startsWith("http://") || url.startsWith("https://")) {
        let response = await Http.request("get", url);
        if(response.status != 200) {
            throw new Error(`An error occurred while downloading ${url}. Status:${response.status} Body:${response.body}`);
        }
        if(response.body == null) {
            throw new Error(`File data is empty.`);
        }
        if(!(response.body instanceof Buffer)) {
            throw new Error(`File data is not binary. Body:${response.body}`);
        }
        return response.body;
    } 
    else if (url.startsWith("file://") || !/^\w+:\/\//.test(url)) {
        // Any URL starting witj file:// or not containing a scheme is treated as a local file path.  
        let data = readFileSync(fileURLToPath(url));
        if (!(data instanceof Buffer)) {
            throw new Error(`File data is not binary: ${data}`);
        }
        return data;
    } 
    throw new Error(`The URL scheme is not supported. URL:${url}`);
}


/**
 * Load a text resource from a URL.
 * @param {string} url 
 * @param {BufferEncoding} [encoding='utf8'] The encoding to use for the text conversion
 * @returns {Promise<string>}
 * @throws {Error}
 */
export async function loadTextResource(url, encoding = 'utf8') {
    return (await loadResource(url)).toString(encoding);
}
