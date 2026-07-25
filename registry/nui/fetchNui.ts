import { isEnvBrowser } from "@/utils/misc";
import { nuiConfig } from "@/nui.config";

/**
 * Simple wrapper around fetch API tailored for CEF/NUI use. This abstraction
 * can be extended to include AbortController if needed or if the response isn't
 * JSON. Tailor it to your needs.
 *
 * @param eventName - The endpoint eventname to target
 * @param data - Data you wish to send in the NUI Callback
 * @param mockData - Mock data to be returned if in the browser
 *
 * @return returnData - A promise for the data sent back by the NuiCallbacks CB argument
 */

export async function fetchNui<T = unknown>(
  eventName: string,
  data?: unknown,
  mockData?: T,
): Promise<T> {
  const options = {
    method: "post",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(data),
    signal: AbortSignal.timeout(10000),
  };

  if (isEnvBrowser() && mockData) return mockData;

  const resourceName = window.GetParentResourceName
    ? window.GetParentResourceName()
    : nuiConfig.resourceName;

  try {
    const resp = await fetch(`https://${resourceName}/${eventName}`, options);

    const respFormatted = await resp.json();

    return respFormatted;
  } catch (error) {
    console.error(`fetchNui: request "${eventName}" failed:`, error);
    // Safe fallback so awaiting call sites never hang or reject uncaught:
    // array consumers get an empty-compatible array, everyone else gets a failure result.
    if (Array.isArray(mockData)) return mockData;
    return { success: false, message: "Request failed" } as unknown as T;
  }
}
