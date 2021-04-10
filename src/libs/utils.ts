import { browser, Tabs } from 'webextension-polyfill-ts';

export async function asyncForEach<T = any> (
  array: T[],
  callback: (item: T, index?: number, array?: T[]) => Promise<any>
) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

export function createElementFromHTML (html: string): HTMLElement {
  const div = document.createElement('div');
  div.innerHTML = html.trim();

  return <HTMLElement>div.firstChild;
}

export async function getAllTabs (params: Tabs.QueryQueryInfoType = null) {
  let tabs: Tabs.Tab[] = null;

  try {
    tabs = await browser.tabs.query(params || {});
  } catch {
    tabs = [];
  }

  return tabs;
}
